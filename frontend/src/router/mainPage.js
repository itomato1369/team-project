export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/pages/Login.vue'),
    meta: { requiresAuth: false }, // 인증X
  },
  // {
  //   path: '/home',
  //   name: 'userhome',
  //   component: () => import('@/components/AppMain.vue'),
  // },
  {
    path: '/homepage',
    name: 'homepage',
    component: () => import('@/views/pages/AppHome.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/views/pages/SignUp.vue'),
  },
  {
    path: '/findaccount',
    name: 'findAccount',
    component: () => import('@/views/pages/FindAccount.vue'),
  },
  {
    path: '/counseling-apply',
    name: 'counseling-apply',
    component: () => import('../views/pages/user/Counseling.vue'),
  },
  {
    path: '/counseling-history',
    name: 'counseling-history',
    component: () => import('../views/pages/user/CounselingHistory.vue'),
  },
];
