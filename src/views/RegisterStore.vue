<template>
  <!-- 비밀번호 인증 모달 -->
  <div v-if="!isAuthenticated" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">관리자 인증</h2>
        <p class="text-gray-600">지점 등록 관리 페이지에 접근하려면<br>비밀번호를 입력해주세요.</p>
      </div>
      
      <div class="mb-6">
        <label for="adminPassword" class="block text-sm font-medium text-gray-700 mb-2">관리자 비밀번호</label>
        <input 
          id="adminPassword"
          v-model="passwordInput"
          type="password"
          @keyup.enter="checkPassword"
          placeholder="비밀번호를 입력하세요"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-400"
          autofocus
        />
        <p v-if="passwordError" class="text-red-500 text-sm mt-2">{{ passwordError }}</p>
      </div>
      
      <div class="flex gap-3">
        <button 
          @click="goBack"
          class="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
        >
          돌아가기
        </button>
        <button 
          @click="checkPassword"
          class="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          확인
        </button>
      </div>
    </div>
  </div>

  <!-- 메인 페이지 컨텐츠 (인증 후에만 표시) -->
  <div v-else class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 py-10">
        <!-- 관리자 페이지 헤더 -->
        <div class="flex items-center justify-between mb-10">
            <h1 class="text-3xl font-bold text-gray-800">지점 등록 관리</h1>
            <div class="flex items-center gap-4">
                <span class="text-sm text-gray-600 bg-green-100 px-3 py-1 rounded-full">관리자 모드</span>
                <button 
                    @click="logout"
                    class="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                    로그아웃
                </button>
            </div>
        </div>
        
        <!-- 검색 및 필터 섹션 -->
        <div class="search-section bg-white p-6 rounded-lg shadow-md mb-6">
          <div class="search-controls">
            <div class="search-box">
              <select v-model="searchFilter" class="search-filter">
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
                :class="['region-button', { active: selectedRegionFilter === region.value }]"
              >
                {{ region.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="flex flex-col md:flex-row gap-6">

            <!-- 지점 정보 입력 -->
            <div class="w-full md:w-2/5 bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg font-semibold text-gray-800"> 지점 정보 입력 </h2>
                    <button @click="registerStore" class="px-4 py-2 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 transition"> 등록하기 </button>
                </div>
                <div class="space-y-4">
                    <!-- 지역 표시 -->
                    <div v-if="formData.region">
                        <label class="block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap">지역</label>
                        <div class="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 text-gray-600 whitespace-nowrap">
                            {{ formData.region }}
                        </div>
                    </div>
                    
                                        <div>
                        <label for="name" class="block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap">협력점명 *</label>
                        <input id="name" v-model="formData.name" type="text" required
                         class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-400" />
                    </div>
                    <div>
                        <label for="address" class="block text-sm font-medium text-gray-700 mb-1  whitespace-nowrap">주소 *</label>
                        <div class="flex gap-2">
                            <input id="address" v-model="formData.address" type="text" required
                             class="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-400" />
                            <button @click="searchAddress" type="button" class="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition">
                                주소찾기
                            </button>
                        </div>
                        <p class="text-xs text-gray-500 mt-1">주소 입력 시 지역이 자동으로 설정됩니다</p>
                    </div>
                    <div>
                        <label for="detailAddress" class="block text-sm font-medium text-gray-700 mb-1">상세주소</label>
                        <input id="detailAddress" v-model="formData.detailAddress" type="text" 
                               placeholder="동, 호수, 층수 등 상세주소를 입력하세요"
                         class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-400" />
                        <p class="text-xs text-gray-500 mt-1">예: 101동 1502호, 3층, B1층 등</p>
                    </div>
                    <div>
                        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">전화번호 *</label>
                        <input id="phone" v-model="formData.phone" type="tel" required
                               @input="handlePhoneInput"
                               placeholder="010-1234-5678"
                         class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-400" />
                    </div>
                    <div>
                        <label for="kakaoChannel" class="block text-sm font-medium text-gray-700 mb-1">카카오톡 채널 링크</label>
                        <input id="kakaoChannel" v-model="formData.kakaoChannel" type="url" placeholder="https://pf.kakao.com/_example"
                         class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-400" />
                        <p class="text-xs text-gray-500 mt-1">카카오톡 채널 링크를 입력하세요 (선택사항)</p>
                    </div>
                </div>
            </div>

            <!-- 지점 테이블 -->
            <div class="w-full md:w-3/5 bg-white rounded-lg shadow-md overflow-hidden">
                <div class="table-header bg-gray-50 px-6 py-4 border-b">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-lg font-semibold text-gray-800">등록된 지점 목록</h2>
                            <p class="text-sm text-gray-600 mt-1">총 {{ totalCount }}개 지점</p>
                        </div>
                        <!-- 선택된 항목이 있을 때만 삭제 버튼 표시 -->
                        <div v-if="selectedLocationIds.length > 0" class="flex items-center gap-3">
                            <span class="text-sm text-gray-600">{{ selectedLocationIds.length }}개 선택됨</span>
                            <button 
                                @click="showDeleteModal = true"
                                class="delete-button"
                            >
                                선택 삭제
                            </button>
                        </div>
                    </div>
                </div>
                <div class="overflow-x-auto">
                <table class="min-w-full text-sm table-auto">
                <thead class="bg-gray-100 text-gray-700 text-center">
                    <tr>
                            <th class="px-4 py-3 w-12">
                                <input 
                                    type="checkbox" 
                                    v-model="selectAll"
                                    @change="toggleSelectAll"
                                    class="w-4 h-4"
                                />
                            </th>
                            <th class="px-4 py-3 w-1/12 cursor-pointer hover:bg-gray-200" @click="sortBy('district')">
                                지역 
                                <span v-if="sortField === 'district'" class="ml-1">
                                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                </span>
                            </th>
                            <th class="px-4 py-3 w-2/12 cursor-pointer hover:bg-gray-200" @click="sortBy('name')">
                                협력점명
                                <span v-if="sortField === 'name'" class="ml-1">
                                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                </span>
                            </th>
                        <th class="px-4 py-3 w-3/12">주소</th>
                        <th class="px-4 py-3 w-2/12">전화번호</th>
                        <th class="px-4 py-3 w-2/12">문의하기</th>
                        <th class="px-4 py-3 w-2/12">약도보기</th>
                    </tr>
                </thead>
                <tbody>
                        <tr v-for="location in paginatedLocations" :key="location.id" 
                            :class="{ 'bg-green-50 border-l-4 border-green-400': location.isNewlyAdded }">
                            <td class="px-4 py-3 text-center">
                                <input 
                                    type="checkbox" 
                                    v-model="selectedLocationIds"
                                    :value="location.id"
                                    class="w-4 h-4"
                                />
                            </td>
                            <td class="px-4 py-3 text-center">
                                <div class="flex items-center gap-2 flex-col whitespace-nowrap">
                                    {{ location.district }}
                                    <span v-if="location.isNewlyAdded" class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">NEW</span>
                                </div>
                            </td>
                        <td class="px-4 py-3 text-center">{{ location.name }}</td>
                        <td class="px-4 py-3 text-center font-medium text-gray-800">
                            <div>
                                {{ location.address }}
                                <span v-if="location.detailAddress" class="inline text-sm text-gray-600 ml-1">
                                    ({{ location.detailAddress }})
                                </span>
                            </div>
                        </td>
                        <td class="px-4 py-3 text-center break-words max-w-[300px] leading-snug">{{ location.phone }}</td>
                        <td class="px-4 py-3 text-center"> 
                                <button v-if="location.kakaoChannel" @click="openKakaoChannel(location.kakaoChannel)" 
                                        class="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-4 py-1 rounded-full shadow transition">
                                톡채널
                            </button>
                                <span v-else class="text-gray-400 text-sm">-</span>
                        </td>
                        <td class="px-4 py-3 text-center">
                                <button @click="showKakaoMap(location)" class="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1 rounded transition">
                                MAP
                            </button>
                        </td>
                    </tr>
                </tbody>
                </table>
                </div>
                
                <!-- 페이지네이션 -->
                <div class="pagination bg-gray-50 px-6 py-4 border-t">
                    <div class="flex items-center justify-between">
                        <div class="text-sm text-gray-500">
                            {{ startItem }}-{{ endItem }} / {{ totalCount }}개
                        </div>
                        <div class="flex gap-2">
                            <button 
                                @click="changePage(1)"
                                :disabled="currentPage === 1"
                                class="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
                            >
                                처음
                            </button>
                            <button 
                                @click="changePage(currentPage - 1)"
                                :disabled="currentPage === 1"
                                class="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
                            >
                                이전
                            </button>
                            <template v-for="page in visiblePages" :key="page">
                                <button 
                                    @click="changePage(page)"
                                    :class="[
                                        'px-3 py-1 text-sm border rounded',
                                        currentPage === page ? 'bg-gray-700 text-white' : 'hover:bg-gray-100'
                                    ]"
                                >
                                    {{ page }}
                                </button>
                            </template>
                            <button 
                                @click="changePage(currentPage + 1)"
                                :disabled="currentPage === totalPages"
                                class="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
                            >
                                다음
                            </button>
                            <button 
                                @click="changePage(totalPages)"
                                :disabled="currentPage === totalPages"
                                class="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
                            >
                                끝
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 삭제 확인 모달 -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-800">지점 삭제 확인</h3>
                        <button @click="showDeleteModal = false" class="text-gray-400 hover:text-gray-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="mb-6">
                        <p class="text-gray-600 mb-4">선택한 {{ selectedLocationIds.length }}개 지점을 삭제하시겠습니까?</p>
                        <div class="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                            <p class="text-sm font-medium text-gray-700 mb-2">삭제 대상 지점:</p>
                            <ul class="text-sm text-gray-600 space-y-1">
                                <li v-for="location in selectedLocations" :key="location.id">
                                    • {{ location.name }} ({{ location.district }})
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="flex gap-3 justify-end">
                        <button @click="showDeleteModal = false" class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                            취소
                        </button>
                        <button @click="deleteSelectedLocations" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                            삭제
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 인증 관련 변수들
const isAuthenticated = ref(false)
const passwordInput = ref('')
const passwordError = ref('')
const adminPassword = 'tnstngkswna1!' // 실제 운영 시에는 환경변수나 더 안전한 방식 사용

// 기본 폼 데이터
const formData = ref({
    region: '',
    name: '',
    address: '',
    detailAddress: '',
    phone: '',
    kakaoChannel: ''
})

// 검색 및 필터 변수들 (LocationFinder.vue 참고)
const searchQuery = ref('')
const searchFilter = ref('협력점명')
const selectedRegionFilter = ref('')

// 지역 목록 (LocationFinder.vue와 동일)
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
  { value: '제주', label: '제주' }
])

