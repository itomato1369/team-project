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

// 반려 버튼 클릭시 실행될 함수
const openRejectDialog = (item) => {
  // 처리할 항목 저장
  currentItemToReject.value = item;
  // 반려 사유 초기화
  rejectReason.value = '';
  // 모달창 표시 호출
  rejectDialog.value = true;
};

// 반려 사유 입력 후 전송 시 실행되는 함수
const submitReject = () => {};
//   if (!rejectReason.value.trim()) {
//     return;
//   }
//   const item = currentItemToReject.value;

//   try {
//     // 백엔드 API는 추후에 입력
//   }
// };

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

const getApprovalList = async () => {
  try {
    // backend 서버의 API
    const response = await axios.get('/api/institutions/approval');
    approvalList.value = response.data;
  } catch (error) {
    console.error('권한 승인 대기 목록 오류', error);
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
          field="institution_no"
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
              <Button icon="pi pi-check" label="승인" severity="success" size="small"></Button>
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
/* 1. 입력 필드 (Textarea) 스타일 개선 */
.p-fluid .field textarea {
  /* 텍스트 영역의 너비를 부모 컨테이너(p-fluid)에 꽉 채우도록 설정 */
  width: 100%;

  /* 기본 테두리를 더 부드럽게 */
  border: 1px solid var(--surface-d);
  border-radius: var(--border-radius);

  /* 포커스 시 테두리 색상 및 그림자 효과 변경 */
  transition:
    box-shadow 0.2s,
    border-color 0.2s;

  /* 높이를 키워 사유를 충분히 입력할 공간 확보 */
  height: 150px;

  /* 폰트 크기 조정 */
  font-size: 14px;
  padding: 10px;
}

.p-fluid .field textarea:focus {
  /* PrimeVue의 기본 포커스 색상 변수 사용 */
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem var(--primary-color-lighter);
}

/* 2. 레이블 스타일 개선 */
.p-fluid .field label {
  /* 레이블과 입력 필드 사이의 간격 추가 */
  display: block;
  margin-bottom: 8px;

  /* 굵게 표시하여 강조 */
  font-weight: bold;

  /* 폰트 색상 조정 */
  color: var(--text-color);
}

/* 3. 전체 Dialog 내부 여백 조정 */
/* Dialog 본문(content)의 기본 패딩을 사용하지만, 필요에 따라 조정할 수 있습니다. */
/* PrimeVue는 Dialog 본문에 .p-dialog-content 클래스를 사용합니다. */
.p-dialog-md .p-dialog-content {
  padding: 1.5rem;
}
</style>
