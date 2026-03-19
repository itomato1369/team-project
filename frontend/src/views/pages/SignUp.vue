<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 라우팅을 위해 추가n

// JavaScript 문 분리하기
import { checkIdDuplicate, handleSignUp, searchZipcode, addressSearched, closePostcode } from '@/assets/js/signUp.js';

// 상태 변수 정의 (추가된 필드 포함)
const router = useRouter();

const selectedRole = ref('1a'); // 기본 값은 'USER' '1a'
const userId = ref(''); // 아이디
const password = ref(''); // 비밀번호
const confirmPassword = ref(''); // 비밀번호 확인
const name = ref('');
const email = ref('');
const phone = ref('');
// DAUM API 사용을 위한 기본 설정
const zipcode = ref(''); // 우편번호
const addressMain = ref(''); // 기본 주소
const addressDetail = ref(''); // 상세 주소
const apiLoadError = ref(''); // Daum API 연동 에러 상태 변수

const birthYear = ref(''); // 생년월일
const birthMonth = ref('');
const birthDay = ref('');
const agreeTerms = ref(false); // 약관 동의

const passwordError = ref('');
const termsError = ref('');

const idCheckMessage = ref(''); // 아이디 중복 메시지 표시
const serverError = ref(''); // 서버에서 받은 에러 메시지 표시


// 주소 찾기 표시/숨김 상태
const isPostcodeOpen = ref(false);

// 로그인 페이지로 이동
const goToLogin = () => {
  router.push({ name: 'login' });
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
          <input id="phone" type="tel" v-model="phone" placeholder="010 1234 5678" required />
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
            <!-- Daum API를 쉽게 사용할 수 있도록 패키징된 Vue 컴포넌트를 활용하여
             주소 검색 화면을 렌더링 -->
            <VueDaumPostcode
              @complete="addressSearched"
              :width="600"
              :height="600"
              :animation="true"
              :theme="{
                bgColor: '#fff',
                searchColor: '#3498db',
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

<style src="@/assets/style/signUp.css"></style>
