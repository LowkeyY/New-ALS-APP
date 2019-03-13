import modelExtend from 'dva-model-extend';

const model = {
    reducers: {
      updateState (state, { payload }) {
        return {
          ...state,
          ...payload,
        };
      },
    },
  },
  getGrid = (datas = []) => {
    let result = [],
      counts = 0,
      fixedLanmu = defaultFixedGrid;
    datas.map((data, index) => {
      const { id = '', route = '', image = '', ...others } = data;
      if (id != '' && counts++ < 4) {
        result.push({
          id,
          route: route || '/',
          icon: image || defaultIcon,
          ...others,
        });
      }
    });
    if (counts == datas.length && datas[counts - 1]) {
      fixedLanmu = {
        ...datas[counts - 1],
      };
    }
    return {
      grids: result.length > 0 ? result : defaultGrids,
      fixedLanmu,
    };
  },
  getBanners = (datas = []) => {
    let result = [],
      counts = 0;
    datas.map((data, index) => {
      const { image = '', id = '' } = data;
      if (image !== '' && id !== '' && counts++ < 4) {
        result.push({
          url: image,
          ...data,
        });
      }
    });
    return result.length > 0 ? result : defaultBanners;
  },
  getList = (datas = []) => {
    const result = [];
    datas.map((_, index) => {
      const { id = '', route = 'details' } = _;
      if (id !== '' > 0) {
        result.push({
          ..._,
          id,
          route,
        });
      }
    });
    return result.length > 0 ? result : defaultLists;
  },
  pageModel = modelExtend(model, {});
module.exports = {
  model,
  pageModel,
};
