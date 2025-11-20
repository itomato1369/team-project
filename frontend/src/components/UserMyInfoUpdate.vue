<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Divider from 'primevue/divider';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

// 동일한 컴포넌트라서 사실 여기에서 로그인한 사용자 id받아와서 적용시키는게 중요함 이것만하면 내정보관리는 문제없음.
const logInUserId = 'test';

// --- Main Data State ---
const currentUser = ref(null);
const institutions = ref([]);

// --- UI Control State ---
const isEditing = ref(false);

// --- Editable Data Models ---
const editableUserInfo = ref({});
const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});
const passwordError = ref(''); // For displaying password errors
const selectedInstitution = ref(null);

// Address fields
const postcode = ref('');
const address = ref('');
const detailedAddress = ref('');

// --- Data Loading ---
const loadMyInfo = async () => {
  try {
    const userRes = await axios.get('/api/user/me', { params: { userId: logInUserId } });
    currentUser.value = userRes.data.result;

    if (currentUser.value.role === 'USER') {
      const instRes = await axios.get('/api/user/institutions');
      institutions.value = instRes.data.result;
    }
  } catch (error) {
    console.error('내 정보를 불러오는 데 실패했습니다:', error);
    if (error.response) {
      console.error('Error Response Data:', error.response.data);
      console.error('Error Response Status:', error.response.status);
    }
  }
};

onMounted(() => {
  loadMyInfo();
  // Dynamically load Daum Postcode script
  if (typeof window.daum === 'undefined' || !window.daum.Postcode) {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);
  }
});

const splitAddress = (fullAddress) => {
  const parts = (fullAddress || '').split('!');
  postcode.value = parts[0] || '';
  address.value = parts[1] || '';
  detailedAddress.value = parts[2] || ''; // 상세주소는 사용자가 직접 입력하도록 초기화
};

// currentUser가 로드되면 editableUserInfo를 설정
watch(
  currentUser,
  (newVal) => {
    if (newVal) {
      editableUserInfo.value = { ...newVal };
      // 주소 분리
      splitAddress(newVal.address);
    }
  },
  { immediate: true }
);

// Watch for changes in password fields to clear the error
watch(
  passwordData,
  () => {
    passwordError.value = '';
  },
  { deep: true }
);

// --- Event Handlers ---
const toggleEdit = (isCancel = false) => {
  if (isCancel && currentUser.value) {
    editableUserInfo.value = { ...currentUser.value };
    // 취소 시 주소도 원복
    splitAddress(currentUser.value.address);
  }
  isEditing.value = !isEditing.value;
};

const openPostcodeSearch = () => {
  new window.daum.Postcode({
    oncomplete: (data) => {
      let fullAddress = data.address;
      let extraAddress = '';

      if (data.addressType === 'R') {
        if (data.bname !== '') {
          extraAddress += data.bname;
        }
        if (data.buildingName !== '') {
          extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
        }
        fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
      }
      // 분리된 필드에 할당
      postcode.value = data.zonecode;
      address.value = fullAddress;
      detailedAddress.value = ''; // 상세주소는 사용자가 직접 입력하도록 초기화
    },
  }).open();
};

const resetPasswordFields = () => {
  passwordData.value = { currentPassword: '', newPassword: '', confirmPassword: '' };
  passwordError.value = ''; // Clear error on cancel
};

const updateUserInfo = async () => {
  try {
    // 주소 합치기
    const combinedAddress = `${postcode.value}!${address.value}!${detailedAddress.value}`;

    await axios.put('/api/user/me', {
      userId: currentUser.value.user_id,
      ...editableUserInfo.value,
      address: combinedAddress, // 합친 주소로 전송
    });

    // 성공 후 currentUser 업데이트
    await loadMyInfo();

    isEditing.value = false;
    alert('사용자 정보가 수정되었습니다.');
  } catch (error) {
    console.error('사용자 정보 수정에 실패했습니다:', error);
    alert('사용자 정보 수정에 실패했습니다.');
  }
};

const changePassword = async () => {
  passwordError.value = ''; // Reset error
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    passwordError.value = '새 비밀번호가 일치하지 않습니다.';
    return;
  }
  try {
    await axios.put('/api/user/password', {
      userId: currentUser.value.user_id,
      ...passwordData.value,
    });
    alert('비밀번호가 성공적으로 변경되었습니다.');
    resetPasswordFields();
  } catch (error) {
    console.error('비밀번호 변경에 실패했습니다:', error);
    passwordError.value = '비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.';
  }
};

const applyToInstitution = async () => {
  if (!selectedInstitution.value) {
    alert('기관을 선택해주세요.');
    return;
  }
  try {
    await axios.post('/api/user/apply-institution', {
      userId: currentUser.value.user_id,
      institutionNo: selectedInstitution.value.institution_no,
    });
    alert('신청이 완료되었습니다.');
    loadMyInfo(); // Refresh user info
  } catch (error) {
    console.error('기관 신청에 실패했습니다:', error);
  }
};

const institutionStatusText = computed(() => {
  if (!currentUser.value || !currentUser.value.institution_status) {
    return '';
  }

  const status = currentUser.value.institution_status;
  if (status === '1s') {
    return '(운영중)';
  } else if (status === '2s') {
    const date = new Date(currentUser.value.closed_at);
    return `(휴업, ${date.toLocaleDateString()} 까지)`;
  } else if (status === '3s') {
    return '(폐업)';
  }
  return '';
});
</script>

