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
import { useAuthStore } from '@/stores/authStore';

// --- 상태 관리 ---
const authStore = useAuthStore();
const activeTab = ref(2); // '기관상태' 탭을 기본으로 활성화
const adminInfo = ref(null); // 초기는 null로 유지하여 로딩 상태 구분
// const logInUserId = !logInUserId ? authStore.user.user_id : 'test456';// 'test456'; // 하드코딩된 관리자 ID
const logInUserId = authStore.user.id; // 'test456'; // 하드코딩된 관리자 ID

// --- 데이터 로딩 ---
const loadAdminInfo = async () => {
  try {
    const response = await axios.get(`/api/user/institution-info/${logInUserId}`);
    // 데이터가 성공적으로 로드되면 객체를 할당
    adminInfo.value = response.data.result || {}; // API 결과가 null/undefined일 경우 빈 객체로 초기화
  } catch (error) {
    console.error('관리자 정보를 불러오는 데 실패했습니다:', error);
    adminInfo.value = {}; // 실패 시에도 빈 객체를 할당하여 화면 렌더링 보장
  }
};

onMounted(() => {
  loadAdminInfo();
});
</script>

<template>
  <div class="card">
    <!-- 1. 상단 영역 (데이터 로딩 완료 후 표시) -->
    <div v-if="adminInfo" class="header-container">
      <div class="header-left">
        <h1 class="page-title">마이페이지</h1>
        <p v-if="adminInfo.user_name" class="user-info">
          {{ adminInfo.user_name }}님
          <span v-if="adminInfo.institution_name">({{ adminInfo.institution_name }} 관리자)</span>
          <span v-else>(소속 기관 없음)</span>
        </p>
        <p v-else>관리자 정보를 불러오는 중입니다...</p>
      </div>
      <div class="header-right">
        <Button label="메인 페이지로" icon="pi pi-arrow-left" />
      </div>
    </div>

    <!-- 2. 탭 메뉴 영역 (항상 표시) -->
    <TabView v-model:activeIndex="activeTab">
      <TabPanel header="일반 이용자 목록" :disabled="!adminInfo || !adminInfo.institution_no">
        <p>일반 이용자 목록 컨텐츠가 준비중입니다.</p>
      </TabPanel>
      <TabPanel header="기관상태" :disabled="!adminInfo || !adminInfo.institution_no">
        <InstitutionState v-if="adminInfo && adminInfo.institution_no" />
        <p v-else>
          소속된 기관이 없어 상태를 표시할 수 없습니다. '내 정보 관리' 탭에서 기관을 신청하세요.
        </p>
      </TabPanel>
      <TabPanel header="내 정보 관리">
        <UserMyInfoUpdate v-if="adminInfo && adminInfo.user_id" :user-info="adminInfo" />
        <p v-else>사용자 정보를 불러오는 중...</p>
      </TabPanel>
    </TabView>
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
