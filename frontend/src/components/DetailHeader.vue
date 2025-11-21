<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    default: 'OOO',
  },
  userType: {
    type: String,
    default: '보호자',
  },
  status: {
    type: String,
    default: 'approved',
  },
});

const router = useRouter();

const statusText = computed(() => {
  return props.status === 'approved' ? '승인완료' : '승인대기';
});

const statusClass = computed(() => {
  return `status-${props.status}`;
});

const goToMain = () => {
  router.push('/');
};
</script>
<template>
  <div class="detail-header">
    <div class="title-area">
      <h1>{{ title }}</h1>
      <div class="user-info">
        <span>{{ userName }} ({{ userType }})</span>
        <span class="status" :class="statusClass">{{ statusText }}</span>
      </div>
    </div>
    <Button label="메인 페이지로" icon="pi pi-arrow-right" icon-pos="right" @click="goToMain" />
  </div>
</template>
<style scoped>
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 2rem;
}

.title-area {
  display: flex;
  flex-direction: column;
}

h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.user-info span {
  font-size: 0.9rem;
  color: #6c757d;
}

.status {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-weight: bold;
  font-size: 0.8rem;
}

.status-approved {
  background-color: #28a745;
  color: white;
}

.status-pending {
  background-color: #ffc107;
  color: black;
}
</style>
