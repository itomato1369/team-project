<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
  {
    label: '홈',
    items: [{ label: '대쉬보드', icon: 'pi pi-fw pi-home', to: '/system' }],
  },
  {
    label: '기능',
    items: [
      { label: '권한승인', icon: 'pi pi-fw pi-id-card', to: '/system/approval' },
      {
        label: '신규기관 등록',
        icon: 'pi pi-fw pi-check-square',
        to: '/system/institutions/register',
      },
      {
        label: '등록기관 목록',
        icon: 'pi pi-fw pi-list',
        to: '/system/institutions',
        class: 'rotated-icon',
      },
      { label: '공고 등록', icon: 'pi pi-fw pi-check-square', to: '/system/notices/register' },
      { label: '공고 목록', icon: 'pi pi-fw pi-list', to: '/system/notices' },
      { label: '조사지 관리', icon: 'pi pi-fw pi-book', to: '/system/survey' },
      { label: '자료실', icon: 'pi pi-fw pi-file', to: '/system/data-board' },
    ],
  },
  {
    label: 'Prime Blocks',
    icon: 'pi pi-fw pi-prime',
    items: [
      {
        label: 'Free Blocks',
        icon: 'pi pi-fw pi-eye',
        to: '/blocks',
      },
      {
        label: 'All Blocks',
        icon: 'pi pi-fw pi-globe',
        url: 'https://blocks.primevue.org/',
        target: '_blank',
      },
    ],
  },
  {
    label: 'Pages',
    icon: 'pi pi-fw pi-briefcase',
    to: '/pages',
    items: [
      {
        label: 'Landing',
        icon: 'pi pi-fw pi-globe',
        to: '/landing',
      },
      {
        label: 'Auth',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Login',
            icon: 'pi pi-fw pi-sign-in',
            to: '/login',
          },
          {
            label: 'Error',
            icon: 'pi pi-fw pi-times-circle',
            to: '/auth/error',
          },
          {
            label: 'Access Denied',
            icon: 'pi pi-fw pi-lock',
            to: '/auth/access',
          },
        ],
      },
      {
        label: 'Crud',
        icon: 'pi pi-fw pi-pencil',
        to: '/pages/crud',
      },
      {
        label: 'Not Found',
        icon: 'pi pi-fw pi-exclamation-circle',
        to: '/pages/notfound',
      },
      {
        label: 'Empty',
        icon: 'pi pi-fw pi-circle-off',
        to: '/pages/empty',
      },
    ],
  },
  {
    label: 'Hierarchy',
    items: [
      {
        label: 'Submenu 1',
        icon: 'pi pi-fw pi-bookmark',
        items: [
          {
            label: 'Submenu 1.1',
            icon: 'pi pi-fw pi-bookmark',
            items: [
              { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
            ],
          },
          {
            label: 'Submenu 1.2',
            icon: 'pi pi-fw pi-bookmark',
            items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }],
          },
        ],
      },
      {
        label: 'Submenu 2',
        icon: 'pi pi-fw pi-bookmark',
        items: [
          {
            label: 'Submenu 2.1',
            icon: 'pi pi-fw pi-bookmark',
            items: [
              { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
            ],
          },
          {
            label: 'Submenu 2.2',
            icon: 'pi pi-fw pi-bookmark',
            items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }],
          },
        ],
      },
    ],
  },
  {
    label: 'Get Started',
    items: [
      {
        label: 'Documentation',
        icon: 'pi pi-fw pi-book',
        to: '/documentation',
      },
      {
        label: 'View Source',
        icon: 'pi pi-fw pi-github',
        url: 'https://github.com/primefaces/sakai-vue',
        target: '_blank',
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
