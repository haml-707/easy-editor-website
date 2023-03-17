import { defineStore } from 'pinia';

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
    };
  },
  actions: {
    setPageData(data: any) {
      const mapData = new Map();
      for (let i = 0; i < data.length; i++) {
        mapData.set(data[i].name, data[i]);
      }
      this.pageData = mapData;
    },
  },
});
