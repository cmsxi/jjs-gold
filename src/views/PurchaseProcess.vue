<template>
  <div class="min-h-screen bg-gray-50 py-11">
    <h1 class="text-center text-4xl font-light text-secondary mb-12">
      매입 절차 안내
    </h1>
    <!-- 탭 메뉴 -->
    <div class="mb-8">
      <TabComponent v-model="activeTab" :tabs="tabList" />
    </div>
    <div class="max-w-[1100px] mx-auto px-4">
            <!-- 매입 절차 -->
      <div class="p-8 md:p-12">
        <h2 class="text-left text-3xl font-semibold text-secondary mb-20">
          {{ currentProcessData.title }}
        </h2>

        <!-- 아이콘 프로세스 -->
        <div
          class="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-12 mb-16 flex-wrap"
        >
          <template v-for="(step, index) in currentProcessData.steps" :key="index">
            <div class="flex flex-col items-center text-center">
              <div
                class="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-primary to-gray-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-all duration-300 hover:scale-105"
              >
                <component
                  :is="step.icon"
                  class="w-10 h-10 lg:w-12 lg:h-12 text-white"
                />
              </div>
              <div
                class="font-semibold text-secondary text-sm lg:text-base whitespace-nowrap"
              >
                {{ step.text }}
              </div>
            </div>

            <!-- 화살표 (마지막이 아닐 때만) -->
            <div
              v-if="index < currentProcessData.steps.length - 1"
              class="hidden lg:flex items-center justify-center text-primary"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </template>
        </div>

        <!-- 상세 설명 -->
        <div class="bg-gray-50 rounded-xl p-8 grid gap-6">
          <div 
            v-for="(detail, index) in currentProcessData.details" 
            :key="index"
            class="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm"
          >
            <div
              class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
            >
              {{ index + 1 }}
            </div>
            <div>
              <h4 class="text-lg font-semibold text-secondary mb-2">
                {{ detail.title }}
              </h4>
              <p class="text-gray-600 leading-relaxed">
                {{ detail.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, h, computed } from "vue";
import TabComponent from "@/components/common/TabComponent.vue";
import consIcon from '@/assets/images/cons.png'
import deliveryIcon from '@/assets/images/delivery.png'
import maniIcon from '@/assets/images/mani.png'
import messIcon from '@/assets/images/mess.png'
import paymentIcon from '@/assets/images/payment.png'
import boxIcon from '@/assets/images/box.png'

const activeTab = ref("visit");

// 탭 목록
const tabList = [
  { id: "visit", title: "방문매입" },
  { id: "delivery", title: "택배매입" },
];

// 매입 절차 데이터
const processData = {
  visit: {
    title: "방문매입절차안내",
    steps: [
      {
        icon: () => h('img', { 
          src: messIcon, 
          alt: '전화 및 카톡 상담', 
          class: 'w-16 h-16 object-contain' 
        }),
        text: "전화 및 카톡 상담",
      },
      {
        icon: () => h('img', { 
          src: maniIcon, 
          alt: '방문 감정', 
          class: 'w-16 h-16 object-contain' 
        }),
        text: "방문 감정",
      },
      {
        icon: () => h('img', { 
          src: consIcon, 
          alt: '매입가 협의',
          class: 'w-16 h-16 object-contain' 
        }),
        text: "매입가 협의",
      },
      {
        icon: () => h('img', { 
          src: paymentIcon, 
          alt: '대금 정산', 
          class: 'w-16 h-16 object-contain' 
        }),
        text: "대금 정산",
      },
    ],
    details: [
      {
        title: "전화 및 카톡 상담",
        description: "고객의 보유한 금제품의 종류, 무게, 상태 등을 간단히 카카오톡으로 상담받습니다"
      },
      {
        title: "방문감정",
        description: "전문 감정사가 직접 방문하여 금제품을 정밀하게 감정하는 단계입니다"
      },
      {
        title: "매입가 협의",
        description: "감정 결과를 바탕으로 당일 금시세를 적용하여 최종 매입 가격을 공개 협의합니다"
      },
      {
        title: "대금정산",
        description: "매입가 합의와 즉시 현장에서 대금을 지급하는 단계입니다"
      }
    ]
  },
  delivery: {
    title: "택배매입절차안내",
    steps: [
      {
        icon: () => h('img', { 
          src: messIcon, 
          alt: '전화 및 카톡 상담', 
          class: 'w-16 h-16 object-contain' 
        }),
        text: "전화 및 카톡 상담",
      },
      {
        icon: () => h('img', { 
          src: boxIcon, 
          alt: '택배발송', 
          class: 'w-16 h-16 object-contain' 
        }),
        text: "택배발송",
      },
      {
        icon: () => h('img', { 
          src: maniIcon, 
          alt: '정밀감정', 
          class: 'w-16 h-16 object-contain' 
        }),
        text: "정밀감정",
      },
      {
        icon: () => h('img', { 
          src: paymentIcon, 
          alt: '대금 정산', 
          class: 'w-16 h-16 object-contain' 
        }),
        text: "대금 정산",
      },
    ],
    details: [
      {
        title: "전화 및 카톡 상담",
        description: "고객의 보유한 금제품의 종류, 무게, 상태 등을 간단히 카카오톡으로 상담받습니다"
      },
      {
        title: "택배발송",
        description: "안전한 포장 후 등기우편 또는 택배로 금제품을 발송해주시면 됩니다"
      },
      {
        title: "정밀감정",
        description: "전문 감정사가 정밀 장비를 통해 정확한 순도와 무게를 측정합니다"
      },
      {
        title: "계좌입금",
        description: "감정 완료 후 고객 계좌로 매입대금을 즉시 입금해드립니다"
      }
    ]
  }
};

// 현재 선택된 탭에 따른 데이터
const currentProcessData = computed(() => {
  return processData[activeTab.value];
});
</script>

<style scoped>
/* 탭 컴포넌트 가운데 정렬 */
:deep(.tab-header) {
  justify-content: center;
  margin-bottom: 0 !important;
}

:deep(.tab-component) {
  margin-bottom: 0 !important;
}

/* 탭 컨텐츠 높이 제거 - 이게 문제였음! */
:deep(.tab-content) {
  min-height: 0 !important;
  height: 0 !important;
  overflow: hidden;
}
</style> 