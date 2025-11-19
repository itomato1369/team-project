<script setup>
// vue에서 제공하는 데이터 테이블을 깔끔하게 볼 수 있는 기능
// import { DataTable, Column, Tag, Button, Dialog } from 'primevue';
import { ref, onMounted } from 'vue';
import axios from 'axios';

// DB에서 정보를 가져와야함
const approvalList = ref([]);

// Dialog 모달 표시 primevue 에서 제공하는 모달창 기능
const rejectDialog = ref(false);
// 반려 사유 모달
const rejectReason = ref('');
// 반려 사유 저장
const currentItemToReject = ref(null);

// 권한 승인 목록 조회
const getApprovalList = async () => {
  try {
    // backend 서버의 API
    const response = await axios.get('/api/institutions/approval');
    approvalList.value = response.data;
  } catch (error) {
    console.error('권한 승인 대기 목록 오류', error);
  }
};

// 승인 버튼 클릭시 실행되는 함수
const acceptApproval = async (item) => {
  // 사용자에게 한 번 더 확인
  if (!confirm(`${item.user_name}의 권한 요청을 승인하시겠습니까?`)) {
    return;
  }
  try {
    // 백엔드 API /approval/:id 호출
    const response = await axios.patch(`/api/institutions/approval/${item.user_id}`);
    console.log('승인 완료', response.data.message);
    // 승인 완료 후 목 록 새로고침
    await getApprovalList();
  } catch (error) {
    console.error('권한 승인 실패', error);
  }
};

// 반려 버튼 클릭시 실행될 함수
const openRejectDialog = (item) => {
  // 처리할 항목 저장
  currentItemToReject.value = item;
  // 반려 사유 초기화
  rejectReason.value = '';
  // 모달창 표시 호출
  rejectDialog.value = true;
};

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '유효하지 않은 날짜';
    }
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch (error) {
    return '날짜 포맷 오류';
  }
};

// 공통 코드
const getRoleText = (role) => {
  switch (role) {
    case '1a':
    case 'USER':
      return '일반 이용자'; // 일반 이용자의 승인은 여기서 받지 않음
    case '2a':
    case 'STAFF':
      return '기관 담당자';
    case '3a':
    case 'ADMIN':
      return '기관 관리자';
    default:
      return role;
  }
};

// 승인 상태에 따라 태그 색상 정의
// 0J이용자승인구분코드 1j승인 2j거부
const getStatus = (status) => {
  switch (status) {
    case 'READY':
      return 'warning';
    case 'ACTIVE':
      return 'success';
    default:
      return 'secondary';
  }
};

// vue 컴포넌트가 로드될 때 데이터를 가져오도록
onMounted(() => {
  getApprovalList();
});
</script>

<template>
  <div class="approval-page">
    <h2 class="page-subtitle">신규 관리자 및 담당자 승인 대기 목록</h2>

    <div class="table-container">
      <div v-if="!approvalList.length" class="empty-list-message">
        <i class="pi pi-check-circle"></i>
        <p>현재 승인 대기 중인 사용자가 없습니다</p>
      </div>
      <!-- paginator은 DataTable이 가지고 있는 페이징 기능 -->
      <DataTable v-else :value="approvalList" paginator :rows="10" class="p-datatable-gridlines">
        <Column field="user_name" header="신청자명" style="width: 15%; min-width: 120px"></Column>

        <Column
          field="institution_name"
          header="소속기관"
          style="width: 15%; min-width: 120px"
        ></Column>

        <Column field="role" header="요청권한" style="width: 15%; min-width: 120px">
          <template #body="slotProps">
            <Tag
              :value="getRoleText(slotProps.data.role)"
              :severity="slotProps.data.role.includes('3a') ? 'info' : 'secondary'"
            ></Tag>
          </template>
        </Column>

        <Column field="created_at" header="신청일자" style="width: 15%; min-width: 120px">
          <template #body="slotProps">{{ formatDate(slotProps.data.created_at) }}</template>
        </Column>

        <Column field="status" header="상태" style="width: 15%; min-width: 100px">
          <template #body="slotProps">
            <Tag :value="slotProps.data.status" :severity="getStatus(slotProps.data.status)"></Tag>
          </template>
        </Column>

        <Column
          header="처리"
          style="width: 15%; min-width: 160px"
          headerStyle="text-align: center;"
        >
          <template #body="slotProps">
            <div class="flex gap-2 justify-center" v-if="slotProps.data.status === 'READY'">
              <Button
                icon="pi pi-check"
                label="승인"
                severity="success"
                size="small"
                @click="acceptApproval(slotProps.data)"
              ></Button>
              <Button
                icon="pi pi-times"
                label="반려"
                severity="danger"
                size="small"
                @click="openRejectDialog(slotProps.data)"
              ></Button>
              <!-- @click으로 승인 버튼 누르면 승인할 수 있도록 함수 -->
              <!-- 반려 버튼 누르면 모달 창 호출해서 사유 입력 함수 -->
            </div>
          </template>
        </Column>
      </DataTable>
      <Dialog
        header="권한 요청 반려 사유 입력"
        v-model:visible="rejectDialog"
        :modal="true"
        class="p-dialog-md"
        :style="{ width: '50vw' }"
      >
        <div class="p-fluid">
          <div class="field">
            <label for="rejectReason">반려 사유</label>
            <textarea
              id="rejectReason"
              v-model="rejectReason"
              rows="5"
              cols="20"
              class="p-inputttext p-component"
              placeholder="상세 반려 사유 입력"
            ></textarea>
          </div>
        </div>
        <template #footer>
          <Button
            label="취소"
            icon="pi pi-times"
            @click="rejectDialog = false"
            text
            raised
          ></Button>
          <Button label="전송" icon="pi pi-check" @click="submitReject" severity="danger"></Button>
        </template>
      </Dialog>
    </div>
  </div>
