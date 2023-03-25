import { defineStore } from 'pinia';
import _ from 'lodash-es';

// 语言
export const useLangStore = defineStore('lang', {
  state: () => {
    return {
      lang: '',
    };
  },
  actions: {
    setLangStore(val: string) {
      this.lang = val;
    },
  },
});

export const usePageData = defineStore('edit-data', {
  state: () => {
    return {
      pageData: new Map(),
      tempData: new Map(),
    };
  },
  actions: {
    setPageData(data: any) {
      console.log(data);

      if (data?.length) {
        const mapData = new Map();
        for (let i = 0; i < data.length; i++) {
          mapData.set(data[i].name, data[i]);
        }
        this.pageData = mapData;
        this.tempData = _.cloneDeep(mapData);
      } else {
        this.pageData = new Map();
        this.tempData = new Map();
        console.log(this.pageData);
      }
    },
  },
});
