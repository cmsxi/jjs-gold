<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100/30 to-gray-200">
    <!-- 배너 영역: 프리미엄 그라데이션 배경 -->
    <section class="relative w-full h-[70vh] min-h-[400px] flex flex-col md:flex-row overflow-hidden">
      <!-- 그라데이션 배경 -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"></div>
      <!-- 배경 이미지 오버레이 -->
      <div class="absolute inset-0 w-full h-full bg-cover bg-center opacity-[0.25] mix-blend-soft-light" style="background-image: url('./src/assets/images/main-banner.jpg');"></div>
      <!-- 그라데이션 오버레이 -->
      <div class="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-gray-600/20"></div>
      
      <div class="relative z-10 flex-1 w-full flex flex-col justify-center items-center">
        <div class="w-full max-w-[1200px] flex flex-col md:flex-row items-center justify-between gap-8 px-4 md:px-8">
          <!-- 좌측 시세 카드 리스트 -->
          <div class="flex-1 flex flex-col justify-center min-w-[360px] md:min-w-[400px]">
               <h2 class="text-2xl md:text-3xl font-light text-white mb-2 tracking-tight w-full text-center justify-center">
                <span class="font-extrabold bg-gradient-to-r from-primary via-yellow-400 to-primary bg-clip-text text-transparent">진정성 금거래소</span> 
                <span class="text-white/90"> 금 매입 시세</span>
              </h2>
            <div class="mb-10 mt-2 w-full text-center justify-center">
              <span class="inline-flex items-center gap-2 text-lg md:text-xl font-medium text-white/90 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                {{ today }} 기준
              </span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3 stats-grid">
              <div 
                v-for="item in prices" 
                :key="item.type" 
                class="glass-card bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-5 lg:p-5 shadow-xl hover:scale-102 transition-all duration-300 group flex justify-between flex-col"
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
            <div class="space-y-6">
              <div class="floating-label-group">
                <input 
                  v-model="form.name" 
                  id="name" 
                  type="text" 
                  required 
                  class="floating-input peer w-full border-0 border-b-2 border-gray-200 bg-transparent px-0 py-3 text-slate-700 placeholder-transparent focus:border-primary focus:outline-none transition-colors duration-300"
                  placeholder="성함"
                />
                <label for="name" class="floating-label absolute left-0 top-3 text-gray-500 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm peer-focus:text-primary peer-valid:-top-2 peer-valid:text-sm">
                  성함 <span class="text-red-500">*</span>
                </label>
              </div>
              
              <div class="floating-label-group">
                <input 
                  v-model="form.phone" 
                  id="phone" 
                  type="tel" 
                  required 
                  class="floating-input peer w-full border-0 border-b-2 border-gray-200 bg-transparent px-0 py-3 text-slate-700 placeholder-transparent focus:border-primary focus:outline-none transition-colors duration-300"
                  placeholder="연락처"
                />
                <label for="phone" class="floating-label absolute left-0 top-3 text-gray-500 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm peer-focus:text-primary peer-valid:-top-2 peer-valid:text-sm">
                  연락처 <span class="text-red-500">*</span>
                </label>
              </div>
              
              <div class="floating-label-group">
                <input 
                  v-model="form.region" 
                  id="region" 
                  type="text" 
                  required 
                  class="floating-input peer w-full border-0 border-b-2 border-gray-200 bg-transparent px-0 py-3 text-slate-700 placeholder-transparent focus:border-primary focus:outline-none transition-colors duration-300"
                  placeholder="거주지역"
                />
                <label for="region" class="floating-label absolute left-0 top-3 text-gray-500 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm peer-focus:text-primary peer-valid:-top-2 peer-valid:text-sm">
                  거주지역 <span class="text-red-500">*</span>
                </label>
              </div>
            </div>
            
            <button 
              type="submit" 
              class="premium-button w-full mt-8 bg-gradient-to-r from-primary to-gray-600 text-white font-medium py-4 rounded-2xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group"
            >
              <span class="relative z-10">신청하기</span>
              <div class="absolute inset-0 bg-gradient-to-r from-gray-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
import { ref, h } from 'vue'
import CountUp from '@/components/CountUp.vue'
import logoWhite from '@/assets/images/logo-white.png'

// 오늘 날짜 (한국 기준)
const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Seoul' })

// 더미 시세 데이터
const prices = [
  { type: 'gold24k', label: '금 24K', price: 870200, change: +300 },
  { type: 'gold18k', label: '금 18K', price: 654000, change: -200 },
  { type: 'gold14k', label: '금 14K', price: 51200, change: 0 },
  { type: 'silver', label: '은', price: 1100, change: +10 },
  { type: 'platinum', label: '백금(Pt)', price: 43200, change: -100 },
]

// 매입 절차 단계
const steps = [
  {
    icon: () => h('svg', { class: 'w-10 h-10', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })
    ]),
    text: '전화 및 카톡 상담'
  },
  {
    icon: () => h('svg', { class: 'w-10 h-10', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' })
    ]),
    text: '방문 감정'
  },
  {
    icon: () => h('svg', { class: 'w-10 h-10', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8' })
    ]),
    text: '매입가 협의'
  },
  {
    icon: () => h('svg', { class: 'w-10 h-10', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M17 9V7a5 5 0 00-10 0v2a5 5 0 00-1 9.9V19a2 2 0 002 2h8a2 2 0 002-2v-.1A5 5 0 0017 9z' })
    ]),
    text: '대금 정산'
  }
]

// 협력점 문의 폼
const form = ref({ name: '', phone: '', region: '' })
const toast = ref(false)

function onSubmit() {
  if (!form.value.name || !form.value.phone || !form.value.region) return
  toast.value = true
  setTimeout(() => { toast.value = false }, 3000)
  form.value = { name: '', phone: '', region: '' }
}
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
  margin: 1.5rem 0;
}

.floating-label {
  pointer-events: none;
}

.floating-input:focus + .floating-label,
.floating-input:valid + .floating-label,
.floating-input:not(:placeholder-shown) + .floating-label {
  transform: translateY(-1.5rem);
  font-size: 0.875rem;
  color: var(--primary-color, #333343);
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