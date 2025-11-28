<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';

import AppMenuItem from './AppMenuItem.vue';

const authStore = useAuthStore();

const model = ref([
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
      {
        label: '자료실',
        icon: 'pi pi-fw pi-file',
        to: '/data-board',
        roles: ['SYS'],
      },
      {
        label: '로그아웃',
        icon: 'pi pi-fw pi-sign-out',
        command: () => authStore.logout(),
        roles: ['SYS'],
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
