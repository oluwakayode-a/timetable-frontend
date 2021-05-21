<template>
    <div>
        <v-container>
            <h1>{{ title }}</h1>
            <v-data-table 
                :headers="headers" 
                :items="schedule"
                :loading="loading"
                loading-text="Loading... Please wait"
                :items-per-page="5" 
                class="elevation-1">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>My CRUD</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>

                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                    New Item
                                </v-btn>
                            </template>

                            <v-card>
                                <v-card-title>
                                    <span class="headline">{{ formTitle }}</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="4" v-for="(item, key) in editedItem" :key="key">
                                                <v-text-field :label="key" solo v-model="editedItem[key]"></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="close">
                                        Cancel
                                    </v-btn>
                                    <v-btn color="blue darken-1" text @click="save">
                                        Save
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        
                        <v-dialog v-model="dialogDelete" max-width="500px">
                            <v-card>
                                <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                    <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
                    <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
                </template>
                <template v-slot:no-data>
                    No data in table
                </template>    
            </v-data-table>
        </v-container>
    </div>
</template>

<script>
import { getAPI } from "../axios-api";

export default {
    props: {
        id: String
    },
    data() {
        return {
            loading: false,
            title: "",
            dialog: false,
            dialogDelete: false,
            time_intervals: [],
            headers: [
                {
                    text: "Days",
                    align: "start",
                    sortable: false,
                    value: "day",
                },
            ],
            schedule: [
                
            ],
            editedIndex: -1,
            editedItem: null,
            defaultItem: null
        }
    },
    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
        },
    },

    watch: {
        dialog (val) {
        val || this.close()
        },
        dialogDelete (val) {
        val || this.closeDelete()
        },
    },
    methods: {
        editItem (item) {
            this.editedIndex = this.schedule.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem (item) {
            this.editedIndex = this.schedule.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm () {
            this.schedule.splice(this.editedIndex, 1)
            this.closeDelete()
        },

        close () {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete () {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        save () {
            if (this.editedIndex > -1) {
                Object.assign(this.schedule[this.editedIndex], this.editedItem)

                // save the editedItem in a new Object.
                const data = Object.assign({}, this.editedItem)
                let day = data["day"]
                
                // Get entry instance from API
                getAPI.get(`/timetable/${this.$route.params.id}/get/${day}/`, {
                    headers: {
                        'Authorization' :  `Token ${this.$store.state.token}`
                    }
                })
                .then(response => {
                    let entry_id = response.data["entry_id"]
                    delete data.day
                    for (let [key, value] of Object.entries(data)) {
                        if(value !== "") {
                            this.updateEntryItem(entry_id, key, value)
                        }
                    }
                })
                .catch(error => console.log(error))
                // update entry
            } else {
                // New entry
                this.newEntry()
                this.schedule.push(this.editedItem)
            }
            this.close()
        },
        newEntry() {
            // Make a copy of the edited item.
            const data = Object.assign({}, this.editedItem)

            getAPI.post(`/timetable/${this.$route.params.id}/entries/`, {
                day: this.editedItem.day,
                table: parseInt(this.$route.params.id),
            }, {
                headers: {
                   'Authorization' :  `Token ${this.$store.state.token}`
                }
            })
            .then(response => {
                let entryID = response.data.id

                // remove the day key from the Object.
                delete data.day
                // Loop through all the models
                for (let [key, value] of Object.entries(data)) {
                    if(value !== "") {
                        this.newEntryItem(entryID, key, value)
                    }
                }
            })
            .catch(error => console.log(error))
        },
        newEntryItem(entryID, time_range, activity) {
            getAPI.post(`/timetable/entry_item/create/`, {
                time_range: time_range,
                activity: activity,
                entry: parseInt(entryID)
            }, {
                headers: {
                   'Authorization' :  `Token ${this.$store.state.token}`
                }
            })
        },
        updateEntryItem(entryID, time, activity) {
            getAPI.patch(`/timetable/entry_item/${entryID}/${time}/`, {
                activity: activity
            }, {
                headers: {
                   'Authorization' :  `Token ${this.$store.state.token}`
                }
            })
            .then(response => {
                console.log(response)
            })
            .catch(error => console.log(error))
        },
        fetchItems() {
            this.loading = true;
            const newItem = {
                day: ''
            }
            getAPI.get(`/timetable/${this.$route.params.id}`, {
                headers: {
                    'Authorization' :  `Token ${this.$store.state.token}`
                }
            })
            .then(response => {
                // console.log(response.data)
                // Save time intervals
                this.time_intervals = response.data.get_time_intervals
                this.title = response.data.title

                for (let i of response.data.entries) {
                    // init empty Object
                    let entries = {}
                    // Add the day to the Object
                    entries["day"] = i.day
                    // Loop through the items in each entry and add them to the object
                    for (let j of i.items) {
                        entries[j.time_range] = j.activity
                    }

                    // check if every time_range has been filled, if it has not,
                    // set it to an empty string.
                    for (let k of this.time_intervals) {
                        if (Object.prototype.hasOwnProperty.call(entries,k) === false) {
                            entries[k] = ""
                        }
                    }
                    // Add the object to the data.
                    this.schedule.push(entries)
                }
                // console.log(this.time_intervals)
                for (let i of this.time_intervals) {
                    this.headers.push({
                        text: i,
                        value: i,
                        sortable: false
                    })
                    newItem[i] = ""
                }
                this.headers.push({
                    text: "Actions",
                    value:  'actions',
                    sortable: false
                })

                this.editedItem = Object.assign({}, newItem)
                this.defaultItem = Object.assign({}, newItem)

            })
            .catch(error => console.log(error))
            .finally(() => this.loading = false)
        },
    },
    created() {
        this.fetchItems();
        this.loading = false;
    },
        
};
</script>