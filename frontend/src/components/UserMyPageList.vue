<script setup>
import { ref } from 'vue';
import BaseDataTable from '@/components/BaseDataTable.vue';
import Button from 'primevue/button';

// 부모에게 보낼 이벤트를 정의합니다.
const emit = defineEmits(['goToPlan', 'goToResult', 'goToInquiry']);

// 데이터와 컬럼 정의 (기존과 동일)
const appliedProjects = ref([
    { id: 1
        , 사업명: '긴급 돌봄 서비스'
        , 기관명: '보건복지부'
        , 담당자: '김담당'
        , 지원신청일시: '2025-10-20'
        , 상태: '접수 완료', planContent: '긴급 돌봄 서비스 지원 계획 내용입니다.'
        , attachments: ['첨부파일1.pdf']
        , status: 'selected'
        , reason: '자격 요건 충족'
        , rejectionReason: '넌뭔데'
     },
    { id: 2, 사업명: '주간 활동 서비스', 기관명: '지방자치단체', 담당자: '이주무', 지원신청일시: '2025-10-15', 상태: '지원 대상 선정', planContent: '주간 활동 서비스 지원 계획 내용입니다.', attachments: [], status: 'rejected', reason: '정보 부족', rejectionReason: '필수 서류 미제출' },
]);
const columns = ref([
    { field: '사업명', header: '사업명' },
    { field: '기관명', header: '기관명' },
    { field: '지원신청일시', header: '지원신청일시' },
    { field: '상태', header: '상태' },
    { field: '조사지열람', header: '조사지열람' },
    { field: '지원계획서', header: '지원계획서' },
    { field: '결과확인', header: '결과확인' },
]);

// --- 이벤트 핸들러 ---
// 버튼 클릭 시, 정의한 이벤트를 통해 부모에게 데이터를 전달합니다.
const showUserinquiry = (project) => {
  emit('goToInquiry', project);
}

const showUserSupportPlan = (project) => {
  emit('goToPlan', project);
};

const showUserSupportResult = (project) => {
  emit('goToResult', project);
};
</script>

<template>
    <div class="table-section">
        <BaseDataTable :data="appliedProjects" :columns="columns" :rows="5">
            <template #body-조사지열람="{ data }">
                <Button label="열람하기" outlined @click="showUserinquiry(data)" />
            </template>
            <template #body-지원계획서="{ data }">
                <Button label="열람하기" outlined @click="showUserSupportPlan(data)" />
            </template>
            <template #body-결과확인="{ data }">
                <Button label="결과확인" outlined @click="showUserSupportResult(data)" />
            </template>
        </BaseDataTable>
    </div>
</template>

<style scoped>
.table-section {
    margin-top: 2rem;
}
</style>