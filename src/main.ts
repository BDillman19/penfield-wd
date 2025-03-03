import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import Primevue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from "primevue/toastservice";
import Tooltip from 'primevue/tooltip';
import { createRouter, createWebHistory } from 'vue-router'
import Customers from './components/Customers.vue'
import Dashboard from './components/Dashboard.vue'
import MainMeter from "./components/MainMeter.vue";
import MeterReadingMode from "./components/MeterReadingMode.vue";

const routes = [
    { path: '/', redirect: {name: 'Dashboard'}},
    { path: '/customers', name: 'Customers', component: Customers },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard },
    { path: '/main-meter', name: 'Main Meter', component: MainMeter},
    { path: '/meter-reading-mode', name: 'Meter Reading Mode', component: MeterReadingMode},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
const app = createApp(App)
app.use(Primevue, {
    theme: {
        preset: Aura
    }
})

app.use(ToastService)
app.use(router)
app.directive('tooltip', Tooltip);
Amplify.configure(outputs);

app.mount("#app");
