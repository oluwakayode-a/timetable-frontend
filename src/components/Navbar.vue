<template>
    <div>
        <v-app-bar elevate-on-scroll scroll-target="#main" color="white">
            <v-container class="py-0 fill-height" fluid>
                <router-link to="/" tag="div" style="cursor:pointer">
                    <v-toolbar-title>
                        <v-icon left x-large>mdi-table</v-icon>
                        Timetable
                    </v-toolbar-title>
                </router-link>
                <v-spacer></v-spacer>

                <!-- <v-app-bar-nav-icon class="hidden-sm-and-up" @click.stop="navOpen = !navOpen"></v-app-bar-nav-icon> -->

                <v-toolbar-items>
                    <v-menu open-on-hover bottom offset-y=true>
                        <template v-slot:activator="{on, attrs}">
                            <v-btn text v-bind="attrs" v-on="on">
                                {{ username }}
                                <v-icon>mdi-menu-down</v-icon>
                            </v-btn>
                        </template>

                        <v-list>
                            <v-list-item>
                                <v-btn text link @click="logout">
                                    Logout
                                </v-btn>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-toolbar-items>
            </v-container>
        </v-app-bar>

        <!-- <v-navigation-drawer v-model="navOpen" app temporary right>
            <v-list>
                <v-list-item>
                    <v-menu open-on-hover bottom offset-y=true>
                        <template v-slot:activator="{on, attrs}">
                            <v-btn text v-bind="attrs" v-on="on">
                                John Doe
                                <v-icon>mdi-menu-down</v-icon>
                            </v-btn>
                        </template>

                        <v-list>
                            <v-list-item>
                                <v-btn text link @click="logout">
                                    Logout
                                </v-btn>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-list-item>
            </v-list>
        </v-navigation-drawer> -->
    </div>
</template>

<script>
import { getAPI } from '../axios-api'
  export default {
    data: () => ({
      username: ''
    }),
    methods: {
        logout() {
            this.$store.dispatch("userLogout")
            .then(() => {
                this.$router.push({name : 'Login'})
            })
        }
    },
    created() {
        let token = this.$store.state.token
        getAPI.get('users/me/', {
            headers: {
                'Authorization' : `Token ${token}`
            }
        })
        .then(response => {
            this.username = response.data.username
        })
        .catch(error => {
            console.log(error)
        })
        
    },
  }
</script>