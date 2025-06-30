import axios from 'axios'

// 환경에 따른 API 기본 URL 설정
const getApiBaseUrl = () => {
  // 개발 환경에서는 Vite 프록시 사용
  if (import.meta.env.DEV) {
    return '/api/jjs-gold'
  }
  // 프로덕션 환경에서는 실제 서버 URL 사용
  return import.meta.env.VITE_API_BASE_URL || 'http://211.170.168.146:9000/jjs-gold'
}

const API_BASE_URL = getApiBaseUrl()

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    console.log('API 요청:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('API 요청 오류:', error)
    return Promise.reject(error)
  }
)

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    console.log('API 응답:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('API 응답 오류:', error.response?.status, error.response?.data)
    
    // 공통 에러 처리
    if (error.response?.status === 401) {
      console.error('인증 오류: 관리자 권한이 필요합니다.')
    } else if (error.response?.status === 404) {
      console.error('요청한 리소스를 찾을 수 없습니다.')
    } else if (error.response?.status >= 500) {
      console.error('서버 오류가 발생했습니다.')
    }
    
    return Promise.reject(error)
  }
)

// API 기본 URL 내보내기 (이미지 URL 생성 등에 사용)
export { API_BASE_URL }
export default api 