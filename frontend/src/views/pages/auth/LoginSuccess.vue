<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const authStore = useAuthStore();

onMounted(async () => {
  const { token, refreshToken } = route.query;

  if (token && refreshToken) {
    await authStore.handleSocialLogin({ accessToken: token, refreshToken: refreshToken });
  } else {
    // 토큰이 없으면 에러 처리 또는 로그인 페이지로 리디렉션
    console.error('소셜 로그인 토큰이 없습니다.');
    // 예: router.push('/auth/login');
  }
});
</script>

<template>
  <div class="flex justify-content-center align-items-center min-h-screen">
    <div class="text-center">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      <p class="mt-3">로그인 처리 중입니다. 잠시만 기다려주세요...</p>
    </div>
  </div>
</template>
