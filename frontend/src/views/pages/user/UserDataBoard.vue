<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import MultiSelect from 'primevue/multiselect';
import DatePicker from 'primevue/datepicker';

import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; // 👈 2. [추가] axios import

const router = useRouter();
const datas = ref([]);
const selectedFiles = ref([]);

const filters1 = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  'country.name': {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  representative: { value: null, matchMode: FilterMatchMode.IN },
  date: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
  },
  balance: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  status: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
  verified: { value: null, matchMode: FilterMatchMode.EQUALS },
});
const loading1 = ref(true); // 로딩 초기값 true로 설정

const representatives = reactive([
  { name: '장애인지원센터1' },
  { name: '장애인지원센터2' },
  { name: '장애인지원센터3' },
  { name: '장애인지원센터4' },
  { name: '장애인지원센터5' },
  { name: '장애인지원센터6' },
  { name: '장애인지원센터7' },
  { name: '장애인지원센터8' },
  { name: '장애인지원센터9' },
]);

onMounted(async () => {
  //   ProductService.getProductsWithOrdersSmall().then((data) => (products.value = data));

  // 👇 3. [수정] 백엔드 I 호출 로직으로 변경AP
  try {
    // 백엔드 서버 주소 (포트 3000 확인 필요)

    const response = await axios.get('/api/system/data-board/');

    const dbData = response.data;

    // 4. [중요] DB 데이터(inquiry 테이블)를 프론트엔드 테이블 구조에 맞게 변환
    datas.value = dbData.map((item, index) => {
      // 1️⃣ 안전한 날짜 변환 함수
      const parseDate = (value) => {
        if (!value) return null; // null 또는 undefined면 그냥 null 반환
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date; // Invalid Date 방지
      };
      console.log(item.board_no);
      return {
        board_no: item.board_no ?? index, // null/undefined면 인덱스로 대체
        name: item.no, // 조사지ID

        institution_name: {
          name: item.institution_name, // 기관명
        },
        writer: {
          name: item.writer, // 담당기관
        },
        file_no: {
          name: item.file_no,
        },
        title: {
          name: item.title,
        },
        date: parseDate(item.created_at), // ✅ 안전한 날짜 변환
        balance: 0, // 더미 데이터
      };
    });

    console.log('DB 데이터 로드 성공:', datas.value);
  } catch (error) {
    console.error('백엔드 API 호출 실패:', error);
    // 에러 발생 시 빈 배열로 초기화하여 테이블이 깨지지 않게 함
    datas.value = [];
  } finally {
    loading1.value = false; // 로딩 종료
  }

  initFilters1();
});

function initFilters1() {
  filters1.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    'country.name': {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    date: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    balance: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  };
}

function formatDate(value) {
  if (!value) return '';
  return value.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
const downloadFile = async function downloadFile(fileNo) {
  try {
    const response = await axios.get(`/api/system/data-board/download/${fileNo}`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;

    const contentDisposition = response.headers['content-disposition'];
    let fileName = fileNo;

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?(.+)"?/);
      if (match) fileName = decodeURIComponent(match[1]);
    }

    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('파일 다운로드 실패:', err);
  }
};
const downloadZip = async function downloadZip(file) {
  // 👈 인자 fileNo 제거
  try {
    // 1. 선택된 파일 객체에서 board_no (또는 file_no.name)만 추출하여 배열 생성
    const fileNos = selectedFiles.value.map((file) => file.file_no.name);

    if (fileNos.length === 0) {
      alert('다운로드할 파일을 선택해주세요.');
      return;
    } // 2. POST 요청으로 fileNos 배열을 Body에 전달

    const response = await axios.post(
      `/api/system/data-board/download-multi`,
      { fileNos: fileNos },
      {
        responseType: 'blob',
      }
    );

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;

    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'files.zip';

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?(.+)"?/);
      if (match) fileName = decodeURIComponent(match[1]);
    }

    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
    selectedFiles.value = [];
  } catch (err) {
    console.error('파일 다운로드 실패:', err);
  }
};
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">자료실</div>
    <DataTable
      v-model:filters="filters1"
      :value="datas"
      :paginator="true"
      :rows="10"
      dataKey="id"
      :rowHover="true"
      filterDisplay="menu"
      :loading="loading1"
      :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']"
      showGridlines
    >
      <template #empty> No file found. </template>
      <template #loading> Loading file data. Please wait. </template>
      <Column field="name" header="자료 번호" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.board_no }}
        </template>
      </Column>
      <Column header="자료명" filterField="country.name" style="min-width: 12rem">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span>{{ data.title.name }}</span>
          </div>
        </template>

        <template #filterclear="{ filterCallback }">
          <Button
            type="button"
            icon="pi pi-times"
            @click="filterCallback()"
            severity="secondary"
          ></Button>
        </template>
        <template>
          <Button
            type="button"
            icon="pi pi-check"
            @click="filterCallback()"
            severity="success"
          ></Button>
        </template>
      </Column>
      <Column header="첨부 파일" style="min-width: 8rem">
        <template #body="{ data }">
          <div v-if="data.file_no.name">
            <!-- 디스켓 아이콘 클릭 시 다운로드 -->
            <i
              class="pi pi-save"
              style="cursor: pointer; font-size: 1.2rem"
              @click="downloadFile(data.file_no.name)"
              title="파일 다운로드"
            ></i>
          </div>
        </template>
      </Column>
      <Column
        header="작성 기관"
        filterField="representative"
        :showFilterMatchModes="false"
        :filterMenuStyle="{ width: '14rem' }"
        style="min-width: 14rem"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span>{{ data.institution_name.name }}</span>
          </div>
        </template>

        <MultiSelect
          v-model="filterModel.value"
          :options="representatives"
          optionLabel="name"
          placeholder="Any"
        >
          <template #option="slotProps">
            <div class="flex items-center gap-2">
              <span>{{ slotProps.option.name }}</span>
            </div>
          </template>
        </MultiSelect>
      </Column>
      <Column
        header="작성자"
        filterField="representative"
        :showFilterMatchModes="false"
        :filterMenuStyle="{ width: '14rem' }"
        style="min-width: 14rem"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span>{{ data.writer.name }}</span>
          </div>
        </template>

        <MultiSelect
          v-model="filterModel.value"
          :options="representatives"
          optionLabel="name"
          placeholder="Any"
        >
        </MultiSelect>
      </Column>
      <Column header="등록일" filterField="date" dataType="date" style="min-width: 10rem">
        <template #body="{ data }">
          {{ formatDate(data.date) }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
  font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
  font-weight: bold;
}
</style>
