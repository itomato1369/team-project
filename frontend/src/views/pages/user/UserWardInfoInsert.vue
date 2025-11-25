<script setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
const props = defineProps({
  ward_no: {
    type: String,
    default: null,
  },
});

// const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isEditMode = computed(() => !!props.ward_no);

const ward = ref({
  name: '',
  ward_rrn: '', // This will be set before submission
  sex: '',
  age: '',
  address: '',
  guardian_id: authStore.user.id,
  guardian_relation: '',
  disabled_level: '',
});

const rrn1 = ref(''); // For the first 6 digits of RRN
const rrn2 = ref(''); // For the last 7 digits of RRN
const rrn2Input = ref(null); // Reference to the second RRN input field

// Address fields for Daum Postcode
const postcode = ref('');
const fullAddress = ref(''); // Road address or Jibun address
const detailAddress = ref(''); // Detailed address input by user

const fetchWardData = async () => {
  if (!isEditMode.value) return;
  try {
    const response = await axios.get('/api/user/wardlist', {
      params: { guardianId: ward.value.guardian_id },
    });
    const wardData = response.data.result.find((w) => w.ward_no === parseInt(props.ward_no));
    if (wardData) {
      ward.value = { ...wardData };
      // Split RRN for edit mode
      if (ward.value.ward_rrn && ward.value.ward_rrn.length === 13) {
        rrn1.value = ward.value.ward_rrn.substring(0, 6);
        rrn2.value = ward.value.ward_rrn.substring(6);
      } else {
        rrn1.value = ward.value.ward_rrn; // Fallback if RRN is not 13 chars
        rrn2.value = '';
      }

      // Split address for edit mode
      if (ward.value.address) {
        const parts = ward.value.address.split('!');
        postcode.value = parts[0] || '';
        fullAddress.value = parts[1] || '';
        detailAddress.value = parts[2] || '';
      }
    }
  } catch (error) {
    console.error('Error fetching ward data:', error);
    alert('피보호자 정보를 불러오는 데 실패했습니다.');
  }
};

const handleRrnInput = (event, field) => {
  let value = event.target.value.replace(/[^0-9]/g, ''); // 숫자만 남김
  
  if (field === 'rrn1') {
    rrn1.value = value.slice(0, 6);
    if (rrn1.value.length === 6 && rrn2Input.value) {
      rrn2Input.value.focus(); // 6자리 모두 입력되면 다음 필드로 이동
    }
  } else if (field === 'rrn2') {
    rrn2.value = value.slice(0, 7);
  }
};

const handleRrnKeydown = (event, field) => {
  // rrn2 필드에서 백스페이스 누르고 내용이 비어있을 경우 rrn1으로 포커스 이동
  if (field === 'rrn2' && event.key === 'Backspace' && rrn2.value.length === 0) {
    event.preventDefault(); // 기본 백스페이스 동작 방지
    // rrn1 필드로 포커스 이동
    const rrn1Input = document.getElementById('ward_rrn1');
    if (rrn1Input) {
      rrn1Input.focus();
    }
  }
};

const openPostcodeSearch = () => {
  new window.daum.Postcode({
    oncomplete: (data) => {
      let roadAddr = data.roadAddress; // 도로명 주소 변수
      let extraRoadAddr = ''; // 참고 항목 변수

      // 법정동명이 있을 경우 추가 (법정리는 제외)
      // 법정동의 경우 마지막 글자가 "동/로/가"로 끝난다.
      if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
        extraRoadAddr += data.bname;
      }
      // 건물명이 있고, 공동주택일 경우 추가
      if (data.buildingName !== '' && data.apartment === 'Y') {
        extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
      }
      // 참고항목 조합
      if (extraRoadAddr !== '') {
        extraRoadAddr = ' (' + extraRoadAddr + ')';
      }

      postcode.value = data.zonecode;
      fullAddress.value = roadAddr;
      // Combine road address with extra info if any
      if (extraRoadAddr !== '') {
          fullAddress.value += extraRoadAddr;
      }
      detailAddress.value = ''; // Clear detailed address for new input
    },
  }).open();
};

