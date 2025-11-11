<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// 1. 상태 변수 (State Variables)
// PDF '기본페이지는 일반 이용자'
// DB 스키마 'member.role' ENUM('USER', 'STAFF', 'ADMIN_SYS') 참조
const selectedRole = ref('USER'); //
const userId = ref('');
const password = ref('');
const rememberId = ref(false); //

const router = useRouter();

// 2. 로그인 처리 함수
// 2. Login handling function
const handleLogin = () => {
  // [cite: 42]
  console.log('Login attempt with:', {
    role: selectedRole.value,
    userId: userId.value,
    remember: rememberId.value,
  });
  // TODO: Add login logic (e.g., API call)
  // 역할에 따라 페이지 이동 (Redirect based on role) [cite: 44]
  switch (selectedRole.value) {
    case 'USER':
      // router.push('/user-dashboard');
      break;
    case 'STAFF':
      // router.push('/staff-dashboard');
      break;
    case 'ADMIN_SYS':
      // router.push('/admin-dashboard');
      break;
  }
};

// 3. 회원가입 페이지 이동 함수
// 3. Function to navigate to Sign Up page
const goToSignUp = () => {
  // [cite: 48]
  console.log('Navigating to sign up page...');
  // router.push('/signup');
};

// TODO: Implement social login functions [cite: 50]
</script>
<template>
  <div class="login-container">
    <div class="login-box">
      <div class="role-tabs">
        <button
          :class="['tab-button', { active: selectedRole === 'USER' }]"
          @click="selectedRole = 'USER'"
        >
          일반 이용자
        </button>
        <button
          :class="['tab-button', { active: selectedRole === 'STAFF' }]"
          @click="selectedRole = 'STAFF'"
        >
          기관 담당자
        </button>
        <button
          :class="['tab-button', { active: selectedRole === 'ADMIN_SYS' }]"
          @click="selectedRole = 'ADMIN_SYS'"
        >
          기관 관리자
        </button>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="user-id">아이디</label>
          <input id="user-id" type="text" v-model="userId" placeholder="아이디 입력" required />
        </div>
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="비밀번호 입력"
            required
          />
        </div>

        <div class="login-options">
          <div class="remember-me">
            <input id="remember-id" type="checkbox" v-model="rememberId" />
            <label for="remember-id">아이디 정보 기억하기</label>
          </div>
          <div class="links">
            <a href="/find-id">아이디 비밀번호 찾기</a>
            <a href="/reset-password">비밀번호 재설정</a>
          </div>
        </div>

        <div class="action-buttons">
          <button type="submit" class="btn-login">로그인</button>
          <button type="button" class="btn-signup" @click="goToSignUp">회원가입</button>
        </div>
      </form>

      <div v-if="selectedRole === 'USER'" class="social-login">
        <div class="divider">
          <span>혹은</span>
        </div>
        <p>소셜 계정으로 회원가입 및 로그인</p>
        <div class="social-buttons">
          <button class="social-btn naver">네이버</button>
          <button class="social-btn kakao">카카오</button>
          <button class="social-btn google">구글</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f7f6;
}

.login-box {
  width: 400px;
  padding: 2rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 1. 역할 탭 */
/* 1. Role Tabs */
.role-tabs {
  display: flex;
  margin-bottom: 1.5rem;
}

.tab-button {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
}

.tab-button:first-child {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.tab-button:last-child {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.tab-button.active {
  background-color: #007bff; /* [cite: 32] */
  color: white;
  border-color: #007bff;
  font-weight: bold;
}

/* 2. 폼 그룹 */
/* 2. Form Group */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; /* Ensures padding doesn't affect width */
}

/* 3. 로그인 옵션 */
/* 3. Login Options */
.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me input {
  margin-right: 0.25rem;
}

.links a {
  color: #555;
  text-decoration: none;
  margin-left: 0.5rem;
}

.links a:hover {
  text-decoration: underline;
}

/* 4. 액션 버튼 */
/* 4. Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-buttons button {
  padding: 0.85rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
}

.btn-login {
  background-color: #007bff;
  color: white;
}

.btn-signup {
  background-color: #f0f0f0;
  color: #333;
}

/* 5. 소셜 로그인 */
/* 5. Social Login */
.social-login {
  margin-top: 2rem;
  text-align: center;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #aaa;
  margin: 1.5rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #eee;
}

.divider span {
  padding: 0 1rem;
}

.social-login p {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1rem;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-btn {
  /* [cite: 51] */
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  color: white;
  font-weight: bold;
}

.social-btn.naver {
  background-color: #03c75a;
}
.social-btn.kakao {
  background-color: #fee500;
  color: #3c1e1e;
}
.social-btn.google {
  background-color: #db4437;
}
</style>
