// router/main.routes.js

// 이 파일에서만 사용하는 컴포넌트가 있다면 여기서 import 합니다.
// 예: import About from '@/views/About.vue'

const mainRouter = [
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'), // 예시 경로
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/Contact.vue'), // 예시 경로
  },
];

export default mainRouter;
