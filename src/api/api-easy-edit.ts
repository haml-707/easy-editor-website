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
export function createPage(content: string) {
  const url = '/api-edit/page';
  const params = {
    path: 'https://www.openeuler.org/zh/sig/sig-detail/?name=sig-OpenDesign',
    name: 'profile/markdown',
    title: 'sig 简介',
    description: 'sig 简介',
    isPrivate: false,
    isPublished: false,
    content:
      'The A-Tune team is responsible for exploration of optimization technologies and AI-assisted performance analysis',
    contentType: 'txt',
  };
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
  return request
    .put(url, params, getHeaderConfig())
    .then((res: AxiosResponse) => res.data)
    .catch((e: any) => {
      console.error(e);
    });
}

export function publishPage(path: string) {
  const url = '/api-edit/publish';
  const params = {
    path,
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

export function profileData() {
  const url = '/api-edit/page/profile';
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
  console.log(name, path);

  const url = `/api-edit/page?path=${path}&name=${name}`;
  return request
    .delete(url, getHeaderConfig())
    .then((res: AxiosResponse) => res.data)
    .catch((e: any) => {
      console.error(e);
    });
}
