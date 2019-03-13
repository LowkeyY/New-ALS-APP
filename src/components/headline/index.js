import React from 'react';
import { Carousel, Icon } from 'antd-mobile';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';
import { getLocalIcon } from 'utils';
import styles from './index.less';

const PrefixCls = 'headline';

class HeadLine extends React.Component {
  constructor (props) {
    super();
  }
  
  state = {
    data: [],
    isLoad: false
  };
  
  componentWillMount () {
    setTimeout(() => {
      this.setState({
        data: this.props.datas,
      });
    }, 300);
  }
  
  onHandleChange = (num) => {
    this.props.dispatch({
      type: 'dashboard/updateState',
      payload: {
        selectedIndex: num
      }
    });
  };
  handleClick = ({ pathname = 'lanmusub' }) => {
    props.dispatch(routerRedux.push({
      pathname: `/${pathname}`,
      query: {
        name: '阿拉善头条',
      },
    }));
  };
  
  
  render () {
    const selectedIndex = this.props.selectedIndex, 
      currentData = this.props.datas || [];
    return (
      <div>
        <div className={styles[`${PrefixCls}-outer`]} style={{ clear: 'both' }}>
          <Carousel
            className="space-carousel"
            selectedIndex={selectedIndex}
            autoplayInterval={5000}
            autoplay
            infinite
            dotStyle={{
              background: '#fff',
              opacity: '0.5',
              width: '12px',
              height: '2px',
              borderRadius: '0'
            }}
            dotActiveStyle={{
              background: '#fff',
              width: '12px',
              height: '2px',
              borderRadius: '0'
            }}
            afterChange={this.onHandleChange}
          >
            {this.props.bannerDatas && this.props.bannerDatas.map((data, i) => (
              <div
                className={styles[`${PrefixCls}-image`]}
                key={`a_${i}`}
                onClick={this.props.handleClick.bind(null, data, this.props.dispatch)}
              >
                <img
                  ref={el => this.banner = el}
                  src={`${data.url}`}
                  alt=""
                  style={{ width: '100%', verticalAlign: 'top' }}
                  onLoad={() => {
                    if (!this.state.isLoad) {
                      this.setState({
                        isLoad: true
                      });
                      window.dispatchEvent(new Event('resize'));
                    }
                  }}
                />
                <div>{data.name}</div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    );
  }
}
HeadLine.propTypes = {
  handleClick: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired
};
HeadLine.defaultProps = {
  bannerDatas: []
};
export default HeadLine;
