<script setup>
import { useLayout } from '@/layout/composables/layout';
// import AppConfigurator from './AppConfigurator.vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore'; // ⭐️ Pinia Store 경로를 실제 프로젝트 구조에 맞게 수정하세요

const { toggleMenu } = useLayout();
const router = useRouter();
const authStore = useAuthStore(); // Pinia Store 인스턴스

/**
 * 사용자 역할(userRole)에 따라 정해진 경로로 이동하는 함수
 */
function goToDashboard() {
  // Pinia Store에서 현재 사용자 역할을 가져옵니다.
  const role = authStore.userRole;

  let targetPath = '/'; // 기본 경로 설정

  switch (role) {
    case '1a':
      targetPath = '/ud';
      break;
    case '2a':
      targetPath = '/staff/home';
      break;
    case '3a':
      targetPath = '/amy';
      break;
    case 'SYS':
      targetPath = '/system';
      break;
    default:
      // 정의되지 않은 역할은 홈으로 이동
      targetPath = '/';
      break;
  }

  router.push(targetPath);
}
</script>

<template>
  <div class="layout-topbar">
    <div class="layout-topbar-logo-container">
      <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
        <i class="pi pi-bars"></i>
      </button>

      <div @click="goToDashboard" class="layout-topbar-logo" style="cursor: pointer">
        <img class="logo" src="/demo/images/기본로고.png" alt="메인로고" />
        <!-- <span>도움 24</span> -->
      </div>
    </div>

    <div class="layout-topbar-actions">
      <div class="layout-config-menu">
        <div class="relative">
          <!-- <button
            v-styleclass="{
              selector: '@next',
              enterFromClass: 'hidden',
              enterActiveClass: 'animate-scalein',
              leaveToClass: 'hidden',
              leaveActiveClass: 'animate-fadeout',
              hideOnOutsideClick: true,
            }"
            type="button"
            class="layout-topbar-action layout-topbar-action-highlight"
          >
            <i class="pi pi-palette"></i>
          </button> -->
          <!-- <AppConfigurator /> -->
        </div>
      </div>

      <!-- <button
        class="layout-topbar-menu-button layout-topbar-action"
        v-styleclass="{
          selector: '@next',
          enterFromClass: 'hidden',
          enterActiveClass: 'animate-scalein',
          leaveToClass: 'hidden',
          leaveActiveClass: 'animate-fadeout',
          hideOnOutsideClick: true,
        }"
      >
        <i class="pi pi-ellipsis-v"></i>
      </button> -->

      <div class="layout-topbar-menu hidden lg:block">
        <div class="layout-topbar-menu-content">
          <!-- <button type="button" class="layout-topbar-action">
            <i class="pi pi-calendar"></i> <span>Calendar</span>
          </button> -->

          <!-- <button type="button" class="layout-topbar-action">
            <i class="pi pi-inbox"></i> <span>Messages</span>
          </button> -->

          <!-- <button type="button" class="layout-topbar-action">
            <i class="pi pi-user"></i> <span>Profile</span>
          </button> -->
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* 1. 로고 컨테이너에 Flexbox 적용 */
.layout-topbar-logo {
  display: flex; /* 자식 요소를 수평으로 배치 */
  align-items: center; /* 중앙 정렬 */
  gap: 0.75rem; /* 로고와 텍스트 사이 간격  */
}

/* 2. 로고 이미지(.logo)의 크기를 강제 고정 */
.layout-topbar-logo .logo {
  width: 100px;
  height: 56px;

  /* PNG 이미지의 가로세로 비율을 유지하며 컨테이너에 맞춤 */
  object-fit: contain !important;
}

/*  텍스트 크기 조정  */
.layout-topbar-logo span {
  font-size: 1.2rem !important;
  font-weight: 700;
}
</style>
