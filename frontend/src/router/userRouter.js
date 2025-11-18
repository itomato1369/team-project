export default [
  {
    path: '/ud',
    name: 'ud',
    component: () => import('@/views/UserDashboard.vue'),
  },
  {
    path: '/umy',
    name: 'umy',
    component: () => import('@/views/UserMyPage.vue'),
  },
  {
    path: '/smy',
    name: 'smy',
    component: () => import('@/views/pages/staff/StaffMyPage.vue'),
  },
  {
    path: '/amy',
    name: 'amy',
    component: () => import('@/views/AdminMyPage.vue'),
  },
  {
    path: '/uds',
    name: 'uds',
    component: () => import('@/components/UserSearch.vue'),
  },
  {
    path: '/un',
    name: 'un',
    component: () => import('@/components/UserNotice.vue'),
  },
  {
    path: '/sn',
    name: 'sn',
    component: () => import('@/components/StaffNotice.vue'),
  },
  {
    path: '/ui',
    name: 'ui',
    component: () => import('@/components/UserInquiry.vue'),
  },
  {
    path: '/ui/:id',
    name: 'user-inquiry-detail',
    component: () => import('@/components/UserInquiryDetail.vue'),
  },
];
