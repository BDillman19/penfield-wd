import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import Primevue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from "primevue/toastservice";
import Tooltip from 'primevue/tooltip';

const app = createApp(App)
app.use(Primevue, {
    theme: {
        preset: Aura
    }
})

app.use(ToastService)
app.directive('tooltip', Tooltip);
Amplify.configure(outputs);

app.mount("#app");
