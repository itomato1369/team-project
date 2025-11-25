import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const api = axios.create({
  timeout: 10000,
});

// --- 요청 인터셉터 (Request Interceptor) ---
// (변경 없음)
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.accessToken;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 응답 인터셉터 (Response Interceptor) ---
// (변경 없음 - authStore.refreshAccessToken()가 알아서 body로 전송)
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  /* ... (내용 생략) ... */
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();

    // 401 에러이고, 재시도한 요청이 아니며, 로그인 요청이 아닐 때만 토큰 갱신
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/api/auth/login'
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshSuccess = await authStore.refreshAccessToken();

        if (refreshSuccess) {
          processQueue(null);
          isRefreshing = false;
          return api(originalRequest);
        } else {
          const refreshError = new Error('Token refresh failed');
          processQueue(refreshError);
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      } catch (e) {
        processQueue(e);
        isRefreshing = false;
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

// API 서비스 객체

export const authApi = {
  /**
   * 소셜 로그인 후 추가 정보를 제출하여 가입을 완료합니다.
   * (POST /api/auth/complete-profile)
   */
  completeSocialSignup: (payload) => {
    return api.post('/api/auth/complete-profile', payload);
  },
};

// --- (사용자용) 예약 API ---
export const reservationApi = {
  /**
   * 나의 상담 내역을 조회합니다.
   * (GET /api/reservations/my)
   * @returns {Promise<AxiosResponse<any>>}
   */
  getMyReservations: () => {
    return api.get('/api/user/reservations/my');
  },

  /**
   * 특정 예약을 취소합니다.
   * (POST /api/reservations/cancel/:reservationId)
   * @param {number} reservationId - 취소할 예약 ID (res_no)
   * @returns {Promise<AxiosResponse<any>>}
   */
  cancelReservation: (reservationId) => {
    return api.post(`/api/user/reservations/cancel/${reservationId}`);
  },
};

export const userApi = {
  /**
   * 로그인된 사용자의 피보호자 목록을 조회합니다.
   * (GET /api/user/wards)
   */
  getMyWards: () => {
    return api.get('/api/user/wards');
  },
};

/**
 * 담당자 스케줄 관련 API
 */
export const staffScheduleApi = {
  /**
   * 담당자의 스케줄(상담가능, 예약건수)을 조회합니다.
   * (GET /api/staff/schedules)
   * @returns {Promise<AxiosResponse<any>>}
   */
  getSchedules: () => {
    return api.get('/api/staff/schedules');
  },

  /**
   * 담당자의 상담 가능 스케줄을 생성합니다.
   * (POST /api/staff/schedule/create)
   * @param {object} payload - { start_time, end_time, recurring_rules }
   * @returns {Promise<AxiosResponse<any>>}
   */
  createSchedule: (payload) => {
    return api.post('/api/staff/schedule/create', payload);
  },

  /**
   * 담당자의 상담 가능 스케줄을 삭제합니다.
   * (DELETE /api/staff/schedule/delete/:at_no)
   * @param {number} at_no - 삭제할 스케줄 ID
   * @returns {Promise<AxiosResponse<any>>}
   */
  deleteSchedule: (at_no) => {
    return api.delete(`/api/staff/schedule/delete/${at_no}`);
  },
};

// --- (담당자용) 예약 관리 API ---
/**
 * 담당자 예약 관리 관련 API (상담 예약 관리 페이지용)
 */
export const staffReservationApi = {
  /**
   * 담당자에게 배정된 예약 목록을 검색/조회합니다.
   * (GET /api/staff/reservations)
   * @param {object} params - { searchType, startDate, endDate, keyword }
   * @returns {Promise<AxiosResponse<any>>}
   */
  getReservations: (params) => {
    // params 예: { searchType: 'date', startDate: '2025-11-01', endDate: '2025-11-30' }
    // params 예: { searchType: 'applicant', keyword: '김민수' }
    return api.get('/api/staff/reservations', { params });
  },

  getTodaysCount: () => {
    return api.get('/api/staff/todays-count');
  },

  getNewReservationCount: () => {
    return api.get('/api/staff/reservations/new-count');
  },

  getPendingReportsCount: () => {
    return api.get('/api/staff/reservations/pending-count');
  },

  /**
   * 담당자가 예약을 취소시킵니다. (available_time의 at_no 기준)
   * (POST /api/staff/reservations/cancel/:at_no)
   * @param {number} at_no - 취소할 'available_time'의 ID
   * @returns {Promise<AxiosResponse<any>>}
   */
  cancelReservationByStaff: (at_no) => {
    // 요구사항 3: 담당자가 취소 시 at_no를 기준으로 '상담불가' 상태로 변경
    return api.post(`/api/staff/reservations/cancel/${at_no}`);
  },

  // (참고) '기록 작성'은 페이지 이동(location.href)으로 처리하거나,
  // 별도 API (예: /api/staff/records/create)를 호출할 수 있습니다.
};

// 4. [신규] 상담 일지 API (여기에 추가되었습니다)
export const consultLogApi = {
  /**
   * 상담 일지를 생성(등록)합니다.
   * (POST /api/counseling/logs)
   */
  createLog: (data) => {
    return api.post('/api/counseling/logs', data);
  },

  /**
   * 상담 일지를 임시저장합니다.
   * (POST /api/counseling/logs/draft)
   */
  saveDraft: (data) => {
    return api.post('/api/counseling/logs/draft', data);
  },

  /**
   * 피보호자(ward_id) 기준 조사지 목록 조회
   * (POST /api/counseling/surveys/${wardId})
   */
  getSurveysByWard: (wardNo) => {
    return api.get(`/api/counseling/surveys/${wardNo}`);
  },

  /**
   * 상담 일지 목록을 조회합니다.
   * (GET /api/counseling/logs)
   * @param {object} params
   */
  getLogs: (params) => {
    return api.get('/api/counseling/logs', { params });
  },

  /**
   * 상담 일지 상세 조회 (PDF 다운로드/보기 용)
   * (GET /api/counseling/logs/:logId)
   */
  getLogDetail: (consultNo) => {
    return api.get(`/api/counseling/logs/${consultNo}`);
  },

  /**
   * 상담 일지 수정
   * (PUT /api/counseling/logs/:consultNo)
   */
  updateLog: (consultNo, data) => {
    return api.put(`/api/counseling/logs/${consultNo}`, data);
  },
};

export default api;