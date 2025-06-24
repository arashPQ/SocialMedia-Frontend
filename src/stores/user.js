import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {

    state: () => ({
        user: {
            isAuthenticated: false,
            id: null,
            name: null,
            username: null,
            email: null,
            friends_count: null,
            access: null,
            refresh: null,
            avatar: null,
        }
    }),

    actions: {
        initStore() {

            if (localStorage.getItem('user.access')) {

                this.user.access = localStorage.getItem('user.access')
                this.user.refresh = localStorage.getItem('user.refresh')
                this.user.id = localStorage.getItem('user.id')
                this.user.name = localStorage.getItem('user.name')
                this.user.friends_count = localStorage.getItem('user.friends_count')
                this.user.username = localStorage.getItem('user.username')
                this.user.email = localStorage.getItem('user.email')
                this.user.avatar = localStorage.getItem('user.avatar')
                this.user.isAuthenticated = true

                this.refreshToken()
            }
        },

        setToken(data) {

            this.user.access = data.access
            this.user.refresh = data.refresh
            this.user.username = data.username
            this.user.isAuthenticated = true

            localStorage.setItem('user.access', data.access)
            localStorage.setItem('user.refresh', data.refresh)

        },

        removeToken() {

            this.user.refresh = null
            this.user.access = null
            this.user.isAuthenticated = false
            this.user.id = null
            this.user.name = null
            this.user.friends_count = null
            this.user.username = null
            this.user.email = null
            this.user.avatar = null

            localStorage.setItem('user.access', '')
            localStorage.setItem('user.refresh', '')
            localStorage.setItem('user.id', '')
            localStorage.setItem('user.name', '')
            localStorage.setItem('user.friends_count', '')
            localStorage.setItem('user.username', '')
            localStorage.setItem('user.email', '')
            localStorage.setItem('user.avatar', '')
        },

        setUserInfo(user) {

            this.user.id = user.id
            this.user.name = user.name
            this.user.username = user.username
            this.user.email = user.email
            this.user.friends_count = user.friends_count
            this.user.avatar = user.avatar

            localStorage.setItem('user.id', this.user.id)
            localStorage.setItem('user.name', this.user.name)
            localStorage.setItem('user.username', this.user.username)
            localStorage.setItem('user.email', this.user.email)
            localStorage.setItem('user.friends_count', this.user.friends_count)
            localStorage.setItem('user.avatar', this.user.avatar)
        },

        refreshToken() {
            axios.post('/api/refresh/', {
                refresh: this.user.refresh
            })
                .then((response) => {
                    this.user.access = response.data.access

                    localStorage.setItem('user.access', response.data.access)

                    axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.access
                })
                .catch((error)=>{
                    console.log(error)

                    this.removeToken()
                })
        },
    }
})