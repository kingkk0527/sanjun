import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/layout/index.vue';

// 路由配置
Vue.use(Router);

const router = new Router({
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
      meta: { title: '登录', hidden: true, notNeedAuth: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/login/register.vue'),
      meta: { title: '注册', hidden: true, notNeedAuth: true }
    },
    {
      path: '/404',
      component: () => import('@/views/404.vue'),
      meta: { title: '404', hidden: true, notNeedAuth: true }
    },
    {
      path: '/',
      component: Layout,
      redirect: '/algorithm',
      children: [ {
        path: '/algorithm',
        component: () => import('@/views/algorithm/suanfa.vue'),
        meta: {
          title: '图像处理',
          icon: 'icon-image'
        }
      },
      {
        path: '/patient',
        component: () => import('@/views/Patient/index.vue'),
        meta: {
          title: '患者管理',
          icon: 'icon-patient',
          iconColor: '#000000'
        }
      },
      {
        path: '/patient/add',
        component: () => import('@/views/Patient/addPatient.vue'),
        meta: {
          title: '添加患者',
          hidden: true
        }
      },
      {
        path: '/patient/detail',
        component: () => import('@/views/Patient/detailPatient.vue'),
        meta: {
          title: '添加患者',
          hidden: true
        }
      },

      {
        path: 'employee',
        component: () => import('@/views/employee/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'icon-user',
          roles: ['admin'],
          hidden: false
        }
      },

      {
        path: '/employee/add',
        component: () => import('@/views/employee/addEmployee.vue'),
        meta: {
          title: '添加/修改用户',
          roles: ['admin'],
          hidden: true
        }
      }

      ]
    },
    {
      path: '*',
      redirect: '/404',
      meta: { hidden: true }
    }
  ]
});
// 在路由实例后添加导航守卫
router.beforeEach((to, from, next) => { // TODO 权限控制路由
  console.log('[路由守卫触发] 访问路径:', to.path);
  // 获取本地存储的用户信息
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  // 验证需要权限的路由
  if (to.matched.some(record => record.meta.roles)) {
    const requiredRoles = (to.meta.roles || []) as string[];
    const userRole = userInfo.role || '';

    if (!requiredRoles.includes(userRole)) {
      next('/404');
      return; // 重要：阻止后续代码执行
    }
  }
  next(); // 必须执行的基础放行
}
);

export default router;
