<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 라우팅을 위해 추가n
import axios from 'axios';

// 상태 변수 정의 (추가된 필드 포함)
const selectedRole = ref('1a'); // 기본 값은 'USER' '1a'
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

const apiLoadError = ref(''); // Daum API 연동 에러 상태 변수

const passwordError = ref('');
const termsError = ref('');

const idCheckMessage = ref(''); // 아이디 중복 메시지 표시
const serverError = ref(''); // 서버에서 받은 에러 메시지 표시

const router = useRouter();

// 주소 찾기 표시/숨김 상태
const isPostcodeOpen = ref(false);

// 아이디 중복 확인 함수
const checkIdDuplicate = async () => {
  idCheckMessage.value = '';

  if (!userId.value) {
    idCheckMessage.value = '아이디를 입력해주세요';
    return;
  }

  try {
    const res = await axios.get('/api/register/check', { params: { userId: userId.value } });

    // 아이디 중복 확인
    if (res.data.exists) {
      idCheckMessage.value = '이미 가입된 아이디 입니다';
    } else {
      idCheckMessage.value = '사용 가능한 아이디 입니다';
    }
  } catch (error) {
    idCheckMessage.value = '아이디 중복 검사 중 오류발생';
  }
};

// 회원가입 제출 처리 함수
const handleSignUp = async () => {
  // 에러 메시지 초기화
  passwordError.value = '';
  termsError.value = '';
  serverError.value = '';
  // 유효성 검사
  if (password.value !== confirmPassword.value) {
    passwordError.value = '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
    return;
  }
  if (!agreeTerms.value) {
    termsError.value = '필수 약관에 동의해야 회원가입을 완료할 수 있습니다.';
    return;
  }
  // 생년월일 통합(YYYY-MM-DD) .padStart(4, '0') mariaDB 날짜표기 통합
  const birthDate = `${birthYear.value.padStart(4, '0')}-${birthMonth.value.padStart(2, '0')}-${birthDay.value.padStart(2, '0')}`;

  // 주소 통합
  const fullAddress = `${zipcode.value}!${addressMain.value}${addressDetail.value ? '! ' + addressDetail.value : ''}`;

  // backend로 전송할 최종 데이터 객체
  const signUpData = {
    userId: userId.value,
    password: password.value,
    name: name.value,
    birthDate: birthDate,
    email: email.value,
    phone: phone.value,
    fullAddress: fullAddress,
    role: selectedRole.value,
  };
  // backend API로 POST 요청
  try {
    const nodeApiUrl = '/api/register';

    await axios.post(nodeApiUrl, signUpData);
    alert('회원가입이 완료되었습니다');
    goToLogin();
  } catch (error) {
    // 요청 실패
    console.error('회원가입 실패');
    // 이미 등록된 이용자
    if (error.response) {
      // 이미 등록된 이용자 관련 에러
      const errorMessage = error.response.data.message;

      if (errorMessage && errorMessage.includes('이미 등록된')) {
        serverError.value = '이미 등록된 이용자입니다!';
      } else {
        // 기타 에러 메시지 표시
        serverError.value = errorMessage || '회원가입 중 서버 오류';
      }
    } else {
      // 네트워크 오류 등 응답이 없는 경우
      serverError.value = '네트워크 오류가 발생했습니다. 다시 시도해 주세요';
    }
  }
};

// 이전 페이지로 이동
const goToLogin = () => {
  router.back();
};

// 우편번호 검색 함수 (모달 열기)
const searchZipcode = () => {
  isPostcodeOpen.value = true;
  apiLoadError.value = ''; // 에러 메시지 초기화
};
// 우편번호 검색 완료 시 처리 함수
const addressSearched = (data) => {
  // 모달 닫기
  isPostcodeOpen.value = false;
  // 기본 주소 (vue-daum-postcode가 제공)
  let fullAddress = '';
  let extraAddr = '';

  if (data.userSelectedType === 'R') {
    // 도로명 주소
    fullAddress = data.roadAddress;
  } else {
    // 지번 주소
    fullAddress = data.jibunAddress;
  }
  // 참고항목 (법정동명, 건물명 등)
  if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
    extraAddr += data.bname;
  }
  if (data.buildingName !== '' && data.apartment === 'Y') {
    extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
  }
  if (extraAddr !== '') {
    fullAddress += `(${extraAddr})`;
  }
  // 상태 변수 업데이트
  zipcode.value = data.zonecode;
  addressMain.value = fullAddress;
  addressDetail.value = ''; // 상세 주소 초기화
  // 상세 주소는 이용자가 직접 입력하도록 포커스스
  setTimeout(() => {
    document.getElementById('address-detail')?.focus();
  }, 100);
};
// 우편번호 찾기 화면 닫기
const closePostcode = () => {
  isPostcodeOpen.value = false;
};
</script>

