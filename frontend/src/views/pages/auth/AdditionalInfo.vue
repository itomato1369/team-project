<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/api.js';
import { useToast } from 'primevue/usetoast';

// State
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const signupToken = ref(null);
const isLoading = ref(false);

// Form fields
const phone = ref('');
const birthYear = ref('');
const birthMonth = ref('');
const birthDay = ref('');
const zipcode = ref('');
const addressMain = ref('');
const addressDetail = ref('');

const apiLoadError = ref('');

// 우편번호 모달
const isPostcodeOpen = ref(false);

// --- Lifecycle ---
onMounted(() => {
  const token = route.query.signupToken;
  if (!token) {
    toast.add({ severity: 'error', summary: '오류', detail: '잘못된 접근입니다.', life: 3000 });
    router.push({ name: 'login' });
  } else {
    signupToken.value = token;
  }
});

// --- Methods ---
const handleSubmit = async () => {
  if (
    !phone.value ||
    !birthYear.value ||
    !birthMonth.value ||
    !birthDay.value ||
    !addressMain.value
  ) {
    toast.add({
      severity: 'warn',
      summary: '정보 부족',
      detail: '모든 필수 정보를 입력해주세요.',
      life: 3000,
    });
    return;
  }

  isLoading.value = true;
  try {
    const birthDate = `${birthYear.value.padStart(4, '0')}-${birthMonth.value.padStart(2, '0')}-${birthDay.value.padStart(2, '0')}`;
    const fullAddress = `${zipcode.value}!${addressMain.value}${addressDetail.value ? '! ' + addressDetail.value : ''}`;

    const payload = {
      signupToken: signupToken.value,
      birthDate,
      phone: phone.value,
      fullAddress,
    };

    const response = await authApi.completeSocialSignup(payload);

    await authStore.handleSocialLogin({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    });

    toast.add({
      severity: 'success',
      summary: '성공',
      detail: '회원가입이 완료되었습니다! 환영합니다.',
      life: 3000,
    });
  } catch (error) {
    console.error('추가 정보 제출 실패:', error);
    toast.add({
      severity: 'error',
      summary: '가입 실패',
      detail: error.response?.data?.message || '회원가입을 완료하는 중 오류가 발생했습니다.',
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};

// 주소 검색
const searchZipcode = () => {
  isPostcodeOpen.value = true;
  apiLoadError.value = '';
};
const closePostcode = () => {
  isPostcodeOpen.value = false;
};
const addressSearched = (data) => {
  isPostcodeOpen.value = false;
  let fullAddress = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
  zipcode.value = data.zonecode;
  addressMain.value = fullAddress;
  addressDetail.value = '';
  setTimeout(() => document.getElementById('address-detail')?.focus(), 100);
};
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="text-center mb-5">
        <div class="text-900 text-3xl font-medium mb-3">추가 정보 입력</div>
        <span class="text-600 font-medium">소셜 로그인을 완료하려면 추가 정보가 필요합니다.</span>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- 생년월일 -->
        <div class="form-group">
          <label>생년월일</label>
          <div class="birth-input-group">
            <input type="text" v-model="birthYear" placeholder="년 (YYYY)" maxlength="4" required />
            <input type="text" v-model="birthMonth" placeholder="월 (MM)" maxlength="2" required />
            <input type="text" v-model="birthDay" placeholder="일 (DD)" maxlength="2" required />
          </div>
        </div>

        <!-- 전화번호 -->
        <div class="form-group">
          <label for="phone">전화번호</label>
          <input id="phone" type="tel" v-model="phone" placeholder="010-1234-5678" required />
        </div>

        <!-- 주소 -->
        <div class="form-group">
          <label for="address-zip">주소</label>
          <div class="address-input-group">
            <input
              id="address-zip"
              type="text"
              v-model="zipcode"
              placeholder="우편번호"
              required
              readonly
            />
            <button type="button" class="btn-zipcode-search" @click="searchZipcode">
              우편번호 찾기
            </button>
          </div>
          <input
            id="address-main"
            type="text"
            v-model="addressMain"
            placeholder="기본 주소"
            required
            readonly
            class="mt-2"
          />
          <input
            id="address-detail"
            type="text"
            v-model="addressDetail"
            placeholder="상세 주소 (동/호수 등)"
            class="mt-2"
          />
        </div>

        <div v-if="isPostcodeOpen" class="postcode-modal-overlay" @click.self="closePostcode">
          <div class="postcode-modal-content">
            <VueDaumPostcode
              @complete="addressSearched"
              :width="600"
              :height="600"
              :animation="true"
            />
            <button class="close-btn" @click="closePostcode">닫기</button>
          </div>
        </div>

        <div class="action-buttons">
          <button type="submit" class="btn-login" :disabled="isLoading">가입 완료</button>
          <button type="button" class="btn-signup" @click="$router.push({ name: 'login' })">
            취소
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* 후자 코드와 동일한 스타일 적용 */
.login-container {
  display: flex;
  justify-content: center;
  padding: 50px;
}
.login-box {
  width: 100%;
  max-width: 450px;
  padding: 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.form-group {
  margin-bottom: 20px;
}
.birth-input-group {
  display: flex;
  gap: 8px;
}
.birth-input-group input {
  flex: 1;
}
.address-input-group {
  display: flex;
  gap: 10px;
}
.address-input-group input {
  flex-grow: 1;
}
.btn-zipcode-search {
  padding: 10px 15px;
  background-color: #555;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 15px;
}
.btn-login {
  background-color: #007bff;
  color: white;
  padding: 0.85rem;
  border-radius: 4px;
  font-weight: 600;
}
.btn-signup {
  background-color: #f0f0f0;
  color: #333;
  padding: 0.85rem;
  border-radius: 4px;
  font-weight: 600;
}
.postcode-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.postcode-modal-content {
  background: #fff;
  padding: 10px;
  border-radius: 8px;
}
.close-btn {
  color: blue;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 10px;
  cursor: pointer;
}
</style>
