<template>
    <main class="px-8 py-6 bg-gray-100">
        <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
            <div class="main-left col-span-1">
                <div class="p-4 bg-white border border-gray-200 text-center rounded-lg">
                    <div class="space-y-4">
                        <div class="flex items-center justify-between" 
                        v-for="conversation in conversations" 
                        v-bind:key="conversation.id" 
                        v-on:click="setActiveConversation(conversation.id)">
                            <div class="flex items-center space-x-2">
                                
                                
                                <template 
                                v-for="user in conversation.users"
                                v-bind:key="user.id"
                                >
                                    <img v-if="user.id !== userStore.user.id" :src="user.get_avatar" class="w-[40px] rounded-full">
                                    <p class="text-xs" v-if="user.id !== userStore.user.id">{{ user.name }}</p>

                                </template>
                            </div>
                            <span class="text-xs text-gray-500">{{ conversation.modified_at_formatted }} ago</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="main-center col-span-3 space-y-4">
                <div class="bg-white border border-gray-200 rounded-lg ">
                    <div class="flex flex-col flex-grow p-4">
                        <template v-for="message in activeConversation.messages" v-bind:key="message.id">
                            <div 
                                class="flex w-full mt-2 space-x-3 max-w-md ml-auto justify-end"
                                v-if="message.created_by.id == userStore.user.id"
                            >
                                <div>
                                    <div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                                        <p class="text-sm">{{ message.body }}</p>
                                    </div>
                                    <span class="text-xs text-gray-500 leading-none">{{ message.created_at_formatted }} ago</span>
                                </div>
                                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
                                    <img :src="message.created_by.get_avatar" class="w-[40px] rounded-full">
                                </div>
                            </div>

                            <div 
                                class="flex w-full mt-2 space-x-3 max-w-md"
                                v-else
                            >
                                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
                                    <img :src="message.created_by.get_avatar" class="w-[40px] rounded-full">
                                </div>
                                <div>
                                    <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                                        <p class="text-sm">{{ message.body }}</p>
                                    </div>
                                    <span class="text-xs text-gray-500 leading-none">{{ message.created_at_formatted }} ago</span>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="bg-white border border-gray-200 rounded-lg">
                    <form v-on:submit.prevent="submitForm" action="">
                        <div class="p-4">  
                            <textarea v-model="body" class="p-4 w-full bg-gray-100 rounded-lg resize-none" placeholder="What do you want to say?"></textarea>
                        </div>
                        <div class="p-4 border-t border-gray-100 flex justify-between">
                            <button href="#" class="inline-block py-4 px-6 bg-purple-600 text-white rounded-lg">
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import { defineComponent } from 'vue';
import { useUserStore } from '@/stores/user';

export default defineComponent( {
    name: 'Conversation',

    setup() {
        const userStore = useUserStore()

        return {
            userStore
        }
        
    },

    data() {
        return{
            conversations: [],
            activeConversation: {},
            body: ''
        }
    },

    mounted() {
        this.getConversations()
    },
    methods: {
        setActiveConversation(id) {
            console.log("set conversation id: ", id);
            this.activeConversation = id
            this.getMessages()
        },

        getConversations() {
            axios.get('/api/chat/')
            .then(response => {
                this.conversations = response.data
                if (this.conversations.length){
                    this.activeConversation = this.conversations[0].id
                }
                this.getMessages()
                
            })
            .catch(error => {
                console.log(error);  
            })
            
        },

        getMessages() {
            axios.get(`/api/chat/${this.activeConversation}/`)
            .then(response => {
                this.activeConversation = response.data
                
            })
            .catch(error => {
                console.log(error);  
            })
        },

        submitForm() {
            axios.post(`/api/chat/${this.activeConversation.id}/send/`, {body: this.body})
            .then(response => {
                this.activeConversation.messages.push(response.data)
                this.body = ''
                
            })
            .catch(error => {
                console.log(error);
                
            })
            
        },

        
    }
})
</script>