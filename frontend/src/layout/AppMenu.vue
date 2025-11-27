<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import AppMenuItem from './AppMenuItem.vue';

const authStore = useAuthStore();

// 메뉴 데이터 + 권한 정보 추가
const model = ref([
  {
    label: 'Home',
    items: [
      { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/', roles: ['1a', '2a', '3a', 'SYS'] },
      { label: '로그인', icon: 'pi pi-fw pi-sign-in', to: '/login', roles: ['guest'] }, // guest: 비로그인
      {
        label: '로그아웃',
        icon: 'pi pi-fw pi-sign-out',
        command: () => authStore.logout(),
        roles: ['1a', '2a', '3a', 'SYS'],
      }, // 로그인
      {
        label: 'Q&A',
        icon: 'pi pi-fw pi-search',
        to: '/qna',
        roles: ['1a', '2a', '3a', 'SYS'],
        //         {
        //   path: '/qna',
        //   name: 'user-qna',
        //   component: () => import('@/views/pages/user/UserQna.vue'),
        //   props: true,
        // },
      },
      { label: '자료실', icon: 'pi pi-fw pi-file', to: '/ud/data-board', roles: ['1a'] },
      {
        label: '자료실',
        icon: 'pi pi-fw pi-file',
        to: '/data-board',
        roles: ['2a', '3a', 'SYS'],
      },
    ],
  },
  {
    label: '이용자',
    items: [
      {
        label: '이용자 상담신청',
        icon: 'pi pi-fw pi-home',
        to: { name: 'counseling-apply' },
        roles: ['1a'],
      },
      {
        label: '이용자 상담내역',
        icon: 'pi pi-fw pi-home',
        to: { name: 'counseling-history' },
        roles: ['1a'],
      },
      { label: '마이 페이지', icon: 'pi pi-fw pi-home', to: '/umy', roles: ['1a'] },
    ],
  },
  {
    label: '담당자',
    items: [
      {
        label: '담당자 대시보드',
        icon: 'pi pi-fw pi-home',
        to: { name: 'staffhome' },
        roles: ['2a'],
      },
      {
        label: '담당자 상담스케줄설정',
        icon: 'pi pi-fw pi-home',
        to: { name: 'staffschedule-settings' },
        roles: ['2a'],
      },
      {
        label: '담당자 상담예약관리',
        icon: 'pi pi-fw pi-home',
        to: { name: 'reservations' },
        roles: ['2a'],
      },
      {
        label: '담당자 상담기록관리',
        icon: 'pi pi-fw pi-home',
        to: { name: 'counselinglist' },
        roles: ['2a'],
      },
      { label: '담당자신청서조회', icon: 'pi pi-fw pi-home', to: '/activityreport', roles: ['2a'] },
      { label: '담당자마이페이지', icon: 'pi pi-fw pi-home', to: '/amy', roles: ['2a'] },
    ],
  },
  {
    label: '관리자',
    items: [
      {
        label: '이용자승인대기목록',
        icon: 'pi pi-fw pi-home',
        to: '/applicationform',
        roles: ['3a'],
      },
      { label: '지원계획조회', icon: 'pi pi-fw pi-home', to: '/applicationlist', roles: ['3a'] },
      { label: '지원결과조회', icon: 'pi pi-fw pi-home', to: '/supportresultlist', roles: ['3a'] },
      // { label: 'Landing', icon: 'pi pi-fw pi-globe', to: '/landing', roles: ['3a'] },
      // { label: 'Crud', icon: 'pi pi-fw pi-pencil', to: '/pages/crud', roles: ['3a'] },
      { label: '관리자마이페이지', icon: 'pi pi-fw pi-home', to: '/amy', roles: ['3a'] },
    ],
  },
  {
    label: '시스템',
    items: [
      { label: '시스템 관리자 대쉬보드', icon: 'pi pi-fw pi-home', to: '/system', roles: ['SYS'] },
      {
        label: '신규기관 등록',
        icon: 'pi pi-fw pi-check-square',
        to: '/system/institutions/register',
        roles: ['SYS'],
      },
      {
        label: '등록기관 목록',
        icon: 'pi pi-fw pi-list',
        to: '/system/institutions',
        class: 'rotated-icon',
        roles: ['SYS'],
      },
      {
        label: '공고 등록',
        icon: 'pi pi-fw pi-check-square',
        to: '/system/notices/register',
        roles: ['SYS'],
      },
      { label: '공고 목록', icon: 'pi pi-fw pi-list', to: '/system/notices', roles: ['SYS'] },
      { label: '조사지 관리', icon: 'pi pi-fw pi-book', to: '/system/survey', roles: ['SYS'] },

      {
        label: '권한승인 대기 목록',
        icon: 'pi pi-fw pi-id-card',
        to: '/system/approval',
        roles: ['SYS'],
      },
    ],
  },
]);

// 권한 기반 메뉴 필터링
const filteredMenu = computed(() => {
  const role = authStore.isLoggedIn ? authStore.userRole : 'guest'; // 로그인 여부에 따라 role 결정
  console.log('===============================\nrole is ', role);
  console.log('===============================\n menu is ', model.value);
  return model.value
    .map((menu) => {
      if (!menu.items) return null;
      const filteredItems = menu.items.filter((item) => item.roles.includes(role));
      if (filteredItems.length === 0) return null;
      return { ...menu, items: filteredItems };
    })
    .filter(Boolean);
});
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in filteredMenu" :key="i">
      <app-menu-item :item="item" :index="i"></app-menu-item>
    </template>
  </ul>
</template>

<style scoped lang="scss">
/* 필요 시 스타일 추가 */
</style>
