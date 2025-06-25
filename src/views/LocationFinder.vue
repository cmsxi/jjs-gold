<template>
  <div class="location-finder-page">
    <div class="page-container">
      <h1 class="page-title">인근 지점 찾기</h1>
      <div class="content">
        <div class="search-section">
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="지역명을 입력하세요 (예: 강남구, 서초구)"
              class="search-input"
            />
            <button @click="searchLocations" class="search-button">검색</button>
          </div>
        </div>
        
        <div class="locations-section">
          <div class="locations-list">
            <div 
              v-for="location in filteredLocations" 
              :key="location.id"
              class="location-item"
            >
              <h3>{{ location.name }}</h3>
              <p class="address">{{ location.address }}</p>
              <p class="phone">{{ location.phone }}</p>
              <p class="hours">영업시간: {{ location.hours }}</p>
            </div>
          </div>
          
          <div class="map-placeholder">
            <p>지도가 표시될 자리입니다.</p>
            <p>Google Maps 또는 카카오맵 API 연동 예정</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')

const locations = ref([
  {
    id: 1,
    name: '진정성 금거래소 강남점',
    address: '서울특별시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    hours: '09:00 - 18:00'
  },
  {
    id: 2,
    name: '진정성 금거래소 서초점',
    address: '서울특별시 서초구 서초대로 456',
    phone: '02-2345-6789',
    hours: '09:00 - 18:00'
  },
  {
    id: 3,
    name: '진정성 금거래소 홍대점',
    address: '서울특별시 마포구 홍대로 789',
    phone: '02-3456-7890',
    hours: '09:00 - 18:00'
  }
])

const filteredLocations = computed(() => {
  if (!searchQuery.value) return locations.value
  return locations.value.filter(location => 
    location.name.includes(searchQuery.value) || 
    location.address.includes(searchQuery.value)
  )
})

const searchLocations = () => {
  // 검색 로직
  console.log('검색:', searchQuery.value)
}
</script>

<style scoped>
.location-finder-page {
  min-height: 100vh;
  background-color: var(--background-light);
}

.content {
  padding: 2rem;
}

.search-section {
  margin-bottom: 2rem;
}

.search-box {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  gap: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
}

.search-button {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-button:hover {
  background: #8a6a24;
}

.locations-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.locations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.location-item {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.location-item h3 {
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
}

.address, .phone, .hours {
  color: #666;
  margin-bottom: 0.25rem;
}

.map-placeholder {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #666;
  min-height: 400px;
}

@media (max-width: 768px) {
  .locations-section {
    grid-template-columns: 1fr;
  }
}
</style> 