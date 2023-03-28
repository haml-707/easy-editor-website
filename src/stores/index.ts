import { defineStore } from 'pinia';
import _ from 'lodash-es';

interface FloorData {
  name: string;
  content_type?: string;
  description?: string;
  title: string;
}

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
// 页面数据
export const usePageData = defineStore('edit-data', {
  state: () => {
    return {
      pageData: new Map(),
      tempData: new Map(),
    };
  },
  actions: {
    setPageData(data: [FloorData]) {
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
      }
    },
  },
});
// 当前版本
export const useVersionData = defineStore('version-data', {
  state: () => {
    return {
      versionData: 0,
      isCoverLatest: true,
      isCoverDialogShon: false,
    };
  },
  actions: {
    setVersionData(data: number) {
      this.versionData = data;
    },
    setCoverData(data: boolean) {
      this.isCoverLatest = data;
    },
    setDialogData(data: boolean) {
      this.isCoverDialogShon = data;
    },
  },
});
