import { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import styles from './index.less';
import { ReceiveBubble, ReplyBubble, ReceiveImgBubble, ReplyImgBubble } from './chatbubble/index';
import ReceiveVoiceBubble from './chatbubble/ReceiveVoiceBubble';
import ReplyVoiceBubble from './chatbubble/ReplyVoiceBubble';
import InputBox from 'components/inputbox';
import WxImageViewer from 'react-wx-images-viewer';

const PrefixCls = 'chatroom';
let defaultTimer = '';

class ChatRoom extends Component {
  constructor (props) {
    super(props);
    this.state = {
      height: 0,
    };
  }

  componentDidMount () {
    setTimeout(() => {
      if (ReactDOM.findDOMNode(this.lv)) {
        const currentHeight = cnhtmlHeight - ReactDOM.findDOMNode(this.lv).offsetTop;
        this.setState({
          height: currentHeight,
        });
        this.scrollToBottom(ReactDOM.findDOMNode(this.lv));
      }
    }, 0);
  }

  scrollToBottom (el) {
    setTimeout(() => {
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 200);
  }
  getImages (arr) {
    const images = [];
    arr.map((data, i) => {
      if (data.msgType == 1) {
        images.push(data.msgInfo);
      }
    });
    return images;
  }
  componentDidUpdate () {
    this.scrollToBottom(ReactDOM.findDOMNode(this.lv));
  }
  onViemImageClose () {
    this.props.dispatch({
      type: 'taskdetails/updateState',
      payload: {
        isOpen: false,
      },
    });
  }
  handleDivClick (arr, e) {
    if (e.target.tagName === 'IMG') {
      let src = e.target.src,
        curImageIndex = -1;
      if (src && (curImageIndex = arr.indexOf(src)) != -1) {
        this.props.dispatch({
          type: 'taskdetails/updateState',
          payload: {
            isOpen: true,
            viewImageIndex: curImageIndex,
          },
        });
      }
    }
  }
  render () {
    const isSuccess = this.props.isSuccess;
    const useravatar = this.props.useravatar;
    const props = {
        onSubmit: this.props.onSubmit,
        val: this.props.val,
        dispatch: this.props.dispatch,
        isDisabled: this.props.isDisabled,
      },
      getShowTimer = (messageTimer = '') => {
        if (messageTimer && defaultTimer != messageTimer) {
          defaultTimer = messageTimer;
          return <div className={styles[`${PrefixCls}-timer`]}><span>{messageTimer}</span></div>;
        }
        return '';
      };
    return (
      <div>
        <div className={styles[`${PrefixCls}-outer`]}
          ref={el => this.lv = el}
          style={{ height: this.state.height }}
          onClick={this.handleDivClick.bind(this, this.getImages(this.props.localArr))}
        >
          <div className={styles[`${PrefixCls}-outer-content`]} ref={el => this.contentEl = el}>
            {this.props.localArr && this.props.localArr.map((data, i) => {
              const { msgType, isMySelf = false, msgcDate = '', ...others } = data,
                props = {
                  msgType,
                  ...others,
                  isSuccess,
                  useravatar
                },
                result = [getShowTimer(msgcDate)];
              if (msgType == 0) { // 接受消息
                result.push(isMySelf ? <ReplyBubble {...props} /> : <ReceiveBubble {...props} />);
              } else if (msgType == 1) { // 接受图片
                result.push(isMySelf ? <ReplyImgBubble {...props} /> : <ReceiveImgBubble {...props} />);
              } else if (msgType == 2) { // 接受语音
                result.push(isMySelf ? <ReplyVoiceBubble {...props} /> : <ReceiveVoiceBubble {...props} />);
              }
              return result;
            })}
          </div>
          <div style={{ clear: 'both' }} />
          <InputBox {...props} handlerSubmit={this.props.handlerSubmit} />
        </div>
        {
          this.props.isOpen && this.props.viewImageIndex != -1 ?
            <WxImageViewer onClose={this.onViemImageClose.bind(this)} urls={this.getImages(this.props.localArr)} index={this.props.viewImageIndex} /> : ''
        }
      </div>
    );
  }
}

export default ChatRoom;
