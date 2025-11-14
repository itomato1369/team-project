<script setup>
// vue에서 제공하는 데이터 테이블을 깔끔하게 볼 수 있는 기능
import { Column } from 'primevue';
import { ref } from 'vue';

// DB에서 기관 담당자, 기관 관리자의 정보를 가져와야함
const approvalList = ref([
  {
    user_id: 'admin',
    user_name: 'admin',
    institution_name: 'A기관',
    role: '3a', // 공통코드 참조
    applicationDate: '2025-11-10', // 실제 권한 승인 신청한 날짜로 변경
    status: 'READY', // 'READY', 'ACTVIE'
  },
]);
</script>

<template>
  <div class="approval-page">
    <h2 class="page-subtitle">신규 관리자 및 담당자 승인 대기 목록</h2>

    <div class="table-container">
      <!-- paginator은 DataTable이 가지고 있는 페이징 기능 -->
      <DataTable :value="approvalList" paginator :rows="10" class="p-datatable-gridlines">
        <Column field="user_id" header="신청자명" style="width: 15%; min-width: 120px"></Column>

        <Column
          field="institution_name"
          header="소속기관"
          style="width: 15%; min-width: 120px"
        ></Column>

        <Column field="role" header="요청권한" style="width: 15%; min-width: 120px">
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.role"
              :severity="slotProps.data.role.includes('3a') ? 'info' : 'secondary'"
            ></Tag>
          </template>
        </Column>

        <Column
          field="applicationDate"
          header="신청일자"
          style="width: 15%; min-width: 120px"
        ></Column>

        <Column field="status" header="상태" style="width: 15%; min-width: 100px">
          <template #body="slotProps">
            <Tag :value="slotProps.data.status"></Tag>
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
              <Button icon="pi pi-times" label="반려" severity="danger" size="small"></Button>
              <!-- @click으로 승인/반려 버튼 누르면 승인할 수 있도록 함수 -->
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