<template>
  <div class="card" v-if="currentUser">
    <!-- User Profile Section -->
    <h5>내 정보 수정</h5>
    <div class="p-fluid">
      <div class="p-field p-grid" style="margin-bottom: 1rem; align-items: center">
        <label for="phone" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0">전화번호</label>
        <div class="p-col-12 p-md-12">
          <InputText
            id="phone"
            v-model="editableUserInfo.phone"
            :disabled="!isEditing"
            style="width: 100%"
          />
        </div>
      </div>
      <!-- Address Section -->
      <div class="p-field p-grid" style="margin-bottom: 1rem; align-items: center">
        <label class="p-col-12 p-mb-2 p-md-2 p-mb-md-0">주소</label>
        <div class="p-col-12 p-md-12">
          <div class="p-d-flex" style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem">
            <InputText
              id="postcode"
              v-model="postcode"
              placeholder="우편번호"
              :disabled="!isEditing"
              style="width: 120px"
            />
            <Button
              v-if="isEditing"
              label="주소 검색"
              @click="openPostcodeSearch"
              class="p-button-secondary"
            />
          </div>
          <InputText
            id="address"
            v-model="address"
            placeholder="주소"
            :disabled="!isEditing"
            style="width: 100%; margin-bottom: 0.5rem"
          />
          <InputText
            id="detailedAddress"
            v-model="detailedAddress"
            placeholder="상세주소"
            :disabled="!isEditing"
            style="width: 100%"
          />
        </div>
      </div>
      <div class="p-field p-grid" style="margin-bottom: 1rem; align-items: center">
        <label for="email" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0">이메일</label>
        <div class="p-col-12 p-md-12">
          <InputText
            id="email"
            v-model="editableUserInfo.email"
            :disabled="!isEditing"
            style="width: 100%"
          />
        </div>
      </div>
      <div
        class="p-d-flex p-jc-end"
        style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-bottom: 1.5rem"
      >
        <Button label="수정" v-if="!isEditing" @click="toggleEdit(false)" />
        <template v-if="isEditing">
          <Button label="취소" @click="toggleEdit(true)" class="p-button-danger" />
          <Button label="저장" @click="updateUserInfo" class="p-button-success" />
        </template>
      </div>
    </div>

    <!-- Password Change Accordion -->
    <Accordion>
      <AccordionTab header="비밀번호 변경">
        <div class="p-fluid">
          <div class="p-field p-grid" style="margin-bottom: 1rem; align-items: center">
            <label for="currentPassword" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0">
              현재 비밀번호
            </label>
            <!-- Password Error Message Display -->
            <div v-if="passwordError" class="p-field p-grid" style="margin-top: 1rem">
              <div class="p-col-12 p-md-10 p-md-offset-2">
                <small class="p-error" style="font-size: 1.2rem; color: red">{{
                  passwordError
                }}</small>
              </div>
            </div>
            <div class="p-col-12 p-md-12">
              <InputText
                id="currentPassword"
                type="password"
                v-model="passwordData.currentPassword"
                style="width: 100%"
              />
            </div>
          </div>
          <div class="p-field p-grid" style="margin-bottom: 1rem; align-items: center">
            <label for="newPassword" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0">새 비밀번호</label>
            <div class="p-col-12 p-md-12">
              <InputText
                id="newPassword"
                type="password"
                v-model="passwordData.newPassword"
                style="width: 100%"
              />
            </div>
          </div>
          <div class="p-field p-grid" style="margin-bottom: 1rem; align-items: center">
            <label for="confirmPassword" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0"
              >새 비밀번호 확인</label
            >
            <div class="p-col-12 p-md-12">
              <InputText
                id="confirmPassword"
                type="password"
                v-model="passwordData.confirmPassword"
                style="width: 100%"
              />
            </div>
          </div>
          <div
            class="p-d-flex p-jc-end"
            style="display: flex; justify-content: flex-end; gap: 0.5rem"
          >
            <Button label="취소" @click="resetPasswordFields" class="p-button-danger" />
            <Button label="변경" @click="changePassword" />
          </div>
        </div>
      </AccordionTab>
    </Accordion>

    <Divider />

    <!-- Institution Section -->
    <div v-if="currentUser.role === 'USER'">
      <h5>기관 정보</h5>
      <div v-if="!currentUser.institution_no">
        <p>소속된 기관이 없습니다. 기관을 선택하여 신청해주세요.</p>
        <div class="p-fluid p-formgrid p-grid" style="margin-top: 1rem">
          <div class="p-field p-col-12 p-md-6">
            <label for="institution">기관 선택</label>
            <Dropdown
              id="institution"
              v-model="selectedInstitution"
              :options="institutions"
              optionLabel="institution_name"
              placeholder="기관을 선택하세요"
            ></Dropdown>
          </div>
          <div class="p-field p-col-12 p-md-2" style="margin-top: 1.75rem">
            <Button label="신청하기" @click="applyToInstitution"></Button>
          </div>
        </div>
      </div>
      <div v-else>
        <p>
          <strong>소속 기관:</strong> {{ currentUser.institution_name }} {{ institutionStatusText }}
        </p>
        <p
          v-if="
            currentUser.institution_status === '3s' &&
            currentUser.closed_notice &&
            currentUser.closed_notice.trim() !== ''
          "
        >
          <strong>기관 공지:</strong> {{ currentUser.closed_notice }}
        </p>
        <p><strong>승인 상태:</strong> {{ currentUser.status }}</p>
      </div>
    </div>
  </div>
  <p v-else class="placeholder-text">사용자 정보를 불러오는 중입니다...</p>
</template>

<style scoped>
.card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow:
    0 2px 1px -1px rgba(0, 0, 0, 0.2),
    0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
}
.placeholder-text {
  margin-top: 2rem;
  text-align: center;
  color: #6c757d;
}
</style>
