import { request } from '@/shared/axios';
import type { AxiosResponse } from '@/shared/axios';

/**
 * 创建页面
 * @name createPage
 * @return {Array}
 */
export function createPage(content: string) {
  const url = '/api/page';

  const params = {
    path: 'https://www.openeuler.org/zh/interaction/event-list/',
    folder: '/',
    name: 'level2_name',
    title: 'Test',
    description: 'Test page',
    isPrivate: false,
    isPublished: false,
    content: content,
    contentType: 'txt',
  };
  return request
    .post(url, params)
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
  const url = `/api/page/${id}`;
  return request
    .get(url)
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

export function modifyPageData(id: number, content: string) {
  const url = `/api/page/${id}`;
  const params = {
    path: 'https://www.openeuler.org/zh/interaction/event-list/',
    folder: '/',
    name: 'level2_name',
    title: 'Test',
    description: 'Test page',
    isPrivate: false,
    isPublished: false,
    content: content,
    contentType: 'txt',
  };
  return request
    .put(url, params)
    .then((res: AxiosResponse) => res.data)
    .catch((e: any) => {
      console.error(e);
    });
}
