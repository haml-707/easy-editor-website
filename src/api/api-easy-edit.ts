import { request } from '@/shared/axios';
import type { AxiosResponse } from '@/shared/axios';
import { getUserAuth } from '@/shared/login';

function getHeaderConfig() {
  const { token } = getUserAuth();
  const headersConfig = token
    ? {
        headers: {
          token,
        },
      }
    : {};
  return headersConfig;
}

/**
 * 创建页面
 * @name createPage
 * @return {Array}
 */
export function createPage(params: any) {
  const url = '/api-edit/page';
  return request
    .post(url, params, getHeaderConfig())
    .then((res: AxiosResponse) => res.data)
    .catch((e: any) => {
      console.error(e);
    });
}

/**
 * 创建页面
 * @name getPageData
 * @return {Array}
 */

export function getPageData(id: number) {
  const url = `/api-edit/page/${id}`;
  return request
    .get(url, getHeaderConfig())
    .then((res: AxiosResponse) => res.data)
    .catch((e: any) => {
      console.error(e);
    });
}
/**
 * 更新页面数据
 * @name modifyPageData
 * @return {Array}
 */

export function modifyFloorData(params: any) {
  const url = `/api-edit/page?path=${params.path}&name=${params.name}`;
  const { headers } = getHeaderConfig();

  return request
    .put(url, params, { headers, $ignoreLoading: true })
    .then((res: AxiosResponse) => res.data)
    .catch((e: any) => {
      console.error(e);
    });
}

export function publishPage(path: string, publisher: string) {
  const url = '/api-edit/publish';
  const params = {
    path,
    publisher,
  };
  return request
    .post(url, params, getHeaderConfig())
    .then((res: AxiosResponse) => res.data)
    .catch((e: any) => {
      console.error(e);
    });
}
/**
 * 查询可编辑的页面
 * @name profileData
 * @return {Array}
 */

export function profileData(params: { siteName: string; type: string }) {
  const url = `/api-edit/page/profile?name=${params.siteName}&type=${params.type}`;
  return request
    .get(url, getHeaderConfig())
    .then((res: AxiosResponse) => res.data)
    .catch((e: any) => {
      console.error(e);
    });
}
/**
 * 查询path 下的所有 组件
 * @name profileData
 * @return {Array}
 */
export function getAllDataByPath(path: string) {
  const url = `/api-edit/page/all?path=${path}`;
  return request
    .get(url, getHeaderConfig())
    .then((res: AxiosResponse) => res.data)
    .catch((e: any) => {
      console.error(e);
    });
}
/**
 * 删除单个页面
 * @name delFloor
 */
export function deleteFloor(path: string, name: string) {
  const url = `/api-edit/page?path=${path}&name=${name}`;
  return request
    .delete(url, getHeaderConfig())
    .then((res: AxiosResponse) => res.data)
    .catch((e: any) => {
      console.error(e);
    });
}

export function getLast() {
  const url = `/api-edit/publish/latest?path=https://www.openeuler.org/zh/sig/sig-detail/?name=sig-OpenDesign`;
  return request
    .get(url, getHeaderConfig())
    .then((res: AxiosResponse) => res.data)
    .catch((e: any) => {
      console.error(e);
    });
}
