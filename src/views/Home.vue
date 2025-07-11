<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100/30 to-gray-200">
    <!-- 배너 영역: 프리미엄 그라데이션 배경 -->
    <section class="relative w-full md:h-[80vh] min-h-[400px] flex flex-col md:flex-row overflow-hidden">
      <!-- 그라데이션 배경 -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"></div>
      <!-- 배경 이미지 오버레이 -->
      <div class="absolute inset-0 w-full h-full bg-cover bg-center opacity-[0.25] mix-blend-soft-light" :style="{ backgroundImage: `url(${mainBannerImg})` }"></div>
      <!-- 그라데이션 오버레이 -->
      <div class="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-gray-600/20"></div>
      
      <div class="relative z-10 flex-1 w-full flex flex-col justify-center items-center">
        <div class="w-full max-w-[1200px] flex flex-col md:flex-row items-center justify-between gap-8 px-4 md:px-8">
          <!-- 좌측 시세 카드 리스트 -->
          <div class="flex-1 flex flex-col justify-center min-w-[360px] md:min-w-[400px] py-10">
               <h2 class="text-2xl md:text-3xl font-light text-white mb-2 tracking-tight w-full text-center justify-center">
                <span class="font-extrabold bg-gradient-to-r from-primary via-yellow-400 to-primary bg-clip-text text-transparent">진정성 금거래소</span> 
                <span class="text-white/90"> 금 매입 시세</span>
              </h2>
            <div class="mb-10 mt-2 w-full text-center justify-center">
              <div class="flex items-center justify-center gap-4">
                <span class="inline-flex items-center gap-2 text-lg md:text-xl font-medium text-white/90 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                  {{ today }} 기준
                </span>
                
                <!-- 새로고침 버튼 -->
                <button 
                  @click="loadPrices"
                  :disabled="isLoadingPrices"
                  class="inline-flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-white/80 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="시세 새로고침"
                >
                  <svg 
                    :class="isLoadingPrices ? 'animate-spin' : ''" 
                    class="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <span class="text-sm font-medium">{{ isLoadingPrices ? '로딩...' : '새로고침' }}</span>
                </button>
              </div>
              
              <!-- 에러 메시지 -->
              <div v-if="pricesError" class="mt-3 text-center">
                <span class="inline-flex items-center gap-2 text-sm text-red-300 bg-red-500/20 backdrop-blur-md rounded-full px-3 py-1 border border-red-400/30">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                  </svg>
                  {{ pricesError }}
                </span>
              </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3 stats-grid relative">
              <!-- 로딩 오버레이 -->
              <div v-if="isLoadingPrices" class="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                <div class="flex flex-col items-center gap-3 text-white">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <span class="text-sm font-medium">시세 업데이트 중...</span>
                </div>
              </div>
              
              <div 
                v-for="item in prices" 
                :key="item.type" 
                class="glass-card bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-5 lg:p-5 shadow-xl hover:scale-102 transition-all duration-300 group flex justify-between flex-col"
                :class="isLoadingPrices ? 'opacity-70' : ''"
              >
                <div class="flex items-center gap-2 mb-2 md:mb-3">
                  <div 
                    class="w-2 h-2 rounded-full"
                    :class="item.type === 'silver' || item.type === 'platinum' 
                      ? 'bg-gradient-to-r from-gray-400 to-gray-300' 
                      : 'bg-gradient-to-r from-primary via-yellow-400 to-primary'"
                  ></div>
                  <span class="text-sm md:text-base font-medium text-white/90">{{ item.label }}</span>
                </div>
                <div class="flex justify-between flex-col">
                <div class="text-lg md:text-lg lg:text-xl font-bold text-white mb-2 flex items-center justify-between">
                  <CountUp :end-val="item.price" :duration="1500" />
                  <span class="text-xs md:text-sm text-white/60 font-normal ml-0.5">원/g</span>
                </div>
                <div class="flex items-center gap-1 mt-2 md:mt-3 justify-between flex-col w-full">
                  <span 
                    :class="item.change > 0 ? 'text-emerald-400' : item.change < 0 ? 'text-red-400' : 'text-white/60'" 
                    class="flex items-center gap-1 font-medium text-xs md:text-sm bg-black/20 rounded-full px-2 md:px-3 py-1"
                  >
                    <svg v-if="item.change > 0" class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                    </svg>
                    <svg v-else-if="item.change < 0" class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                    </svg>
                    <svg v-else class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/>
                    </svg>
                    {{ item.change > 0 ? '+' : item.change < 0 ? '' : '' }}{{ item.change }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 우측 문구/로고 -->
          <div class="flex flex-col items-center md:items-start justify-end md:justify-center flex-[1.1] min-w-[220px] md:min-w-[300px] max-w-full md:max-w-[300px] px-0 py-8 md:pr-0">
                          <div class="glass-card bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-10 mb-4">
                <p class="text-xl md:text-2xl lg:text-3xl font-light text-white leading-relaxed text-center md:text-left">
                  <span class="font-semibold bg-gradient-to-r from-primary via-yellow-400 to-primary bg-clip-text text-transparent">투명한 거래,</span><br />
                  <span class="text-white/90">진정성 있게</span><br />
                  <span class="text-white/80">당신의 금 한 돈의 가치까지</span><br />
                  <span class="font-medium text-white">지켜드립니다.</span>
                </p>
              </div>
            <img :src="logoWhite" alt="진정성 금거래소 로고" class="w-56 md:w-64 lg:w-72 opacity-90 hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </div>
    </section>

    <!-- 방문 매입 절차 -->
    <section class="py-24 bg-white relative overflow-hidden">
      <!-- 배경 장식 -->
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-gray-600 to-primary"></div>
      
      <div class="max-w-[900px] mx-auto px-4">
          <div class="text-center mb-12">
            <h3 class="text-2xl md:text-3xl font-light text-slate-800 mb-4">
              <span class="font-semibold">방문 매입</span> 절차
            </h3>
            <div class="w-20 h-1 bg-gradient-to-r from-primary to-gray-600 mx-auto rounded-full"></div>
          </div>
          
          <div class="flex flex-col lg:flex-row justify-between items-center gap-8 relative">
            <template v-for="(step, index) in steps" :key="index">
              <div class="process-card relative z-10 flex flex-col items-center flex-1 group">
                <div class="w-20 h-20 bg-gradient-to-br from-primary to-gray-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-all duration-300 group-hover:scale-105">
                  <component :is="step.icon" class="w-10 h-10 text-white" />
                </div>
                <div class="bg-white rounded-xl p-6 shadow-lg transition-all duration-300 w-[130px] border border-gray-100 min-h-[100px] flex items-center justify-center">
                  <span class="font-medium text-center leading-relaxed">{{ step.text }}</span>
                </div>
              </div>
              
              <!-- 화살표 (마지막 단계가 아닐 때만) -->
              <div v-if="index < steps.length - 1" class="hidden lg:flex items-center justify-center text-primary">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </template>
          </div>
        </div>
      </section>

    <!-- 협력점 개설 문의 -->
    <section class="py-16 bg-gradient-to-br from-gray-50 to-gray-100/50 relative">
      <div class="max-w-[1100px] mx-auto px-4">
        <div class="max-w-lg mx-auto">
                      <div class="text-center mb-10">
              <h3 class="text-2xl md:text-3xl font-light text-slate-800 mb-4">
                <span class="font-semibold">협력점 개설</span> 문의
              </h3>
              <div class="w-20 h-1 bg-gradient-to-r from-primary to-gray-600 mx-auto rounded-full"></div>
            </div>
          
          <form @submit.prevent="onSubmit" class="premium-form bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-all duration-500">
            <div class="space-y-8">
              <div class="floating-label-group">
                <input 
                  v-model="form.name" 
                  id="name" 
                  type="text" 
                  required 
                  class="floating-input w-full border-0 border-b-2 border-gray-200 bg-transparent px-0 py-3 text-slate-700 placeholder-transparent focus:border-primary focus:outline-none transition-colors duration-300"
                  placeholder="성함"
                />
                <label for="name" class="floating-label text-gray-500">
                  성함 <span class="text-red-500">*</span>
                </label>
              </div>
              
              <div class="floating-label-group">
                <input 
                  v-model="form.phone" 
                  id="phone" 
                  type="tel" 
                  required 
                  class="floating-input w-full border-0 border-b-2 border-gray-200 bg-transparent px-0 py-3 text-slate-700 placeholder-transparent focus:border-primary focus:outline-none transition-colors duration-300"
                  placeholder="연락처"
                />
                <label for="phone" class="floating-label text-gray-500">
                  연락처 <span class="text-red-500">*</span>
                </label>
              </div>
              
              <div class="floating-label-group">
                <input 
                  v-model="form.region" 
                  id="region" 
                  type="text" 
                  required 
                  class="floating-input w-full border-0 border-b-2 border-gray-200 bg-transparent px-0 py-3 text-slate-700 placeholder-transparent focus:border-primary focus:outline-none transition-colors duration-300"
                  placeholder="거주지역"
                />
                <label for="region" class="floating-label text-gray-500">
                  거주지역 <span class="text-red-500">*</span>
                </label>
              </div>
            </div>
            
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="premium-button w-full mt-8 bg-gradient-to-r from-primary to-gray-600 text-white font-medium py-4 rounded-2xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span class="relative z-10 flex items-center justify-center gap-2">
                <svg v-if="isSubmitting" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? '문의 접수 중...' : '신청하기' }}
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-gray-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <!-- 카카오 채널 문의 구분선 -->
            <div class="flex items-center my-6">
              <div class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <span class="px-4 text-sm text-gray-500 bg-white">더 빠른 상담을 원하시나요?</span>
              <div class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>
            
            <!-- 카카오 채널 문의 버튼 -->
            <button 
              @click="openKakaoChannel"
              type="button" 
              class="kakao-button w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800 font-medium py-4 rounded-2xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group border border-yellow-300"
            >
              <span class="relative z-10 flex items-center justify-center gap-3">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.8l-.8 3.1c-.1.4.3.7.6.5L10.4 19c.5.1 1 .1 1.6.1 5.5 0 10-3.6 10-8S17.5 3 12 3z"/>
                </svg>
                카카오 채널 문의하기
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>
          
          <transition name="toast">
            <div v-if="toast" class="fixed left-1/2 bottom-8 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl z-50 border border-emerald-400/20">
              <div class="flex items-center gap-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                문의가 정상적으로 접수되었습니다!
              </div>
            </div>
          </transition>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, h, onMounted, onUnmounted } from 'vue'
