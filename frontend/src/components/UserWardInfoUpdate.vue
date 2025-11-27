<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
// import Tag from 'primevue/tag';

const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const wards = ref([]);

const loadWards = async () => {
  try {
    const response = await axios.get('/api/user/wardlist', {
      params: { guardianId: props.userId },
    });
    wards.value = response.data.result;
  } catch (error) {
    console.error('피보호자 목록을 불러오는 데 실패했습니다:', error);
  }
};

onMounted(() => {
  loadWards();
});

const goToNewWardPage = () => {
  router.push({ name: 'user-ward-insert' });
};

const goToEditWardPage = (ward) => {
  router.push({ name: 'user-ward-edit', params: { ward_no: ward.ward_no } });
};

// const viewSupportHistory = (ward) => {
//   alert(`'${ward.name}'의 지원 기록 보기 기능은 현재 준비 중입니다.`);
// };

// const getPriorityClass = (status) => {
//   switch (status) {
//     case '긴급':
//       return 'priority-urgent';
//     case '중점':
//       return 'priority-important';
//     case '준비':
//       return 'priority-ready';
//     default:
//       return '';
//   }
// };
</script>

<template>
  <div class="card">
    <div
      class="p-d-flex p-jc-between p-mb-3"
      style="display: flex; justify-content: space-between; margin-bottom: 1.5rem"
    >
      <h5>피보호자 관리</h5>
      <Button
        label="신규 등록"
        icon="pi pi-plus"
        class="p-button-success"
        @click="goToNewWardPage"
      />
    </div>
    <DataTable :value="wards" responsiveLayout="scroll">
      <Column field="name" header="이름"></Column>
      <Column field="sex" header="성별"></Column>
      <Column field="age" header="나이"></Column>
      <Column header="주소">
        <template #body="slotProps">
          {{ slotProps.data.address ? slotProps.data.address.split('!').join(', ') : '' }}
        </template>
      </Column>
      <Column field="guardian_relation" header="관계"></Column>
      <Column field="disabled_level" header="장애 수준"></Column>
      <!-- <Column header="서비스 우선순위">
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.priority_status || '없음'"
            :class="getPriorityClass(slotProps.data.priority_status)"
          />
        </template>
      </Column> -->
      <!-- <Column header="지원 기록">
        <template #body="slotProps">
          <Button
            label="기록보기"
            @click="viewSupportHistory(slotProps.data)"
            class="p-button-text"
          />
        </template>
      </Column> -->
      <Column header="정보 수정">
        <template #body="slotProps">
          <Button
            label="정보수정"
            @click="goToEditWardPage(slotProps.data)"
            class="p-button-text"
          />
        </template>
      </Column>
    </DataTable>
  </div>
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

.priority-urgent {
  background-color: #ef4444 !important; /* red-500 */
  color: white !important;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}
.priority-important {
  background-color: #3b82f6 !important; /* blue-500 */
  color: white !important;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}
.priority-ready {
  background-color: #22c55e !important; /* green-500 */
  color: white !important;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}
</style>
