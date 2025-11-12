<script setup>
import { CustomerService } from '@/service/system_service/Institution';
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onBeforeMount, reactive, ref } from 'vue';
import SurveyDetailButton from '@/components/system/SurveyDetailButton.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const customers1 = ref(null);
const customers2 = ref(null);
const customers3 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);

const products = ref(null);
const expandedRows = ref([]);

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

onBeforeMount(() => {
  ProductService.getProductsWithOrdersSmall().then((data) => (products.value = data));
  CustomerService.getCustomersLarge().then((data) => {
    customers1.value = data;
    loading1.value = false;
    customers1.value.forEach((customer) => (customer.date = new Date(customer.date)));
  });
  CustomerService.getCustomersLarge().then((data) => (customers2.value = data));
  CustomerService.getCustomersMedium().then((data) => (customers3.value = data));

  initFilters1();
});
function goToRegistSurvey() {
  router.push({
    name: 'RegistSurvey',
  });
}
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
    activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS },
  };
}

function expandAll() {
  expandedRows.value = products.value.reduce((acc, p) => (acc[p.id] = true) && acc, {});
}

function collapseAll() {
  expandedRows.value = null;
}

function formatCurrency(value) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function formatDate(value) {
  return value.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">조사지 관리</div>
    <DataTable
      :value="customers1"
      :paginator="true"
      :rows="10"
      dataKey="id"
      :rowHover="true"
      v-model:filters="filters1"
      filterDisplay="menu"
      :loading="loading1"
      :filters="filters1"
      :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']"
      showGridlines
    >
      <template #header>
        <div class="flex justify-between">
          <Button
            type="button"
            icon="pi pi-fw pi-pencil"
            label="조사지 등록"
            outlined
            @click="goToRegistSurvey()"
          />
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters1['global'].value" placeholder="Keyword Search" />
          </IconField>
        </div>
      </template>
      <template #empty> No customers found. </template>
      <template #loading> Loading customers data. Please wait. </template>
      <Column field="name" header="조사지ID" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.name }}
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
        </template>
      </Column>
      <Column header="조사지명" filterField="country.name" style="min-width: 12rem">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span>{{ data.country.name }}</span>
          </div>
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" type="text" placeholder="Search by country" />
        </template>
        <template #filterclear="{ filterCallback }">
          <Button
            type="button"
            icon="pi pi-times"
            @click="filterCallback()"
            severity="secondary"
          ></Button>
        </template>
        <template #filterapply="{ filterCallback }">
          <Button
            type="button"
            icon="pi pi-check"
            @click="filterCallback()"
            severity="success"
          ></Button>
        </template>
      </Column>
      <Column
        header="담당기관"
        filterField="representative"
        :showFilterMatchModes="false"
        :filterMenuStyle="{ width: '14rem' }"
        style="min-width: 14rem"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span>{{ data.representative.name }}</span>
          </div>
        </template>
        <template #filter="{ filterModel }">
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
        </template>
      </Column>
      <Column header="최종 수정일" filterField="date" dataType="date" style="min-width: 10rem">
        <template #body="{ data }">
          {{ formatDate(data.date) }}
        </template>
        <template #filter="{ filterModel }">
          <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
        </template>
      </Column>
      <Column header="상세보기" style="min-width: 10rem">
        <template #body="{ data }">
          <SurveyDetailButton :surveyId="data.id" />
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