// 체크박스 관련 변수들
const selectedLocationIds = ref([])
const selectAll = ref(false)
const showDeleteModal = ref(false)

// 정렬 관련 변수들
const sortField = ref('created_at')
const sortOrder = ref('desc')

// 페이지네이션 관련 변수들
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalCount = ref(0)

// 지역 매칭 맵
const regionMap = {
    // 서울 강남구 및 인근 지역
    '강남구': '서울강남',
    '서초구': '서울강남',
    '송파구': '서울강남',
    '강동구': '서울강남',
    '양천구': '서울강남',
    '영등포구': '서울강남',
    '관악구': '서울강남',
    '금천구': '서울강남',
    '동작구': '서울강남',
    
    // 서울 강북 지역
    '강북구': '서울강북',
    '성북구': '서울강북',
    '동대문구': '서울강북',
    '중랑구': '서울강북',
    '노원구': '서울강북',
    '도봉구': '서울강북',
    '은평구': '서울강북',
    '서대문구': '서울강북',
    '마포구': '서울강북',
    '용산구': '서울강북',
    '중구': '서울강북',
    '종로구': '서울강북',
    '성동구': '서울강북',
    '광진구': '서울강북',
    
    // 경기 남부 (서울 남쪽)
    '수원시': '경기남부',
    '성남시': '경기남부',
    '용인시': '경기남부',
    '안양시': '경기남부',
    '안산시': '경기남부',
    '과천시': '경기남부',
    '광명시': '경기남부',
    '군포시': '경기남부',
    '의왕시': '경기남부',
    '화성시': '경기남부',
    '오산시': '경기남부',
    '평택시': '경기남부',
    '시흥시': '경기남부',
    '김포시': '경기남부',
    '부천시': '경기남부',
    '광주시': '경기남부',
    '하남시': '경기남부',
    '이천시': '경기남부',
    '안성시': '경기남부',
    '여주시': '경기남부',
    
    // 경기 북부 (서울 북쪽)
    '고양시': '경기북부',
    '파주시': '경기북부',
    '의정부시': '경기북부',
    '양주시': '경기북부',
    '동두천시': '경기북부',
    '연천군': '경기북부',
    '포천시': '경기북부',
    '가평군': '경기북부',
    '남양주시': '경기북부',
    '구리시': '경기북부',
    
    // 기타 광역시/도
    '인천': '인천',
    '부산': '부산',
    '울산': '울산',
    '대구': '대구',
    '대전': '대전',
    '세종': '세종',
    '광주': '광주',
    '충청남도': '충청남도',
    '충남': '충청남도',
    '충청북도': '충청북도',
    '충북': '충청북도',
    '전라남도': '전라남도',
    '전남': '전라남도',
    '전라북도': '전라북도',
    '전북': '전라북도',
    '경상남도': '경상남도',
    '경남': '경상남도',
    '경상북도': '경상북도',
    '경북': '경상북도',
    '강원도': '강원도',
    '강원': '강원도',
    '제주': '제주'
}

