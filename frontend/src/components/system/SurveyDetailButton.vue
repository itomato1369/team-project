<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  surveyId: {
    type: [String, Number],
    required: true,
  },
});

const router = useRouter();

const goToDetail = () => {
  if (!props.surveyId) {
    console.error('Survey ID가 제공되지 않았습니다.');
    return;
  }

  // 👇 [수정] 경로(path) 대신 이름(name)을 사용합니다.
  // 이렇게 하면 라우터가 'base' 경로를 알아서 계산해서
  // 정확한 URL(/system/survey/detail/1)을 만들어 줍니다.
  router.push({
    name: 'SurveyDetail', // 👈 1번에서 확인한 라우트 name
    params: { id: props.surveyId }, // 👈 동적 파라미터 전달
  });
};
</script>

<template>
  <Button
    label="상세보기"
    icon="pi pi-search"
    @click="goToDetail"
    class="p-button-text p-button-secondary p-button-sm"
  />
</template>
