<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">협력점 개설 문의</h1>
      <div class="flex justify-center">
        <div class="w-full max-w-md">
          <form @submit.prevent="submitForm" class="bg-white p-8 rounded-lg shadow-lg">
            <div class="mb-6">
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">이름 *</label>
              <input 
                type="text" 
                id="name"
                v-model="formData.name"
                class="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent"
                required
              />
            </div>
            
            <div class="mb-6">
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">연락처 *</label>
              <input 
                type="tel" 
                id="phone"
                v-model="formData.phone"
                class="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent"
                required
              />
            </div>
            
            <div class="mb-6">
              <label for="location" class="block text-sm font-medium text-gray-700 mb-2">거주지역 *</label>
              <input 
                type="text" 
                id="location"
                v-model="formData.location"
                class="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="예: 서울 강남구, 경기 성남시"
                required
              />
            </div>
            
            <button 
              type="submit" 
              class="premium-button w-full bg-gradient-to-r from-primary to-gray-600 text-white font-medium py-4 rounded-md hover:shadow-md active:scale-[0.99] transition-all duration-200 text-lg"
            >
              문의하기
            </button>
          </form>
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

const submitForm = () => {
  // 폼 제출 로직
  console.log('협력점 문의:', formData.value)
  alert('문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.')
  
  // 폼 초기화
  formData.value = {
    name: '',
    phone: '',
    location: ''
  }
}
</script>

 