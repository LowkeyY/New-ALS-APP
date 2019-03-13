import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { queryPartyTabs, GetUnreadMessage } from 'services/querylist';
import { queryAdmin } from 'services/queryappeal';
import { doDecode } from 'utils';

const getInfo = (info) => {
    if (info) {
      try {
        return doDecode(info);
      } catch (e) {

      }
    }
    return {};
  },
  getBannerDatas = (data = []) => {
    let bannerDatas = [];
    data.map((item, index) => {
      const { id = '', title = '', route = '', infos = '', ...others } = item;
      let { type } = getInfo(infos);
      if (type === 'banner') {
        bannerDatas.push({
          url: item.image,
          id,
          title,
          ...others,
          route,
          infos,
        });
      }
    });
    return bannerDatas.length > 0 ? bannerDatas : [];
  },
  getGridbox = (data = [], isAdmin) => {
    let gridDatas = [];
    data.map((item, index) => {
      const { id = '', route = '', image = '', infos = '', ...others } = item;
      let { type, showType = '', admin = 'false' } = getInfo(infos);
      if (isAdmin === true) {
        if (type === 'grids') {
          gridDatas.push({
            id,
            showType,
            route: route || '/',
            icon: image || '',
            ...others,
          });
        }
      } else if (type === 'grids' && admin === 'false') {
        gridDatas.push({
          id,
          showType,
          route: route || '/',
          icon: image || '',
          ...others,
        });
      }
    });
    return gridDatas.length > 0 ? gridDatas : [];
  };
export default modelExtend(model, {
  namespace: 'guard',
  state: {
    grids: [],
    bannerDatas: [],
    isAdmin: false,
    xyfprenwuCount: 0,
    noViewCount: 0,
    noViewMsgCount: 0,
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, query, action }) => {
        const { id = '' } = query;
        if (pathname === '/guard') {
          dispatch({
            type: 'queryMessage',
          });
          dispatch({
            type: 'updateState',
            payload: {
              grids: [],
              bannerDatas: [],
            },
          });
          dispatch({
            type: 'queryAdmin',
            payload: {
              id,
            },
          });
        }
      });
    },
  },
  effects: {
    * query ({ payload }, { call, put, select }) {
      const { id = '' } = payload,
        { isAdmin } = yield select(_ => _.guard),
        result = yield call(queryPartyTabs, { dataId: id });
      if (result) {
        let { data = [] } = result;
        yield put({
          type: 'updateState',
          payload: {
            grids: getGridbox(data, isAdmin),
            bannerDatas: getBannerDatas(data),
          },
        });
      }
    },
    * queryAdmin ({ payload }, { call, put }) {
      const data = yield call(queryAdmin),
        { id } = payload;
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            isAdmin: data.isAdmin,
          },
        });
        yield put({ // 先判断admin
          type: 'query',
          payload: {
            id,
          },
        });
      }
    },
    * queryMessage ({ payload }, { call, put, select }) {
      const { isLogin = false } = yield select(_ => _.app);
      if (isLogin) {
        const data = yield call(GetUnreadMessage),
          { success, noViewCount = 0, xyfprenwuCount = 0, noViewMsgCount = 0 } = data;
        if (success) {
          yield put({
            type: 'app/updateState',
            payload: {
              noViewCount: noViewCount * 1,
              xyfprenwuCount: xyfprenwuCount * 1,
              noViewMsgCount: noViewMsgCount * 1,
            },
          });
        }
      }
    },

  },
  reducers: {},
},
);
