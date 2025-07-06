import api, { API_BASE_URL } from './api.js'

export const jinjungsungService = {
  // ========================================
  // 지점 관리 API
  // ========================================
  
  /**
   * 공개 지점 목록 조회 (LocationFinder 페이지용)
   */
  async getPublicLocations() {
    try {
      const response = await api.get('/locations')
      // 백엔드 응답 구조: {"status":"success","data":[]}
      return {
        locations: response.data?.data || []
      }
    } catch (error) {
      console.error('공개 지점 목록 조회 오류:', error)
      throw new Error(error.response?.data?.detail || '지점 목록을 불러오는 중 오류가 발생했습니다.')
    }
  },



  /**
   * 지점 등록
   * @param {Object} locationData - 지점 데이터
   */
  async registerLocation(locationData) {
    try {
      const response = await api.post('/locations/register', locationData)
      return response.data
    } catch (error) {
      console.error('지점 등록 오류:', error)
      throw new Error(error.response?.data?.detail || '지점 등록 중 오류가 발생했습니다.')
    }
  },

  /**
   * 선택된 지점들 삭제
   * @param {Array<number>} locationIds - 삭제할 지점 ID 배열
   */
  async deleteSelectedLocations(locationIds) {
    try {
      if (!Array.isArray(locationIds) || locationIds.length === 0) {
        throw new Error('삭제할 지점을 선택해주세요.')
      }

      const response = await api.post('/locations/delete', locationIds)
      return response.data
    } catch (error) {
      console.error('선택 지점 삭제 오류:', error)
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
  // LocationFinder 전용 API 함수들
  // ========================================


} 