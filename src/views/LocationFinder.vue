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
        
        <div class="table-section">
          <h2 class="section-title">검색결과</h2>
          <div class="table-container" v-if="filteredLocations.length > 0">
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
                <tr v-for="location in filteredLocations" :key="location.id">
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
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedRegion = ref('')
const searchFilter = ref('협력점명')

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

const locations = ref([
  {
    id: 1,
    district: '본점',
    name: '진정성금은 본점',
    address: '서울특별시 강남구 테헤란로 123',
    detailAddress: '10층 1001호',
    phone: '02-1234-5678',
    kakaoChannel: 'https://pf.kakao.com/_example1'
  },
  {
    id: 2,
    district: '서울강남',
    name: '진정성금은 강남점',
    address: '서울특별시 강남구 역삼동 456',
    detailAddress: '2층',
    phone: '02-2345-6789',
    kakaoChannel: 'https://pf.kakao.com/_example2'
  },
  {
    id: 3,
    district: '서울강남',
    name: '진정성금은 테헤란점',
    address: '서울특별시 강남구 테헤란로 789',
    detailAddress: '1층',
    phone: '02-3456-7890',
    kakaoChannel: 'https://pf.kakao.com/_example3'
  },
  {
    id: 4,
    district: '서울강남',
    name: '진정성금은 선릉점',
    address: '서울특별시 강남구 선릉로 433',
    detailAddress: '지하 1층',
    phone: '02-4567-8901',
    kakaoChannel: 'https://pf.kakao.com/_example4'
  },
  {
    id: 5,
    district: '서울강남',
    name: '진정성금은 압구정점',
    address: '서울특별시 강남구 압구정로 40',
    detailAddress: '3층',
    phone: '02-5678-9012',
    kakaoChannel: 'https://pf.kakao.com/_example5'
  },
  {
    id: 6,
    district: '서울강남',
    name: '진정성금은 잠실점',
    address: '서울특별시 송파구 잠실대로 300',
    detailAddress: 'B1층',
    phone: '02-6789-0123',
    kakaoChannel: 'https://pf.kakao.com/_example6'
  },
  {
    id: 7,
    district: '서울강북',
    name: '진정성금은 홍대점',
    address: '서울특별시 마포구 홍대로 240',
    detailAddress: '2층',
    phone: '02-7890-1234',
    kakaoChannel: 'https://pf.kakao.com/_example7'
  },
  {
    id: 8,
    district: '서울강북',
    name: '진정성금은 인사동점',
    address: '서울특별시 종로구 인사동길 62',
    detailAddress: '1층',
    phone: '02-8901-2345',
    kakaoChannel: 'https://pf.kakao.com/_example8'
  },
  {
    id: 9,
    district: '서울강북',
    name: '진정성금은 명동점',
    address: '서울특별시 중구 명동길 78',
    detailAddress: '지하 1층',
    phone: '02-9012-3456',
    kakaoChannel: 'https://pf.kakao.com/_example9'
  },
  {
    id: 10,
    district: '서울강북',
    name: '진정성금은 용산점',
    address: '서울특별시 용산구 한강대로 23길 55',
    detailAddress: '3층',
    phone: '02-0123-4567',
    kakaoChannel: 'https://pf.kakao.com/_example10'
  },
  {
    id: 11,
    district: '경기남부',
    name: '진정성금은 수원점',
    address: '경기도 수원시 영통구 중부대로 123',
    detailAddress: '1층',
    phone: '031-1234-5678',
    kakaoChannel: 'https://pf.kakao.com/_example11'
  },
  {
    id: 12,
    district: '경기남부',
    name: '진정성금은 성남점',
    address: '경기도 성남시 분당구 판교로 456',
    detailAddress: '2층',
    phone: '031-2345-6789',
    kakaoChannel: 'https://pf.kakao.com/_example12'
  },
  {
    id: 13,
    district: '경기북부',
    name: '진정성금은 고양점',
    address: '경기도 고양시 일산동구 중앙로 789',
    detailAddress: '1층',
    phone: '031-3456-7890',
    kakaoChannel: 'https://pf.kakao.com/_example13'
  },
  {
    id: 14,
    district: '인천',
    name: '진정성금은 인천점',
    address: '인천광역시 남동구 구월로 123',
    detailAddress: '3층',
    phone: '032-1234-5678',
    kakaoChannel: 'https://pf.kakao.com/_example14'
  },
  {
    id: 15,
    district: '부산',
    name: '진정성금은 부산점',
    address: '부산광역시 해운대구 해운대로 456',
    detailAddress: '1층',
    phone: '051-1234-5678',
    kakaoChannel: 'https://pf.kakao.com/_example15'
  }
])

