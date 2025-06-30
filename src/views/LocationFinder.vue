<template>
  <div class="location-finder-page">
    <div class="page-container">
      <h1 class="page-title">인근 지점 찾기</h1>
      <div class="content">
        <div class="search-section">
          <div class="search-controls">
            <div class="search-box">
              <select class="search-filter" name="searchFilter">
                <option value="가맹점명">가맹점명</option> 
                <option value="주소">주소</option>
                <option value="전화번호">전화번호</option>
              </select>
              <input 
                type="text" 
                v-model="searchQuery"
                placeholder="검색어 입력"
                class="search-input"
              />
              <button @click="searchLocations" class="search-button">검색</button>
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
                  <th>자치</th>
                  <th>종류</th>
                  <th>지점명</th>
                  <th>주소</th>
                  <th>전화번호</th>
                  <th>순무목</th>
                  <th>영업시간</th>
                  <th>위치</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="location in filteredLocations" :key="location.id">
                  <td>{{ location.district }}</td>
                  <td>{{ location.type }}</td>
                  <td class="location-name">{{ location.name }}</td>
                  <td class="address">{{ location.address }}</td>
                  <td class="phone">{{ location.phone }}</td>
                  <td>{{ location.category }}</td>
                  <td>{{ location.hours }}</td>
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
              <button @click="contactPartnership" class="partnership-button">협력점 문의하기</button>
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
    district: '강남구',
    type: '금매매소',
    name: '진정성 금거래소',
    address: '서울 강남구 테헤란로 123, 한국경제신문빌딩 5층',
    phone: '02-744-9999',
    category: '귀금속',
    hours: '평일 09:00-18:00'
  },
  {
    id: 2,
    district: '서초구',
    type: '금거래점',
    name: '황금마을',
    address: '서울 서초구 서초대로 456, 한국경제타워 3층',
    phone: '02-6203-9950',
    category: '귀금속',
    hours: '평일 09:00-18:00'
  },
  {
    id: 3,
    district: '강남구',
    type: '김현철',
    name: '서울 강남구 올림픽로 650, 1동 101-2층',
    address: '서울 강남구 올림픽로 650, 1동 101-2층',
    phone: '02-471-1202',
    category: '귀금속',
    hours: '평일 09:00-18:00'
  },
  {
    id: 4,
    district: '강남구',
    type: '강진자율회',
    name: '서울 강남구 선릉로 433, 마곡2지오타워',
    address: '서울 강남구 선릉로 433, 마곡2지오타워',
    phone: '02-3663-0008',
    category: '귀금속',
    hours: '평일 09:00-18:00'
  },
  {
    id: 5,
    district: '강남구',
    type: '고려아이투리금천점',
    name: '서울 강남구 영동대로 40, 1층',
    address: '서울 강남구 영동대로 40, 1층',
    phone: '02-3017-4878',
    category: '귀금속',
    hours: '평일 09:00-18:00'
  },
  {
    id: 6,
    district: '강남구',
    type: '금억의',
    name: '서울 강남구 남부순환로 2948, 1층 코트롬',
    address: '서울 강남구 남부순환로 2948, 1층 코트롬',
    phone: '02-878-7706',
    category: '귀금속',
    hours: '평일 09:00-18:00'
  },
  {
    id: 7,
    district: '강남구',
    type: '금헌의',
    name: '서울 강남구 서래동로 390, 1층 코트롬',
    address: '서울 강남구 서래동로 390, 1층 코트롬',
    phone: '02-807-7707',
    category: '귀금속',
    hours: '평일 09:00-18:00'
  },
  {
    id: 8,
    district: '강남구',
    type: '논현의',
    name: '서울 강남구 밤둥이로 514, 1층',
    address: '서울 강남구 밤둥이로 514, 1층',
    phone: '02-518-9993',
    category: '귀금속',
    hours: '평일 09:00-18:00'
  },
  {
    id: 9,
    district: '송파구',
    type: '금매매소',
    name: '송파골드센터',
    address: '서울 송파구 잠실대로 300, 롯데월드몰 B1층',
    phone: '02-415-7777',
    category: '귀금속',
    hours: '평일 10:00-21:00'
  },
  {
    id: 10,
    district: '마포구',
    type: '금거래점',
    name: '홍대금은방',
    address: '서울 마포구 홍대로 240, 홍대입구역 2번출구',
    phone: '02-324-8888',
    category: '귀금속',
    hours: '평일 09:00-19:00'
  },
  {
    id: 11,
    district: '종로구',
    type: '전통금은방',
    name: '인사동 전통금은방',
    address: '서울 종로구 인사동길 62, 전통문화의거리',
    phone: '02-736-5555',
    category: '귀금속',
    hours: '평일 09:00-18:00'
  },
  {
    id: 12,
    district: '중구',
    type: '금매매소',
    name: '명동골드타워',
    address: '서울 중구 명동길 78, 명동지하상가 A구역',
    phone: '02-778-9999',
    category: '귀금속',
    hours: '평일 09:30-19:30'
  },
  {
    id: 13,
    district: '영등포구',
    type: '금거래점',
    name: '여의도 골드플라자',
    address: '서울 영등포구 여의대로 108, IFC몰 B2층',
    phone: '02-782-6666',
    category: '귀금속',
    hours: '평일 10:00-20:00'
  },
  {
    id: 14,
    district: '용산구',
    type: '금매매소',
    name: '용산전자상가 금은방',
    address: '서울 용산구 한강대로 23길 55, 용산전자상가 3층',
    phone: '02-792-4444',
    category: '귀금속',
    hours: '평일 09:00-18:00'
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
    filtered = filtered.filter(location => 
      location.name.includes(searchQuery.value) || 
      location.address.includes(searchQuery.value) ||
      location.district.includes(searchQuery.value)
    )
  }
  
  return filtered
})

const selectRegion = (regionValue) => {
  selectedRegion.value = regionValue
}

const searchLocations = () => {
  let sel = document.querySelector("select[name=searchFilter]")
  const selectedFilter = sel.options[sel.selectedIndex].value;  
  console.log('검색:', selectedFilter, searchQuery.value)
}

const showMap = (location) => {
  console.log('지도 보기:', location.name)
  // 여기에 지도 표시 로직 추가
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
  min-width: 180px;
}
.search-button {
  padding: 0.75rem 1.5rem;
  background: #666;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: background-color 0.2s ease;
}
.search-button:hover {
  background: #555;
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
}

.locations-table th:nth-child(1) { width: 8%; }    /* 지역역 */
.locations-table th:nth-child(3) { width: 18%; }   /* 지점명 */
.locations-table th:nth-child(4) { width: 35%; }   /* 주소 */
.locations-table th:nth-child(5) { width: 12%; }   /* 전화번호 */
.locations-table th:nth-child(6) { width: 7%; }    /* 순도 분석기 */
.locations-table th:nth-child(7) { width: 13%; }   /* 영업시간 */
.locations-table th:nth-child(8) { width: 6%; }    /* 위치 */

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
  text-align: left !important;
}

.address {
  text-align: left !important;
  max-width: 300px;
  word-break: break-all;
  line-height: 1.3;
}

.phone {
  color: #666;
  font-family: monospace;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.partnership-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .content {
    padding: 1rem;
  }
  
  .search-controls {
    gap: 1rem;
  }
  
  .region-buttons {
    justify-content: center;
  }
  
  .region-button {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
  
  .search-box {
    max-width: none;
  }
  
  .locations-table {
    font-size: 0.8rem;
  }
  
  .locations-table th,
  .locations-table td {
    padding: 0.5rem 0.25rem;
  }
  
  .address {
    max-width: none;
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