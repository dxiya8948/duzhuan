import Vue from 'vue'
import App from './App'

require('@/utils/post.js')
// require('./utils/uploadFile.js')

Vue.config.productionTip = false

console.log(11111)

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
