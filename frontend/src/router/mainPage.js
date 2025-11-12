export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/pages/Login.vue'),
    // meta: { requiresAuth: false }, // 인증X
  },
  {
    path: '/home',
    name: 'userhome',
    component: () => import('@/components/AppMain.vue'),
  },
  {
    path: '/syshome',
    name: 'syshome',
    component: () => import('@/components/SysMain.vue'),
  },
  {
    path: '/homepage',
    name: 'homepage',
    component: () => import('@/components/AppHome.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/components/SignUp.vue'),
  },
];