const filteredLocations = computed(() => {
  let filtered = locations.value
  
  // 지역 필터 적용
  if (selectedRegion.value) {
    filtered = filtered.filter(location => 
      location.district.includes(selectedRegion.value)
    )
  }
  
  // 검색어 필터 적용
  if (searchQuery.value) {
    filtered = filtered.filter(location => {
      const query = searchQuery.value.toLowerCase()
      switch (searchFilter.value) {
        case '협력점명':
          return location.name.toLowerCase().includes(query)
        case '주소':
          return location.address.toLowerCase().includes(query) ||
                 (location.detailAddress && location.detailAddress.toLowerCase().includes(query))
        case '전화번호':
          return location.phone.includes(query)
        default:
          return location.name.toLowerCase().includes(query) || 
                 location.address.toLowerCase().includes(query) ||
                 location.district.toLowerCase().includes(query) ||
                 (location.detailAddress && location.detailAddress.toLowerCase().includes(query)) ||
                 location.phone.includes(query)
      }
    })
  }
  
  return filtered
})

const selectRegion = (regionValue) => {
  selectedRegion.value = regionValue
}



// 카카오톡 채널 열기
const openKakaoChannel = (channelUrl) => {
  window.open(channelUrl, '_blank')
}

// 카카오맵 열기 (상세주소 포함)
const showMap = (location) => {
  // 상세주소가 있으면 기본 주소와 함께 검색
  const fullAddress = location.address + (location.detailAddress ? ' ' + location.detailAddress : '')
  const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(fullAddress)}`
  window.open(kakaoMapUrl, '_blank')
}

const contactPartnership = () => {
  // 협력점 문의하기 로직 추가
  const confirmed = confirm('협력점 문의를 위해 고객센터로 연결하시겠습니까?\n\n📞 문의전화: 1588-0000\n📧 이메일: partnership@jjsgold.co.kr')
  
  if (confirmed) {
    // 실제 환경에서는 전화 연결 또는 문의 페이지로 이동
    window.open('tel:1588-0000')
  }
}
</script>

<style scoped>
.location-finder-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* 검색 섹션 */ 
.search-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.search-controls {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}
.search-box {
  display: flex;
  gap: 0.5rem;
  width: 100%; 
  max-width: 1000px;
  justify-content: center;
}
.search-filter{
  max-width: 120px; 
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px; 
  font-size: 0.9rem;
  background: white;
}
.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  min-width: 100px;
}


/*지역 버튼 그리드 */
.region-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.75rem;
  width: 100%;
  max-width: 1000px;
  justify-items: center;
}
.region-button {
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  color: #666;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
  min-width: 100px;
  text-align: center;
}
.region-button:hover {
  background: #e9ecef;
  border-color: #666;
}
.region-button.active {
  background: #666;
  color: white;
  border-color: #666;
}


/*검색 결과 테이블*/
.table-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}
.section-title {
  background: #f8f9fa;
  padding: 1rem 1.5rem;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #eee;
}
.table-container {
  overflow-x: auto;
}
.locations-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  table-layout: fixed;
  text-align: center;
}

.locations-table th:nth-child(1) { width: 8%; }    /* 지역 */
.locations-table th:nth-child(2) { width: 18%; }   /* 협력점명 */
.locations-table th:nth-child(3) { width: 35%; }   /* 주소 */
.locations-table th:nth-child(4) { width: 13%; }   /* 전화번호 */
.locations-table th:nth-child(5) { width: 13%; }    /* 문의하기 */
.locations-table th:nth-child(6) { width: 13%; }   /* 약도보기 */

.locations-table th {
  background: #f8f9fa;
  padding: 1rem 0.75rem;
  text-align: center;
  font-weight: 600;
  color: #555;
  border-bottom: 2px solid #eee;
  white-space: nowrap;
}

.locations-table td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid #f0f0f0;
  text-align: center;
  vertical-align: middle;
}

.locations-table tbody tr:hover {
  background-color: #f8f9fa;
}

.location-name {
  font-weight: 500;
  color: #333;
}

.address {
  max-width: 300px;
  word-break: break-all;
  line-height: 1.3;
}

.detail-address {
  display: inline;
  font-size: 0.8rem;
  color: #666;
  margin-left: 0.25rem;
  font-weight: normal;
}

.phone {
  color: #666;
  font-family: monospace;
}

/* PC에서는 텍스트만 보이고 버튼은 숨김 */
.phone-text {
  display: inline;
}

.phone-button {
  display: none;
  background: #007bff;
  color: white;
  text-decoration: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
  font-family: monospace;
}

.phone-button:hover {
  background: #0056b3;
}

.no-channel {
  color: #999;
  font-size: 0.9rem;
}

/* 톡상담 버튼 스타일 */
.talk-button {
  background: #FFD700;
  border: none;
  border-radius: 25px;
  gap: 6px;
  padding: 0.4rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  min-width: 80px;
  box-shadow: 0 2px 4px rgba(255, 215, 0, 0.3);
}
.talk-button:hover {
  background: #FFC107;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(255, 215, 0, 0.4);
}
.talk-text {
  color: #333;
  font-weight: 700;
  white-space: nowrap;
}

.map-button {
  background: #666;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
}
.map-button:hover {
  background: #555;
}

.no-results {
  padding: 4rem 2rem;
  text-align: center;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-results-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 500px;
}



.no-results-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.no-results-text {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
  text-align: center;
}

.partnership-button {
  padding: 1rem 2rem;
  background: linear-gradient(to right, #aa8b5d, #6b7280);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(170, 139, 93, 0.3);
  position: relative;
  overflow: hidden;
}

.partnership-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(170, 139, 93, 0.4);
}

.partnership-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, #6b7280, #aa8b5d);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.partnership-button:hover::before {
  opacity: 1;
}

.partnership-button span {
  position: relative;
  z-index: 2;
}

@media (max-width: 768px) {
  .content {
    padding: 1rem;
  }
  
  .search-controls {
    gap: 1rem;
  }
  
  .region-buttons {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.4rem;
    justify-content: center;
  }
  
  .region-button {
    padding: 0.5rem 0.3rem;
    font-size: 0.75rem;
    min-width: 100px;
  }
  
  .search-filter {
    font-size: 0.75rem; 
    padding: 0.5rem 0.8rem;
  }
  .search-section {
    padding: 1rem;
  }
  .search-box {
    max-width: none;
  }
  
  .locations-table {
    font-size: 0.75rem;
  }
  
  .locations-table th,
  .locations-table td {
    padding: 0.5rem 0.25rem;
  }
  
  .address {
    max-width: none;
  }

  .detail-address {
    font-size: 0.7rem;
    margin-left: 0.2rem;
  }

  /* 모바일에서는 텍스트 숨기고 버튼만 보임 */
  .phone-text {
    display: none;
  }

  .phone-button {
    display: inline-block;
    font-size: 0.7rem;
    padding: 0.3rem 0.6rem;
  }

  .talk-button {
    padding: 0.4rem 0.4rem;
    font-size: 0.7rem;
    min-width: 25px;
    gap: 0.1rem;
  }
  
  .talk-icon {
    width: 0.75rem;
    height: 0.75rem;
  }
  .talk-text {
    font-size: 0.75rem;
  }

  .map-button{
    font-size: 0.75rem;
    padding: 0.2rem 0.4rem;
  }
  
  .no-results {
    padding: 2rem 1rem;
    min-height: 300px;
  }
  
  .no-results-title {
    font-size: 1.2rem;
  }
  
  .no-results-text {
    font-size: 0.9rem;
  }
  
  .partnership-button {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style> 