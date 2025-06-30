<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-center mb-8 text-secondary">API 연결 테스트</h1>

      <!-- API 상태 확인 -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-secondary">API 연결 상태</h2>
          <button 
            @click="checkApiConnection"
            :disabled="checking"
            class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {{ checking ? '확인 중...' : '연결 확인' }}
          </button>
        </div>
        
        <div :class="apiStatus.connected ? 'text-green-600' : 'text-red-600'" class="flex items-center gap-2">
          <div :class="apiStatus.connected ? 'bg-green-500' : 'bg-red-500'" class="w-3 h-3 rounded-full animate-pulse"></div>
          <span class="font-medium">{{ apiStatus.message }}</span>
        </div>
        
        <div v-if="apiStatus.lastChecked" class="text-sm text-gray-500 mt-2">
          마지막 확인: {{ apiStatus.lastChecked }}
        </div>
      </div>

      <!-- 지역 관리 API 테스트 -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-secondary mb-4">지역 관리 API</h2>
        
        <div class="space-y-4">
          <!-- 지역 목록 조회 -->
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium">지역 목록 조회</h3>
              <button 
                @click="testGetRegions"
                :disabled="testing.regions"
                class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
              >
                {{ testing.regions ? '테스트 중...' : '테스트' }}
              </button>
            </div>
            
            <div class="bg-gray-50 rounded p-3 text-sm">
              <strong>엔드포인트:</strong> GET /regions<br>
              <strong>결과:</strong> 
              <div v-if="results.regions" class="mt-2 p-2 bg-white rounded border">
                <pre class="text-xs overflow-x-auto">{{ JSON.stringify(results.regions, null, 2) }}</pre>
              </div>
              <div v-else class="text-gray-500 mt-2">아직 테스트하지 않았습니다.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 지점 관리 API 테스트 -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-secondary mb-4">지점 관리 API</h2>
        
        <div class="space-y-4">
          <!-- 지점 목록 조회 -->
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium">지점 목록 조회</h3>
              <button 
                @click="testGetLocations"
                :disabled="testing.locations"
                class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
              >
                {{ testing.locations ? '테스트 중...' : '테스트' }}
              </button>
            </div>
            
            <div class="bg-gray-50 rounded p-3 text-sm">
              <strong>엔드포인트:</strong> GET /locations<br>
              <strong>결과:</strong>
              <div v-if="results.locations" class="mt-2 p-2 bg-white rounded border">
                <pre class="text-xs overflow-x-auto">{{ JSON.stringify(results.locations, null, 2) }}</pre>
              </div>
              <div v-else class="text-gray-500 mt-2">아직 테스트하지 않았습니다.</div>
            </div>
          </div>

          <!-- 지점 수 조회 -->
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium">지점 수 조회</h3>
              <button 
                @click="testGetLocationsCount"
                :disabled="testing.locationsCount"
                class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
              >
                {{ testing.locationsCount ? '테스트 중...' : '테스트' }}
              </button>
            </div>
            
            <div class="bg-gray-50 rounded p-3 text-sm">
              <strong>엔드포인트:</strong> GET /locations/count<br>
              <strong>결과:</strong>
              <div v-if="results.locationsCount" class="mt-2 p-2 bg-white rounded border">
                <pre class="text-xs overflow-x-auto">{{ JSON.stringify(results.locationsCount, null, 2) }}</pre>
              </div>
              <div v-else class="text-gray-500 mt-2">아직 테스트하지 않았습니다.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 금시세 API 테스트 -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-secondary mb-4">금시세 API</h2>
        
        <div class="space-y-4">
          <!-- 오늘의 시세 -->
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium">오늘의 시세</h3>
              <button 
                @click="testGetTodayPrices"
                :disabled="testing.todayPrices"
                class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
              >
                {{ testing.todayPrices ? '테스트 중...' : '테스트' }}
              </button>
            </div>
            
            <div class="bg-gray-50 rounded p-3 text-sm">
              <strong>엔드포인트:</strong> GET /gold/today-prices<br>
              <strong>결과:</strong>
              <div v-if="results.todayPrices" class="mt-2 p-2 bg-white rounded border">
                <pre class="text-xs overflow-x-auto">{{ JSON.stringify(results.todayPrices, null, 2) }}</pre>
              </div>
              <div v-else class="text-gray-500 mt-2">아직 테스트하지 않았습니다.</div>
            </div>
          </div>

          <!-- 차트 데이터 -->
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium">차트 데이터</h3>
              <div class="flex gap-2">
                <select v-model="chartTestParams.period" class="px-2 py-1 border rounded text-xs">
                  <option value="1W">1주</option>
                  <option value="1M">1개월</option>
                  <option value="3M">3개월</option>
                </select>
                <select v-model="chartTestParams.category" class="px-2 py-1 border rounded text-xs">
                  <option value="all">전체</option>
                  <option value="gold">금</option>
                  <option value="silver">은</option>
                  <option value="platinum">백금</option>
                </select>
                <button 
                  @click="testGetChartData"
                  :disabled="testing.chartData"
                  class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-xs"
                >
                  {{ testing.chartData ? '테스트 중...' : '테스트' }}
                </button>
              </div>
            </div>
            
            <div class="bg-gray-50 rounded p-3 text-sm">
              <strong>엔드포인트:</strong> GET /gold/chart-data?period={{ chartTestParams.period }}&category={{ chartTestParams.category }}<br>
              <strong>결과:</strong>
              <div v-if="results.chartData" class="mt-2 p-2 bg-white rounded border">
                <pre class="text-xs overflow-x-auto">{{ JSON.stringify(results.chartData, null, 2) }}</pre>
              </div>
              <div v-else class="text-gray-500 mt-2">아직 테스트하지 않았습니다.</div>
            </div>
          </div>

          <!-- 실시간 시세 -->
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium">실시간 시세</h3>
              <div class="flex gap-2">
                <select v-model="realtimeTestParams.category" class="px-2 py-1 border rounded text-xs">
                  <option value="all">전체</option>
                  <option value="gold">금</option>
                  <option value="silver">은</option>
                  <option value="platinum">백금</option>
                </select>
                <button 
                  @click="testGetRealtimePrices"
                  :disabled="testing.realtimePrices"
                  class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-xs"
                >
                  {{ testing.realtimePrices ? '테스트 중...' : '테스트' }}
                </button>
              </div>
            </div>
            
            <div class="bg-gray-50 rounded p-3 text-sm">
              <strong>엔드포인트:</strong> GET /gold/realtime-prices?category={{ realtimeTestParams.category }}<br>
              <strong>결과:</strong>
              <div v-if="results.realtimePrices" class="mt-2 p-2 bg-white rounded border">
                <pre class="text-xs overflow-x-auto">{{ JSON.stringify(results.realtimePrices, null, 2) }}</pre>
              </div>
              <div v-else class="text-gray-500 mt-2">아직 테스트하지 않았습니다.</div>
            </div>
          </div>

          <!-- 시장 상태 -->
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium">시장 상태</h3>
              <button 
                @click="testGetMarketStatus"
                :disabled="testing.marketStatus"
                class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
              >
                {{ testing.marketStatus ? '테스트 중...' : '테스트' }}
              </button>
            </div>
            
            <div class="bg-gray-50 rounded p-3 text-sm">
              <strong>엔드포인트:</strong> GET /gold/market-status<br>
              <strong>결과:</strong>
              <div v-if="results.marketStatus" class="mt-2 p-2 bg-white rounded border">
                <pre class="text-xs overflow-x-auto">{{ JSON.stringify(results.marketStatus, null, 2) }}</pre>
              </div>
              <div v-else class="text-gray-500 mt-2">아직 테스트하지 않았습니다.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 전체 테스트 실행 -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-secondary">전체 API 테스트</h2>
          <button 
            @click="runAllTests"
            :disabled="runningAllTests"
            class="px-6 py-3 bg-gradient-to-r from-primary to-yellow-600 text-white rounded-md hover:from-primary/90 hover:to-yellow-600/90 disabled:opacity-50 transition-colors font-medium"
          >
            {{ runningAllTests ? '전체 테스트 실행 중...' : '전체 테스트 실행' }}
          </button>
        </div>
        
        <div class="text-sm text-gray-600">
          모든 API 엔드포인트를 순서대로 테스트합니다. 결과는 각 섹션에서 확인할 수 있습니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { jinjungsungService } from '@/services/jinjungsungService.js'

