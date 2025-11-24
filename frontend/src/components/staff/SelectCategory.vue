<script setup>
import { ref, onMounted, defineProps } from 'vue';
import axios from 'axios';
import SurveyDetail from '@/components/SurveyDetail.vue';
import SupportList from '@/components/staff/SupportList.vue';
import StaffSupportResultList from '@/components/staff/StaffSupportResultList.vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

// --- State ---
const activeTab = ref('0');
const surveyList = ref([]);
const selectedInquiryId = ref(null);
const isModalVisible = ref(false);
const loading = ref(true);
const props = defineProps(['ward-id']);

console.log(props);
// --- Data Fetching ---
const fetchMyPageSurveys = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/api/user/my-page-surveys', {
      params: { writer: 'test' }, // Pass 'test' as a query parameter
    });
    surveyList.value = response.data.result;
  } catch (err) {
    console.error('Failed to fetch survey list:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchMyPageSurveys();
});

// --- Event Handlers ---
const openSurveyListModal = () => {
  isModalVisible.value = true;
};

const onRowSelect = (event) => {
  selectedInquiryId.value = event.data.inquiry_no;
  isModalVisible.value = false;
};
</script>

<template>
  <div class="card">
    <Tabs v-model:value="activeTab">
      <TabList>
        <Tab value="0">지원신청서</Tab>
        <Tab value="1">지원계획서</Tab>
        <Tab value="2">지원결과서</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0" class="p-4">
          <div class="flex flex-col gap-4">
            <!-- Button to open modal -->
            <div class="border-b pb-4 mb-4">
              <Button
                label="작성한 조사지 목록 보기"
                icon="pi pi-list"
                @click="openSurveyListModal"
              />
            </div>

            <!-- Detail View Area -->
            <div v-if="selectedInquiryId">
              <SurveyDetail :inquiry-id="selectedInquiryId" />
            </div>
            <div v-else class="text-center text-gray-500 p-8 border rounded-md">
              <p>조사지 목록 보기 버튼을 클릭하여 작성 또는 수정할 조사지를 선택하세요.</p>
            </div>
          </div>
        </TabPanel>
        <TabPanel value="1" class="p-4">
          <SupportList :ward-id="wardId" />
        </TabPanel>
        <TabPanel value="2">
          <StaffSupportResultList :ward-id="wardId" />
        </TabPanel>
      </TabPanels>
    </Tabs>

    <!-- Survey List Modal -->
    <Dialog header="조사지 목록" v-model:visible="isModalVisible" modal style="width: 50vw">
      <DataTable
        :value="surveyList"
        :loading="loading"
        selection-mode="single"
        @row-select="onRowSelect"
        data-key="inquiry_no"
        responsive-layout="scroll"
      >
        <Column field="content" header="조사지명"></Column>
        <Column field="created_at" header="작성일"></Column>
      </DataTable>
    </Dialog>
  </div>
</template>
