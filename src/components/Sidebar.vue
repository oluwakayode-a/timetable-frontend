<template>
  <v-sheet rounded="lg">
    <v-navigation-drawer permanent floating class="rounded-lg" expand-on-hover>
        <v-list color="transparent" nav>
            <v-list-item link to="/">
                <v-list-item-icon>
                    <v-icon>mdi-home-city</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>My Timetables</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link to="/manage-user">
                <v-list-item-icon>
                    <v-icon>mdi-account-settings</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>My Account</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
  </v-sheet>
</template>