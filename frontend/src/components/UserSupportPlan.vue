<template>
  <div>
    <!-- <DetailHeader title="지원 계획 열람" /> -->
    <div class="support-plan-container card">
      <div class="plan-form">
        <h4>지원 계획 폼</h4>
        <div class="p-fluid">
          <div class="p-field">
            <label for="project-name">사업</label>
            <InputText id="project-name" :value="project.사업명" disabled />
          </div>
          <div class="p-field">
            <label for="content">내용</label>
            <Textarea id="content" :value="project.planContent" rows="5" disabled />
          </div>
          <div class="p-field">
            <label>첨부</label>
            <div class="attachments">
              <p v-for="file in project.attachments" :key="file">{{ file }}</p>
            </div>
          </div>
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
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

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
.plan-form {
  border: 1px solid #ddd;
  padding: 2rem;
  border-radius: 10px;
}
.p-field {
  margin-bottom: 1.5rem;
}
.attachments p {
  margin: 0;
  padding: 0.5rem 0;
}
.actions {
  margin-top: 2rem;
  text-align: center;
}
</style>