import CountUp from '@/components/CountUp.vue'
import { jinjungsungService } from '@/services/jinjungsungService.js'
import logoWhite from '@/assets/images/logo-white.png'
import consIcon from '@/assets/images/cons.png'
import deliveryIcon from '@/assets/images/delivery.png'
import maniIcon from '@/assets/images/mani.png'
import messIcon from '@/assets/images/mess.png'
import paymentIcon from '@/assets/images/payment.png'
import mainBannerImg from '@/assets/images/main-banner.jpg'

// 오늘 날짜 (한국 기준)
const today = ref('')

// 시세 데이터 (API로부터)
const prices = ref([
  { type: 'gold24k', label: '금 24K', price: 542000, change: 0.0 },
  { type: 'gold18k', label: '금 18K', price: 398400, change: 0.0 },
  { type: 'gold14k', label: '금 14K', price: 309000, change: 0.0 },
  { type: 'silver', label: '은', price: 5660, change: 0.71 },
  { type: 'platinum', label: '백금(Pt)', price: 216000, change: -0.92 },
])

// 로딩 상태
const isLoadingPrices = ref(false)
const pricesError = ref('')

// 매입 절차 단계
const steps = [
  {
    icon: () => h('img', { 
      src: messIcon, 
      alt: '전화 및 카톡 상담', 
      class: 'w-16 h-16 object-contain' 
    }),
    text: '전화 및 카톡 상담'
  },
  {
    icon: () => h('img', { 
      src: maniIcon, 
      alt: '방문 감정', 
      class: 'w-12 h-12 object-contain' 
    }),
    text: '방문 감정'
  },
  {
    icon: () => h('img', { 
      src: consIcon, 
      alt: '매입가 협의', 
      class: 'w-16 h-16 object-contain' 
    }),
    text: '매입가 협의'
  },
  {
    icon: () => h('img', { 
      src: paymentIcon, 
      alt: '대금 정산', 
      class: 'w-16 h-16 object-contain' 
    }),
    text: '대금 정산'
  }
]

