import AppLayout from '@/layout/system/System_AppLayout.vue';

const systemRouter = [
  {
    path: '/sys/',
    component: AppLayout,
    children: [
      {
        path: '/system/dashboard',
        name: 'sysDashboard',
        component: () => import('@/views/Dashboard.vue'),
      },
      {
        path: '/system/allow',
        name: 'sysAllow',
        component: () => import('@/views/uikit/FormLayout.vue'),
      },
      {
        path: '/system/regist',
        name: 'input',
        component: () => import('@/views/uikit/InputDoc.vue'),
      },
      {
        path: '/system/regist-list',
        name: 'button',
        component: () => import('@/views/uikit/ButtonDoc.vue'),
      },
      {
        path: '/system/regist-plan',
        name: 'table',
        component: () => import('@/views/uikit/TableDoc.vue'),
      },
      {
        path: '/system/plan-list',
        name: 'list',
        component: () => import('@/views/uikit/ListDoc.vue'),
      },
      {
        path: '/system/survey',
        name: 'tree',
        component: () => import('@/views/uikit/TreeDoc.vue'),
      },
    ],
  },
  {
    path: '/landing',
    name: 'landing',
    component: () => import('@/views/pages/Landing.vue'),
  },
  {
    path: '/pages/notfound',
    name: 'notfound',
    component: () => import('@/views/pages/NotFound.vue'),
  },

  {
    path: '/auth/login',
    name: 'login',
    component: () => import('@/views/pages/auth/Login.vue'),
  },
  {
    path: '/auth/access',
    name: 'accessDenied',
    component: () => import('@/views/pages/auth/Access.vue'),
  },
  {
    path: '/auth/error',
    name: 'error',
    component: () => import('@/views/pages/auth/Error.vue'),
  },
];

export default systemRouter;
