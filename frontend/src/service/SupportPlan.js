import axios from 'axios';
export const SupportPlan = {
  getSupportPlan() {
    return axios.get('/api/qna/supportplan').then((res) => res.data);
  },
};