// 반응형 데이터
const checking = ref(false)
const runningAllTests = ref(false)

// API 상태
const apiStatus = ref({
  connected: false,
  message: '연결 상태를 확인해주세요',
  lastChecked: null
})

// 테스트 상태
const testing = ref({
  regions: false,
  locations: false,
  locationsCount: false,
  todayPrices: false,
  chartData: false,
  realtimePrices: false,
  marketStatus: false
})

// 테스트 결과
const results = ref({
  regions: null,
  locations: null,
  locationsCount: null,
  todayPrices: null,
  chartData: null,
  realtimePrices: null,
  marketStatus: null
})

// 테스트 매개변수
const chartTestParams = ref({
  period: '1M',
  category: 'all'
})

const realtimeTestParams = ref({
  category: 'all'
})

// API 연결 확인
const checkApiConnection = async () => {
  checking.value = true
  
  try {
    const isConnected = await jinjungsungService.checkApiHealth()
    
    apiStatus.value = {
      connected: isConnected,
      message: isConnected ? 'API 서버에 정상 연결됨' : 'API 서버 연결 실패',
      lastChecked: new Date().toLocaleString('ko-KR')
    }
  } catch (error) {
    apiStatus.value = {
      connected: false,
      message: `연결 확인 중 오류 발생: ${error.message}`,
      lastChecked: new Date().toLocaleString('ko-KR')
    }
  } finally {
    checking.value = false
  }
}