// 주소에서 지역 추출 함수
const extractRegionFromAddress = (address) => {
    if (!address) return ''
    
    // 주소를 공백으로 분할하여 각 부분을 검사
    const addressParts = address.split(' ')
    
    // 첫 번째로 시/도 정보 확인
    for (const part of addressParts) {
        // 광역시/특별시/도 확인
        if (part.includes('서울') || part.includes('서울특별시')) {
            // 서울의 경우 구를 확인하여 강남/강북 구분
            for (const addressPart of addressParts) {
                if (regionMap[addressPart]) {
                    return regionMap[addressPart]
                }
            }
            return '서울강남' // 기본값
        }
        
        if (part.includes('경기') || part.includes('경기도')) {
            // 경기도의 경우 시/군 확인
            for (const addressPart of addressParts) {
                if (regionMap[addressPart]) {
                    return regionMap[addressPart]
                }
            }
            return '경기남부' // 기본값
        }
        
        // 기타 광역시/도 직접 매칭
        if (regionMap[part]) {
            return regionMap[part]
        }
        
        // 시/군/구 단위로 매칭
        for (const [key, value] of Object.entries(regionMap)) {
            if (part.includes(key)) {
                return value
            }
        }
    }
    
    return ''
}

// 주소 변경 감지하여 자동 지역 설정
watch(() => formData.value.address, (newAddress) => {
    const detectedRegion = extractRegionFromAddress(newAddress)
    if (detectedRegion) {
        formData.value.region = detectedRegion
    } else {
        formData.value.region = ''
    }
})

