<script setup>
import ApplicantInfo from '@/components/staff/ApplicantInfo.vue';
import SelectCategory from '@/components/staff/SelectCategory.vue';
import AppReportRegistration from '@/components/staff/AppReportRegistration.vue';
import { defineProps, ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  surveyNo: { type: Number, required: true },
});

const survey = ref(null); // ⭐ 응답 통째로 저장
const wardId = ref(null); // ⭐ 피보호자번호만 따로 저장

onMounted(async () => {
  try {
    const res = await axios.get(`/api/staff/${props.surveyNo}`);
    console.log('DB 응답 전체:', res.data);

    const wardData = res.data.result && res.data.result.length > 0 ? res.data.result[0] : null;

    if (wardData) {
      survey.value = wardData;
      wardId.value = wardData['피보호자번호']; // ⭐ 대괄호 표기법
    } else {
      console.error('조회된 피보호자 데이터가 없습니다.');
    }
  } catch (err) {
    console.error('Survey 상세 조회 오류:', err);
  }
});
</script>

<template>
  <div class="flex flex-col md:flex-row w-full min-h-screen gap-4 p-4">
    <div
      class="w-full md:w-1/2 flex flex-col gap-4"
      style="max-height: calc(100vh - 2rem); overflow-y: auto"
    >
      <!-- ⭐ applicant-data 로 Survey.vue 전체 정보 전달 -->
      <ApplicantInfo :ward-id="wardId" :applicant-data="survey" />
      <SelectCategory :ward-id="wardId" />
    </div>

    <div
      class="w-full md:w-1/2 flex flex-col"
      style="max-height: calc(100vh - 2rem); overflow-y: auto"
    >
      <AppReportRegistration :ward-id="wardId" class="flex-1" />
    </div>
  </div>
</template>
