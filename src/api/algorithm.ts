import request from '@/utils/request';
export const upload = (data: any) =>
  request({
    'url': '/algorithm/image-analyze',
    'method': 'post',
    data: data
  });
