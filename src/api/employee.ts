import request from '@/utils/request';
/**
 *
 * 员工管理
 *
 **/
// 修改密码
export const editPassword = (data: any) =>
  request({
    'url': '/employee/editPassword',
    'method': 'put',
    data: data
  });
// 登录
export const login = (data: any) =>
  request({
    'url': '/employee/login',
    'method': 'post',
    data: data
  });

export const register = (data: any) =>
  request({
    'url': '/employee/register',
    'method': 'post',
    data: data
  });

  // 退出
export const userLogout = (params: any) =>
  request({
    'url': `/employee/logout`,
    'method': 'post',
    params
  });

// 分页查询
export const getEmployeeList = (params: any) =>
  request({
    'url': `/employee/page`,
    method: 'post',
    data: { ...params }
  });

export function deleteEmployee(id: number) {
  return request.delete(`/employee/${id}`);
}

// 新增员工
export const addEmployee = (params: any) =>
  request({
    'url': '/employee',
    'method': 'POST',
    'data': params
  });

// 根据id查询员工
export const queryEmployeeById = (id: number) =>
  request({
    'url': `/employee/${id}`,
    'method': 'POST'
  });

// 修改员工
export const updateEmployee = (params: any) =>
  request({
    'url': '/employee',
    'method': 'PUT',
    'data': params
  });