// 개별 API 테스트 함수들
const testGetRegions = async () => {
  testing.value.regions = true
  try {
    const result = await jinjungsungService.getRegions()
    results.value.regions = { success: true, data: result }
  } catch (error) {
    results.value.regions = { success: false, error: error.message }
  } finally {
    testing.value.regions = false
  }
}

const testGetLocations = async () => {
  testing.value.locations = true
  try {
    const result = await jinjungsungService.getLocations()
    results.value.locations = { success: true, data: result }
  } catch (error) {
    results.value.locations = { success: false, error: error.message }
  } finally {
    testing.value.locations = false
  }
}

const testGetLocationsCount = async () => {
  testing.value.locationsCount = true
  try {
    const result = await jinjungsungService.getLocationsCount()
    results.value.locationsCount = { success: true, data: result }
  } catch (error) {
    results.value.locationsCount = { success: false, error: error.message }
  } finally {
    testing.value.locationsCount = false
  }
}

const testGetTodayPrices = async () => {
  testing.value.todayPrices = true
  try {
    const result = await jinjungsungService.getTodayPrices()
    results.value.todayPrices = { success: true, data: result }
  } catch (error) {
    results.value.todayPrices = { success: false, error: error.message }
  } finally {
    testing.value.todayPrices = false
  }
}

const testGetChartData = async () => {
  testing.value.chartData = true
  try {
    const result = await jinjungsungService.getChartData(
      chartTestParams.value.period, 
      chartTestParams.value.category
    )
    results.value.chartData = { success: true, data: result }
  } catch (error) {
    results.value.chartData = { success: false, error: error.message }
  } finally {
    testing.value.chartData = false
  }
}

const testGetRealtimePrices = async () => {
  testing.value.realtimePrices = true
  try {
    const result = await jinjungsungService.getRealtimePrices(realtimeTestParams.value.category)
    results.value.realtimePrices = { success: true, data: result }
  } catch (error) {
    results.value.realtimePrices = { success: false, error: error.message }
  } finally {
    testing.value.realtimePrices = false
  }
}

const testGetMarketStatus = async () => {
  testing.value.marketStatus = true
  try {
    const result = await jinjungsungService.getMarketStatus()
    results.value.marketStatus = { success: true, data: result }
  } catch (error) {
    results.value.marketStatus = { success: false, error: error.message }
  } finally {
    testing.value.marketStatus = false
  }
}

// 전체 테스트 실행
const runAllTests = async () => {
  runningAllTests.value = true
  
  try {
    await checkApiConnection()
    await testGetRegions()
    await testGetLocations()
    await testGetLocationsCount()
    await testGetTodayPrices()
    await testGetChartData()
    await testGetRealtimePrices()
    await testGetMarketStatus()
  } catch (error) {
    console.error('전체 테스트 실행 중 오류:', error)
  } finally {
    runningAllTests.value = false
  }
}

// 컴포넌트 마운트 시 연결 확인
onMounted(() => {
  checkApiConnection()
})
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style> 