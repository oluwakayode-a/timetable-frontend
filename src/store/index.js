import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getAPI } from '../axios-api'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: null,
        snackbar: {
            show: false,
            variant: 'success',
            message: ''
        },
    },
    mutations: {
        updateStorage(state, token) {
            // { token }
            state.token = token
        },
        destroyToken(state) {
            state.user = null
            state.token = null
            state.isAuthenticated = false
        },
        updateSnackbar(state, settings) {
            state.snackbar = {
              ...state.snackbar,
              ...settings
            }
        }
    },
    actions: {
        userLogin(context, credentials) {
            return new Promise((resolve, reject) => {
                getAPI.post('users/login/', credentials)
                .then(response => {
                    context.commit('updateStorage', response.data.token)
                    resolve(response)
                }) 
                .catch(error => {
                    reject(error)
                })
            })
           
        },
        userRegister(context, credentials) {
            return new Promise((resolve, reject) => {
                getAPI.post('users/sign_up/', credentials)
                .then(response => {
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
            })
        },
        userLogout(context) {
            if (context.getters.loggedIn) {
                context.commit('destroyToken')
            }
        }
    },
    getters: {
        loggedIn(state) {
            return state.token != null
        }
    },
    plugins: [createPersistedState(),]
})