<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';

import AppMenuItem from './AppMenuItem.vue';

const authStore = useAuthStore();

const model = ref([
  {
    label: '홈',
    items: [
      { label: '시스템 관리자 대쉬보드', icon: 'pi pi-fw pi-home', to: '/system' },
      { label: '로그아웃', icon: 'pi pi-fw pi-sign-out', command: () => authStore.logout() },
    ],
  },
  {
    label: '기능',
    items: [
      {
        label: '신규기관 등록',
        icon: 'pi pi-fw pi-check-square',
        to: '/system/institutions/register',
      },
      { label: '자료실', icon: 'pi pi-fw pi-file', to: '/data-board', roles: ['SYS'] },
      {
        label: '등록기관 목록',
        icon: 'pi pi-fw pi-list',
        to: '/system/institutions',
        class: 'rotated-icon',
      },
      { label: '공고 등록', icon: 'pi pi-fw pi-check-square', to: '/system/notices/register' },
      { label: '공고 목록', icon: 'pi pi-fw pi-list', to: '/system/notices' },
      { label: '조사지 관리', icon: 'pi pi-fw pi-book', to: '/system/survey' },
      { label: '권한승인 대기 목록', icon: 'pi pi-fw pi-id-card', to: '/system/approval' },
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
