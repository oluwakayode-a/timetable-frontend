<template>
  <v-app>
    <Navbar v-if="!showMenu" />
    <v-main id="main" class="grey lighten-3">
      <v-container>
        <v-row>
            <!-- <Sidebar class="my-3" v-if="!showMenu" /> -->
          <v-col>
            <transition 
              name="router-anim" 
              enter-active-class="animate__animated animate__fadeInLeft" 
              leave-active-class="animate__animated animate__fadeOutRight"
              mode="out-in"
              >
              <router-view></router-view>
            </transition>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-snackbar v-model="$store.state.snackbar.show" :multi-line="true" :right="true" :top="true" :timeout="6000" :color="$store.state.snackbar.variant">
      {{ $store.state.snackbar.message }}
      <v-btn dark text @click="$store.commit('updateSnackbar', {show : false})">
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar'
// import Sidebar from './components/Sidebar'

export default {
  name: 'App',

  components: {
    Navbar,
    // Sidebar,
  },

  data: () => ({
    //
  }),
  computed: {
        showMenu() {
          return ['Login', 'Register'].includes(this.$route.name);
    }
  }
}
</script>

<style>
  @import "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.css";

  .page {
    position: sticky;
    /* width: inherit; */
  }
</style>
