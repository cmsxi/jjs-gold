<template>
  <header class="fixed top-0 left-0 w-full z-50 bg-white border-b border-black/10 shadow-sm transition-transform duration-300" :class="{ '-translate-y-full': isHidden, 'translate-y-0': !isHidden }">
    <div class="max-w-7xl mx-auto flex items-center justify-between h-20 px-4 md:px-8">
      <!-- 로고 -->
      <router-link to="/" class="flex items-center h-full">
        <img src="@/assets/images/logo.png" alt="center Logo" class="h-12 md:h-14 w-auto object-contain" />
      </router-link>

      <!-- 데스크탑 메뉴 -->
      <nav class="hidden md:flex flex-1 justify-center items-center">
        <ul class="flex gap-x-8 text-secondary font-semibold text-base">
          <li><router-link to="/gold-price" class="hover:text-primary transition">금 시세 조회</router-link></li>
          <li><router-link to="/purchase-process" class="hover:text-primary transition">방문매입, 택배매입 절차</router-link></li>
          <li><router-link to="/faq" class="hover:text-primary transition">자주 묻는 질문</router-link></li>
          <li><router-link to="/location-finder" class="hover:text-primary transition">인근 지점 찾기</router-link></li>
          <li><router-link to="/partnership" class="hover:text-primary transition">협력점 문의</router-link></li>
        </ul>
      </nav>

      <!-- 모바일 햄버거 -->
      <button class="block md:hidden ml-2 z-50 p-2 rounded-lg hover:bg-gray-100 transition-colors" @click="toggleMobileMenu">
        <span class="sr-only">모바일 메뉴 열기</span>
        <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- 모바일 메뉴 -->
    <transition name="fade">
      <nav v-if="isMobileMenuOpen" 
           class="fixed top-0 left-0 w-full bg-gray-800 z-50 flex flex-col"
           style="height: 100vh; min-height: 100vh;">
        <!-- 헤더 영역 -->
        <div class="flex items-center justify-between h-20 px-4 md:px-8 bg-gray-800 border-b border-gray-600">
          <router-link to="/" class="flex items-center h-full py-4" @click="closeMobileMenu">
            <img src="@/assets/images/logo-white.png" alt="center Logo" class="h-12 w-auto object-contain" />
          </router-link>
          <button @click="closeMobileMenu" class="text-white p-2 rounded-lg hover:bg-gray-700 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- 메뉴 리스트 -->
        <div class="flex-1 px-8 py-8 bg-gray-800">
          <ul class="flex flex-col gap-y-6 text-white font-semibold text-lg">
            <li>
              <router-link to="/" @click="closeMobileMenu" 
                class="block py-3 px-4 rounded-lg transition-colors border-l-4 border-transparent hover:text-primary">
                메인
              </router-link>
            </li>
            <li>
              <router-link to="/gold-price" @click="closeMobileMenu" 
                class="block py-3 px-4 rounded-lg transition-colors border-l-4 border-transparent hover:text-primary">
                금 시세 조회
              </router-link>
            </li>
            <li>
              <router-link to="/purchase-process" @click="closeMobileMenu" 
                class="block py-3 px-4 rounded-lg transition-colors border-l-4 border-transparent hover:text-primary">
                매입 절차
              </router-link>
            </li>
            <li>
              <router-link to="/faq" @click="closeMobileMenu" 
                class="block py-3 px-4 rounded-lg  transition-colors border-l-4 border-transparent hover:text-primary">
                자주 묻는 질문
              </router-link>
            </li>
            <li>
              <router-link to="/location-finder" @click="closeMobileMenu" 
                class="block py-3 px-4 rounded-lg transition-colors border-l-4 border-transparent hover:text-primary">
                지점 찾기
              </router-link>
            </li>
          </ul>
        </div>
        
        <!-- 하단 버튼 -->
        <div class="px-8 pb-8 bg-gray-800">
          <router-link to="/partnership" @click="closeMobileMenu" 
            class="block w-full text-center bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-4 rounded-lg font-semibold shadow-lg hover:from-primary/90 hover:to-primary/70 transition-all transform">
            협력점 문의
          </router-link>
        </div>
      </nav>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const isHidden = ref(false)
const isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : ''
}
function closeMobileMenu() {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>