import { defineStore } from 'pinia';
import api from '@/api/api';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null, // [추가] Refresh Token도 LocalStorage에 저장
    isLoading: false,
  }),
  getters: {
    isLoggedIn: (state) => !!state.accessToken && !!state.user,
    userRole: (state) => state.user?.role || 'GUEST',
  },
  actions: {
    async login(credentials) {
      this.isLoading = true;
      console.log('[AuthStore] login: 시도 중...', credentials.userId);
      try {
        const response = await api.post('/api/auth/login', credentials);
        const { accessToken, refreshToken, user } = response.data;

        console.log('[AuthStore] login: 성공', {
          user,
          accessToken: accessToken.substring(0, 10) + '...',
        });

        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;

        switch (user.role) {
          case '1a':
            router.push('/ud');
            break;
          case '2a':
            router.push('/smy');
            break;
          case '3a':
            router.push('/amy');
            break;
          case 'SYS':
            router.push('/system');
            break;
          default:
            router.push('/');
            break;
        }
        return true;
      } catch (error) {
        console.error('[AuthStore] login: 실패', error.response?.data || error.message);
        this.$reset();
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      console.log('[AuthStore] logout: 호출됨. 현재 사용자:', this.user?.id);
      console.log('[AuthStore] logout: Pinia 상태와 LocalStorage를 초기화합니다.');

      this.$reset();

      console.log('[AuthStore] logout: 상태 초기화 완료. 로그인 페이지로 이동합니다.');
      router.push({ name: 'login' });
    },

    async refreshAccessToken() {
      console.log('[AuthStore] refreshAccessToken: 호출됨');
      if (!this.refreshToken) {
        console.warn('[AuthStore] refreshAccessToken: Refresh token 없음. 강제 로그아웃.');
        this.logout();
        return false;
      }
      try {
        const response = await api.post('/api/auth/refresh', {
          refreshToken: this.refreshToken,
        });
        this.accessToken = response.data.accessToken;
        console.log('[AuthStore] refreshAccessToken: 성공. 새 Access Token 발급.');
        return true;
      } catch (error) {
        console.error(
          '[AuthStore] refreshAccessToken: 실패',
          error.response?.data || error.message
        );
        this.logout();
        return false;
      }
    },

    async fetchUser() {
      if (!this.accessToken) return;
      this.isLoading = true;
      try {
        const response = await api.get('/api/auth/me');
        this.user = response.data.user;
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async handleSocialLogin({ accessToken, refreshToken }) {
      console.log('[AuthStore] handleSocialLogin: 호출됨');
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;

      await this.fetchUser(); // 사용자 정보 가져오기

      console.log('[AuthStore] handleSocialLogin: 소셜 로그인 성공. 홈으로 이동합니다.');
      router.push('/');
    },
  },
  persist: true, // 모든 state를 localStorage에 저장
});
