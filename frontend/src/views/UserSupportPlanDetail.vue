<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Button from 'primevue/button';
// Removed InputText and Textarea as they are no longer directly used in the template for plan_content

const route = useRoute();
const router = useRouter();

const supportPlan = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchSupportPlanDetail = async () => {
  loading.value = true;
  error.value = null;
  try {
    const inquiry_no = route.params.inquiry_no;
    const ward_no = route.params.ward_no;

    const response = await axios.get(`/api/user/support-plan`, {
      params: { inquiry_no: inquiry_no, ward_no: ward_no },
    });
    if (response.data.result) {
      supportPlan.value = response.data.result;
    }
  } catch (err) {
    console.error('Failed to fetch support plan detail:', err);
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.go(-1); // Go back to the previous page
};

onMounted(() => {
  fetchSupportPlanDetail();
});
</script>

<template>
  <div>
    <div class="support-plan-container card">
      <div class="plan-form">
        <h4>지원 계획 상세</h4>
        <div v-if="loading" class="loading-message">로딩 중...</div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        <div v-else-if="supportPlan">
          <div v-if="supportPlan.support_plan_status === 'REJECTED'" class="rejected-message">
            <h1>반려되었습니다.</h1>
            <p>관리자에 의해 지원 계획이 반려되었습니다.</p>
          </div>
          <div v-else class="p-fluid">
            <div class="p-field">
              <h3>
                사업명: <strong>{{ supportPlan.business_name }}</strong>
              </h3>
            </div>
            <div class="p-field">
              <h3>
                승인 목표: <strong>{{ supportPlan.support_plan_goal }}</strong>
              </h3>
            </div>
            <div class="p-field">
              <h3>승인된 내용:</h3>
              <div class="plan-content-display p-3 border-round surface-100">
                {{ supportPlan.plan }}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-data-message">지원 계획을 찾을 수 없습니다.</div>
      </div>
      <div class="actions">
        <Button label="목록으로 돌아가기" icon="pi pi-arrow-left" @click="goBack" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow:
    0 2px 1px -1px rgba(0, 0, 0, 0.2),
    0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
}
.plan-form {
  border: 1px solid #ddd;
  padding: 2rem;
  border-radius: 10px;
}
.p-field {
  margin-bottom: 1.5rem;
}
.actions {
  margin-top: 2rem;
  text-align: center;
}
.loading-message,
.error-message,
.no-data-message {
  text-align: center;
  margin-top: 20px;
  font-size: 1.1rem;
  color: #555;
}
.error-message {
  color: #d32f2f;
}
h3 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #333;
}
strong {
  color: #007bff; /* A distinct color for values */
}

/* Styles for plan_content display */
.plan-content-display {
  background-color: var(--surface-50);
  border: 1px solid var(--surface-200);
  padding: 1.5rem;
  border-radius: 8px;
  font-size: 1.1rem;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
  margin-left: 0;
  margin-right: 0;
  width: 100%;
  box-sizing: border-box;
}

/* Styles for rejected message */
.rejected-message {
  text-align: center;
  padding: 3rem;
  background-color: #ffebee; /* Light red background */
  border: 2px solid #ef9a9a; /* Red border */
  border-radius: 10px;
  margin-top: 2rem;
}
.rejected-message h1 {
  color: #d32f2f; /* Darker red for heading */
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.rejected-message p {
  color: #e57373; /* Lighter red for paragraph */
  font-size: 1.2rem;
}
</style>
