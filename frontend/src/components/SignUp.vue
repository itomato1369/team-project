<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 라우팅을 위해 추가

// 상태 변수 정의 (추가된 필드 포함)
const selectedRole = ref('USER'); // 권한 별 로그인
const userId = ref(''); // 아이디
const password = ref(''); // 비밀번호
const confirmPassword = ref(''); // 비밀번호 확인
const name = ref('');
const email = ref('');
const phone = ref('');

const zipcode = ref(''); // 우편번호
const addressMain = ref(''); // 기본 주소
const addressDetail = ref(''); // 상세 주소

const birthYear = ref(''); // 생년월일
const birthMonth = ref('');
const birthDay = ref('');

const agreeTerms = ref(false); // 약관 동의

const router = useRouter();

// 회원가입 제출 처리 함수
const handleSignUp = () => {
  if (password.value !== confirmPassword.value) {
    alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    return;
  }
  if (!agreeTerms.value) {
    alert('필수 약관에 동의해야 회원가입을 완료할 수 있습니다.');
    return;
  }

  // TODO: 실제 API 호출 및 회원가입 로직 구현
  console.log('회원가입 정보:', {
    role: selectedRole.value,
    userId: userId.value,
    name: name.value,
    email: email.value,
    phone: phone.value,
    birthday: `${birthYear.value}-${birthMonth.value}-${birthDay.value}`,
    address: {
      zipcode: zipcode.value,
      addressMain: addressMain.value,
      addressDetail: addressDetail.value,
    },
  });

  alert(`[${selectedRole.value}] 역할로 회원가입을 시도합니다. (API 연동 필요)`);
  // 성공 후 로그인 페이지로 리다이렉션 예시
  // router.push({ name: 'Login' });
};

// 로그인 페이지로 이동
const goToLogin = () => {
  router.push({ name: 'Login' });
};

// 우편번호 검색 함수
const searchZipcode = () => {};
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 역할 탭: 디자인 동일하게 유지 -->
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

      <!-- 회원가입 폼 (로그인 폼 레이아웃 복제) -->
      <form @submit.prevent="handleSignUp">
        <!-- 1. 아이디 -->
        <div class="form-group">
          <label for="user-id">아이디</label>
          <input
            id="user-id"
            type="text"
            v-model="userId"
            placeholder="아이디를 입력해주세요"
            required
          />
        </div>
        <!-- 2. 비밀번호 -->
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="비밀번호 입력해주세요"
            required
          />
        </div>
        <!-- 3. 비밀번호 확인 (추가) -->
        <div class="form-group">
          <label for="confirm-password">비밀번호 확인</label>
          <input
            id="confirm-password"
            type="password"
            v-model="confirmPassword"
            placeholder="비밀번호를 확인하세요"
            required
          />
        </div>

        <!-- 4. 이름 -->
        <div class="form-group">
          <label for="name">이름</label>
          <input id="name" type="text" v-model="name" placeholder="이름" required />
        </div>
        <!-- 생년월일 -->
        <div class="form-group">
          <label>생년월일</label>
          <div class="birth-input-group">
            <input type="text" v-model="birthYear" placeholder="년 (YYYY)" maxlength="4" required />
            <input type="text" v-model="birthMonth" placeholder="월 (MM)" maxlength="2" required />
            <input type="text" v-model="birthDay" placeholder="일 (DD)" maxlength="2" required />
          </div>
        </div>

        <!-- 5. 이메일 -->
        <div class="form-group">
          <label for="email">이메일</label>
          <input id="email" type="email" v-model="email" placeholder="이메일 주소" required />
        </div>
        <!-- 6. 전화번호 -->
        <div class="form-group">
          <label for="phone">전화번호</label>
          <input id="phone" type="tel" v-model="phone" placeholder="010-1234-5678" required />
        </div>

        <!-- 7. 주소 필드 (추가) -->
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
        </div>
        <div class="form-group">
          <input
            id="address-main"
            type="text"
            v-model="addressMain"
            placeholder="기본 주소"
            required
            readonly
          />
        </div>
        <div class="form-group">
          <input
            id="address-detail"
            type="text"
            v-model="addressDetail"
            placeholder="상세 주소 (동/호수 등)"
          />
        </div>
        <!-- 주소 필드는 레이블을 하나로 묶고, 입력 필드를 분리하여 디자인 통일성을 유지했습니다. -->

        <!-- 약관 동의 (로그인 옵션 대체) -->
        <div class="login-options signup-options">
          <div class="remember-me">
            <input id="agree-terms" type="checkbox" v-model="agreeTerms" required />
            <label for="agree-terms">[필수] 이용약관 및 개인정보 처리방침 동의</label>
          </div>
          <!-- 회원가입 페이지에서는 '아이디/비번 찾기' 링크는 불필요하므로 제거 -->
        </div>

        <!-- 액션 버튼: 회원가입용으로 변경 -->
        <div class="action-buttons">
          <button type="submit" class="btn-login">회원가입</button>
          <button type="button" class="btn-signup" @click="goToLogin">취소</button>
        </div>
      </form>

      <!-- 회원가입 페이지에서는 소셜 로그인 섹션이 불필요하므로 제거 -->
    </div>
  </div>
</template>

<style scoped>
/* =======================================================
   로그인 컴포넌트에서 제공된 기본 스타일 (디자인 통일성 유지)
   ======================================================= */
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
  background-color: #007bff;
  color: white;
  border-color: #007bff;
  font-weight: bold;
}

/* 2. 폼 그룹 */
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
  box-sizing: border-box;
}
.birth-input-group {
  display: flex;
  gap: 8px; /* 입력 필드 사이 간격 */
}

/* 생년월일 입력 필드는 모두 동일한 너비로 설정 */
.birth-input-group input {
  flex: 1; /* 가용 공간을 균등하게 분할 */
  min-width: 0; /* flex 컨테이너 내에서 overflow 방지 */
}

/* 3. 로그인 옵션 (회원가입 약관 동의로 사용) */
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
  /* 회원가입 시 input 크기 조정 */
  width: auto;
  padding: 0;
}

/* 링크는 회원가입 페이지에서는 제거되었지만 클래스 구조 유지를 위해 CSS는 남겨둡니다. */
.links {
  display: none;
}

/* 4. 액션 버튼 */
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
  /* 회원가입 완료 버튼 */
  background-color: #007bff;
  color: white;
}

.btn-signup {
  /* 로그인 돌아가기 버튼 */
  background-color: #f0f0f0;
  color: #333;
}

/* =======================================================
   주소 필드를 위한 추가 스타일 (기존 폼 스타일 유지하면서 배치)
   ======================================================= */

.address-input-group {
  display: flex;
  gap: 8px; /* 입력창과 버튼 사이 간격 */
}

/* 우편번호 입력창 스타일 */
.address-input-group input {
  flex-grow: 0; /* 우편번호 칸을 작게 유지 */
  width: 120px;
}

/* 우편번호 찾기 버튼 스타일 */
.btn-zipcode-search {
  flex-grow: 1; /* 나머지 공간을 채움 */
  padding: 0 0.75rem; /* form-group input과 높이 맞추기 위해 폼 그룹 인풋과 동일한 패딩 사용 */
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  color: #333;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background-color 0.2s;
  height: 41px; /* input과 높이를 맞추기 위해 명시적 높이 설정 (input padding 기준) */
}

.btn-zipcode-search:hover {
  background-color: #e0e0e0;
}
</style>
