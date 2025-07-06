<template>
  <div class="min-h-screen bg-gray-50 pb-8">
    <div class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl border-b border-gray-700 sticky top-0 z-10 py-10">
      <div class="max-w-7xl mx-auto px-4 ">
        <h1 class="text-center text-3xl py-2 font-semibold text-white mb-12">
          오늘의 시세 {{ todayDate }}
        </h1>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pb-6">
          <div 
            v-for="metal in todayPrices" 
            :key="metal.name"
            class="text-center p-4 bg-gray-800/60 rounded-md border border-gray-600 hover:bg-gray-700/60 transition-all duration-200 backdrop-blur-sm"
          >
            <div class="text-sm text-gray-300 mb-2">{{ metal.name }}</div>
            <div class="font-bold text-lg text-white mb-1">{{ formatPrice(metal.price) }}</div>
            <div :class="metal.change >= 0 ? 'text-green-400' : 'text-red-400'" class="text-xs font-semibold flex items-center justify-center gap-1">
              <svg v-if="metal.change >= 0" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 13l4-4 4 4 7-7"/>
              </svg>
              <svg v-else class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17 7l-4 4-4-4-7 7"/>
              </svg>
              {{ metal.change >= 0 ? '+' : '' }}{{ metal.change }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-[1100px] mx-auto px-4 mt-8">

      <!-- 차트 섹션 -->
      <div class="bg-white rounded-lg p-8 shadow-lg mb-8 border border-gray-100">
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div class="flex items-center gap-4">
            <h2 class="text-2xl font-semibold text-secondary">시세 차트</h2>
            
            <!-- 새로고침 버튼 -->
            <button
              @click="refreshData"
              :disabled="isLoading"
              class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg :class="isLoading ? 'animate-spin' : ''" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ isLoading ? '로딩 중...' : '새로고침' }}
            </button>
          </div>
          
          <!-- 기간 선택 버튼 -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="period in periods"
              :key="period.value"
              @click="handlePeriodChange(period.value)"
              :disabled="isChartLoading"
              :class="selectedPeriod === period.value 
                ? 'bg-gradient-to-r from-primary to-yellow-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              class="px-4 py-2 rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ period.label }}
            </button>
          </div>
        </div>

        <!-- 금속 선택 탭 -->
        <div class="flex flex-wrap gap-2 mb-6">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="handleCategoryChange(category.id)"
            :disabled="isChartLoading"
            :class="selectedCategory === category.id 
              ? 'bg-gradient-to-r from-primary to-yellow-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            class="px-6 py-3 rounded-md font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ category.name }}
          </button>
        </div>

        <!-- API 에러 메시지 -->
        <div v-if="apiError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div class="flex items-center gap-2 text-red-700">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <span>{{ apiError }}</span>
          </div>
          <p class="text-sm text-red-600 mt-1">일부 데이터는 임시 데이터로 표시됩니다.</p>
        </div>

        <!-- 차트와 실시간 데이터 -->
        <div class="grid lg:grid-cols-3 gap-6 mb-6">
          <!-- 차트 -->
          <div class="lg:col-span-2">
            <div class="h-96 relative">
              <!-- 차트 로딩 오버레이 -->
              <div v-if="isChartLoading" class="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
                <div class="flex flex-col items-center gap-3">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span class="text-sm text-gray-600">차트 데이터 로드 중...</span>
                </div>
              </div>
              
              <Line
                :data="chartData"
                :options="chartOptions"
                class="w-full h-full"
              />
            </div>
            <!-- 범례 -->
            <div class="flex flex-wrap justify-center gap-4 mt-4">
              <div 
                v-for="(dataset, index) in chartData.datasets" 
                :key="index"
                class="flex items-center gap-2"
              >
                <div 
                  class="w-4 h-4 rounded-full"
                  :style="{ backgroundColor: dataset.borderColor }"
                ></div>
                <span class="text-sm font-medium text-gray-700">{{ dataset.label }}</span>
              </div>
            </div>
          </div>

          <!-- 실시간 시세 표 -->
          <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
            <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              실시간 시세
            </h4>
            <div class="space-y-3">
              <div 
                v-for="item in currentPriceData" 
                :key="item.name"
                class="flex justify-between items-center p-3 bg-white/80 rounded-md hover:bg-white transition-colors border border-gray-200"
              >
                <div>
                  <div class="text-sm font-medium text-gray-800">{{ item.name }}</div>
                  <div class="text-xs text-gray-500">{{ item.unit || '1g' }}</div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-sm text-primary">{{ formatPrice(item.price) }}</div>
                  <div :class="item.change >= 0 ? 'text-green-600' : 'text-red-600'" class="text-xs font-medium flex items-center justify-end gap-1">
                    <svg v-if="item.change >= 0" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 13l4-4 4 4 7-7"/>
                    </svg>
                    <svg v-else class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17 7l-4 4-4-4-7 7"/>
                    </svg>
                    {{ item.change >= 0 ? '+' : '' }}{{ item.change }}%
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 마지막 업데이트 시간 -->
            <div class="mt-4 pt-3 border-t border-gray-300">
              <div class="text-xs text-gray-600 text-center">
                마지막 업데이트: {{ lastUpdateTime }}
              </div>
            </div>
          </div>
        </div>
      </div>



      <!-- 시세 정보 안내 -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h4 class="font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
          시세 정보 안내
        </h4>
        <ul class="text-sm text-blue-700 space-y-3">
          <li class="flex items-start gap-2">
            <div class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            시세는 실시간으로 업데이트되며, 실제 거래가와 차이가 있을 수 있습니다.
          </li>
          <li class="flex items-start gap-2">
            <div class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            매입가는 당일 시세를 기준으로 산정되며, 제품 상태에 따라 달라질 수 있습니다.
          </li>
          <li class="flex items-start gap-2">
            <div class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            정확한 매입가는 전화 상담 또는 방문 감정을 통해 확인하실 수 있습니다.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { jinjungsungService } from '@/services/jinjungsungService.js'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

