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
import { useAuthStore } from '@/stores/authStore';

// --- 상태 관리 ---
const authStore = useAuthStore();
const activeTab = ref(3);
const staffInfo = ref(null); // 초기는 null로 유지
// const logInUserId = !logInUserId ? authStore.user.user_id : 'test789';// 'test789'; // 하드코딩된 관리자 ID
const logInUserId = authStore.user.id; // 'test789'; // 하드코딩된 관리자 ID

// --- 데이터 로딩 ---
const loadStaffInfo = async () => {
  try {
    const response = await axios.get(`/api/user/institution-info/${logInUserId}`); // 동일 API 사용
    staffInfo.value = response.data.result || {}; // API 결과가 null/undefined일 경우 빈 객체로 초기화
  } catch (error) {
    console.error('스태프 정보를 불러오는 데 실패했습니다:', error);
    staffInfo.value = {}; // 실패 시에도 빈 객체를 할당하여 화면 렌더링 보장
  }
};

onMounted(() => {
  loadStaffInfo();
});
</script>

<template>
  <div class="card">
    <!-- 1. 상단 영역 (데이터 로딩 완료 후 표시) -->
    <div v-if="staffInfo" class="header-container">
      <div class="header-left">
        <h1 class="page-title">마이페이지</h1>
        <p v-if="staffInfo.user_name" class="user-info">
          {{ staffInfo.user_name }}님
          <span v-if="staffInfo.institution_name">({{ staffInfo.institution_name }} 담당자)</span>
          <span v-else>(소속 기관 없음)</span>
        </p>
        <p v-else>스태프 정보를 불러오는 중입니다...</p>
      </div>
      <div class="header-right">
        <Button label="메인 페이지로" icon="pi pi-arrow-left" />
      </div>
    </div>

    <!-- 2. 탭 메뉴 영역 (항상 표시) -->
    <TabView v-model:activeIndex="activeTab">
      <TabPanel header="일반 이용자 목록" :disabled="!staffInfo || !staffInfo.institution_no">
        <StaffUserList v-if="staffInfo && staffInfo.institution_no" />
        <p v-else>
          소속된 기관이 없어 이용자 목록을 조회할 수 없습니다. '내 정보 관리' 탭에서 기관을
          신청하세요.
        </p>
      </TabPanel>
      <TabPanel header="상담 목록" :disabled="!staffInfo || !staffInfo.institution_no">
        <p>상담 목록 컨텐츠가 준비중입니다.</p>
      </TabPanel>
      <TabPanel header="기관상태" :disabled="!staffInfo || !staffInfo.institution_no">
        <InstitutionState v-if="staffInfo && staffInfo.institution_no" />
        <p v-else>
          소속된 기관이 없어 상태를 표시할 수 없습니다. '내 정보 관리' 탭에서 기관을 신청하세요.
        </p>
      </TabPanel>
      <TabPanel header="내 정보 관리">
        <UserMyInfoUpdate v-if="staffInfo && staffInfo.user_id" :user-info="staffInfo" />
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
