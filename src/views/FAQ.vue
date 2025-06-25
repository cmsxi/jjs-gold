<template>
  <div class="faq-page">
    <div class="page-container">
      <h1 class="page-title">자주 묻는 질문</h1>
      <div class="content">
        <div class="faq-list">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index"
            class="faq-item"
          >
            <div 
              class="faq-question"
              @click="toggleFaq(index)"
            >
              <h3>{{ faq.question }}</h3>
              <span class="toggle-icon">{{ faq.isOpen ? '−' : '+' }}</span>
            </div>
            <div 
              v-show="faq.isOpen"
              class="faq-answer"
            >
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const faqs = ref([
  {
    question: '금 매입 시 필요한 서류는 무엇인가요?',
    answer: '금 매입 시 필요한 서류에 대한 답변이 들어갈 자리입니다.',
    isOpen: false
  },
  {
    question: '매입 가격은 어떻게 결정되나요?',
    answer: '매입 가격 결정 기준에 대한 답변이 들어갈 자리입니다.',
    isOpen: false
  },
  {
    question: '택배매입은 어떻게 진행되나요?',
    answer: '택배매입 진행 절차에 대한 답변이 들어갈 자리입니다.',
    isOpen: false
  }
])

const toggleFaq = (index) => {
  faqs.value[index].isOpen = !faqs.value[index].isOpen
}
</script>

<style scoped>
.faq-page {
  min-height: 100vh;
  background-color: var(--background-light);
}

.content {
  padding: 2rem;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: white;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.faq-question {
  padding: 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s;
}

.faq-question:hover {
  background-color: #f8f9fa;
}

.faq-question h3 {
  color: var(--secondary-color);
  margin: 0;
  font-size: 1.1rem;
}

.toggle-icon {
  font-size: 1.5rem;
  color: var(--primary-color);
  font-weight: bold;
}

.faq-answer {
  padding: 0 1.5rem 1.5rem;
  color: #666;
  line-height: 1.6;
}
</style> 