// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'; // 完整导入 Element Plus
import 'element-plus/dist/index.css';

const app = createApp(App);
app.use(ElementPlus);
app.use(router);

app.mount('#app');
