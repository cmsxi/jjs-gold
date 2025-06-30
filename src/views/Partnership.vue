<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100/30 to-gray-200">
    <div class="py-16 bg-gradient-to-br from-gray-50 to-gray-100/50 relative">
      <div class="max-w-[1100px] mx-auto px-4">
        <div class="max-w-lg mx-auto">
          <div class="text-center mb-10">
            <h3 class="text-2xl md:text-3xl font-light text-slate-800 mb-4">
              <span class="font-semibold">협력점 개설</span> 문의
            </h3>
            <div class="w-20 h-1 bg-gradient-to-r from-primary to-gray-600 mx-auto rounded-full"></div>
          </div>
          
          <form @submit.prevent="submitForm" class="premium-form bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-all duration-500">
            <div class="space-y-8">
              <div class="floating-label-group">
                <input 
                  v-model="formData.name" 
                  id="name" 
                  type="text" 
                  required 
                  class="floating-input w-full border-0 border-b-2 border-gray-200 bg-transparent px-0 py-3 text-slate-700 placeholder-transparent focus:border-primary focus:outline-none transition-colors duration-300"
                  placeholder="이름"
                />
                <label for="name" class="floating-label text-gray-500">
                  이름 <span class="text-red-500">*</span>
                </label>
              </div>
              
              <div class="floating-label-group">
                <input 
                  v-model="formData.phone" 
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
                  v-model="formData.location" 
                  id="location" 
                  type="text" 
                  required 
                  class="floating-input w-full border-0 border-b-2 border-gray-200 bg-transparent px-0 py-3 text-slate-700 placeholder-transparent focus:border-primary focus:outline-none transition-colors duration-300"
                  placeholder="거주지역"
                />
                <label for="location" class="floating-label text-gray-500">
                  거주지역 <span class="text-red-500">*</span>
                </label>
              </div>
            </div>
            
            <button 
              type="submit" 
              class="premium-button w-full mt-8 bg-gradient-to-r from-primary to-gray-600 text-white font-medium py-4 rounded-2xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group"
            >
              <span class="relative z-10">문의하기</span>
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  name: '',
  phone: '',
  location: ''
})

const toast = ref(false)

const submitForm = () => {
  if (!formData.value.name || !formData.value.phone || !formData.value.location) return
  
  console.log('협력점 문의:', formData.value)
  
  // 토스트 표시
  toast.value = true
  setTimeout(() => { toast.value = false }, 3000)
  
  // 폼 초기화
  formData.value = {
    name: '',
    phone: '',
    location: ''
  }
}

const openKakaoChannel = () => {
  // 카카오 채널 문의 로직을 구현해야 합니다.
  console.log('카카오 채널 문의')
}
</script>

<style scoped>
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
</style>

 