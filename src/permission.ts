import router from './router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { Message } from 'element-ui';
// @ts-ignore
import { Route } from 'vue-router';
import { UserModule } from '@/store/modules/user';
import Cookies from 'js-cookie';

NProgress.configure({ 'showSpinner': false });

router.beforeEach(async(to: Route, _: Route, next: any) => { // TODO 控制登陆安全 从 Cookies 里面取token
  NProgress.start();
  if (Cookies.get('token')) {
    next();
  } else {
    if (!to.meta.notNeedAuth) {
      next('/login'); // TODO 否则全部重定向到登录页
    } else {
      next();
    }
  }
});

router.afterEach((to: Route) => {
  NProgress.done();
  document.title = to.meta.title;
});
