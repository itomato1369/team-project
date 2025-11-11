<script setup>
import { ref } from 'vue';

import AppMenuItem from './System_AppMenuItem.vue';

const model = ref([
  {
    label: '홈',
    items: [{ label: '대쉬보드', icon: 'pi pi-fw pi-home', to: '/system/dashboard' }],
  },

  {
    label: '기능',
    items: [
      { label: '권한승인', icon: 'pi pi-fw pi-id-card', to: '/system/allow' },
      { label: '신규 기관 등록', icon: 'pi pi-fw pi-check-square', to: '/system/regist' },
      {
        label: '등록 기관 목록',
        icon: 'pi pi-fw pi-mobile',
        to: '/system/regist-list',
        class: 'rotated-icon',
      },
      { label: '지원계획 등록', icon: 'pi pi-fw pi-table', to: '/system/regist-plan' },
      { label: '지원계획 목록', icon: 'pi pi-fw pi-list', to: '/system/plan-list' },
      { label: '조사지 관리', icon: 'pi pi-fw pi-share-alt', to: '/survey' },
    ],
  },
]);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator">{{ label.items.label }}</li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
