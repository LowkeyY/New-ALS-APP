import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, Layout } from 'components';
import Nav from 'components/nav';
import styles from './index.less';

const PrefixCls = 'patrydetails', 
  { BaseLine } = Layout;

function Patrydetails ({ location, dispatch, patrydetails }) {
  const { name = '' } = location.query;
  const { currentData, currentData: { content, date, title } } = patrydetails;
  console.log(currentData);
  const getContents = () => {
    return {
      __html: content,
    };
  };
  return (
    <div>
      <Nav title={name} dispatch={dispatch} />
      <div className={styles[`${PrefixCls}-outer`]}>
        <div className={styles[`${PrefixCls}-outer-title`]}>
          {title}
        </div>
        <div className={styles[`${PrefixCls}-outer-date`]}>{date}</div>
        <WhiteSpace size="sm" />
        <div className={styles[`${PrefixCls}-outer-content`]}>
          <div dangerouslySetInnerHTML={getContents()} />
        </div>
      </div>
      <BaseLine />
    </div>
  );
}

export default connect(({ loading, patrydetails }) => ({
  loading,
  patrydetails,
}))(Patrydetails);
