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
// 권한 승인 목록 조회
const getApprovalList = async () => {
  try {
    const response = await axios.get('/api/institutions/approval');

    // 너가 사용 중인 role 코드 기준으로 필터링
    const allowedRoles = ['USER', '1a', 'STAFF', '2a'];

    approvalList.value = response.data.filter((item) => allowedRoles.includes(item.role));
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
    <h2 class="page-subtitle">신규 이용자 및 담당자 승인 대기 목록</h2>

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
              class="p-inputtext p-component"
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
  padding: 30px 20px;
  background-color: #f7f9fc;
  min-height: 100vh;
}

.page-subtitle {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e6ed;
}

.table-container {
  margin-top: 1.5rem;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  padding: 0;
}

/* ======================================= */
/* 1. 데이터 테이블 스타일 개선 (::v-deep 문법 수정) */
/* ======================================= */

/* 테이블 헤더 */
/* ⚠️ 수정됨: :deep()을 클래스 앞에 붙여서 적용 범위 해제 */
:deep(.p-datatable-gridlines .p-datatable-thead th) {
  background-color: #4a6fa5;
  color: #ffffff;
  font-weight: 600;
  text-align: center;
  border-color: #3f6093;
  padding: 12px 10px;
  font-size: 14px;
}

/* 테이블 바디 셀 */
/* ⚠️ 수정됨 */
:deep(.p-datatable-gridlines .p-datatable-tbody td) {
  font-size: 14px;
  color: #495057;
  vertical-align: middle;
  border-color: #e9ecef;
  padding: 10px;
}

/* 테이블 행 호버 효과 */
/* ⚠️ 수정됨 */
:deep(.p-datatable-gridlines .p-datatable-tbody tr:not(.p-highlight):hover) {
  background-color: #f0f7ff;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

/* 테이블 내 버튼 스타일 */
/* ⚠️ 수정됨 */
:deep(.p-datatable-gridlines .p-button) {
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.2s;
  font-weight: 500;
}

/* 승인 버튼 호버 */
/* ⚠️ 수정됨 */
:deep(.p-datatable-gridlines .p-button.p-button-success:hover) {
  background-color: #1e7e34 !important;
}
/* 반려 버튼 호버 */
/* ⚠️ 수정됨 */
:deep(.p-datatable-gridlines .p-button.p-button-danger:hover) {
  background-color: #bd2130 !important;
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
/* 3. 반려 모달 (Dialog) 내부 스타일 (오타 및 문법 수정) */
/* ======================================= */

/* PrimeVue의 p-dialog-content 안에 있는 필드 스타일 */
:deep(.p-dialog-content .p-fluid .field label) {
  /* ⚠️ 수정됨: :deep() 문법 조정 */
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #34495e;
  font-size: 0.95rem;
}

/* 텍스트 영역 (Textarea) 스타일 */
/* ⚠️ 오타 수정됨: p-inputttext -> p-inputtext */
:deep(.p-dialog-content .p-fluid .field textarea.p-inputtext) {
  /* ⚠️ 수정됨: :deep() 문법 조정 및 오타 수정 */
  width: 100%;
  min-height: 120px;
  padding: 12px;
  font-size: 15px;
  line-height: 1.5;
  border: 1px solid #ced4da;
  border-radius: 8px;
  transition: all 0.3s;
  resize: vertical;
}

/* 텍스트 영역 포커스 스타일 */
/* ⚠️ 오타 수정됨: p-inputttext -> p-inputtext */
:deep(.p-dialog-content .p-fluid .field textarea.p-inputtext:focus) {
  /* ⚠️ 수정됨: :deep() 문법 조정 및 오타 수정 */
  border-color: #4a6fa5;
  box-shadow: 0 0 0 0.2rem rgba(74, 111, 165, 0.2);
  outline: none;
}

/* 모바일 반응형 디자인 */
:deep(.p-dialog) {
  /* ⚠️ 수정됨: :deep() 문법 조정 */
  /* 원래는 이 스타일이 global하게 적용되므로, 이 스타일만 남겨둠 */
}

@media (max-width: 768px) {
  /* 템플릿에서 width: '50vw'를 사용하고 있으므로, 작은 화면에서만 오버라이드 */
  :deep(.p-dialog) {
    width: 90vw !important;
  }
}
</style>
