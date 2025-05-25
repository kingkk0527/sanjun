import request from '@/utils/request';
export const upload = (data: any) =>
  request({
    'url': '/algorithm/upload',
    'method': 'post',
    data: data
  });
