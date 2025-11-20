<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

// PrimeVue 컴포넌트
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';

// 컴포넌트
import StaffUserList from '@/components/staff/StaffUserList.vue';
import UserMyInfoUpdate from '@/components/UserMyInfoUpdate.vue';
import InstitutionState from '@/components/InstitutionState.vue';

// --- 상태 관리 ---
const activeTab = ref(0);
const staffInfo = ref(null);
const logInUserId = 'staff'; // 하드코딩된 스태프 ID

// --- 데이터 로딩 ---
const loadStaffInfo = async () => {
  try {
    const response = await axios.get(`/api/user/institution-info/${logInUserId}`); // 동일 API 사용
    staffInfo.value = response.data.result;
  } catch (error) {
    console.error('스태프 정보를 불러오는 데 실패했습니다:', error);
  }
};

onMounted(() => {
  loadStaffInfo();
});
</script>

<template>
  <div class="card" v-if="staffInfo">
    <!-- 1. 상단 영역 -->
    <div class="header-container">
      <div class="header-left">
        <h1 class="page-title">마이페이지</h1>
        <p class="user-info">{{ staffInfo.user_name }}님({{ staffInfo.institution_name }} 담당자)</p>
      </div>
      <div class="header-right">
        <Button label="메인 페이지로" icon="pi pi-arrow-left" />
      </div>
    </div>

    <!-- 2. 탭 메뉴 영역 -->
    <TabView v-model:activeIndex="activeTab">
      <TabPanel header="일반 이용자 목록">
        <StaffUserList />
      </TabPanel>
      <TabPanel header="상담 목록">
        <p>상담 목록 컨텐츠가 준비중입니다.</p>
      </TabPanel>
      <TabPanel header="기관상태">
        <InstitutionState />
      </TabPanel>
      <TabPanel header="내 정보 관리">
        <UserMyInfoUpdate />
      </TabPanel>
    </TabView>
  </div>
  <div v-else>
    <p>스태프 정보를 불러오는 중입니다...</p>
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

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #495057;
  color: white;
  padding: 1.5rem;
  border-radius: 10px 10px 0 0;
  margin: -2rem -2rem 2rem -2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.user-info {
  margin: 0.5rem 0 0 0;
}

.status-badge {
  color: #22c55e; /* green-500 */
  font-weight: bold;
}

.p-tabview {
  margin-top: 2rem;
}
</style>