// 반응형 데이터
const selectedPeriod = ref('1M')
const selectedCategory = ref('gold')
const isLoading = ref(false)
const isChartLoading = ref(false)
const apiError = ref('')

// 기간 선택 옵션
const periods = [
  { value: '1W', label: '1주' },
  { value: '1M', label: '1개월' },
  { value: '3M', label: '3개월' },
  { value: '6M', label: '6개월' },
  { value: '1Y', label: '1년' }
]

// 카테고리 선택 옵션
const categories = [
  { id: 'gold', name: '금 시세' },
  { id: 'silver', name: '은 시세' },
  { id: 'platinum', name: '백금 시세' },
  { id: 'all', name: '전체' }
]

// API 데이터
const todayPricesData = ref(null)
const chartDataFromApi = ref(null)
const realtimePricesData = ref(null)

// 오늘의 시세 데이터 (API로부터)
const todayPrices = computed(() => {
  if (!todayPricesData.value?.data?.prices) {
    // 기본 더미 데이터 (업데이트된 시세 반영)
    return [
      { name: '금 24K', price: 542000, change: 0.0 },
      { name: '금 18K', price: 398400, change: 0.0 },
      { name: '금 14K', price: 309000, change: 0.0 },
      { name: '은', price: 5660, change: 0.71 },
      { name: '백금(Pt)', price: 216000, change: -0.92 }
    ]
  }
  
  return todayPricesData.value.data.prices.map(price => ({
    name: price.label || price.name || '알 수 없음',
    price: price.price || 0,
    change: price.change || 0
  }))
})

