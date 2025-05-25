import axios from 'axios';
import { UserModule } from '@/store/modules/user';
import { getRequestKey, removePending } from './requestOptimize';
import router from '@/router';

const service = axios.create({ // 创建自定义axios实例，隔离全局配置
  baseURL: process.env.VUE_APP_BASE_API, // 基础API地址，通过环境变量注入（对应.env文件中的配置）控制环境切换（开发/生产）
  timeout: 60000000 // 请求超时时间（单位：毫秒），10分钟超时适用于大文件上传场景
});

// Request interceptors
service.interceptors.request.use( // 配置请求拦截器
  (config: any) => {
    // 身份验证处理流程
    if (UserModule.token) {
      // 当存在有效token时，自动注入请求头
      config.headers['token'] = UserModule.token;
    } else if (UserModule.token && config.url != '/login') {
      // 无有效token且非登录请求时，强制跳转登录页
      window.location.href = '/login'; // 使用完整重载方式跳转，清空当前路由状态
      return false; // 中止当前请求
    }
    return config; // 继续传递修改后的请求配置
  },
  (error: any) => {
    // 请求配置错误处理（如网络错误、无效请求等）
    Promise.reject(error); // 将错误传递到业务层的catch处理
  }
);

service.interceptors.response.use(
  (response: any) => {
    // 处理授权过期情况
    if (response.data.status === 401) { // 401, token失效
      router.push('/login'); // 使用vue-router跳转保持单页应用状态
    }
    // 代理路径处理（开发环境API代理解决方案）
    response.config.url = response.config.url.replace('/api', ''); // 去除代理前缀保持配置一致性

    // 请求队列管理
    const key = getRequestKey(response.config); // 生成唯一请求标识
    removePending(key); // 从pending队列移除已完成请求

    // 业务状态码过滤（假设1表示成功状态）
    if (response.data.code === 1) {
      return response; // 返回标准响应结构
    }
    return response; // 非成功状态继续传递响应
  },
  (error: any) => {
    // 网络级错误处理
    if (error && error.response) {
      switch (error.response.status) {
        case 401: // 未授权访问
          router.push('/login'); // 保留Vue应用上下文的路由跳转
          break;
        case 405: // 方法不允许
          error.message = '请求错误'; // 统一客户端错误提示
      }
    }

    // 错误请求的代理路径清理
    error.config.url = error.config.url.replace('/api', '');

    // 异常请求队列清理
    const key = getRequestKey(error.config);
    removePending(key); // 防止异常请求阻塞后续请求

    return Promise.reject(error); // 将错误抛给业务层处理
  }
);

export default service;
