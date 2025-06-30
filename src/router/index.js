import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue';
import GoldPrice from '../views/GoldPrice.vue';
import PurchaseProcess from '../views/PurchaseProcess.vue';
import FAQ from '../views/FAQ.vue';
import LocationFinder from '../views/LocationFinder.vue';
import Partnership from '../views/Partnership.vue';
import RegisterStore from '@/views/RegisterStore.vue';
import ApiTestComponent from '../components/ApiTestComponent.vue';
import '../assets/styles/global.css';

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/gold-price', name: 'GoldPrice', component: GoldPrice },
    { path: '/purchase-process', name: 'PurchaseProcess', component: PurchaseProcess },
    { path: '/faq', name: 'FAQ', component: FAQ },
    { path: '/location-finder', name: 'LocationFinder', component: LocationFinder },
    { path: '/partnership', name: 'Partnership', component: Partnership },
    { path: '/register-store', name: 'RegisterStore', component: RegisterStore},
    // API 테스트 페이지 (개발 환경에서만 표시)
    { path: '/api-test', name: 'ApiTest', component: ApiTestComponent },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        return { top: 0 }
    }
})

export default router;