// 협력점 문의 폼
const form = ref({ name: '', phone: '', region: '' })
const toast = ref(false)
const isSubmitting = ref(false)

async function onSubmit() {
  if (!form.value.name || !form.value.phone || !form.value.region) return
  
  isSubmitting.value = true
  
  try {
    await jinjungsungService.submitCourseRegistration({
      name: form.value.name,
      phone: form.value.phone,
      location: form.value.region
    })
    
    toast.value = true
    setTimeout(() => { toast.value = false }, 3000)
    form.value = { name: '', phone: '', region: '' }
  } catch (error) {
    console.error('협력점 개설 문의 오류:', error)
    alert('문의 접수 중 오류가 발생했습니다. 다시 시도해 주세요.')
  } finally {
    isSubmitting.value = false
  }
}

function openKakaoChannel() {
  // 카카오 채널 문의 로직을 구현해야 합니다.
  console.log('카카오 채널 문의 버튼이 클릭되었습니다.')
}

// 오늘 날짜 업데이트
const updateTodayDate = () => {
  today.value = new Date().toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    timeZone: 'Asia/Seoul' 
  })
}

// 시세 데이터 로드
const loadPrices = async () => {
  if (isLoadingPrices.value) return
  
  isLoadingPrices.value = true
  pricesError.value = ''
  
  try {
    // today-prices API 직접 호출
    const response = await jinjungsungService.getTodayPrices()
    console.log('Today API 응답:', response)
    
    // 응답 데이터 구조 확인
    console.log('API 응답 전체:', response)
    console.log('응답 데이터 keys:', Object.keys(response || {}))
    
    // API 응답 데이터 추출
    const apiData = response?.data || response
    const pricesData = apiData?.prices
    
    console.log('추출된 가격 데이터:', pricesData)
    
    if (pricesData && Array.isArray(pricesData)) {
      const updatedPrices = []
      
      // 배열 형태의 응답 처리
      pricesData.forEach(priceInfo => {
        console.log('가격 정보:', priceInfo)
        // 실제 API 응답의 type 필드를 직접 사용
        if (priceInfo.type && ['gold24k', 'gold18k', 'gold14k', 'silver', 'platinum'].includes(priceInfo.type)) {
          updatedPrices.push({
            type: priceInfo.type,
            label: priceInfo.label || priceInfo.name || '알 수 없음',
            price: priceInfo.price || 0,
            change: priceInfo.change || 0
          })
        }
      })
      
      console.log('파싱된 가격 데이터:', updatedPrices)
      
      // 업데이트된 가격이 있으면 적용
      if (updatedPrices.length > 0) {
        // 기존 가격에 API 데이터 병합
        const finalPrices = prices.value.map(existingPrice => {
          const apiPrice = updatedPrices.find(p => p.type === existingPrice.type)
          return apiPrice || existingPrice
        })
        
        prices.value = finalPrices
        console.log('최종 적용된 가격:', finalPrices)
      }
      
      // API에서 today_date를 제공하면 사용
      if (apiData?.today_date) {
        today.value = apiData.today_date
      }
    }
    
    console.log('시세 데이터 로드 성공')
    
  } catch (error) {
    console.error('시세 데이터 로드 실패:', error)
    console.error('에러 응답:', error.response?.data)
    pricesError.value = '시세 정보를 불러오는데 실패했습니다.'
    
    // 에러시 기본 날짜 설정
    updateTodayDate()
  } finally {
    isLoadingPrices.value = false
  }
}

