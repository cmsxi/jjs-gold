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
                @input="handleSearchInput"
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
                    <h2 class="text-lg font-semibold text-gray-800">지점 정보 입력</h2>
                    <button 
                        @click="registerStore" 
                        :disabled="isRegistering"
                        class="px-4 py-2 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 transition disabled:opacity-50"
                    >
                        {{ isRegistering ? '등록 중...' : '등록하기' }}
                    </button>
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
                        <label for="address" class="block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap">주소 *</label>
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
                               placeholder="전화번호 (예: 02-1234-5678, 010-1234-5678)"
                         class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-400" />
                        <p class="text-xs text-gray-500 mt-1">지역번호(02, 031 등), 휴대폰(010), 인터넷전화(070) 모두 입력 가능</p>
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
                
                <!-- 로딩 상태 -->
                <div v-if="loading" class="text-center py-12">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p class="mt-4 text-gray-600">데이터를 불러오는 중...</p>
                </div>
                
                <!-- 오류 상태 -->
                <div v-else-if="error" class="text-center py-12">
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
                
                <!-- 테이블 내용 -->
                <div v-else class="overflow-x-auto">
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
                        <button 
                            @click="deleteSelectedLocations" 
                            :disabled="isDeletingLocations"
                            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                        >
                            {{ isDeletingLocations ? '삭제 중...' : '삭제' }}
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
import { jinjungsungService } from '@/services/jinjungsungService.js'

const router = useRouter()

// 인증 관련 변수들
const isAuthenticated = ref(false)
const passwordInput = ref('')
const passwordError = ref('')
const adminPassword = 'tnstngkswna1!' // 실제 운영 시에는 환경변수나 더 안전한 방식 사용

// 로딩 상태
const loading = ref(false)
const error = ref('')
const isRegistering = ref(false)
const isDeletingLocations = ref(false)

// 기본 폼 데이터
const formData = ref({
    region: '',
    name: '',
    address: '',
    detailAddress: '',
    phone: '',
    kakaoChannel: ''
})

// 검색 및 필터 변수들
const searchQuery = ref('')
const searchFilter = ref('협력점명')
const selectedRegionFilter = ref('')

// 검색 입력 디바운스용 타이머
let searchTimer = null

// 지역 목록
const regions = ref([
  { value: '', label: '전체' },
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

// 지점 데이터 (모든 데이터)
const allLocations = ref([])

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
    
    const addressParts = address.split(' ')
    
    for (const part of addressParts) {
        if (part.includes('서울') || part.includes('서울특별시')) {
            for (const addressPart of addressParts) {
                if (regionMap[addressPart]) {
                    return regionMap[addressPart]
                }
            }
            return '서울강남'
        }
        
        if (part.includes('경기') || part.includes('경기도')) {
            for (const addressPart of addressParts) {
                if (regionMap[addressPart]) {
                    return regionMap[addressPart]
                }
            }
            return '경기남부'
        }
        
        if (regionMap[part]) {
            return regionMap[part]
        }
        
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

// 전화번호 입력 처리 (지역번호 포함)
const handlePhoneInput = (event) => {
    let value = event.target.value.replace(/[^\d\-\s]/g, '')
    value = value.replace(/[^\d]/g, '') // 숫자만 남기기
    
    if (value.length <= 3) {
        // 3자리 이하일 때는 그대로
        formData.value.phone = value
        return
    }
    
    // 02로 시작하는 서울 지역번호 (02-1234-5678)
    if (value.startsWith('02')) {
        if (value.length <= 2) {
            formData.value.phone = value
        } else if (value.length <= 6) {
            formData.value.phone = value.slice(0, 2) + '-' + value.slice(2)
        } else {
            formData.value.phone = value.slice(0, 2) + '-' + value.slice(2, 6) + '-' + value.slice(6, 10)
        }
    }
    // 010, 011, 016, 017, 018, 019 휴대폰 번호 (010-1234-5678)
    else if (value.startsWith('010') || value.startsWith('011') || value.startsWith('016') || 
             value.startsWith('017') || value.startsWith('018') || value.startsWith('019')) {
        if (value.length <= 3) {
            formData.value.phone = value
        } else if (value.length <= 7) {
            formData.value.phone = value.slice(0, 3) + '-' + value.slice(3)
        } else {
            formData.value.phone = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11)
        }
    }
    // 070 인터넷전화 (070-1234-5678)
    else if (value.startsWith('070')) {
        if (value.length <= 3) {
            formData.value.phone = value
        } else if (value.length <= 7) {
            formData.value.phone = value.slice(0, 3) + '-' + value.slice(3)
        } else {
            formData.value.phone = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11)
        }
    }
    // 031, 032, 041, 042, 043, 044, 051, 052, 053, 054, 055, 061, 062, 063, 064 지역번호 (031-123-4567)
    else if (value.startsWith('031') || value.startsWith('032') || value.startsWith('041') || 
             value.startsWith('042') || value.startsWith('043') || value.startsWith('044') ||
             value.startsWith('051') || value.startsWith('052') || value.startsWith('053') || 
             value.startsWith('054') || value.startsWith('055') || value.startsWith('061') || 
             value.startsWith('062') || value.startsWith('063') || value.startsWith('064')) {
        if (value.length <= 3) {
            formData.value.phone = value
        } else if (value.length <= 6) {
            formData.value.phone = value.slice(0, 3) + '-' + value.slice(3)
        } else {
            formData.value.phone = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10)
        }
    }
    // 080 무료전화 (080-123-4567)
    else if (value.startsWith('080')) {
        if (value.length <= 3) {
            formData.value.phone = value
        } else if (value.length <= 6) {
            formData.value.phone = value.slice(0, 3) + '-' + value.slice(3)
        } else {
            formData.value.phone = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10)
        }
    }
    // 기타 번호 (기본 3-4-4 포맷)
    else {
        if (value.length <= 3) {
            formData.value.phone = value
        } else if (value.length <= 7) {
            formData.value.phone = value.slice(0, 3) + '-' + value.slice(3)
        } else {
            formData.value.phone = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11)
        }
    }
}

