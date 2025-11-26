<script setup>
import { ref } from 'vue';
import axios from 'axios';

// 현재 탭 이메일로 찾기 혹은 전화번호로 찾기 선택
const currentTab = ref('email');

// 폼 데이터 구조
const form = ref({
  idEmail: {
    name: '',
    input: '',
    code: '',
  },
  pwEmail: {
    name: '',
    input: '',
    code: '',
  },
  idPhone: {
    name: '',
    input: '',
    code: '',
  },
  pwPhone: {
    name: '',
    id: '',
    code: '',
  },
});

// 메시지 상태
// text : 내용 type: success || error
const message = ref({
  idEmail: { text: '', type: '' },
  pwEmail: { text: '', type: '' },
  idPhone: { text: '', type: '' },
  pwPhone: { text: '', type: '' },
});

// 인증번호 저장용 (임시)
const verificationCodes = ref({
  idEmail: '',
  pwEmail: '',
  idPhone: '',
  pwPhone: '',
});

// 메시지 출력 함수
const showMessage = (target, text, type = 'success') => {
  message.value[target].text = text;
  message.value[target].type = type;
};

// 인증번호 전송 함수
const sendVerification = async (type) => {
  const target = form.value[type];
  console.log(target);

  if (!target.input) {
    showMessage(type, '연락처 또는 이메일을 입력하세요', 'error');
    return;
  }
  // 테스트 인증번호 생성
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes.value[type] = code;

  const key = type === 'email' ? 'idEmail' : 'idPhone';

  const data =
    type === 'email'
      ? { name: form.value.idEmail.name, email: form.value.idEmail.input }
      : { name: form.value.idPhone.name, phone: form.value.idPhone.input };
  console.log(form.value.idEmail.input);
  // 입력 확인
  if (!data.name || (!data.email && !data.phone)) {
    showMessage(key, '이름과 이메일/전화번호를 입력하세요', 'error');
    return;
  }
  try {
    const res = await axios.post('/api/findaccount/id', data);

    if (res.data.success) {
      showMessage(key, '아이디가 등록된 이메일로 발송되었습니다 이메일을 확인하세요', 'success');
    } else {
      showMessage(key, res.data.message, 'error');
    }
  } catch (error) {
    console.error('이메일 발송 오류', error);
    showMessage(key, '서버 오류 발생', 'error');
  }

  showMessage(type, `인증번호가 발송되었습니다 임시${code}`, 'success');
};

// 인증번호 확인
const verifyCode = (type) => {
  if (form.value[type].code === verificationCodes.value[type]) {
    showMessage(type, '인증 성공', 'success');
  } else {
    showMessage(type, '인증번호가 올바르지 않습니다', 'error');
  }
};

// 아이디 찾기
// const findId = async (method) => {};

// 비밀번호 찾기
const findPw = (method) => {
  const key = method === 'email' ? 'pwEmail' : 'pwPhone';
  showMessage(key, '비밀번호 찾기 요청 전송', 'success');
};
</script>

