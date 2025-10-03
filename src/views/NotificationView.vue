<template>
    <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
        <div class="main-center col-span-3 space-y-4">
            <div 
                class="p-4 bg-white flex items-center justify-between border border-gray-200 rounded-lg"
                v-for="notification in notifications"
                v-bind:key="notification.id"
                v-if="notifications.length"
            >
                {{ notification.body }} 

                <button
                class="py-2 px-3 bg-purple-600 text-white text-xs rounded-lg"
                @click="showNotif(notification)">
                    Show Detail
                </button>
            </div>

            <div 
                class="p-4 bg-white font-bold text-[16px] border border-gray-200 rounded-lg"
                v-else
            >
                You don't have any unread notifications!
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'notifications',

    data() {
        return {
            notifications: []
        }
    },

    mounted() {
        this.getNotifications()
    },

    methods: {
        getNotifications() {
            axios
                .get('/api/notifications/')
                .then(response => {
                    this.notifications = response.data
                })
                .catch(error => {
                    console.log('Error: ', error)
                })
        },

        async showNotif(notification) {

            await axios
                .post(`/api/notifications/${notification.id}/read/`)
                .then(response => {

                    if (notification.type_of_notification == 'postlike' || notification.type_of_notification == 'postcomment') {
                        this.$router.push({name: 'post', params: {id: notification.post_id}})
                    } else {
                        this.$router.push({name: 'followers', params: {id: notification.created_for_id}})
                    }
                })
                .catch(error => {
                    console.log('Error: ', error)
                })
        }
    }
}
</script>