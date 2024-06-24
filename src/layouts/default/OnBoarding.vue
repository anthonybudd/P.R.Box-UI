<template>
    <v-app class="bg-grey-lighten-4">
        <notifications />
        <v-app-bar
            flat
            :height="80"
        >
            <v-container
                fluid
                class="px-0 py-0"
            >
                <v-container class="d-flex align-center justify-center">
                    <div class="d-flex align-center justify-center">
                        <v-img
                            :width="30"
                            src="./../../assets/logo.png"
                        ></v-img>
                        <h1 class="ml-4">P.R. Box</h1>
                    </div>
                </v-container>
            </v-container>
        </v-app-bar>

        <DefaultView />
    </v-app>
</template>

<script setup>
import DefaultView from './View.vue';
</script>
