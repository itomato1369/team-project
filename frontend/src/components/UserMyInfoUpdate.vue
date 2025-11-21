<script setup>
import { ref, onMounted, computed, watch, defineProps } from 'vue';
import axios from 'axios';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Divider from 'primevue/divider';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

const props = defineProps({
  userInfo: {
    type: Object,
    required: true,
  },
});

// --- Main Data State ---
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
const loadInstitutions = async () => {
  // 기관 목록은 역할에 관계없이 필요할 수 있으므로 항상 로드
  try {
    const instRes = await axios.get('/api/user/institutions');
    institutions.value = instRes.data.result;
  } catch (error) {
    console.error('기관 목록을 불러오는 데 실패했습니다:', error);
  }
};

onMounted(() => {
  if (props.userInfo && !props.userInfo.institution_no) {
    loadInstitutions();
  }
  // Daum Postcode script
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
  detailedAddress.value = parts[2] || '';
};

// userInfo prop이 변경되면 editableUserInfo를 업데이트
watch(
  () => props.userInfo,
  (newVal) => {
    if (newVal) {
      editableUserInfo.value = { ...newVal };
      splitAddress(newVal.address);
      // 기관이 없는 경우에만 기관 목록을 새로 로드
      if (!newVal.institution_no && institutions.value.length === 0) {
        loadInstitutions();
      }
    }
  },
  { immediate: true, deep: true }
);

watch(
  passwordData,
  () => {
    passwordError.value = '';
  },
  { deep: true }
);

// --- Event Handlers ---
const toggleEdit = (isCancel = false) => {
  if (isCancel && props.userInfo) {
    editableUserInfo.value = { ...props.userInfo };
    splitAddress(props.userInfo.address);
  }
  isEditing.value = !isEditing.value;
};

const openPostcodeSearch = () => {
  new window.daum.Postcode({
    oncomplete: (data) => {
      let fullAddress = data.address;
      let extraAddress = '';
      if (data.addressType === 'R') {
        if (data.bname !== '') extraAddress += data.bname;
        if (data.buildingName !== '')
          extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
        fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
      }
      postcode.value = data.zonecode;
      address.value = fullAddress;
      detailedAddress.value = '';
    },
  }).open();
};

const resetPasswordFields = () => {
  passwordData.value = { currentPassword: '', newPassword: '', confirmPassword: '' };
  passwordError.value = '';
};

const updateUserInfo = async () => {
  try {
    const combinedAddress = `${postcode.value}!${address.value}!${detailedAddress.value}`;
    await axios.put('/api/user/me', {
      userId: props.userInfo.user_id,
      ...editableUserInfo.value,
      address: combinedAddress,
    });
    // 부모에게 데이터 새로고침을 요청하는 이벤트를 발생시킬 수 있음
    // context.emit('updated');
    alert('사용자 정보가 수정되었습니다.');
    isEditing.value = false;
    // 여기서는 간단히 페이지 새로고침 또는 부모의 함수를 호출해야함
  } catch (error) {
    console.error('사용자 정보 수정에 실패했습니다:', error);
    alert('사용자 정보 수정에 실패했습니다.');
  }
};

const changePassword = async () => {
  passwordError.value = '';
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    passwordError.value = '새 비밀번호가 일치하지 않습니다.';
    return;
  }
  try {
    await axios.put('/api/user/password', {
      userId: props.userInfo.user_id,
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
      userId: props.userInfo.user_id,
      institutionNo: selectedInstitution.value.institution_no,
    });
    alert('신청이 완료되었습니다. 관리자 승인 후 적용됩니다.');
    // 여기도 부모에게 상태 업데이트를 알려야 함
  } catch (error) {
    console.error('기관 신청에 실패했습니다:', error);
  }
};

const userStatusText = computed(() => {
  if (!props.userInfo || !props.userInfo.status) return '';
  switch (props.userInfo.status) {
    case 'READY':
      return '승인대기중';
    case 'ACTIVE':
      return '승인';
    default:
      return props.userInfo.status;
  }
});

const institutionStatusText = computed(() => {
  if (!props.userInfo || !props.userInfo.institution_status) return '';
  const status = props.userInfo.institution_status;
  if (status === '1s') return '(운영중)';
  if (status === '2s') {
    const date = new Date(props.userInfo.closed_at);
    return `(휴업, ${date.toLocaleDateString()} 까지)`;
  }
  if (status === '3s') return '(폐업)';
  return '';
});
</script>

<template>
  <div class="card" v-if="userInfo">
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
    <div v-if="['1a', '2a', '3a'].includes(userInfo.role)">
      <h5>기관 정보</h5>
      <div v-if="!userInfo.institution_no">
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
          <strong>소속 기관:</strong> {{ userInfo.institution_name }} {{ institutionStatusText }}
        </p>
        <p
          v-if="
            userInfo.institution_status === '3s' &&
            userInfo.closed_notice &&
            userInfo.closed_notice.trim() !== ''
          "
        >
          <strong>기관 공지:</strong> {{ userInfo.closed_notice }}
        </p>
        <p><strong>승인 상태:</strong> {{ userStatusText }}</p>
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
