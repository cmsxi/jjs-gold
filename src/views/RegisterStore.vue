<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 py-10">
        <h1 class="text-3xl font-bold text-gray-800 mb-10">지점 등록</h1>
        <div class="flex flex-col md:flex-row gap-6">

            <!-- 지점 정보 입력 -->
            <div class="w-full md:w-2/5 bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg font-semibold text-gray-800"> 지점 정보 입력 </h2>
                    <button class="px-4 py-2 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 transition"> 등록하기 </button>
                </div>
                <div class="space-y-4">
                    <div>
                        <label for="region" class="blank text-sm font-medium text-gray-700 mb-1">지역 *</label>
                        <select id="region" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-400">  
                            <option v-for="region in regionOptions" :key="region" :value="region">
                                {{ region }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label for="name" class="blank text-sm font-medium text-gray-700 mb-1">협력점명 *</label>
                        <input id="name" type="text" required
                         class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-400" />
                    </div>
                    <div>
                        <label for="address" class="blank text-sm font-medium text-gray-700 mb-1">주소 *</label>
                        <input id="address" type="text" required
                         class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-400" />
                    </div>
                    <div>
                        <label for="phone" class="blank text-sm font-medium text-gray-700 mb-1">전화번호 *</label>
                        <input id="phone" type="text" required
                         class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-400" />
                    </div>
                </div>
            </div>

            <!-- 지점 테이블 -->
            <div class="w-full md:w-3/5 bg-white rounded-lg shadow-md overflow-x-auto">
                <table class="min-w-full text-sm table-auto">
                <thead class="bg-gray-100 text-gray-700 text-center">
                    <tr>
                        <th class="px-4 py-3 w-1/12">지역</th>
                        <th class="px-4 py-3 w-2/12">협력점명</th>
                        <th class="px-4 py-3 w-3/12">주소</th>
                        <th class="px-4 py-3 w-2/12">전화번호</th>
                        <th class="px-4 py-3 w-2/12">문의하기</th>
                        <th class="px-4 py-3 w-2/12">약도보기</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="location in filteredLocations" :key="location.id">
                        <td>{{ location.district }}</td>
                        <td class="px-4 py-3">{{ location.name }}</td>
                        <td class="px-4 py-3 text-left font-medium text-gray-800">{{ location.address }}</td>
                        <td class="px-4 py-3 text-left break-words max-w-[300px] leading-snug">{{ location.phone }}</td>
                        <td class="px-4 py-3"> 
                            <button class="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-4 py-1 rounded-full shadow transition">
                                톡채널
                            </button>
                        </td>
                        <td class="px-4 py-3">
                            <button @click="showMap(location)" class="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1 rounded transition">
                                MAP
                            </button>
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedRegion = ref('')
const regionOptions =ref([
    '본점', '서울강남', '서울강북', '경기남부', '경기북부', '인천', '부산', '울산', '경상남도', '경상북도',
    '대구', '대전', '세종', '충청남도', '충청북도', '전라남도', '전라북도', '광주', '강원도', '제주'
])
</script>

<style scoped>

</style>
