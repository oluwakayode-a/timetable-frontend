<template>
   <v-app style="background: none;">
      <v-main>
         <v-container fluid fill-height>
            <v-layout align-center justify-center>
               <v-flex xs12 sm8 md4>
                  <v-card class="elevation-12">
                     <v-toolbar dark color="primary">
                        <v-toolbar-title>Register</v-toolbar-title>
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
                              prepend-icon="mdi-email"
                              name="email"
                              label="Email"
                              type="email"
                              v-model="email"
                              :error-messages="emailErrors"
                              @blur="$v.email.$touch()"
                              @input="$v.email.$touch()"
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
                           <div v-if="incorrectAuth">
                              <p v-for="message in errorMessage" :key="message">{{ message[0] }}</p>
                           </div>
                            <v-card-actions mt-3>
                                <v-btn color="primary" type="submit" :loading="loading">Register</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" type="button" to="/login">Login</v-btn>
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
import { required, minLength, email } from 'vuelidate/lib/validators'

export default {
   name: 'Register',
   data() {
      return {
         username: '',
         email: '',
         password: '',
         incorrectAuth: false,
         errorMessage: {},
         loading: false
      }
   },
   mixins: [validationMixin],
   validations: {
      username: {
         required,
         minLength: minLength(5)
      },
      email: {
         required,
         email
      },
      password: {
         required,
         minLength: minLength(8)
      }
   },
   computed: {
      usernameErrors() {
         const errors = []
         if (!this.$v.username.$dirty) return errors
         !this.$v.username.minLength && errors.push("Name should not be less than 5 characters")
         !this.$v.username.required && errors.push("This field is required")
         return errors
      },
      emailErrors() {
         const errors = []
         if (!this.$v.email.$dirty) return errors
         !this.$v.email.email && errors.push("Email format incorrect.")
         !this.$v.email.required && errors.push("This field is required")
         return errors
      },
      passwordErrors() {
         const errors = []
         if (!this.$v.password.$dirty) return errors
         !this.$v.password.minLength && errors.push("Password should not be less than 5 characters")
         !this.$v.password.required && errors.push("This field is required")
         return errors
      }
   },
   methods: {
      handleSubmit() {
         this.$v.$touch();
         if (!this.$v.$error) {
            this.register()
            this.clear()
         }
      },
      clear() {
         this.$v.$reset()
         this.username = ""
         this.password = ""
         this.email = ""
      },
      register() {
         this.loading = true
         this.errorMessage = {}
         
         const userData = {
            username : this.username,
            email: this.email,
            password : this.password
         }
         this.$store.dispatch('userRegister', userData)
         .then(response => {
            console.log(response)
            this.$store.commit('updateSnackbar', {show : true, message: "Registered successfully. Log in."})
            this.$router.push({path : 'login'})
         })
         .catch(error => {
            this.incorrectAuth = true
            this.errorMessage = error.response.data
            // console.log(error.response)
         })
         .finally(() => this.loading = false)
      }
   }
};
</script>

<style></style>