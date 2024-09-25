import '@/scss/main.scss';

import Tres from '@tresjs/core';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/App.vue';

const app = createApp(App);

app.use(Tres);

app.use(createPinia());

app.mount('#app');
