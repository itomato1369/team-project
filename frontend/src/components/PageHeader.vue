<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    default: null,
  },
  userType: {
    type: String,
    default: '보호자',
  },
  status: {
    type: String,
    default: 'approved', // 'approved', 'pending', etc.
  },
});

const statusText = computed(() => {
  switch (props.status) {
    case 'approved':
      return '승인완료';
    case 'pending':
      return '승인대기';
    default:
      return '';
  }
});

const statusClass = computed(() => {
  return `status-${props.status}`;
});
</script>

<template>
  <div class="page-header">
    <div class="title-container">
      <h1>{{ title }}</h1>
      <div v-if="userName" class="user-info">
        <span>{{ userName }} ({{ userType }})</span>
        <span class="status" :class="statusClass">{{ statusText }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  background-color: #4a4a4a;
  color: white;
  padding: 1.5rem 2rem;
  border-radius: 10px 10px 0 0;
}

.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
}

.status {
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-weight: bold;
}

.status-approved {
  background-color: #4caf50; /* Green */
  color: white;
}

.status-pending {
  background-color: #ffc107; /* Amber */
  color: black;
}
</style>
