import Vue from 'vue';
import Vuex from 'vuex';
import Element from 'element-ui'
import AppMain from './App.vue';
import Axios from 'axios';
import './styles/element-ui.css';
import './styles/layout.css';

Vue.use(Element);

const VueApp = new Vue({
    el: "#app",
    components: {
        'app-main': AppMain,
    }
});
window.VueApp = VueApp;
