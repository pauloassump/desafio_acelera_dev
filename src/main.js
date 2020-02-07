import Vue from 'vue'
import App from './App.vue'
const cors = require('cors');

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

module.exports = app => {
  app.use(cors());
}