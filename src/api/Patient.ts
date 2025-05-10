import request from '@/utils/request';
import { getToken } from '@/utils/cookies';
/**
 *
 * 患者管理
 *
 **/
/**
 * 分页查询患者列表接口
 * @param params -  page:    // 分页查询 当前页数
           *       pageSize: // 分页查询 每页条数
           *       name:      // 分页查询 患者名称
           *       patientId: // 分页查询 患者编号
 * @returns 包含患者列表数据的响应
 */
export const getPatientPage = (params: any) => {
  return request({
    url: '/patient/page',
    method: 'get',
    params
  });
};

// 删除接口
export const deletePatient = (ids: string) => {
  return request({
    url: '/patient',
    method: 'delete',
    params: { ids }
  });
};

// 修改接口
export const editPatient = (params: any) => {
  return request({
    url: '/patient',
    method: 'put',
    data: { ...params }
  });
};

// 新增接口
export const addPatient = (params: any) => {
  return request({
    url: '/patient',
    method: 'post',
    data: { ...params }
  });
};

// 查询详情
export const queryPatientById = (id: string | (string | null)[]) => {
  return request({
    url: `/patient/${id}`,
    method: 'get'
  });
};

// 删除图片

export const deletePatientImage = (params: any) => {
  return request({
    url: `/patient/deleteImage`,
    method: 'delete',
    data: { ...params },
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
};
// export function deletePatientImage(data) {
//   return axios({
//     url: '/patient/deleteImage',
//     method: 'DELETE',
//     data: JSON.stringify(data),
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   });
// }

function axios(arg0: { url: string; method: string; data: string; headers: { 'Content-Type': string; }; }) {
  throw new Error('Function not implemented.');
}
