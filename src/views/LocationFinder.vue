<template>
  <div class="location-finder-page">
    <div class="page-container">
      <h1 class="text-3xl font-semibold text-center mb-8 text-secondary">인근 지점 찾기</h1>
      <div class="content">
        <div class="search-section">
          <div class="search-controls">
            <div class="search-box">
              <select v-model="searchFilter" class="search-filter" name="searchFilter">
                <option value="협력점명">협력점명</option> 
                <option value="주소">주소</option>
                <option value="전화번호">전화번호</option>
              </select>
              <input 
                type="text" 
                v-model="searchQuery"
                placeholder="검색어 입력"
                class="search-input"
                @input="handleSearchInput"
              />
            </div>
            <div class="region-buttons">
              <button 
                v-for="region in regions" 
                :key="region.value"
                @click="selectRegion(region.value)"
                :class="['region-button', { active: selectedRegion === region.value }]"
              >
                {{ region.label }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- 로딩 상태 -->
        <div v-if="loading" class="loading-section">
          <div class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p class="mt-4 text-gray-600">지점 정보를 불러오는 중...</p>
          </div>
        </div>
        
        <!-- 오류 상태 -->
        <div v-else-if="error" class="error-section">
          <div class="text-center py-12">
            <div class="text-red-600 mb-4">
              <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">데이터 로드 실패</h3>
            <p class="text-gray-600 mb-4">{{ error }}</p>
            <button @click="loadLocations" class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
              다시 시도
            </button>
          </div>
        </div>
        
        <div v-else class="table-section">
          <h2 class="section-title">검색결과</h2>
          <div class="table-container" v-if="locations.length > 0">
            <table class="locations-table">
              <thead>
                <tr>
                  <th>지역</th>
                  <th>협력점명</th>
                  <th>주소</th>
                  <th>전화번호</th>
                  <th>문의하기</th>
                  <th>약도보기</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="location in locations" :key="location.id">
                  <td>{{ location.district }}</td>
                  <td class="location-name">{{ location.name }}</td>
                  <td class="address">
                    <div>
                      {{ location.address }}
                      <span v-if="location.detailAddress" class="detail-address">
                        ({{ location.detailAddress }})
                      </span>
                    </div>
                  </td>
                  <td class="phone">
                    <!-- PC에서 보이는 일반 텍스트 -->
                    <span class="phone-text">{{ location.phone }}</span>
                    <!-- 모바일에서 보이는 전화연결 버튼 -->
                    <a :href="`tel:${location.phone}`" class="phone-button">
                      {{ location.phone }}
                    </a>
                  </td>
                  <td> 
                    <button v-if="location.kakaoChannel" @click="openKakaoChannel(location.kakaoChannel)" class="talk-button">
                      <span class="talk-text">톡채널</span> 
                    </button>
                    <span v-else class="no-channel">-</span>
                  </td>
                  <td>
                    <button @click="showMap(location)" class="map-button">MAP</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="no-results" v-else>
            <div class="no-results-content">
              <h3 class="no-results-title">현재 지점이 없습니다.</h3>
              <p class="no-results-text">선택하신 지역에는 아직 지점이 없습니다.<br>협력점 개설에 관심이 있으시다면 아래 버튼을 클릭해주세요.</p>
              <button @click="contactPartnership" class="partnership-button">
                <span>협력점 문의하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { jinjungsungService } from '@/services/jinjungsungService.js'

const router = useRouter()

// 반응형 변수들
const searchQuery = ref('')
const selectedRegion = ref('')
const searchFilter = ref('협력점명')
const loading = ref(false)
const error = ref('')

// 검색 입력 디바운스용 타이머
let searchTimer = null

// 지역 목록
const regions = ref([
  { value: '', label: '전체' },
  { value: '본점', label: '본점' },
  { value: '서울강남', label: '서울강남' },
  { value: '서울강북', label: '서울강북' },
  { value: '경기남부', label: '경기남부' },
  { value: '경기북부', label: '경기북부' },
  { value: '인천', label: '인천' },
  { value: '부산', label: '부산' },
  { value: '울산', label: '울산' },
  { value: '경상남도', label: '경상남도' },
  { value: '경상북도', label: '경상북도' },
  { value: '대구', label: '대구' },
  { value: '대전', label: '대전' },
  { value: '세종', label: '세종' },
  { value: '충청남도', label: '충청남도' },
  { value: '충청북도', label: '충청북도' },
  { value: '전라남도', label: '전라남도' },
  { value: '전라북도', label: '전라북도' },
  { value: '광주', label: '광주' },
  { value: '강원도', label: '강원도' },
  { value: '제주', label: '제주' },
])

// 지점 데이터
const locations = ref([])

// 지점 데이터 로드
const loadLocations = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const params = {
      searchQuery: searchQuery.value,
      searchFilter: searchFilter.value,
      district: selectedRegion.value,
      activeOnly: true
    }
    
    const response = await jinjungsungService.getPublicLocations(params)
    locations.value = response.locations || response || []
    
  } catch (err) {
    console.error('지점 데이터 로드 실패:', err)
    error.value = err.message || '지점 데이터를 불러오는 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
}

