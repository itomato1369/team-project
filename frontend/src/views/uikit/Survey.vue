<script setup>
// ref와 데이터들은 각 자식 컴포넌트로 이동했습니다.

/*
  '@' 별칭(alias)을 사용하여 'src' 폴더를 기준으로 하는
  절대 경로로 컴포넌트를 import 합니다.
*/
import ApplicantInfo from '@/components/staff/ApplicantInfo.vue';
import ApplicationPlanForm from '@/components/staff/ApplicationPlanForm.vue';
</script>

<template>
  <div class="flex flex-col md:flex-row gap-8 mt-8">
    <ApplicantInfo />
    <ApplicationPlanForm />
  </div>
</template>
