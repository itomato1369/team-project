<script setup>
import { ref, defineProps } from 'vue';
import SupportList from '@/components/staff/SupportList.vue';
import StaffSupportResultList from '@/components/staff/StaffSupportResultList.vue';
import Button from 'primevue/button';
import StaffUserSurveyDetail from '@/components/staff/staffUserSurveyDetail.vue'; // staffUserSurveyDetail 컴포넌트 import

// --- State ---
const activeTab = ref('0');
// onOpenSurveyList: 모달을 열고 데이터를 불러오는 함수 (Survey.vue에서 전달)
// selectedSurveyNo: 현재 SelectCategory.vue에 표시할 조사지 번호 (Survey.vue에서 전달)
const props = defineProps(['ward-id', 'onOpenSurveyList', 'selectedSurveyNo']);

console.log(props);
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
                @click="onOpenSurveyList"
              />
            </div>

            <!-- Detail View Area -->
            <div class="border rounded-md">
              <StaffUserSurveyDetail v-if="props.selectedSurveyNo" :survey_no="props.selectedSurveyNo" />
              <div v-else class="text-center text-gray-500 p-8">
                <p>조사지 목록 보기 버튼을 클릭하여 관련 조사지를 선택하세요.</p>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel value="1" class="p-4">
          <SupportList :ward-id="wardId" :selected-survey-no="selectedSurveyNo" />
        </TabPanel>
        <TabPanel value="2">
          <StaffSupportResultList :ward-id="wardId" :selected-survey-no="selectedSurveyNo" />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>
