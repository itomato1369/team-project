<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// PrimeVue 컴포넌트
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';

// 컴포넌트
import UserMyInfoUpdate from '@/components/UserMyInfoUpdate.vue';
import InstitutionState from '@/components/InstitutionState.vue';

// --- 상태 관리 ---
const activeTab = ref(1); // '기관상태' 탭을 기본으로 활성화
const adminInfo = ref(null);
const logInUserId = 'admin'; // 하드코딩된 관리자 ID

// --- 데이터 로딩 ---
const loadAdminInfo = async () => {
  try {
    // 새로 만든 백엔드 API 엔드포인트를 사용
    const response = await axios.get(`/api/user/institution-info/${logInUserId}`);
    adminInfo.value = response.data.result;
  } catch (error) {
    console.error('관리자 정보를 불러오는 데 실패했습니다:', error);
  }
};

onMounted(() => {
  loadAdminInfo();
});
</script>

<template>
  <div class="card" v-if="adminInfo">
    <!-- 1. 상단 영역 -->
    <div class="header-container">
      <div class="header-left">
        <h1 class="page-title">마이페이지</h1>
        <p class="user-info">
          {{ adminInfo.user_name }}님({{ adminInfo.institution_name }} 관리자)
        </p>
      </div>
      <div class="header-right">
        <Button label="메인 페이지로" icon="pi pi-arrow-left" />
      </div>
    </div>

    <!-- 2. 탭 메뉴 영역 -->
    <TabView v-model:activeIndex="activeTab">
      <TabPanel header="일반 이용자 목록">
        <p>일반 이용자 목록 컨텐츠가 준비중입니다.</p>
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
    <p>관리자 정보를 불러오는 중입니다...</p>
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
