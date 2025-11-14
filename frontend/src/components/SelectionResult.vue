<template>
  <div>
    <DetailHeader title="선발 결과 확인" />
    <div class="selection-result-container card">
      <div class="result-details">
        <div class="status-header">
          <h4>선발 결과</h4>
          <div class="status-pills">
            <span :class="['status-pill', { active: project.status === 'selected' }]">선정</span>
            <span :class="['status-pill', { active: project.status === 'rejected' }]">반려</span>
          </div>
        </div>
        <div class="result-body">
          <h5>사유</h5>
          <p>{{ project.reason }}</p>
          <h5 v-if="project.status === 'rejected'">반려 사유</h5>
          <p v-if="project.status === 'rejected'">{{ project.rejectionReason }}</p>
        </div>
      </div>
      <div class="actions">
        <Button label="목록으로 돌아가기" icon="pi pi-arrow-left" @click="$emit('back')" />
      </div>
    </div>
  </div>
</template>

<script setup>
import DetailHeader from './DetailHeader.vue';
import Button from 'primevue/button';

defineProps({
  project: {
    type: Object,
    required: true,
  },
});

defineEmits(['back']);
</script>

<style scoped>
.card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
}
.result-details {
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
}
.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  padding: 1rem 2rem;
  border-bottom: 1px solid #ddd;
}
.status-pills {
  display: flex;
  gap: 0.5rem;
}
.status-pill {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: #e9ecef;
  color: #adb5bd;
  font-weight: bold;
}
.status-pill.active {
  background-color: #007bff;
  color: white;
}
.result-body {
  padding: 2rem;
}
.result-body h5 {
  font-weight: bold;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
.actions {
  margin-top: 2rem;
  text-align: center;
}
</style>