const handleSubmit = async () => {
  try {
    // Combine RRN parts before submission
    ward.value.ward_rrn = rrn1.value + rrn2.value;

    // Combine address parts before submission
    ward.value.address = `${postcode.value}!${fullAddress.value}!${detailAddress.value}`;

    if (isEditMode.value) {
      // Update existing ward
      await axios.put(`/api/user/wards/${props.ward_no}`, ward.value); // Sending all ward.value for update
      alert('정보가 성공적으로 수정되었습니다.');
    } else {
      // Create new ward
      await axios.post('/api/user/wards', ward.value);
      alert('피보호자가 성공적으로 등록되었습니다.');
    }
    router.push({ name: 'umy' }); // Redirect to MyPage after submission
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('작업을 완료하는 데 실패했습니다.');
  }
};

const cancel = () => {
  router.go(-1); // Go back to the previous page
};

onMounted(() => {
  fetchWardData();
  // Daum Postcode script
  if (typeof window.daum === 'undefined' || !window.daum.Postcode) {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);
  }
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">
      {{ isEditMode ? '피보호자 정보 수정' : '신규 피보호자 등록' }}
    </h1>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- 읽기 전용 항목 (isEditMode일 때 비활성화되거나 항상 비활성화) -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">이름</label>
        <input
          type="text"
          id="name"
          v-model="ward.name"
          :disabled="isEditMode"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          :class="{'bg-gray-100': isEditMode, 'bg-white': !isEditMode}"
        />
      </div>
      <div>
        <label for="ward_rrn1" class="block text-sm font-medium text-gray-700">주민등록번호</label>
        <div class="mt-1 flex items-center space-x-2">
          <input
            type="text"
            id="ward_rrn1"
            v-model="rrn1"
            @input="handleRrnInput($event, 'rrn1')"
            :disabled="isEditMode"
            maxlength="6"
            class="block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-center"
            :class="{'bg-gray-100': isEditMode, 'bg-white': !isEditMode}"
          />
          <span>-</span>
          <input
            type="text"
            id="ward_rrn2"
            ref="rrn2Input"
            v-model="rrn2"
            @input="handleRrnInput($event, 'rrn2')"
            @keydown="handleRrnKeydown($event, 'rrn2')"
            :disabled="isEditMode"
            maxlength="7"
            class="block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-center"
            :class="{'bg-gray-100': isEditMode, 'bg-white': !isEditMode}"
          />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">성별</label>
        <div class="mt-1 flex space-x-4">
          <label
            ><input
              type="radio"
              value="MALE"
              v-model="ward.sex"
              :disabled="isEditMode"
              class="mr-1"
            />
            남성</label
          >
          <label
            ><input
              type="radio"
              value="FEMALE"
              v-model="ward.sex"
              :disabled="isEditMode"
              class="mr-1"
            />
            여성</label
          >
        </div>
      </div>
      <div>
        <label for="age" class="block text-sm font-medium text-gray-700">나이</label>
        <input
          type="number"
          id="age"
          v-model="ward.age"
          :disabled="isEditMode"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          :class="{'bg-gray-100': isEditMode, 'bg-white': !isEditMode}"
        />
      </div>
      <div>
        <label for="guardian_name" class="block text-sm font-medium text-gray-700">
          보호자 ID
        </label>
        <input
          type="text"
          id="guardian_name"
          v-model="ward.guardian_id"
          disabled
          class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label for="guardian_relation" class="block text-sm font-medium text-gray-700"
          >보호자 관계</label
        >
        <input
          type="text"
          id="guardian_relation"
          v-model="ward.guardian_relation"
          :disabled="isEditMode"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          :class="{'bg-gray-100': isEditMode, 'bg-white': !isEditMode}"
        />
      </div>

      <!-- 수정 가능 항목 -->
      <!-- 수정 가능 항목 -->
      <div>
        <label for="address" class="block text-sm font-medium text-gray-700">주소</label>
        <div class="mt-1">
          <div class="flex items-center space-x-2 mb-2">
            <input
              type="text"
              id="postcode"
              v-model="postcode"
              placeholder="우편번호"
              class="block w-24 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
            <button
              type="button"
              @click="openPostcodeSearch"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              주소 검색
            </button>
          </div>
          <input
            type="text"
            id="fullAddress"
            v-model="fullAddress"
            placeholder="주소"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm"
          />
          <input
            type="text"
            id="detailAddress"
            v-model="detailAddress"
            placeholder="상세주소"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <label for="disabled_level" class="block text-sm font-medium text-gray-700"
          >장애 수준</label
        >
        <input
          type="text"
          id="disabled_level"
          v-model="ward.disabled_level"
          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div class="flex justify-end space-x-2">
        <button
          type="button"
          @click="cancel"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          취소
        </button>
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          저장
        </button>
      </div>
    </form>
  </div>
</template>
