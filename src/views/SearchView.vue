<template>
    <main class="px-8 py-6 bg-gray-100">
        <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
            <div class="main-center col-span-3 space-y-4">
                <div class="bg-white border border-gray-200 rounded-lg">
                    <form v-on:submit.prevent="submitForm" class="p-4 flex space-x-4">
                        <input v-model="query" type="text" class="p-4 w-full bg-gray-100 rounded-lg" placeholder="What are you looking for?">
                        <button class="inline-block py-4 px-6 bg-purple-600 text-white rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
                            </svg> 
                        </button>
                    </form>
                </div>


                <div class="p-4 bg-white border border-gray-200 rounded-lg grid grid-cols-4 gap-4">
                    <div class="p-4 text-center bg-gray-100 rounded-lg" v-for="user in users" v-bind:key="user.id">
                        <img :src="user.get_avatar" class="mb-6 rounded-full">
                        <p>
                            <strong>
                                <RouterLink :to="{'name': 'profile', params:{'id': user.id}}">{{ user.name }}</RouterLink>
                            </strong>
                        </p>
                        <div class="mt-6 flex space-x-8 justify-around">
                            <p class="text-xs text-gray-500">{{ user.friends_count }} friends</p>
                            <p class="text-xs text-gray-500">{{ user.posts_count }} posts</p>
                        </div>
                    </div>
                </div>


                <div 
                    class="p-4 bg-white border border-gray-200 rounded-lg"
                    v-for="post in posts"
                    v-bind:key="post.id"
                >
                    <FeedPosts v-bind:post="post" />
                </div>
            </div>

            <div class="main-right col-span-1 space-y-4">
                <PeopleYouMayKnow />
                <Trends />
            </div>

        </div>
    </main>
</template>

<script>
import axios from 'axios';
import Trends from '@/components/Trends.vue';
import PeopleYouMayKnow from '@/components/PeopleYouMayKnow.vue';
import FeedPosts from '@/components/FeedPosts.vue';



export default {
    name: "SearchView",

    components:{
        Trends,
        PeopleYouMayKnow,
        FeedPosts
    },

    data() {
        return {
            query: '',
            users: [],
            posts: []
        }
    },

    methods: {
        submitForm() {
            if (this.query === '') {
                this.errors.push('You need post something')
            }
            axios
            .post('/search/', {
                'query': this.query
            })
            .then(response => {
                
                this.users = response.data.users
                this.posts = response.data.posts
            })
            .catch(error => {
                console.log('error: ', error);
                
            })
            
        }
    }
}


</script>