import api, { API_BASE_URL } from './api.js'

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
   */
  async getLocations(params = {}) {
    try {
      const response = await api.get('/locations')
      // 백엔드 응답 구조: {"status":"success","data":[]}
      return {
        locations: response.data?.data || []
      }
    } catch (error) {
      console.error('지점 목록 조회 오류:', error)
      throw new Error(error.response?.data?.detail || '지점 목록을 불러오는 중 오류가 발생했습니다.')
    }
  },


  /**
   * 지점 등록
   * @param {Object} locationData - 지점 데이터
   */
  async registerLocation(locationData) {
    try {
      const response = await api.post('/register-store/locations', locationData)
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

      const response = await api.post('/register-store/locations/batch', locationIds)
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
   * 지역별 지점 수 조회 (LocationFinder 페이지용)
   * @param {boolean} activeOnly - 활성 지점만 조회
   */
  async getLocationCountByRegion(activeOnly = true) {
    try {
      const response = await api.get('/locations/count-by-region', {
        params: { active_only: activeOnly }
      })
      return response.data
    } catch (error) {
      console.error('지역별 지점 수 조회 오류:', error)
      throw new Error(error.response?.data?.detail || '지역별 지점 수를 조회하는 중 오류가 발생했습니다.')
    }
  },

  /**
   * 지점 상세 정보 조회 (공개용)
   * @param {number} locationId - 지점 ID
   */
  async getPublicLocationDetail(locationId) {
    try {
      if (!locationId || locationId <= 0) {
        throw new Error('유효한 지점 ID가 필요합니다.')
      }

      const response = await api.get(`/locations/${locationId}`)
      return response.data
    } catch (error) {
      console.error('지점 상세 정보 조회 오류:', error)
      
      if (error.response?.status === 404) {
        throw new Error('해당 지점을 찾을 수 없습니다.')
      }
      
      throw new Error(error.response?.data?.detail || '지점 정보를 조회하는 중 오류가 발생했습니다.')
    }
  },

  /**
   * 인근 지점 찾기 (위치 기반)
   * @param {number} latitude - 위도
   * @param {number} longitude - 경도
   * @param {number} radius - 반경 (km, 기본값: 10km)
   * @param {number} limit - 조회 개수 제한 (기본값: 10개)
   */
  async getNearbyLocations(latitude, longitude, radius = 10, limit = 10) {
    try {
      if (!latitude || !longitude) {
        throw new Error('위도와 경도 정보가 필요합니다.')
      }

      const response = await api.get('/locations/nearby', {
        params: { latitude, longitude, radius, limit }
      })
      return response.data
    } catch (error) {
      console.error('인근 지점 조회 오류:', error)
      throw new Error(error.response?.data?.detail || '인근 지점을 조회하는 중 오류가 발생했습니다.')
    }
  },

  // ========================================
  // RegisterStore 추가 API 함수들
  // ========================================

  /**
   * 지점 정보 수정 (RegisterStore용)
   * @param {number} locationId - 지점 ID
   * @param {Object} updateData - 수정할 데이터
   */
  async updateRegisterStoreLocation(locationId, updateData) {
    try {
      if (!locationId || locationId <= 0) {
        throw new Error('유효한 지점 ID가 필요합니다.')
      }

      const response = await api.put(`/register-store/locations/${locationId}`, updateData)
      return response.data
    } catch (error) {
      console.error('지점 정보 수정 오류:', error)
      
      if (error.response?.status === 404) {
        throw new Error('해당 지점을 찾을 수 없습니다.')
      }
      
      throw new Error(error.response?.data?.detail || '지점 정보 수정 중 오류가 발생했습니다.')
    }
  },

  /**
   * 지점 상태 변경 (활성/비활성)
   * @param {number} locationId - 지점 ID
   * @param {boolean} isActive - 활성 상태
   */
  async updateLocationStatus(locationId, isActive) {
    try {
      if (!locationId || locationId <= 0) {
        throw new Error('유효한 지점 ID가 필요합니다.')
      }

      const response = await api.patch(`/register-store/locations/${locationId}/status`, {
        is_active: isActive
      })
      return response.data
    } catch (error) {
      console.error('지점 상태 변경 오류:', error)
      
      if (error.response?.status === 404) {
        throw new Error('해당 지점을 찾을 수 없습니다.')
      }
      
      throw new Error(error.response?.data?.detail || '지점 상태 변경 중 오류가 발생했습니다.')
    }
  },

  /**
   * 지점 통계 정보 조회
   */
  async getLocationStatistics() {
    try {
      const response = await api.get('/register-store/locations/statistics')
      return response.data
    } catch (error) {
      console.error('지점 통계 조회 오류:', error)
      throw new Error(error.response?.data?.detail || '지점 통계를 조회하는 중 오류가 발생했습니다.')
    }
  },

  /**
   * 지점 검색 제안 (자동완성)
   * @param {string} query - 검색어
   * @param {string} type - 검색 타입 (name, address, district)
   * @param {number} limit - 조회 개수 제한
   */
  async getLocationSuggestions(query, type = 'name', limit = 5) {
    try {
      if (!query || query.trim().length < 2) {
        return []
      }

      const response = await api.get('/register-store/locations/suggestions', {
        params: { query: query.trim(), type, limit }
      })
      return response.data
    } catch (error) {
      console.error('지점 검색 제안 오류:', error)
      // 검색 제안은 실패해도 빈 배열 반환
      return []
    }
  },

  /**
   * 지점 데이터 내보내기 (Excel)
   * @param {Object} filters - 필터 조건
   */
  async exportLocationsData(filters = {}) {
    try {
      const queryParams = {
        search_query: filters.searchQuery || null,
        search_filter: filters.searchFilter || null,
        district: filters.district || null,
        sort_by: filters.sortBy || 'created_at',
        sort_order: filters.sortOrder || 'desc'
      }

      // null 값 제거
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === null) {
          delete queryParams[key]
        }
      })

      const response = await api.get('/register-store/locations/export', {
        params: queryParams,
        responseType: 'blob'
      })
      
      // Blob 데이터를 파일로 다운로드
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `지점목록_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      return true
    } catch (error) {
      console.error('지점 데이터 내보내기 오류:', error)
      throw new Error(error.response?.data?.detail || '지점 데이터 내보내기 중 오류가 발생했습니다.')
    }
  },

  // ========================================
  // 공통 지역 및 설정 API
  // ========================================

  /**
   * 지역 목록 조회 (계층적 구조)
   */
  async getRegionsHierarchy() {
    try {
      const response = await api.get('/regions/hierarchy')
      return response.data
    } catch (error) {
      console.error('계층적 지역 목록 조회 오류:', error)
      throw new Error(error.response?.data?.detail || '지역 목록을 불러오는 중 오류가 발생했습니다.')
    }
  },

  /**
   * 주소 검증 및 지역 자동 설정
   * @param {string} address - 주소
   */
  async validateAddress(address) {
    try {
      if (!address || address.trim().length < 5) {
        throw new Error('유효한 주소를 입력해주세요.')
      }

      const response = await api.post('/common/validate-address', {
        address: address.trim()
      })
      return response.data
    } catch (error) {
      console.error('주소 검증 오류:', error)
      throw new Error(error.response?.data?.detail || '주소 검증 중 오류가 발생했습니다.')
    }
  },

  /**
   * 카카오톡 채널 URL 유효성 검증
   * @param {string} channelUrl - 카카오톡 채널 URL
   */
  async validateKakaoChannel(channelUrl) {
    try {
      if (!channelUrl) {
        return { isValid: true, message: '' } // 선택사항이므로 빈 값도 유효
      }

      const response = await api.post('/common/validate-kakao-channel', {
        channel_url: channelUrl
      })
      return response.data
    } catch (error) {
      console.error('카카오톡 채널 URL 검증 오류:', error)
      return { 
        isValid: false, 
        message: error.response?.data?.detail || '카카오톡 채널 URL 검증 중 오류가 발생했습니다.' 
      }
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