// 검색 입력 처리 (디바운스)
const handleSearchInput = () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  
  searchTimer = setTimeout(() => {
    loadLocations()
  }, 300) // 300ms 딜레이
}

// 지역 선택
const selectRegion = (regionValue) => {
  selectedRegion.value = regionValue
  loadLocations()
}

// 카카오톡 채널 열기
const openKakaoChannel = (channelUrl) => {
  if (channelUrl) {
    window.open(channelUrl, '_blank')
  }
}

// 카카오맵 열기
const showMap = (location) => {
  const address = location.address + (location.detailAddress ? ` ${location.detailAddress}` : '')
  const mapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(address)}`
  window.open(mapUrl, '_blank')
}

// 협력점 문의하기
const contactPartnership = () => {
  router.push('/partnership')
}

// 검색 필터 변경 감지
watch(searchFilter, () => {
  if (searchQuery.value) {
    loadLocations()
  }
})

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  loadLocations()
})
</script>

<style scoped>
.location-finder-page {
  min-height: 100vh;
  padding: 2rem 0;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.search-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-box {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-filter {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  font-size: 1rem;
  min-width: 120px;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #6b7280;
  box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.1);
}

.region-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
}

.region-button {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.region-button:hover {
  background: #f3f4f6;
}

.region-button.active {
  background: #374151;
  color: white;
  border-color: #374151;
}

.table-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.section-title {
  padding: 1.5rem 2rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.table-container {
  overflow-x: auto;
}

.locations-table {
  width: 100%;
  font-size: 0.875rem;
}

.locations-table th {
  background: #f9fafb;
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.locations-table td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #f3f4f6;
}

.location-name {
  font-weight: 600;
  color: #374151;
}

.address {
  text-align: left;
  max-width: 300px;
}

.detail-address {
  color: #6b7280;
  font-size: 0.8rem;
}

.phone {
  position: relative;
}

.phone-text {
  display: inline;
}

.phone-button {
  display: none;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.phone-button:hover {
  text-decoration: underline;
}

.talk-button {
  background: #fee500;
  color: #3c1e1e;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.talk-button:hover {
  background: #fdd500;
}

.no-channel {
  color: #9ca3af;
  font-size: 0.875rem;
}

.map-button {
  background: #374151;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.map-button:hover {
  background: #4b5563;
}

.no-results {
  padding: 4rem 2rem;
  text-align: center;
}

.no-results-content {
  max-width: 500px;
  margin: 0 auto;
}

.no-results-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.no-results-text {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.partnership-button {
  background: #059669;
  color: white;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.partnership-button:hover {
  background: #047857;
}

.loading-section, .error-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 모바일 최적화 */
@media (max-width: 768px) {
  .search-box {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-filter {
    min-width: auto;
  }
  
  .region-buttons {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
  
  .locations-table {
    font-size: 0.75rem;
  }
  
  .locations-table th,
  .locations-table td {
    padding: 0.5rem;
  }
  
  .address {
    max-width: 200px;
  }
  
  /* 모바일에서 전화번호 버튼 표시 */
  .phone-text {
    display: none;
  }
  
  .phone-button {
    display: inline;
  }
}
</style> 