// 지점 데이터 로드 (모든 데이터 한 번에 로드)
const loadLocations = async () => {
    try {
        loading.value = true
        error.value = ''
        
        // 모든 지점 데이터를 한 번에 가져오기
        const response = await jinjungsungService.getPublicLocations()
        allLocations.value = response.locations || response || []
        
        // 체크박스 선택 초기화
        selectedLocationIds.value = []
        selectAll.value = false
        
    } catch (err) {
        console.error('지점 데이터 로드 실패:', err)
        error.value = err.message || '지점 데이터를 불러오는 중 오류가 발생했습니다.'
    } finally {
        loading.value = false
    }
}

// 필터링된 지점 목록 (검색어, 지역 필터 적용)
const filteredLocations = computed(() => {
    let filtered = [...allLocations.value]
    
    // 검색어 필터링
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(location => {
            if (searchFilter.value === '협력점명') {
                return location.name?.toLowerCase().includes(query)
            } else if (searchFilter.value === '주소') {
                return location.address?.toLowerCase().includes(query) || 
                       location.detailAddress?.toLowerCase().includes(query)
            } else if (searchFilter.value === '전화번호') {
                return location.phone?.includes(query)
            }
            return false
        })
    }
    
    // 지역 필터링
    if (selectedRegionFilter.value) {
        filtered = filtered.filter(location => location.district === selectedRegionFilter.value)
    }
    
    return filtered
})

// 정렬된 지점 목록
const sortedLocations = computed(() => {
    const sorted = [...filteredLocations.value]
    
    sorted.sort((a, b) => {
        let aValue = a[sortField.value]
        let bValue = b[sortField.value]
        
        // 날짜 필드 처리
        if (sortField.value === 'created_at') {
            aValue = new Date(aValue)
            bValue = new Date(bValue)
        }
        
        // 문자열 비교
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            aValue = aValue.toLowerCase()
            bValue = bValue.toLowerCase()
        }
        
        if (sortOrder.value === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        }
    })
    
    return sorted
})

// 페이지네이션 적용된 지점 목록
const paginatedLocations = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return sortedLocations.value.slice(start, end)
})

