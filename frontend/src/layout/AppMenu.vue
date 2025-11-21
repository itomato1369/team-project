<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';

import AppMenuItem from './AppMenuItem.vue';

const authStore = useAuthStore();

const model = ref([
  {
    label: 'Home',
    items: [
      { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
      { label: '로그인', icon: 'pi pi-fw pi-sign-in', to: '/login' },
      { label: '로그아웃', icon: 'pi pi-fw pi-sign-out', command: () => authStore.logout() },
    ],
  },
  {
    label: '이용자',
    items: [
      { label: '이용자 상담신청', icon: 'pi pi-fw pi-home', to: { name: 'counseling-apply' } },
      { label: '이용자 상담내역', icon: 'pi pi-fw pi-home', to: { name: 'counseling-history' } },
      {
        label: '마이 페이지',
        icon: 'pi pi-fw pi-home',
        to: '/umy',
      },
    ],
  },
  {
    label: '담당자',
    icon: 'pi pi-fw pi-prime',
    items: [
      { label: '담당자 대시보드', icon: 'pi pi-fw pi-home', to: { name: 'staffhome' } },
      {
        label: '담당자 상담스케줄설정',
        icon: 'pi pi-fw pi-home',
        to: { name: 'staffschedule-settings' },
      },
      {
        label: '담당자 상담예약관리',
        icon: 'pi pi-fw pi-home',
        to: { name: 'reservations' },
      },
      {
        label: '담당자 상담기록관리',
        icon: 'pi pi-fw pi-home',
        to: { name: 'counselinglist' },
      },
      { label: '담당자신청서조회', icon: 'pi pi-fw pi-home', to: '/activityreport' },
      { label: '지원계획조회', icon: 'pi pi-fw pi-home', to: '/applicationlist' },
      { label: '지원결과조회', icon: 'pi pi-fw pi-home', to: '/supportresultlist' },
    ],
  },
  {
    label: '관리자',
    icon: 'pi pi-fw pi-briefcase',
    to: '/pages',
    items: [
      { label: '이용자승인대기목록', icon: 'pi pi-fw pi-home', to: '/applicationform' },
      {
        label: 'Landing',
        icon: 'pi pi-fw pi-globe',
        to: '/landing',
      },
      {
        label: 'Crud',
        icon: 'pi pi-fw pi-pencil',
        to: '/pages/crud',
      },
    ],
  },
]);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
