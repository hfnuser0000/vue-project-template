import Vue from 'vue';
import Vuex from 'vuex';
import Element from 'element-ui'
import AppMain from './App.vue';
import Axios from 'axios';
import _ from 'lodash';
import store from './store';

Vue.use(Element);

window._ = _;
const VueApp = new Vue({
    el: "#app",
    components: {
        'app-main': AppMain,
    },
    router: new VueRouter({
    }),
    store,
    methods: {
        goBack() {
            window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
        },
        goForward() {
            this.$router.go(1);
        }
    }
});
window.VueApp = VueApp;
