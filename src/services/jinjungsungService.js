import api, { API_BASE_URL } from './api.js'

/**
 * API 서비스 - FastAPI 백엔드에 맞춰 구성
 */
export const jinjungsungService = {
  
  // ========================================
  // 지역 관리 API
  // ========================================
  
  /**
   * 지역 목록 조회
   */
  async getRegions() {
    try {
      const response = await api.get('/regions')
      return response.data
    } catch (error) {
      console.error('지역 목록 조회 오류:', error)
      throw new Error(error.response?.data?.detail || '지역 목록을 불러오는 중 오류가 발생했습니다.')
    }
  },

  // ========================================
  // 지점 관리 API
  // ========================================
  
  /**
   * 지점 목록 조회
   * @param {Object} params - 조회 매개변수
   * @param {number} params.skip - 건너뛸 항목 수
   * @param {number} params.limit - 가져올 최대 항목 수
   * @param {string} params.searchQuery - 검색어
   * @param {string} params.searchFilter - 검색 필터
   * @param {string} params.district - 지역 필터
   */
  async getLocations(params = {}) {
    try {
      const queryParams = {
        skip: params.skip || 0,
        limit: params.limit || 100,
        search_query: params.searchQuery || null,
        search_filter: params.searchFilter || '가맹점명',
        district: params.district || null
      }

      // null 값 제거
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === null) {
          delete queryParams[key]
        }
      })

      const response = await api.get('/locations', { params: queryParams })
      return response.data
    } catch (error) {
      console.error('지점 목록 조회 오류:', error)
      throw new Error(error.response?.data?.detail || '지점 목록을 불러오는 중 오류가 발생했습니다.')
    }
  },

  /**
   * 지점 수 조회
   * @param {Object} params - 조회 매개변수
   */
  async getLocationsCount(params = {}) {
    try {
      const queryParams = {
        search_query: params.searchQuery || null,
        search_filter: params.searchFilter || '가맹점명',
        district: params.district || null
      }

      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === null) {
          delete queryParams[key]
        }
      })

      const response = await api.get('/locations/count', { params: queryParams })
      return response.data
    } catch (error) {
      console.error('지점 수 조회 오류:', error)
      throw new Error(error.response?.data?.detail || '지점 수를 조회하는 중 오류가 발생했습니다.')
    }
  },

  /**
   * 특정 지점 조회
   * @param {number} locationId - 지점 ID
   */
  async getLocation(locationId) {
    try {
      if (!locationId || locationId <= 0) {
        throw new Error('유효한 지점 ID가 필요합니다.')
      }

      const response = await api.get(`/locations/${locationId}`)
      return response.data
    } catch (error) {
      console.error('지점 조회 오류:', error)
      
      if (error.response?.status === 404) {
        throw new Error('해당 지점을 찾을 수 없습니다.')
      }
      
      throw new Error(error.response?.data?.detail || '지점을 조회하는 중 오류가 발생했습니다.')
    }
  },

  /**
   * 새 지점 등록
   * @param {Object} locationData - 지점 데이터
   */
  async createLocation(locationData) {
    try {
      const response = await api.post('/locations', locationData)
      return response.data
    } catch (error) {
      console.error('지점 등록 오류:', error)
      throw new Error(error.response?.data?.detail || '지점 등록 중 오류가 발생했습니다.')
    }
  },

  /**
   * 지점 정보 수정
   * @param {number} locationId - 지점 ID
   * @param {Object} locationData - 수정할 지점 데이터
   */
  async updateLocation(locationId, locationData) {
    try {
      if (!locationId || locationId <= 0) {
        throw new Error('유효한 지점 ID가 필요합니다.')
      }

      const response = await api.put(`/locations/${locationId}`, locationData)
      return response.data
    } catch (error) {
      console.error('지점 수정 오류:', error)
      
      if (error.response?.status === 404) {
        throw new Error('해당 지점을 찾을 수 없습니다.')
      }
      
      throw new Error(error.response?.data?.detail || '지점 수정 중 오류가 발생했습니다.')
    }
  },

  /**
   * 지점 삭제
   * @param {number} locationId - 지점 ID
   */
  async deleteLocation(locationId) {
    try {
      if (!locationId || locationId <= 0) {
        throw new Error('유효한 지점 ID가 필요합니다.')
      }

      const response = await api.delete(`/locations/${locationId}`)
      return response.data
    } catch (error) {
      console.error('지점 삭제 오류:', error)
      
      if (error.response?.status === 404) {
        throw new Error('해당 지점을 찾을 수 없습니다.')
      }
      
      throw new Error(error.response?.data?.detail || '지점 삭제 중 오류가 발생했습니다.')
    }
  },

  // ========================================
  // 금시세 API
  // ========================================
  
  /**
   * 오늘의 금속별 시세 정보
   */
  async getTodayPrices() {
    try {
      const response = await api.get('/gold/today-prices')
      return response.data
    } catch (error) {
      console.error('오늘의 시세 조회 오류:', error)
      throw new Error(error.response?.data?.detail || '오늘의 시세를 불러오는 중 오류가 발생했습니다.')
    }
  },

  /**
   * 시세 차트 데이터
   * @param {string} period - 조회 기간 (1W, 1M, 3M, 6M, 1Y)
   * @param {string} category - 금속 카테고리 (gold, silver, platinum, all)
   */
  async getChartData(period = '1M', category = 'all') {
    try {
      const response = await api.get('/gold/chart-data', {
        params: { period, category }
      })
      return response.data
    } catch (error) {
      console.error('차트 데이터 조회 오류:', error)
      throw new Error(error.response?.data?.detail || '차트 데이터를 불러오는 중 오류가 발생했습니다.')
    }
  },

  /**
   * 실시간 시세 정보
   * @param {string} category - 금속 카테고리 (gold, silver, platinum, all)
   */
  async getRealtimePrices(category = 'all') {
    try {
      const response = await api.get('/gold/realtime-prices', {
        params: { category }
      })
      return response.data
    } catch (error) {
      console.error('실시간 시세 조회 오류:', error)
      throw new Error(error.response?.data?.detail || '실시간 시세를 불러오는 중 오류가 발생했습니다.')
    }
  },

  /**
   * 시세 이력 조회
   * @param {string} metalType - 금속 타입 (gold_24k, gold_18k, gold_14k, silver, platinum)
   * @param {string} startDate - 시작 날짜 (YYYY-MM-DD)
   * @param {string} endDate - 종료 날짜 (YYYY-MM-DD)
   * @param {number} limit - 조회 개수 제한
   */
  async getPriceHistory(metalType, startDate = null, endDate = null, limit = 100) {
    try {
      const params = { metal_type: metalType, limit }
      if (startDate) params.start_date = startDate
      if (endDate) params.end_date = endDate

      const response = await api.get('/gold/price-history', { params })
      return response.data
    } catch (error) {
      console.error('시세 이력 조회 오류:', error)
      throw new Error(error.response?.data?.detail || '시세 이력을 불러오는 중 오류가 발생했습니다.')
    }
  },

  /**
   * 시장 상태 정보
   */
  async getMarketStatus() {
    try {
      const response = await api.get('/gold/market-status')
      return response.data
    } catch (error) {
      console.error('시장 상태 조회 오류:', error)
      throw new Error(error.response?.data?.detail || '시장 상태를 불러오는 중 오류가 발생했습니다.')
    }
  },

  // ========================================
  // 기타 유틸리티
  // ========================================

  /**
   * API 상태 확인
   * @returns {Promise<boolean>} API 서버 연결 상태
   */
  async checkApiHealth() {
    try {
      // 지역 목록 조회로 간단한 연결 확인
      await api.get('/regions', { timeout: 5000 })
      return true
    } catch (error) {
      // 404는 정상 (엔드포인트가 존재함)
      if (error.response?.status === 404 || error.response?.status === 405) {
        return true
      }
      console.error('API 연결 확인 실패:', error)
      return false
    }
  }
} 