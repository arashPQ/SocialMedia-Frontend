<template>
    <div class="p-4 bg-white border border-gray-200 rounded-lg">
        <h3 class="mb-6 text-xl">People you may know</h3>

        <div class="space-y-4">
            <div v-for="user in users" v-bind:key="user.id" class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <img :src="user.get_avatar" class="w-[40px] rounded-full">             
                    <p class="text-xs"><strong>{{ user.name }}</strong></p>
                </div>
                <RouterLink :to="{'name': 'profile', params:{'id': user.id}}" class="py-2 px-3 bg-purple-600 text-white text-xs rounded-lg">
                    Show Profile
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { defineComponent } from 'vue';


export default defineComponent ({
    data() {
        return {
            users: []
        }
    },
    mounted() {
        this.getPeoplesSuggestion()
    },
    methods: {
        getPeoplesSuggestion() {
            axios.get('/api/followers/suggested/')
            .then(response => {
                this.users = response.data
                
            })
            .catch(error => {
                console.log(error);
                
            })
        }
    }
})

</script>