// 전화번호 입력 처리 (숫자와 하이픈만 허용)
const handlePhoneInput = (event) => {
    // 숫자, 하이픈, 공백만 허용하고 나머지는 제거
    let value = event.target.value.replace(/[^\d\-\s]/g, '')
    
    // 자동 하이픈 추가 (예: 010-1234-5678)
    value = value.replace(/[^\d]/g, '') // 일단 숫자만 남기기
    
    if (value.length >= 3) {
        if (value.length <= 7) {
            value = value.slice(0, 3) + '-' + value.slice(3)
        } else {
            value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11)
        }
    }
    
    formData.value.phone = value
}

// 지점 목록 (예시 데이터)
const locations = ref([
    {
        id: 1,
        district: '본점',
        name: '진정성금은 본점',
        address: '서울특별시 강남구 테헤란로 123',
        detailAddress: '10층 1001호',
        phone: '02-1234-5678',
        kakaoChannel: 'https://pf.kakao.com/_example1',
        isNewlyAdded: false,
        created_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 2,
        district: '서울강남',
        name: '진정성금은 강남점',
        address: '서울특별시 강남구 역삼동 456',
        detailAddress: '2층',
        phone: '02-2345-6789',
        kakaoChannel: 'https://pf.kakao.com/_example2',
        isNewlyAdded: false,
        created_at: '2024-01-02T00:00:00Z'
    }
])