// 주기적 업데이트 (5분마다)
let priceUpdateInterval = null

// 컴포넌트 마운트
onMounted(async () => {
  updateTodayDate()
  await loadPrices()
  
  // 5분마다 시세 업데이트
  priceUpdateInterval = setInterval(async () => {
    await loadPrices()
  }, 300000) // 5분 = 300,000ms
})

// 컴포넌트 언마운트
onUnmounted(() => {
  if (priceUpdateInterval) {
    clearInterval(priceUpdateInterval)
  }
})
</script>

<style scoped>
/* 글래스모피즘 카드 */
.glass-card {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* 커스텀 스크롤바 */
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

/* 플로팅 레이블 */
.floating-label-group {
  position: relative;
  padding-top: 1.25rem;
}

.floating-label {
  position: absolute;
  left: 0;
  top: 2rem;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left top;
  z-index: 1;
  font-size: 1rem;
  line-height: 1.5;
}

.floating-input {
  position: relative;
  z-index: 2;
  padding-top: 1.25rem !important;
}

.floating-input:focus + .floating-label,
.floating-input:not(:placeholder-shown) + .floating-label {
  transform: translateY(-1.25rem) scale(0.875);
  color: #D4AF37;
  font-weight: 500;
}

.floating-input:focus {
  border-color: #D4AF37 !important;
}

/* 프리미엄 그림자 */
.shadow-3xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);
}

/* 토스트 애니메이션 */
.toast-enter-active, .toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(2rem) scale(0.8);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-1rem) scale(0.9);
}



/* 반응형 조정 */
@media (max-width: 768px) {
  .glass-card {
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
  }
}
</style>