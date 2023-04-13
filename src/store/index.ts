import { createStore } from 'vuex'
export default createStore({
  state: {
    name: 'vueX',
    userInfo:null,
    token:null,
  },
  mutations: {
    initUserInfo(state,userInfo){
      state.userInfo = userInfo;
    },
    initToken(state,token){
      state.token = token;
    },
  }
})