// 전화번호 유효성 검증
const validatePhoneNumber = (phone) => {
    // 하이픈 제거하고 숫자만 추출
    const cleanPhone = phone.replace(/[^\d]/g, '')
    
    // 길이 검사
    if (cleanPhone.length < 8 || cleanPhone.length > 11) {
        return false
    }
    
    // 번호 패턴 검사
    const patterns = [
        /^02\d{7,8}$/,          // 서울 지역번호 (02-1234-5678)
        /^0[3-6][1-4]\d{6,7}$/, // 지역번호 (031-123-4567)
        /^01[0-9]\d{7,8}$/,     // 휴대폰 (010-1234-5678)
        /^070\d{7,8}$/,         // 인터넷전화 (070-1234-5678)
        /^080\d{6,7}$/,         // 무료전화 (080-123-4567)
        /^1[5-9]\d{2,3}$/       // 특수번호 (1588, 1577 등)
    ]
    
    return patterns.some(pattern => pattern.test(cleanPhone))
}

// 지점 등록
const registerStore = async () => {
    try {
        // 필수 필드 검증
        if (!formData.value.name || !formData.value.address || !formData.value.phone) {
            alert('필수 항목(협력점명, 주소, 전화번호)을 모두 입력해주세요.')
            return
        }
        
        // 전화번호 형식 검증
        if (!validatePhoneNumber(formData.value.phone)) {
            alert('올바른 전화번호 형식을 입력해주세요.\n(예: 02-1234-5678, 010-1234-5678, 031-123-4567)')
            return
        }
        
        isRegistering.value = true
        
        const locationData = {
            name: formData.value.name,
            address: formData.value.address,
            detailAddress: formData.value.detailAddress || '',
            phone: formData.value.phone,
            district: formData.value.region,
            kakaoChannel: formData.value.kakaoChannel || ''
        }
        
        await jinjungsungService.registerLocation(locationData)
        
        alert('지점이 성공적으로 등록되었습니다.')
        
        // 폼 초기화
        formData.value = {
            region: '',
            name: '',
            address: '',
            detailAddress: '',
            phone: '',
            kakaoChannel: ''
        }
        
        // 목록 새로고침
        await loadLocations()
        
    } catch (err) {
        console.error('지점 등록 실패:', err)
        alert(err.message || '지점 등록 중 오류가 발생했습니다.')
    } finally {
        isRegistering.value = false
    }
}

// 검색 입력 처리 (디바운스)
const handleSearchInput = () => {
    if (searchTimer) {
        clearTimeout(searchTimer)
    }
    
    searchTimer = setTimeout(() => {
        currentPage.value = 1
    }, 300)
}

// 지역 선택
const selectRegion = (regionValue) => {
    selectedRegionFilter.value = regionValue
    currentPage.value = 1
}

// 정렬
const sortBy = (field) => {
    if (sortField.value === field) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortField.value = field
        sortOrder.value = 'asc'
    }
    
    currentPage.value = 1
}

// 페이지 변경
const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

// 전체 선택/해제
const toggleSelectAll = () => {
    if (selectAll.value) {
        selectedLocationIds.value = paginatedLocations.value.map(location => location.id)
    } else {
        selectedLocationIds.value = []
    }
}

// 선택된 지점 삭제
const deleteSelectedLocations = async () => {
    try {
        isDeletingLocations.value = true
        
        await jinjungsungService.deleteSelectedLocations(selectedLocationIds.value)
        
        alert('선택된 지점들이 성공적으로 삭제되었습니다.')
        
        // 모달 닫기
        showDeleteModal.value = false
        
        // 선택 초기화
        selectedLocationIds.value = []
        selectAll.value = false
        
        // 목록 새로고침
        await loadLocations()
        
    } catch (err) {
        console.error('지점 삭제 실패:', err)
        alert(err.message || '지점 삭제 중 오류가 발생했습니다.')
    } finally {
        isDeletingLocations.value = false
    }
}

// 카카오톡 채널 열기
const openKakaoChannel = (channelUrl) => {
    if (channelUrl) {
        window.open(channelUrl, '_blank')
    }
}

