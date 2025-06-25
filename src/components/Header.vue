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
      <button class="block md:hidden ml-2 z-50" @click="toggleMobileMenu">
        <span class="sr-only">모바일 메뉴 열기</span>
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- 모바일 메뉴 -->
    <transition name="fade">
      <nav v-if="isMobileMenuOpen" class="fixed inset-0 bg-black/90 z-50 flex flex-col">
        <div class="flex items-center justify-between h-20 px-4 md:px-8">
          <router-link to="/" class="flex items-center h-full" @click="closeMobileMenu">
            <img src="@/assets/images/logo.png" alt="center Logo" class="h-12 w-auto object-contain" />
          </router-link>
          <button @click="closeMobileMenu" class="text-white">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul class="flex flex-col gap-y-6 text-white font-semibold text-lg px-8 mt-8">
          <li><router-link to="/" @click="closeMobileMenu" class="hover:text-primary transition">메인</router-link></li>
          <li><router-link to="/gold-price" @click="closeMobileMenu" class="hover:text-primary transition">금 시세 조회</router-link></li>
          <li><router-link to="/purchase-process" @click="closeMobileMenu" class="hover:text-primary transition">매입 절차</router-link></li>
          <li><router-link to="/faq" @click="closeMobileMenu" class="hover:text-primary transition">자주 묻는 질문</router-link></li>
          <li><router-link to="/location-finder" @click="closeMobileMenu" class="hover:text-primary transition">지점 찾기</router-link></li>
        </ul>
        <div class="mt-10 px-8">
          <router-link to="/partnership" @click="closeMobileMenu" class="block w-full text-center bg-primary text-white px-6 py-3 rounded font-semibold shadow hover:bg-primary/90 transition">협력점 문의</router-link>
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