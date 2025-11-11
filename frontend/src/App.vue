<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

onMounted(() => {
  // 앱 마운트 시, accessToken(localStorage)은 있는데 user(state) 정보가 없으면
  if (authStore.accessToken && !authStore.user) {
    // 서버에서 사용자 정보를 가져와 state를 복원합니다.
    authStore.fetchUser();
  }
});
</script>

<template>
  <router-view />
</template>

<style scoped></style>
