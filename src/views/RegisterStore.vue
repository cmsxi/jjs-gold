<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <h1 class="text-3xl font-semibold text-center mb-8 text-secondary">협력점 안내</h1>

      <!-- 지점 목록 및 검색 -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        
        <div class="flex flex-col lg:flex-row gap-4 mb-6">
          <h2 class="text-2xl font-semibold text-secondary">협력점 위치</h2>
          
          <!-- 검색 및 필터 -->
          <div class="flex flex-col lg:flex-row gap-4 lg:ml-auto">
            <!-- 지역 필터 -->
            <select 
              v-model="selectedRegion"
              @change="loadStores"
              class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">전체 지역</option>
              <option v-for="region in regions" :key="region" :value="region">
                {{ region }}
              </option>
            </select>

            <!-- 검색 -->
            <div class="flex gap-2">
              <select 
                v-model="searchFilter"
                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="가맹점명">가맹점명</option>
                <option value="주소">주소</option>
                <option value="전화번호">전화번호</option>
              </select>
              <input 
                v-model="searchQuery"
                @keyup.enter="loadStores"
                type="text" 
                placeholder="검색어 입력..."
                class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-w-[200px]"
              >
              <button 
                @click="loadStores"
                class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                검색
              </button>
            </div>
          </div>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="isLoading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p class="mt-2 text-gray-600">지점 정보를 불러오는 중...</p>
        </div>

        <!-- 지점 목록 -->
        <div v-else-if="stores.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="store in stores" 
            :key="store.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-lg text-secondary">{{ store.name }}</h3>
              <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{{ store.district }}</span>
            </div>
            
            <div class="space-y-2 text-sm text-gray-600">
              <div class="flex items-start gap-2">
                <svg class="w-4 h-4 mt-0.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
                <span>{{ store.address }}</span>
              </div>
              
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                <span>{{ store.phone }}</span>
              </div>

              <div v-if="store.hours" class="flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
                <span>{{ store.hours }}</span>
              </div>
            </div>

            <!-- 카카오톡 문의 버튼 -->
            <div v-if="store.kakao_link" class="mt-3">
              <a 
                :href="store.kakao_link"
                target="_blank"
                class="inline-flex items-center gap-2 w-full justify-center px-4 py-2 bg-yellow-400 text-gray-800 rounded-md hover:bg-yellow-500 transition-colors text-sm font-medium"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 01-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"/>
                </svg>
                카카오톡 문의
              </a>
            </div>
          </div>
        </div>

        <!-- 지점이 없는 경우 -->
        <div v-else class="text-center py-8">
          <div class="text-gray-500 mb-4">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0H3"/>
            </svg>
            <p class="text-lg font-medium">등록된 지점이 없습니다</p>
            <p class="text-sm text-gray-400 mt-1">검색 조건을 변경해보세요</p>
          </div>
        </div>

        <!-- 페이지네이션 (향후 확장용) -->
        <div v-if="stores.length > 0" class="mt-6 text-center text-sm text-gray-500">
          총 {{ totalCount }}개의 지점이 있습니다
        </div>
      </div>

      <!-- 신규 지점 개설 문의 -->
      <div class="bg-gradient-to-r from-primary/5 to-yellow-500/5 border border-primary/20 rounded-lg p-6">
        <h3 class="text-xl font-semibold text-secondary mb-4 flex items-center gap-2">
          <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          신규 협력점 개설 문의
        </h3>
        
        <div class="bg-white rounded-lg p-6 mb-4">
          <p class="text-gray-700 mb-4">
            새로운 지역에 협력점 개설을 원하시나요? 아래 정보를 통해 문의해주세요.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
              <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              <div>
                <div class="font-medium">전화 문의</div>
                <div class="text-sm text-gray-600">02-744-9999</div>
              </div>
            </div>
            
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
              <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              <div>
                <div class="font-medium">이메일 문의</div>
                <div class="text-sm text-gray-600">info@jinjungsung.co.kr</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 개설 혜택 안내 -->
        <div class="bg-white rounded-lg p-4">
          <h4 class="font-semibold text-gray-800 mb-3">협력점 개설 혜택</h4>
          <ul class="space-y-2 text-sm text-gray-600">
            <li class="flex items-start gap-2">
              <div class="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              본사 직영점과 동일한 매입가 적용
            </li>
            <li class="flex items-start gap-2">
              <div class="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              전문적인 운영 교육 및 지속적인 지원
            </li>
            <li class="flex items-start gap-2">
              <div class="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              마케팅 자료 및 홍보 지원
            </li>
            <li class="flex items-start gap-2">
              <div class="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              정기적인 시세 정보 및 업계 동향 공유
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 토스트 메시지 -->
    <div v-if="toastMessage" class="fixed bottom-4 right-4 z-50">
      <div 
        :class="toastType === 'success' ? 'bg-green-500' : 'bg-red-500'"
        class="text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300"
      >
        <div class="flex items-center gap-2">
          <svg v-if="toastType === 'success'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <span>{{ toastMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { jinjungsungService } from '@/services/jinjungsungService.js'

// 반응형 데이터
const stores = ref([])
const regions = ref([])
const selectedRegion = ref('')
const searchQuery = ref('')
const searchFilter = ref('가맹점명')
const isLoading = ref(false)
const totalCount = ref(0)

// 토스트 메시지
const toastMessage = ref('')
const toastType = ref('success')

// 토스트 메시지 표시
const showToast = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

// 지역 목록 로드
const loadRegions = async () => {
  try {
    const response = await jinjungsungService.getRegions()
    regions.value = response
  } catch (error) {
    console.error('지역 목록 로드 실패:', error)
    showToast('지역 목록을 불러오는데 실패했습니다.', 'error')
  }
}

// 지점 목록 로드
const loadStores = async () => {
  isLoading.value = true
  
  try {
    const params = {
      skip: 0,
      limit: 100,
      searchQuery: searchQuery.value || null,
      searchFilter: searchFilter.value,
      district: selectedRegion.value || null
    }

    const [storesResponse, countResponse] = await Promise.all([
      jinjungsungService.getLocations(params),
      jinjungsungService.getLocationsCount(params)
    ])

    stores.value = storesResponse
    totalCount.value = countResponse.count
    
  } catch (error) {
    console.error('지점 목록 로드 실패:', error)
    showToast('지점 목록을 불러오는데 실패했습니다.', 'error')
    stores.value = []
    totalCount.value = 0
  } finally {
    isLoading.value = false
  }
}

// 컴포넌트 마운트 시 실행
onMounted(async () => {
  await loadRegions()
  await loadStores()
})
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
