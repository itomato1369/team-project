import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useBoardStore = defineStore('board', () => {
  // state
  const boardList = ref([]);
  // getters
  // actions

  return { boardList };
});