// 실시간 시세 데이터 (차트 옆에 표시)
const currentPriceData = computed(() => {
  if (!realtimePricesData.value?.data?.prices) {
    // 기본 더미 데이터 (업데이트된 시세 반영)
    if (selectedCategory.value === 'gold') {
      return [
        { name: '금 24K', price: 542000, change: 0.0, unit: '1g' },
        { name: '금 18K', price: 398400, change: 0.0, unit: '1g' },
        { name: '금 14K', price: 309000, change: 0.0, unit: '1g' }
      ]
    } else if (selectedCategory.value === 'silver') {
      return [
        { name: '은', price: 5660, change: 0.71, unit: '1g' }
      ]
    } else if (selectedCategory.value === 'platinum') {
      return [
        { name: '백금(Pt)', price: 216000, change: -0.92, unit: '1g' }
      ]
    } else {
      return [
        { name: '금 24K', price: 542000, change: 0.0, unit: '1g' },
        { name: '금 18K', price: 398400, change: 0.0, unit: '1g' },
        { name: '금 14K', price: 309000, change: 0.0, unit: '1g' },
        { name: '은', price: 5660, change: 0.71, unit: '1g' },
        { name: '백금(Pt)', price: 216000, change: -0.92, unit: '1g' }
      ]
    }
  }

  // API 데이터가 있으면 카테고리별로 필터링
  const allPrices = realtimePricesData.value.data.prices.map(price => ({
    name: price.label || price.name || '알 수 없음',
    price: price.price || 0,
    change: price.change || 0,
    unit: price.unit || '1g'
  }))

  // 카테고리별 필터링
  if (selectedCategory.value === 'gold') {
    return allPrices.filter(price => 
      price.name.includes('금') || price.name.includes('24K') || price.name.includes('18K') || price.name.includes('14K')
    )
  } else if (selectedCategory.value === 'silver') {
    return allPrices.filter(price => price.name.includes('은'))
  } else if (selectedCategory.value === 'platinum') {
    return allPrices.filter(price => price.name.includes('백금') || price.name.includes('Pt'))
  } else {
    return allPrices
  }
})

// 마지막 업데이트 시간
const lastUpdateTime = ref('')

// 오늘 날짜
const todayDate = ref('')

// 데이터 로딩 함수들
const loadTodayPrices = async () => {
  try {
    const response = await jinjungsungService.getTodayPrices()
    todayPricesData.value = response
    
    // 업데이트 시간 설정
    if (response.data?.update_time) {
      const updateDate = new Date(response.data.update_time)
      lastUpdateTime.value = updateDate.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }
    
    // 오늘 날짜 설정
    if (response.data?.today_date) {
      todayDate.value = response.data.today_date
    }
    
  } catch (error) {
    console.error('오늘의 시세 로드 실패:', error)
    apiError.value = '시세 정보를 불러오는데 실패했습니다.'
  }
}

const loadChartData = async () => {
  isChartLoading.value = true
  
  try {
    const response = await jinjungsungService.getChartData(selectedPeriod.value, selectedCategory.value)
    chartDataFromApi.value = response
  } catch (error) {
    console.error('차트 데이터 로드 실패:', error)
    apiError.value = '차트 데이터를 불러오는데 실패했습니다.'
  } finally {
    isChartLoading.value = false
  }
}

const loadRealtimePrices = async () => {
  try {
    // today-prices API를 사용하여 실시간 시세 로드
    const response = await jinjungsungService.getTodayPrices()
    realtimePricesData.value = response
    
    // 업데이트 시간 설정
    if (response.data?.update_time) {
      const updateDate = new Date(response.data.update_time)
      lastUpdateTime.value = updateDate.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }
  } catch (error) {
    console.error('실시간 시세 로드 실패:', error)
    // 실시간 시세 실패는 조용히 처리 (더미 데이터 사용)
  }
}

// 현재 시간 업데이트 (API 연결 실패시 fallback)
const updateTime = () => {
  const now = new Date()
  if (!lastUpdateTime.value) {
    lastUpdateTime.value = now.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }
  
  // 오늘 날짜 업데이트
  if (!todayDate.value) {
    todayDate.value = now.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

// 가격 포맷팅 함수
const formatPrice = (price) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0
  }).format(price || 0)
}

