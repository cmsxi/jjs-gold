<template>
  <div class="min-h-screen bg-gray-50">
    <div class="page-container">
      <h1 class="text-center text-3xl font-semibold text-secondary mb-12">
        자주 묻는 질문
      </h1>
      <div class="p-8">
        <div class="max-w-3xl mx-auto">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index"
            class="bg-white mb-6 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md"
          >
            <div 
              class="px-8 py-4 cursor-pointer flex justify-between items-center transition-colors duration-300 hover:bg-gray-50"
              @click="toggleFaq(index)"
            >
              <h3 class="text-gray-800 text-lg font-semibold leading-snug">{{ faq.question }}</h3>
              <span class="text-2xl text-yellow-500 font-bold">{{ faq.isOpen ? '−' : '+' }}</span>
            </div>
            <transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-96"
              leave-active-class="transition-all duration-300 ease-in"
              leave-from-class="opacity-100 max-h-96"
              leave-to-class="opacity-0 max-h-0"
            >
              <div 
                v-show="faq.isOpen"
                class="px-8 py-4 text-gray-600 leading-relaxed text-base bg-white border-t border-gray-200 overflow-hidden"
              >
                <p class="my-4 font-normal text-md" v-html="faq.answer"></p>
              </div>
            </transition>
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
    question: ' 금은 어떻게 매입하나요?',
    answer: '진정성금거래소에서는 고객님이 가지고 계신 금 제품의 순도와 중량을 확인한 뒤, 당일 금 시세를 기준으로 매입가를 책정합니다.<br/><br/> 방문, 택배 중 편하신 방법으로 매입이 가능합니다.',
    isOpen: false
  },
  {
    question: '어떤 종류의 금을 매입하나요?',
    answer: '순금(24K), 18K, 14K, 백금, 금반지, 금목걸이, 금팔찌, 골드바 등 대부분의 금 제품을 매입합니다. <br/> <br/>도금이나 금도금 제품은 매입이 불가하니 감정 전 상담 부탁드립니다.',
    isOpen: false
  },
  {
    question: '매입 가격은 어디 기준인가요?',
    answer: '당일 진정성금거래소 시세를 기준으로 매입가를 산정하며, 시세는 실시간으로 변동됩니다. <br/><br/> 고객님께서 방문하신 시점의 시세로 계산해드리니 안심하셔도 됩니다. <br/><br/> 택배 배송 후 매입 시 택배도착 기준일 시세로 정산해드립니다.',
    isOpen: false
  },
  {
    question: '택배로 보내도 매입이 가능한가요?',
    answer: '네, 가능합니다. <br/><br/> 안전한 거래를 위해 CCTV가 설치된 지점에서 감정 후, 당일 바로 정산해드립니다. <br/><br/> 택배거래를 원하실 경우 미리 지점으로 연락 부탁드립니다.',
    isOpen: false
  },
  {
    question: '택배로 보낼 때 어떤 준비물이 필요한가요?',
    answer: '① 금 제품 <br/> ② 신분증 사본<br/> ③ 연락 가능한 연락처 메모 <br/><br/> 를 동봉해 안전포장 후 안내드리는 주소로 보내주시면 됩니다.',
    isOpen: false
  },  
  {
    question: '매입 금액은 언제 정산되나요?',
    answer: '방문 거래 시: 감정 완료 후 즉시 정산 <br/><br/> 택배 거래 시: 감정 완료 후 30분 이내 정산을 원칙으로 하고 있습니다.',
    isOpen: false
  },

  {
    question: '금이 망가졌거나 끊어진 제품도 매입되나요?',
    answer: '물론입니다! <br/><br/> 제품의 외형과 상관없이 순도와 무게만 정확하면 매입이 가능합니다.',
    isOpen: false
  },

  {
    question: '신분증 없이도 매입이 가능한가요?',
    answer: '아쉽게도 불가능합니다. <br/><br/> 금거래는 특정금융정보법에 따라 고객 확인이 필수이므로, 실물 신분증 지참 또는 사본 제출이 필요합니다.',
    isOpen: false
  },


  
  {
    question: '금 시세는 어디서 확인하나요?',
    answer: '진정성금매입 홈페이지 상단에서 실시간 금 시세를 확인하실 수 있으며, 매일 업데이트되고 있습니다.',
    isOpen: false
  },

  {
    question: '금 외에 매입 가능한 품목이 또 있나요?',
    answer: '진정성금거래소는 은, 백금, 골드바, 일부 명품시계 및 명품가방 등도 매입 가능합니다. <br/><br/> 매입 가능 품목은 수시로 변동될 수 있으니, 지점 유선문의 또는 카카오톡으로 사전 문의 부탁드립니다.',
    isOpen: false
  },
])

const toggleFaq = (index) => {
  faqs.value[index].isOpen = !faqs.value[index].isOpen
}
</script>

 