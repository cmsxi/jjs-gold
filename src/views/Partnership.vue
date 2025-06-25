<template>
  <div class="partnership-page">
    <div class="page-container">
      <h1 class="page-title">협력점 개설 문의</h1>
      <div class="content">
        <div class="form-container">
          <form @submit.prevent="submitForm" class="partnership-form">
            <div class="form-group">
              <label for="name" class="label">이름 *</label>
              <input 
                type="text" 
                id="name"
                v-model="formData.name"
                class="input"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="phone" class="label">연락처 *</label>
              <input 
                type="tel" 
                id="phone"
                v-model="formData.phone"
                class="input"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="email" class="label">이메일</label>
              <input 
                type="email" 
                id="email"
                v-model="formData.email"
                class="input"
              />
            </div>
            
            <div class="form-group">
              <label for="location" class="label">희망 지역 *</label>
              <input 
                type="text" 
                id="location"
                v-model="formData.location"
                class="input"
                placeholder="예: 서울 강남구, 경기 성남시"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="experience" class="label">사업 경험</label>
              <textarea 
                id="experience"
                v-model="formData.experience"
                class="input"
                rows="4"
                placeholder="관련 사업 경험이 있다면 간단히 작성해주세요"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="message" class="label">추가 문의사항</label>
              <textarea 
                id="message"
                v-model="formData.message"
                class="input"
                rows="4"
                placeholder="협력점 개설에 대한 궁금한 점이나 요청사항을 작성해주세요"
              ></textarea>
            </div>
            
            <button type="submit" class="submit-button">문의하기</button>
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
  email: '',
  location: '',
  experience: '',
  message: ''
})

const submitForm = () => {
  // 폼 제출 로직
  console.log('협력점 문의:', formData.value)
  alert('문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.')
  
  // 폼 초기화
  formData.value = {
    name: '',
    phone: '',
    email: '',
    location: '',
    experience: '',
    message: ''
  }
}
</script>

<style scoped>
.partnership-page {
  min-height: 100vh;
  background-color: var(--background-light);
}

.content {
  padding: 2rem;
}

.form-container {
  max-width: 600px;
  margin: 0 auto;
}

.partnership-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.submit-button {
  width: 100%;
  padding: 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background: #8a6a24;
}

.submit-button:active {
  transform: translateY(1px);
}
</style> 