<template>
  <v-form @submit.prevent="handleSubmit">
    <v-row>
      <v-col>
        <v-text-field
          name="table"
          label="Table Name"
          :counter="50"
          :error-messages="tableNameErrors"
          @blur="$v.table_name.$touch()"
          @input="$v.table_name.$touch()"
          v-model="table_name"
          solo
        ></v-text-field>
      </v-col>

      <v-col>
        <v-text-field
          name="table_length"
          type="number"
          label="Number of Columns"
          v-model="table_length"
          :error-messages="tableLengthErrors"
          @blur="$v.table_length.$touch()"
          @input="$v.table_length.$touch()"
          solo
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-label>
          Start Time <br />
          <v-time-picker 
            v-model="start_time"
            :error-messages="startTimeErrors"
            @blur="$v.start_time.$touch()"
            @input="$v.start_time.$touch()"
            ></v-time-picker>
        </v-label>
      </v-col>

      <v-col>
        <v-text-field
          name="interval"
          label="Time interval (in minutes)"
          :error-messages="timeIntervalErrors"
          @blur="$v.time_interval.$touch()"
          @input="$v.time_interval.$touch()"
          solo
          v-model="interval"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn outlined color="primary" dark type="submit">Add Table</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { getAPI } from '../axios-api'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength, numeric } from 'vuelidate/lib/validators'

export default {
    data() {
        return {
            table_name: '',
            interval: '',
            start_time: '',
            table_length: '',
        }
    },
    props: {
      fetchTables: Function
    },
    mixins: [validationMixin],
    validations: {
      table_name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(50)
      },
      interval: {
        required,
        numeric
      },
      start_time: {
        required
      },
      table_length: {
        required,
        maxLength: maxLength(2),
        numeric
      }

    },
    computed: {
      tableNameErrors() {
        const errors = []
        if (!this.$v.table_name.$dirty) return errors
        !this.$v.table_name.minLength && errors.push("Name should not be less than 3 characters")
        !this.$v.table_name.maxLength && errors.push("Name should not be more than 50 characters")
        !this.$v.table_name.required && errors.push("This field is required")
        return errors
      },
      timeIntervalErrors() {
        const errors = []
        if (!this.$v.interval.$dirty) return errors
        !this.$v.interval.required && errors.push("This field is required")
        !this.$v.interval.numeric && errors.push("Only numbers are allowed.");
        return errors
      },
      startTimeErrors() {
        const errors = []
        if (!this.$v.start_time.$dirty) return errors
        !this.$v.start_time.required && errors.push("This field is required")
        return errors
      },
      tableLengthErrors() {
        const errors = []
        if (!this.$v.table_length.$dirty) return errors
        !this.$v.table_length.required && errors.push("This field is required")
        !this.$v.table_length.numeric && errors.push("Only numbers are allowed.");
        !this.$v.table_length.maxLength && errors.push("Length should not be more than 2 characters")
        return errors
      }
    },
    methods: {
      handleSubmit() {
        this.$v.$touch();
        if (!this.$v.$error) {
          this.addTable()
          this.clear()
          this.$store.commit('updateSnackbar', {show : true, message: "Table created successfully."})
          this.$props.fetchTables()
        }
      },
      addTable() {
          getAPI.post("/timetable/", {
              title: this.table_name,
              interval: this.interval,
              start_time: this.start_time,
              table_length: this.table_length,
          }, {
              headers: {
                  'Authorization' :  `Token ${this.$store.state.token}`
              }
          })
          .then(response => console.log(response))
          .catch(err => console.log(err))
    },
    clear() {
      this.$v.$reset()
      this.table_name = ""
      this.table_length = ""
      this.interval = ""
    }
  }
}
</script>