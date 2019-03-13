import React from 'react';
import styles from './index.less';
import { getImages, getErrorImg } from 'utils';
import ReactDOM from 'react-dom';

import Voice from 'components/chatroom/voice';

const PrefixCls = 'voiceprev';

class VociePrev extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      listening: false,
    };
  }

  handleVoiceClick = (e) => {
    this.setState({
      listening: !this.state.listening,
    });
    const audio = ReactDOM.findDOMNode(this.audio);
    this.state.listening ? audio.pause() : audio.play();
  }
  componentDidMount () {
    const that = this;
    const audio = ReactDOM.findDOMNode(this.audio);
    audio.addEventListener('ended', () => {
      that.setState({
        listening: false
      });
    }, false);
  }
  render () {
    const { mediaFileTimer = 0, mediaFileUrl = '' } = this.props,
      voiceLength = Math.min(15 + (mediaFileTimer * 4), 100);
    return (
      <div className={styles[`${PrefixCls}-outer`]}>
        <div className={styles[`${PrefixCls}-box`]}>
          <div className={styles[`${PrefixCls}-box-contentbox`]}
            style={{ paddingRight: `${voiceLength}px` }}
            onClick={this.handleVoiceClick}
          >
            <Voice wave={this.state.listening} isLeft />
          </div>
          <audio ref={el => this.audio = el} preload="auto" src={mediaFileUrl} />
          {/* <audio ref={el => this.audio = el}  preload="auto" src='http://192.168.3.199:8080/ExternalItems/policWork/policeFile/e33862ae-5fe8-4907-97e4-3604b2e85bf3.mp3'></audio> */}
        </div>
        {mediaFileTimer && mediaFileTimer > 0 ?
          <div className={styles[`${PrefixCls}-timer`]}>{`${mediaFileTimer}s`}</div> : ''}
      </div>
    );
  }
}

export default VociePrev;
