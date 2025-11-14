<script setup>
import { ref } from 'vue';

// PrimeVue 컴포넌트 임포트
import Breadcrumb from 'primevue/breadcrumb';
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

// 공통 테이블 컴포넌트 임포트
import BaseDataTable from '@/components/BaseDataTable.vue';
import SupportPlan from '@/components/SupportPlan.vue';
import SelectionResult from '@/components/SelectionResult.vue';

// --- 상태 관리 ---
const currentView = ref('list'); // 'list', 'supportPlan', 'selectionResult'
const selectedProject = ref(null);
const activeTab = ref(0);

// Breadcrumb 경로 아이템
const breadcrumbItems = ref([
    { label: '마이페이지' }
]);

// 테이블에 표시될 임시 데이터
const appliedProjects = ref([
    { id: 1, 사업명: '긴급 돌봄 서비스', 기관명: '보건복지부', 담당자: '김담당', 지원신청일시: '2025-10-20', 상태: '접수 완료', planContent: '긴급 돌봄 서비스 지원 계획 내용입니다.', attachments: ['첨부파일1.pdf'], status: 'selected', reason: '자격 요건 충족', rejectionReason: '' },
    { id: 2, 사업명: '주간 활동 서비스', 기관명: '지방자치단체', 담당자: '이주무', 지원신청일시: '2025-10-15', 상태: '지원 대상 선정', planContent: '주간 활동 서비스 지원 계획 내용입니다.', attachments: [], status: 'rejected', reason: '정보 부족', rejectionReason: '필수 서류 미제출' },
    { id: 3, 사업명: '청소년 발달 지원 사업', 기관명: '고용노동부', 담당자: '박서기', 지원신청일시: '2025-09-30', 상태: '완료', planContent: '청소년 발달 지원 사업 지원 계획 내용입니다.', attachments: ['첨부파일2.docx'], status: 'selected', reason: '자격 요건 충족', rejectionReason: '' },
]);

// BaseDataTable에 전달할 컬럼 정의
const columns = ref([
    { field: '사업명', header: '사업명', style: 'min-width: 15rem' },
    { field: '기관명', header: '기관명', style: 'min-width: 10rem' },
    { field: '담당자', header: '담당자', style: 'min-width: 8rem' },
    { field: '지원신청일시', header: '지원신청일시', style: 'min-width: 10rem' },
    { field: '상태', header: '상태', style: 'min-width: 8rem' },
    { field: '조사지열람', header: '조사지열람', style: 'min-width: 8rem' },
    { field: '지원계획서', header: '지원계획서', style: 'min-width: 8rem' },
    { field: '결과확인', header: '결과확인', style: 'min-width: 8rem' },
]);

// --- 이벤트 핸들러 ---
const handleButtonClick = (action, item) => {
    alert(`${item.사업명}의 '${action}'을(를) 클릭했습니다.`);
};

const showSupportPlan = (project) => {
  selectedProject.value = project;
  currentView.value = 'supportPlan';
};

const showSelectionResult = (project) => {
  selectedProject.value = project;
  currentView.value = 'selectionResult';
};

const goBackToList = () => {
  currentView.value = 'list';
  selectedProject.value = null;
};

</script>

<template>
    <div v-if="currentView === 'list'">
        <div class="card">
            <!-- 1. 상단 영역 -->
            <Breadcrumb :home="{ icon: 'pi pi-home', url: '/' }" :model="breadcrumbItems" />

            <div class="title-section">
                <h2 class="page-title">신청 사업 목록</h2>
                <Button label="메인 페이지로" icon="pi pi-arrow-right" icon-pos="right" />
            </div>

            <!-- 2. 탭 메뉴 영역 -->
            <TabView v-model:activeIndex="activeTab">
                <TabPanel header="신청 사업 목록">
                    <div class="table-section">
                        <BaseDataTable :data="appliedProjects" :columns="columns" :rows="5">
                            <template #body-조사지열람="{ data }">
                                <Button label="열람" outlined @click="handleButtonClick('조사지 열람', data)" />
                            </template>
                            <template #body-지원계획서="{ data }">
                                <Button label="보기" outlined @click="showSupportPlan(data)" />
                            </template>
                            <template #body-결과확인="{ data }">
                                <Button label="확인" outlined @click="showSelectionResult(data)" />
                            </template>
                        </BaseDataTable>
                    </div>
                </TabPanel>
                <TabPanel header="상담내역">
                    <p class="placeholder-text">상담내역 컨텐츠가 준비중입니다.</p>
                </TabPanel>
                <TabPanel header="내 정보 관리">
                    <p class="placeholder-text">내 정보 관리 컨텐츠가 준비중입니다.</p>
                </TabPanel>
                <TabPanel header="피보호자 관리">
                    <p class="placeholder-text">피보호자 관리 컨텐츠가 준비중입니다.</p>
                </TabPanel>
            </TabView>
        </div>
    </div>

    <!-- 상세 뷰 영역 -->
    <SupportPlan v-else-if="currentView === 'supportPlan'" :project="selectedProject" @back="goBackToList" />
    <SelectionResult v-else-if="currentView === 'selectionResult'" :project="selectedProject" @back="goBackToList" />
</template>

<style scoped>
.card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
}

.title-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
}

.page-title {
    font-size: 2rem;
    font-weight: bold;
}

.table-section {
    margin-top: 2rem;
}

.placeholder-text {
    margin-top: 2rem;
    text-align: center;
    color: #6c757d;
}
</style>