<template>
  <div class="find-account-container">
    <h1>아이디 비밀번호 찾기 페이지</h1>

    <!-- 이메일로 찾기, 전화번호로 찾기 -->
    <div class="find-account-tab">
      <!-- vue.js 클래스 바인딩 문법 특정 조건이 true일때 css적용 -->
      <button :class="{ active: currentTab === 'email' }" @click="currentTab = 'email'">
        이메일로 찾기
      </button>
      <button :class="{ active: currentTab === 'phone' }" @click="currentTab = 'phone'">
        전화번호로 찾기
      </button>
    </div>

    <!-- 이메일로 아이디 찾기 섹션 -->
    <div v-if="currentTab === 'email'">
      <div>아이디 찾기</div>
      <form @submit.prevent="findId('email')">
        <div>
          <input type="text" v-model="form.idEmail.name" placeholder="이름" />
        </div>

        <div>
          <div>
            <input type="email" v-model="form.idEmail.input" placeholder="이메일 입력" />
            <button type="button" @click="sendVerification('idEmail')">인증번호 전송</button>
          </div>
        </div>

        <div>
          <div>
            <input type="text" v-model="form.idEmail.code" placeholder="인증번호 입력" />
            <button type="button" @click="verifyCode('idEmail')">확인</button>
          </div>
        </div>

        <div v-if="message.idEmail.text">
          {{ message.idEmail.text }}
        </div>

        <div>
          <button type="submit">아이디 찾기</button>
        </div>
      </form>
      <!-- 이메일로 비밀번호 찾기 섹션 -->
      <div>비밀번호 찾기</div>
      <form @submit.prevent="findPw('email')">
        <div>
          <input type="text" v-model="form.pwEmail.name" placeholder="이름" />
        </div>

        <div>
          <input type="text" v-model="form.pwEmail.idEmail" placeholder="아이디 입력" />
        </div>

        <div>
          <div>
            <input type="email" v-model="form.pwEmail.input" placeholder="이메일 입력" />
            <button type="button" @click="sendVerification('pwEmail')">인증번호 전송</button>
          </div>
        </div>

        <div>
          <div>
            <input type="text" v-model="form.pwEmail.code" placeholder="인증번호 입력" />
            <button type="button" @click="verifyCode('pwEmail')">확인</button>
          </div>
        </div>

        <div v-if="message.pwEmail.text">{{ message.pwEmail.text }}</div>
        <div>
          <button type="submit">비밀번호 찾기</button>
        </div>
      </form>
    </div>

    <!-- 전화번호로 아이디 찾기 -->
    <div v-if="currentTab === 'phone'">
      <div>아이디 찾기</div>
      <form @submit.prevent="findId('phone')">
        <div>
          <input type="text" v-model="form.idPhone.name" placeholder="이름" />
        </div>

        <div>
          <div>
            <input type="text" v-model="form.idPhone.input" placeholder="전화번호 입력 숫자만" />
            <button type="button" @click="sendVerification('idPhone')">인증번호 전송</button>
          </div>
        </div>

        <div>
          <div>
            <input type="text" v-model="form.idPhone.code" placeholder="인증번호 입력" />
            <button type="button" @click="verifyCode('idPhone')">확인</button>
          </div>
        </div>

        <div v-if="message.idPhone.text">{{ message.idPhone.text }}</div>
        <div>
          <button type="submit">아이디 찾기</button>
        </div>
      </form>

      <!-- 전화번호로 비밀번호 찾기 -->
      <div>비밀번호 찾기</div>
      <form @submit.prevent="findPw('phone')">
        <div>
          <input type="text" v-model="form.pwPhone.name" placeholder="이름" />
        </div>

        <div>
          <input type="text" v-model="form.pwPhone.id" placeholder="아이디 입력" />
        </div>

        <div>
          <div>
            <input type="text" v-model="form.pwPhone.input" placeholder="전화번호 입력" />
            <button type="button" @click="sendVerification('pwPhone')">인증번호 전송</button>
          </div>
        </div>

        <div>
          <div>
            <input type="text" v-model="form.pwPhone.code" placeholder="인증번호 입력" />
            <button type="button" @click="verifyCode('pwPhone')">확인</button>
          </div>
        </div>

        <div v-if="message.pwPhone.text">{{ message.pwPhone.text }}</div>

        <div>
          <button type="submit">비밀번호 찾기</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
.find-account-container {
  max-width: 480px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.find-account-container h1 {
  text-align: center;
  margin-bottom: 20px;
}

/* 탭 버튼 */
.find-account-tab {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.find-account-tab button {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  background: #f7f7f7;
  cursor: pointer;
  font-size: 14px;
}

.find-account-tab button.active {
  background: #4a7afe;
  color: white;
  border-color: #4a7afe;
}

/* 전체 form 영역 */
form {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 6px;
  background: #fafafa;
}

/* input 기본 스타일 */
input[type='text'],
input[type='email'] {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

/* 인증번호 영역 버튼 포함 */
form div > div {
  display: flex;
  gap: 8px;
}

form div > div input {
  flex: 1;
}

form button[type='button'] {
  padding: 10px;
  white-space: nowrap;
  border: 1px solid #4a7afe;
  background: #4a7afe;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
/* 인증번호 영역 버튼 포함 */
form div > div {
  display: flex;
  gap: 6px; /* 입력창과 버튼 사이 간격 */
  align-items: center; /* 세로 중앙 정렬 */
}

form div > div input {
  flex: 1; /* 입력창이 버튼 제외 나머지 공간 차지 */
  min-width: 0; /* 버튼이 길어도 input이 줄어들도록 */
  padding: 8px; /* 입력창 패딩 조금 줄임 */
  font-size: 14px;
}

/* 인증번호 전송 버튼 */
form div > div button[type='button'] {
  flex: 0 0 auto; /* 버튼 크기 고정 */
  padding: 6px 12px; /* 버튼 패딩 조절 */
  font-size: 13px; /* 글자 크기 조금 줄임 */
  border-radius: 4px;
  border: 1px solid #4a7afe;
  background: #4a7afe;
  color: white;
  cursor: pointer;
  white-space: nowrap; /* 줄바꿈 방지 */
}

/* 버튼 호버 */
form div > div button[type='button']:hover {
  background: #3c69e0;
}

/* 제출 버튼 */
form button[type='submit'] {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  background: #333;
  color: white;
  cursor: pointer;
}

form button[type='submit']:hover {
  background: #555;
}
</style>