// 더미 차트 데이터 생성 (API 실패시 백업)
const generateDummyChartData = () => {
  const days = 30
  const labels = []
  const today = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    labels.push(date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }))
  }

  const generatePriceData = (basePrice, volatility = 0.02) => {
    const data = []
    let currentPrice = basePrice
    
    for (let i = 0; i < days; i++) {
      const change = (Math.random() - 0.5) * volatility * currentPrice
      currentPrice += change
      data.push(Math.round(currentPrice))
    }
    return data
  }

  return { labels, generatePriceData }
}

// 차트 데이터
const chartData = computed(() => {
  // API 데이터가 있으면 사용
  if (chartDataFromApi.value?.data) {
    const apiData = chartDataFromApi.value.data
    return {
      labels: apiData.labels || [],
      datasets: apiData.datasets || []
    }
  }
  
  // API 데이터가 없으면 더미 데이터 생성
  const { labels, generatePriceData } = generateDummyChartData()
  
  const datasets = []
  
  if (selectedCategory.value === 'gold' || selectedCategory.value === 'all') {
    datasets.push(
      {
        label: '금 24K',
        data: generatePriceData(542000),
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        tension: 0.4
      },
      {
        label: '금 18K',
        data: generatePriceData(398400),
        borderColor: '#FFA500',
        backgroundColor: 'rgba(255, 165, 0, 0.1)',
        tension: 0.4
      },
      {
        label: '금 14K',
        data: generatePriceData(309000),
        borderColor: '#DAA520',
        backgroundColor: 'rgba(218, 165, 32, 0.1)',
        tension: 0.4
      }
    )
  }
  
  if (selectedCategory.value === 'silver' || selectedCategory.value === 'all') {
    datasets.push({
      label: '은',
      data: generatePriceData(5660),
      borderColor: '#C0C0C0',
      backgroundColor: 'rgba(192, 192, 192, 0.1)',
      tension: 0.4
    })
  }
  
  if (selectedCategory.value === 'platinum' || selectedCategory.value === 'all') {
    datasets.push({
      label: '백금',
      data: generatePriceData(216000),
      borderColor: '#E5E4E2',
      backgroundColor: 'rgba(229, 228, 226, 0.1)',
      tension: 0.4
    })
  }

  return { labels, datasets }
})

// 차트 옵션
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: ${formatPrice(context.parsed.y)}`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      ticks: {
        callback: function(value) {
          return formatPrice(value)
        }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  }
}

// 기간/카테고리 변경 시 데이터 다시 로드
const handlePeriodChange = async (period) => {
  selectedPeriod.value = period
  await loadChartData()
}

const handleCategoryChange = async (category) => {
  selectedCategory.value = category
  await Promise.all([
    loadChartData(),
    loadRealtimePrices()
  ])
}

// 새로고침 함수
const refreshData = async () => {
  isLoading.value = true
  apiError.value = ''
  
  try {
    await Promise.all([
      loadTodayPrices(),
      loadChartData(),
      loadRealtimePrices()
    ])
  } catch (error) {
    console.error('데이터 새로고침 실패:', error)
  } finally {
    isLoading.value = false
  }
}

// 주기적 업데이트
let updateInterval = null

// 컴포넌트 마운트 시 초기 로드
onMounted(async () => {
  updateTime()
  await refreshData()
  
  // 30초마다 시간 업데이트
  updateInterval = setInterval(() => {
    updateTime()
  }, 30000)
  
  // 5분마다 데이터 새로고침
  setInterval(async () => {
    await loadTodayPrices()
    await loadRealtimePrices()
  }, 300000) // 5분 = 300,000ms
})

// 컴포넌트 언마운트 시 클린업
onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style> 