<template>
  <div class="signup-container">
    <div class="signup-box">
      <!-- 역할 탭: 디자인 동일하게 유지 -->
      <div class="role-tabs">
        <button
          :class="['tab-button', { active: selectedRole === '1a' }]"
          @click="selectedRole = '1a'"
        >
          일반 이용자
        </button>
        <button
          :class="['tab-button', { active: selectedRole === '2a' }]"
          @click="selectedRole = '2a'"
        >
          기관 담당자
        </button>
        <button
          :class="['tab-button', { active: selectedRole === '3a' }]"
          @click="selectedRole = '3a'"
        >
          기관 관리자
        </button>
      </div>

      <!-- 회원가입 폼 (로그인 폼 레이아웃 복제) -->
      <form @submit.prevent="handleSignUp">
        <p v-if="serverError" class="error-message server-error-box">{{ serverError }}</p>
        <!-- 1. 아이디 -->
        <div class="form-group">
          <label for="user-id">아이디</label>
          <div class="id-input-group">
            <input
              id="user-id"
              type="text"
              v-model="userId"
              placeholder="아이디를 입력해주세요"
              required
            />
            <button type="button" class="btn-id-check" @click="checkIdDuplicate">중복체크</button>
          </div>
          <p v-if="idCheckMessage" class="inline-error-message">{{ idCheckMessage }}</p>
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
          <p v-if="passwordError" class="inline-error-message mx-1 test-sm">{{ passwordError }}</p>
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
        <!-- Daum API연동 에러 발생시 보여줌 -->
        <p v-if="apiLoadError" class="error-message">{{ apiLoadError }}</p>

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

        <div v-if="isPostcodeOpen" class="postcode-modal-overlay" @click.self="closePostcode">
          <div class="postcode-modal-content">
            <VueDaumPostcode
              @complete="addressSearched"
              :width="600"
              :height="600"
              :animation="true"
              :theme="{
                bgColor: '#fff',
                searchColor: '#3498db',
                // ... 기타 테마 설정 가능
              }"
            />
            <button class="close-btn" @click="closePostcode">닫기</button>
          </div>
        </div>

        <!-- 주소 필드는 레이블을 하나로 묶고, 입력 필드를 분리하여 디자인 통일성을 유지했습니다. -->

        <!-- 약관 동의  -->
        <div class="login-options signup-options">
          <div class="remember-me">
            <input id="agree-terms" type="checkbox" v-model="agreeTerms" />
            <label for="agree-terms">[필수] 이용약관 및 개인정보 처리방침 동의</label>
          </div>
          <br />
          <p v-if="termsError" class="inline-error-message mt-1 text-sm">{{ termsError }}</p>
          <!-- 회원가입 페이지에서는 '아이디/비번 찾기' 링크는 불필요하므로 제거 -->
        </div>

        <div class="action-buttons">
          <button type="submit" class="btn-login">회원가입</button>
          <button type="button" class="btn-signup" @click="goToLogin">취소</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* =======================================================
   회원가입 레이아웃
======================================================= */
.signup-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 50px;
  background-color: #f4f7f6;
  min-height: 100vh;
}

.signup-box {
  width: 100%;
  max-width: 450px;
  padding: 40px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  box-sizing: border-box;
}

/* =======================================================
   역할 선택 탭
======================================================= */
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
  color: #fff;
  border-color: #007bff;
  font-weight: bold;
}

/* =======================================================
   Form 기본 구조
======================================================= */
.form-group {
  margin-bottom: 20px;
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

/* =======================================================
   아이디 입력 + 중복체크 버튼 (가로 배치)
======================================================= */
.id-input-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.id-input-group input {
  flex: 1;
  max-width: 235px;
}

.id-input-group .btn-id-check {
  padding: 0.75rem 1rem;
  background-color: #555;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.2s ease;
}

.id-input-group .btn-id-check:hover {
  background-color: #444;
}

/* =======================================================
   생년월일
======================================================= */
.birth-input-group {
  display: flex;
  gap: 8px;
}

.birth-input-group input {
  flex: 1;
  min-width: 0;
}

/* =======================================================
   주소 입력
======================================================= */
.address-input-group {
  display: flex;
  gap: 10px;
}

.address-input-group input#address-zip {
  width: 120px;
}

.btn-zipcode-search {
  padding: 10px 15px;
  background-color: #555;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  font-weight: 600;
}

.btn-zipcode-search:hover {
  background-color: #444;
}

/* 에러 메시지 */
.error-message {
  color: #e53935;
  font-size: 0.9em;
  margin-top: -10px;
  margin-bottom: 10px;
  padding-left: 5px;
  font-weight: bold;
}

.inline-error-message {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 5px;
}

/* 서버 에러 박스 */
.server-error-box {
  background-color: #fcebeb;
  color: #c0392b;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #c0392b;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 500;
}

/* =======================================================
   우편번호 모달
======================================================= */
.postcode-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.postcode-modal-content {
  background: white;
  padding: 20px;
  border-radius: 6px;
  max-width: 640px;
}

.close-btn {
  color: blue;
  padding: 10px;
  border: 1px solid;
  border-radius: 8px;
  margin-bottom: 10px;
}

/* =======================================================
   약관 동의
======================================================= */
.login-options {
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me input {
  margin-right: 0.25rem;
  width: auto;
}

/* =======================================================
   버튼: 회원가입 / 취소
======================================================= */
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

.btn-login:hover {
  background-color: #0066d6;
}

.btn-signup {
  background-color: #6c757d;
  color: white;
}

.btn-signup:hover {
  background-color: #5a6268;
}
</style>
