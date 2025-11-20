<script setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  ward_no: {
    type: String,
    default: null,
  },
});

// const route = useRoute();
const router = useRouter();

const isEditMode = computed(() => !!props.ward_no);

const ward = ref({
  name: '',
  ward_rrn: '',
  sex: 'MALE',
  age: null,
  address: '',
  guardian_id: 'test', // Changed from guardian_name, assuming 'test' is the logged-in user's ID
  guardian_relation: '',
  disabled_level: '',
});

const fetchWardData = async () => {
  if (!isEditMode.value) return;
  try {
    // In a real scenario, a dedicated endpoint `/api/user/wards/:ward_no` would be better.
    // For now, we filter from the list fetched for the guardian.
    const response = await axios.get('/api/user/wards', {
      params: { guardianId: ward.value.guardian_id },
    });
    const wardData = response.data.result.find((w) => w.ward_no === parseInt(props.ward_no));
    if (wardData) {
      ward.value = { ...wardData };
    }
  } catch (error) {
    console.error('Error fetching ward data:', error);
    alert('피보호자 정보를 불러오는 데 실패했습니다.');
  }
};

const handleSubmit = async () => {
  try {
    if (isEditMode.value) {
      // Update existing ward
      await axios.put(`/api/user/wards/${props.ward_no}`, {
        address: ward.value.address,
        disabled_level: ward.value.disabled_level,
      });
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
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">
      {{ isEditMode ? '피보호자 정보 수정' : '신규 피보호자 등록' }}
    </h1>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">이름</label>
        <input
          type="text"
          id="name"
          v-model="ward.name"
          :disabled="isEditMode"
          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label for="ward_rrn" class="block text-sm font-medium text-gray-700">주민등록번호</label>
        <input
          type="text"
          id="ward_rrn"
          v-model="ward.ward_rrn"
          :disabled="isEditMode"
          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
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
          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label for="address" class="block text-sm font-medium text-gray-700">주소</label>
        <input
          type="text"
          id="address"
          v-model="ward.address"
          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
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
