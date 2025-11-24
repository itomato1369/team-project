import AppLayout from '@/layout/system/AppLayout.vue';

const systemRouter = [
  {
    path: '/system',
    component: AppLayout,
    children: [
      {
        path: '/system', // 시스템 관리자 메인 페이지
        name: 'sysMain',
        component: () => import('@/views/uikit/system_ui/SystemMain.vue'),
      },
      {
        path: '/system/approval', // 권한승인 페이지
        name: 'sysApproval',
        component: () => import('@/views/uikit/system_ui/SystemApproval.vue'),
      },
      {
        path: '/system/institutions', // 등록된 기관 목록
        name: 'sysInstitutionList',
        component: () => import('@/views/uikit/system_ui/SystemInstitution.vue'),
      },
      {
        path: '/system/institutions/register', // 새로운 기관 등록
        name: 'sysInstitutionRegister',
        component: () => import('@/views/uikit/system_ui/SystemInstitutionRegister.vue'),
      },
      {
        path: '/system/institutions/:id', // 등록된 기관 상세보기
        name: 'sysInstitutionDetails',
        component: () => import('@/views/uikit/system_ui/SystemInstitutionDetails.vue'),
      },
      {
        path: '/system/institutions/:id', // 등록된 기관 정보수정
        name: 'sysInstitutionUpdate',
        component: () => import('@/views/uikit/system_ui/SystemInstitutionUpdate.vue'),
      },
      {
        path: '/system/notices', // 등록된 공고 목록
        name: 'sysNotice',
        component: () => import('@/views/uikit/system_ui/SystemNotice.vue'),
      },
      {
        path: '/system/notices/:id', // 공고 상세정보
        name: 'sysNoticeDetails',
        component: () => import('@/views/uikit/system_ui/SystemNoticeDetail.vue'),
      },
      {
        path: '/system/notices/register', // 새로운 공고 등록
        name: 'sysNoticeRegister',
        component: () => import('@/views/uikit/system_ui/SystemNoticeRegister.vue'),
      },

      {
        path: '/system/regist-plan',
        name: 'table',
        component: () => import('@/views/uikit/system_ui/TableDoc.vue'),
      },
      {
        path: '/system/plan-list',
        name: 'list',
        component: () => import('@/views/uikit/system_ui/ListDoc.vue'),
      },
      {
        path: '/system/survey',
        name: 'SurveyList',
        component: () => import('@/views/uikit/system_ui/SurveyTable.vue'),
      },
      {
        path: '/system/survey/detail/:id',
        name: 'SurveyDetail',
        // 이 라우트가 로드할 실제 상세 페이지 컴포넌트
        component: () => import('@/views/uikit/system_ui/SurveyDetail.vue'),
      },
      {
        path: '/system/regist-survey', // (실제 경로는 다를 수 있습니다)
        name: 'RegistSurvey', // 👈 이 'name'을 사용할 것입니다.
        component: () => import('@/views/uikit/system_ui/RegistSurvey.vue'),
      },
      {
        path: '/system/data-board', // (실제 경로는 다를 수 있습니다)
        name: 'DataBoard', // 👈 이 'name'을 사용할 것입니다.
        component: () => import('@/views/uikit/system_ui/SystemDataBoard.vue'),
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