// 카카오맵 열기
const showKakaoMap = (location) => {
    const address = location.address + (location.detailAddress ? ` ${location.detailAddress}` : '')
    const mapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(address)}`
    window.open(mapUrl, '_blank')
}

// 주소 찾기 (카카오맵 주소 검색)
const searchAddress = () => {
    // 다음 주소 검색 API 스크립트 동적 로드
    const loadDaumScript = () => {
        return new Promise((resolve) => {
            // 이미 로드된 경우
            if (window.daum && window.daum.Postcode) {
                resolve()
                return
            }
            
            // 스크립트 로드
            const script = document.createElement('script')
            script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
            script.onload = resolve
            document.head.appendChild(script)
        })
    }
    
    loadDaumScript().then(() => {
        new window.daum.Postcode({
            oncomplete: function(data) {
                // 선택된 주소 정보 처리
                let fullAddress = ''
                
                // 도로명 주소 우선, 없으면 지번 주소 사용
                if (data.roadAddress) {
                    fullAddress = data.roadAddress
                } else {
                    fullAddress = data.jibunAddress
                }
                
                // 건물명이 있으면 추가
                if (data.buildingName) {
                    fullAddress += ` (${data.buildingName})`
                }
                
                // 주소 입력 필드에 설정
                formData.value.address = fullAddress
                
                // 상세주소 입력 필드에 포커스
                setTimeout(() => {
                    const detailAddressInput = document.getElementById('detailAddress')
                    if (detailAddressInput) {
                        detailAddressInput.focus()
                    }
                }, 100)
                
                console.log('주소 검색 완료:', {
                    address: fullAddress,
                    zonecode: data.zonecode,
                    region: extractRegionFromAddress(fullAddress)
                })
            },
            onclose: function(state) {
                console.log('주소 검색 창 닫힘:', state)
            }
        }).open({
            left: (window.screen.width / 2) - (400 / 2),
            top: (window.screen.height / 2) - (500 / 2),
            popupTitle: '주소 검색'
        })
    }).catch(error => {
        console.error('주소 검색 API 로드 실패:', error)
        alert('주소 검색 기능을 불러오는 중 오류가 발생했습니다.')
    })
}

// 인증 관련 메서드들
const checkPassword = () => {
    if (passwordInput.value === adminPassword) {
        isAuthenticated.value = true
        sessionStorage.setItem('admin_authenticated', 'true')
        passwordError.value = ''
    } else {
        passwordError.value = '비밀번호가 올바르지 않습니다.'
    }
}

const goBack = () => {
    router.back()
}

const logout = () => {
    isAuthenticated.value = false
    sessionStorage.removeItem('admin_authenticated')
    router.push('/')
}

// 계산된 속성들
const totalPages = computed(() => {
    return Math.ceil(sortedLocations.value.length / itemsPerPage.value)
})

const totalCount = computed(() => {
    return sortedLocations.value.length
})

const startItem = computed(() => {
    return (currentPage.value - 1) * itemsPerPage.value + 1
})

const endItem = computed(() => {
    return Math.min(currentPage.value * itemsPerPage.value, sortedLocations.value.length)
})

const visiblePages = computed(() => {
    const current = currentPage.value
    const total = totalPages.value
    const pages = []
    
    const maxVisible = 5
    let start = Math.max(1, current - Math.floor(maxVisible / 2))
    let end = Math.min(total, start + maxVisible - 1)
    
    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    
    return pages
})

const selectedLocations = computed(() => {
    return paginatedLocations.value.filter(location => selectedLocationIds.value.includes(location.id))
})

// 검색 필터 변경 감지
watch(searchFilter, () => {
    if (searchQuery.value) {
        currentPage.value = 1
        loadLocations()
    }
})

// 컴포넌트 마운트 시 인증 상태 확인 및 데이터 로드
onMounted(() => {
    // 세션 스토리지에서 인증 상태 확인
    const authStatus = sessionStorage.getItem('admin_authenticated')
    if (authStatus === 'true') {
        isAuthenticated.value = true
    }
    
    // 인증된 경우 데이터 로드
    if (isAuthenticated.value) {
        loadLocations()
    }
})
</script>

<style scoped>
/* 기본 스타일 */
.search-section {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.search-box {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.search-filter {
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background: white;
    font-size: 0.875rem;
    min-width: 120px;
}

.search-input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 0.875rem;
}

.search-input:focus {
    outline: none;
    border-color: #6b7280;
    box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.1);
}

.region-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.5rem;
}

.region-button {
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
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

.delete-button {
    padding: 0.5rem 1rem;
    background: #dc2626;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.delete-button:hover {
    background: #b91c1c;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
    .search-box {
        flex-direction: column;
        align-items: stretch;
    }
    
    .search-filter {
        min-width: auto;
    }
    
    .region-buttons {
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    }
}
</style>