// 검색 및 필터링된 지점 목록
const filteredLocations = computed(() => {
    let filtered = locations.value
    
    // 지역 필터 적용
    if (selectedRegionFilter.value) {
        filtered = filtered.filter(location => 
            location.district === selectedRegionFilter.value
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
                           (location.detailAddress && location.detailAddress.toLowerCase().includes(query)) ||
                           location.phone.includes(query)
            }
        })
    }
    
    return filtered
})

// 정렬된 지점 목록
const sortedLocations = computed(() => {
    const sorted = [...filteredLocations.value]
    
    sorted.sort((a, b) => {
        let aValue = a[sortField.value]
        let bValue = b[sortField.value]
        
        // 문자열 비교
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            aValue = aValue.toLowerCase()
            bValue = bValue.toLowerCase()
        }
        
        if (sortOrder.value === 'asc') {
            return aValue > bValue ? 1 : -1
        } else {
            return aValue < bValue ? 1 : -1
        }
    })
    
    return sorted
})

// 페이지네이션 관련 computed 속성들
const totalPages = computed(() => {
    return Math.ceil(sortedLocations.value.length / itemsPerPage.value)
})

const paginatedLocations = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return sortedLocations.value.slice(start, end)
})

const startItem = computed(() => {
    return (currentPage.value - 1) * itemsPerPage.value + 1
})

const endItem = computed(() => {
    const end = currentPage.value * itemsPerPage.value
    return Math.min(end, sortedLocations.value.length)
})

const visiblePages = computed(() => {
    const pages = []
    const total = totalPages.value
    const current = currentPage.value
    
    let start = Math.max(1, current - 2)
    let end = Math.min(total, current + 2)
    
    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    
    return pages
})

// 선택된 지점 목록
const selectedLocations = computed(() => {
    return locations.value.filter(location => 
        selectedLocationIds.value.includes(location.id)
    )
})

// 실시간 검색 설정
watch([searchQuery, searchFilter], () => {
    currentPage.value = 1 // 검색 시 첫 페이지로 이동
    // 검색 변경 시 체크박스 선택 초기화
    selectedLocationIds.value = []
    selectAll.value = false
}, { deep: true })

// 지역 필터 변경 시 첫 페이지로 이동
watch(selectedRegionFilter, () => {
    currentPage.value = 1
    // 지역 필터 변경 시 체크박스 선택 초기화
    selectedLocationIds.value = []
    selectAll.value = false
})

// 총 개수 업데이트
watch(sortedLocations, (newLocations) => {
    totalCount.value = newLocations.length
}, { immediate: true })

// 지역 선택 함수
const selectRegion = (regionValue) => {
    selectedRegionFilter.value = regionValue
}

// 정렬 함수
const sortBy = (field) => {
    if (sortField.value === field) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortField.value = field
        sortOrder.value = 'asc'
    }
}

// 페이지 변경 함수
const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

// 전체 선택/해제 함수
const toggleSelectAll = () => {
    if (selectAll.value) {
        selectedLocationIds.value = paginatedLocations.value.map(location => location.id)
    } else {
        selectedLocationIds.value = []
    }
}

// 선택된 지점 삭제 함수
const deleteSelectedLocations = () => {
    const remainingLocations = locations.value.filter(location => 
        !selectedLocationIds.value.includes(location.id)
    )
    
    locations.value = remainingLocations
    selectedLocationIds.value = []
    selectAll.value = false
    showDeleteModal.value = false
    
    // 현재 페이지에 데이터가 없으면 이전 페이지로 이동
    if (paginatedLocations.value.length === 0 && currentPage.value > 1) {
        currentPage.value = currentPage.value - 1
    }
    
    alert(`선택된 지점이 삭제되었습니다.`)
}

