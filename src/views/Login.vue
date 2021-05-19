<template>
   <v-app id="inspire" style="background: none;">
      <v-main>
         <v-container fluid fill-height>
            <v-layout align-center justify-center>
               <v-flex xs12 sm8 md4>
                  <v-card class="elevation-12">
                     <v-toolbar dark color="primary">
                        <v-toolbar-title>Login</v-toolbar-title>
                     </v-toolbar>
                        <v-form @submit.prevent="handleSubmit">
                           <v-card-text>
                              <v-text-field
                                 prepend-icon="mdi-account"
                                 name="username"
                                 label="Username"
                                 type="text"
                                 v-model="username"
                                 :error-messages="usernameErrors"
                                 @blur="$v.username.$touch()"
                                 @input="$v.username.$touch()"
                              ></v-text-field>
                              <v-text-field
                                 id="password"
                                 prepend-icon="mdi-lock"
                                 name="password"
                                 label="Password"
                                 type="password"
                                 v-model="password"
                                 :error-messages="passwordErrors"
                                 @blur="$v.password.$touch()"
                                 @input="$v.password.$touch()"
                              ></v-text-field>
                              <p v-if="incorrectAuth">Incorrect Username or Password</p>
                              <v-card-actions>
                                 <v-btn color="primary" type="submit" :loading="loading">Login</v-btn>
                                 <v-spacer></v-spacer>
                                <v-btn color="primary" type="button" to="/register">Register</v-btn>
                              </v-card-actions>
                           </v-card-text>
                        </v-form>
                  </v-card>
               </v-flex>
            </v-layout>
         </v-container>
      </v-main>
   </v-app>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
   name: 'Login',
   data() {
      return {
         username: '',
         password: '',
         incorrectAuth: false,
         loading: false,
      }
   },
   mixins: [validationMixin],
   validations: {
      username: {
         required,
      },
      password: {
         required,
      }
   },
   computed: {
      usernameErrors() {
         const errors = []
         if (!this.$v.username.$dirty) return errors
         !this.$v.username.required && errors.push("This field is required")
         return errors
      },
      passwordErrors() {
         const errors = []
         if (!this.$v.password.$dirty) return errors
         !this.$v.password.required && errors.push("This field is required")
         return errors
      }
   },
   methods: {
      handleSubmit() {
         this.$v.$touch();
         if (!this.$v.$error) {
            this.login()
            this.clear()
            this.$store.commit('updateSnackbar', {show : true, message: "Logged in successfully."})
         }
      },
      clear() {
         this.$v.$reset()
         this.username = ""
         this.password = ""
      },
      login() {
         this.loading = true
         const userData = {
            username : this.username,
            password : this.password
         }
         this.$store.dispatch("userLogin", userData)
         .then(() => {
            // console.log(response.data)
            this.$router.push({path: '/'})
         })
         .catch(error => {
            console.log(error)
            this.incorrectAuth = true;
         })

         this.username = ""
         this.password = ""
      }
   }
};
</script>

<style></style>