</template>

<style scoped>
/* ======================================= */
/* 0. 기본 컨테이너 및 제목 스타일 (통일) */
/* ======================================= */
.approval-page {
  /* SystemSupportplan.vue와 동일하게 적용 */
  padding: 30px 20px;
  background-color: #f7f9fc; /* 부드러운 배경 (SystemSupportplan.vue 스타일) */
  min-height: 100vh;
}

.page-subtitle {
  /* SystemSupportplan.vue와 동일하게 적용 */
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e6ed; /* SystemSupportplan.vue 스타일 */
}

.table-container {
  /* SystemSupportplan.vue의 테이블 컨테이너 스타일과 유사하게 적용 */
  margin-top: 1.5rem;
  background-color: #ffffff;
  border-radius: 10px; /* 둥근 모서리 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08); /* 깊이감 있는 그림자 */
  overflow: hidden; /* 테이블의 둥근 모서리를 위해 */
  padding: 0; /* DataTable이 컨테이너의 크기를 채우도록 패딩 제거 */
}

/* ======================================= */
/* 1. 데이터 테이블 스타일 개선 (SystemSupportplan.vue와 동일하게 통일) */
/* ======================================= */

/* 테이블 헤더 */
.p-datatable-gridlines :deep(.p-datatable-thead th) {
  background-color: #4a6fa5; /* 헤더 배경색: 세련된 파란색 */
  color: #ffffff; /* 헤더 텍스트: 흰색 */
  font-weight: 600;
  text-align: center;
  border-color: #3f6093; /* 헤더 경계선 색상 조정 */
  padding: 12px 10px;
  font-size: 14px;
}

/* 테이블 바디 셀 */
.p-datatable-gridlines :deep(.p-datatable-tbody td) {
  font-size: 14px;
  color: #495057;
  vertical-align: middle;
  border-color: #e9ecef;
  padding: 10px;
}

/* 테이블 행 호버 효과 */
.p-datatable-gridlines :deep(.p-datatable-tbody tr:not(.p-highlight):hover) {
  background-color: #f0f7ff; /* 마우스 오버 시 연한 하늘색 배경 */
  transition: background-color 0.2s ease;
  cursor: pointer;
}

/* 테이블 내 버튼 스타일: size="small"에 맞게 최적화 */
.p-datatable-gridlines :deep(.p-button) {
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 4px; /* SystemSupportplan.vue의 버튼 스타일과 통일 */
  transition: all 0.2s;
  font-weight: 500;
}

/* 승인 버튼 호버 */
.p-datatable-gridlines :deep(.p-button.p-button-success:hover) {
  background-color: #1e7e34 !important; /* 더 진한 초록색 */
}
/* 반려 버튼 호버 */
.p-datatable-gridlines :deep(.p-button.p-button-danger:hover) {
  background-color: #bd2130 !important; /* 더 진한 빨간색 */
}

/* ======================================= */
/* 2. 빈 목록 메시지 스타일 (유지) */
/* ======================================= */
.empty-list-message {
  text-align: center;
  padding: 60px 20px;
  color: #9aa5b1;
  font-size: 1.2rem;
  background-color: #fcfcfc;
  border: 2px dashed #dbe1e6;
  border-radius: 10px;
  margin-top: 15px;
}

.empty-list-message i {
  font-size: 3rem;
  color: #c3cfd9;
  margin-bottom: 15px;
  display: block;
}

/* ======================================= */
/* 3. 반려 모달 (Dialog) 내부 스타일 (유지 및 정리) */
/* ======================================= */

/* PrimeVue의 p-dialog-content 안에 있는 필드 스타일 */
:deep(.p-dialog-content) .p-fluid .field label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #34495e;
  font-size: 0.95rem;
}

/* 텍스트 영역 (Textarea) 스타일 */
:deep(.p-dialog-content) .p-fluid .field textarea.p-inputttext {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  font-size: 15px;
  line-height: 1.5;
  border: 1px solid #ced4da;
  border-radius: 8px; /* 더 둥근 모서리 */
  transition: all 0.3s;
  resize: vertical;
}

:deep(.p-dialog-content) .p-fluid .field textarea.p-inputttext:focus {
  border-color: #4a6fa5; /* 포커스 시 테이블 헤더 색상으로 통일 */
  box-shadow: 0 0 0 0.2rem rgba(74, 111, 165, 0.2);
  outline: none;
}

/* 모바일 반응형 디자인: 작은 화면에서 모달 너비 조정 */
@media (max-width: 768px) {
  /* 템플릿에서 width: '50vw'를 사용하고 있으므로, 작은 화면에서만 오버라이드 */
  :deep(.p-dialog) {
    width: 90vw !important;
  }
}
</style>