// 다음 주소 API 스크립트 로드
const loadDaumPostcode = () => {
    return new Promise((resolve) => {
        if (window.daum && window.daum.Postcode) {
            resolve()
            return
        }
        const script = document.createElement('script')
        script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
        script.onload = resolve
        document.head.appendChild(script)
    })
}

// 주소 찾기 기능
const searchAddress = async () => {
    await loadDaumPostcode()
    
    new window.daum.Postcode({
        oncomplete: function(data) {
            let addr = ''
            let extraAddr = ''

            if (data.userSelectedType === 'R') {
                addr = data.roadAddress
            } else {
                addr = data.jibunAddress
            }

            if (data.userSelectedType === 'R') {
                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraAddr += data.bname
                }
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName)
                }
                if (extraAddr !== '') {
                    extraAddr = ' (' + extraAddr + ')'
                }
            }

            const fullAddress = addr + extraAddr
            formData.value.address = fullAddress
            // 지역은 watch에서 자동으로 설정됨
        }
    }).open()
}

// 지점 등록 기능
const registerStore = () => {
    if (!formData.value.region || !formData.value.name || !formData.value.address || !formData.value.phone) {
        alert('필수 항목을 모두 입력해주세요.')
        return
    }

    const newLocation = {
        id: locations.value.length + 1,
        district: formData.value.region,
        name: formData.value.name,
        address: formData.value.address,
        detailAddress: formData.value.detailAddress,
        phone: formData.value.phone,
        kakaoChannel: formData.value.kakaoChannel,
        isNewlyAdded: true,
        created_at: new Date().toISOString()
    }

    locations.value.push(newLocation)
    
    // 폼 초기화
    formData.value = {
        region: '',
        name: '',
        address: '',
        detailAddress: '',
        phone: '',
        kakaoChannel: ''
    }

    alert('지점이 성공적으로 등록되었습니다.')
}

// 카카오톡 채널 열기
const openKakaoChannel = (channelUrl) => {
    window.open(channelUrl, '_blank')
}

// 카카오맵 열기 (새 탭)
const showKakaoMap = (location) => {
    // 상세주소가 있으면 기본 주소와 함께 검색
    const fullAddress = location.address + (location.detailAddress ? ' ' + location.detailAddress : '')
    const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(fullAddress)}`
    window.open(kakaoMapUrl, '_blank')
}

// 인증 관련 함수들
const checkPassword = () => {
    if (passwordInput.value === adminPassword) {
        isAuthenticated.value = true
        passwordError.value = ''
        passwordInput.value = ''
        // 세션 스토리지에 인증 상태 저장
        sessionStorage.setItem('registerStore_authenticated', 'true')
    } else {
        passwordError.value = '잘못된 비밀번호입니다.'
        passwordInput.value = ''
    }
}

const logout = () => {
    isAuthenticated.value = false
    sessionStorage.removeItem('registerStore_authenticated')
    passwordError.value = ''
    passwordInput.value = ''
}

const goBack = () => {
    router.go(-1)
}

onMounted(() => {
    // 세션 스토리지에서 인증 상태 확인
    const authStatus = sessionStorage.getItem('registerStore_authenticated')
    if (authStatus === 'true') {
        isAuthenticated.value = true
    }
    
    // 컴포넌트 마운트 시 다음 주소 API 스크립트 미리 로드
    loadDaumPostcode()
})
</script>

<style scoped>
/* 검색 섹션 스타일 (LocationFinder.vue 참고) */
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

.search-filter {
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

.delete-button {
  padding: 0.5rem 1rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: background-color 0.2s ease;
}

.delete-button:hover {
  background: #b91c1c;
}

/* 지역 버튼 그리드 */
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

/* 테이블 헤더 스타일 */
.table-header {
  background: #f8f9fa;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
}

/* 페이지네이션 스타일 */
.pagination {
  background: #f8f9fa;
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
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
  
  .search-filter,
  .search-input,
  .delete-button {
    font-size: 0.75rem; 
    padding: 0.5rem 0.8rem;
  }
  
  .search-section {
    padding: 1rem;
  }
  
  .search-box {
    max-width: none;
  }
}
</style>