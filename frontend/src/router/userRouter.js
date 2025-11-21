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
  {
    // 피보호자 추가
    path: '/user/ward/insert',
    name: 'user-ward-insert',
    component: () => import('@/views/pages/user/UserWardInfoInsert.vue'),
  },
  {
    // 피보호자 수정
    path: '/user/ward/edit/:ward_no',
    name: 'user-ward-edit',
    component: () => import('@/views/pages/user/UserWardInfoInsert.vue'),
    props: true,
  },
  {
    path: '/user/support-plan/:inquiry_no/:ward_no',
    name: 'user-support-plan-detail',
    component: () => import('@/views/UserSupportPlanDetail.vue'),
    props: true,
  },
  {
    path: '/qna',
    name: 'user-qna',
    component: () => import('@/views/pages/user/UserQna.vue'),
    props: true,
  },
  {
    path: '/qna/question',
    name: 'question',
    component: () => import('@/views/pages/user/Question.vue'),
    props: true,
  },
  {
    path: '/qna/question-detail/:question_no',
    name: 'questionDetail',
    component: () => import('@/views/pages/user/QnaServiceDetail.vue'),
  },
  {
    path: '/data-board', // (실제 경로는 다를 수 있습니다)
    name: 'FileBoard', // 👈 이 'name'을 사용할 것입니다.
    component: () => import('@/views/uikit/system_ui/SystemDataBoard.vue'),
  },
  {
    path: '/data-board/file-regist', // (실제 경로는 다를 수 있습니다)
    name: 'RegistFile', // 👈 이 'name'을 사용할 것입니다.
    component: () => import('@/views/uikit/system_ui/RegistFile.vue'),
  },
];
