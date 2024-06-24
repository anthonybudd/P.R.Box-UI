<template>

    <v-container>
        <v-row>
            <v-col>
                <span class="text-h5 font-weight-bold">Package: <small v-if="pkg.id">{{ pkg.id }}</small></span>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="4">
                <v-sheet
                    variant="outlined"
                    class="mx-auto mb-2"
                    border
                    rounded
                >
                    <v-row>
                        <v-col cols="12">
                            <v-card-title class="text-overline">
                                Status
                            </v-card-title>
                            <v-card-text>
                                <v-chip
                                    :color="({ Received: 'blue', Shipped: 'light-blue', Delivered: 'green' })[pkg.status]"
                                    label
                                    size="x-large"
                                >
                                    {{ pkg.status }}
                                </v-chip>
                            </v-card-text>

                            <v-card-title
                                v-if="pkg.tracking"
                                class="text-overline"
                            >
                                Tracking:
                                <div class="text-h5">
                                    {{ pkg.tracking }}
                                </div>
                            </v-card-title>

                            <v-card-title
                                v-if="pkg.weight"
                                class="text-overline"
                            >
                                Weight:
                                <div class="text-h5">
                                    {{ pkg.weight }}g
                                </div>
                            </v-card-title>

                            <v-card-title
                                v-if="pkg.image"
                                class="text-overline"
                            >
                                Image:
                            </v-card-title>
                            <v-img
                                v-if="pkg.image"
                                :src="pkg.image"
                            ></v-img>
                        </v-col>
                    </v-row>
                </v-sheet>
            </v-col>

            <v-col cols="8">
                <v-sheet
                    variant="outlined"
                    border
                    rounded
                >
                    <v-timeline
                        align="start"
                        side="end"
                    >
                        <v-timeline-item
                            dot-color="pink"
                            size="small"
                        >
                            <div class="d-flex">
                                <strong class="me-4">5pm</strong>
                                <div>
                                    <strong>New Icon</strong>
                                    <div class="text-caption">
                                        Mobile App
                                    </div>
                                </div>
                            </div>
                        </v-timeline-item>

                        <v-timeline-item
                            dot-color="teal-lighten-3"
                            size="small"
                        >
                            <div class="d-flex">
                                <strong class="me-4">3-4pm</strong>
                                <div>
                                    <strong>Design Stand Up</strong>
                                    <div class="text-caption mb-2">
                                        Hangouts
                                    </div>
                                </div>
                            </div>
                        </v-timeline-item>

                        <v-timeline-item
                            dot-color="pink"
                            size="small"
                        >
                            <div class="d-flex">
                                <strong class="me-4">12pm</strong>
                                <div>
                                    <strong>Lunch break</strong>
                                </div>
                            </div>
                        </v-timeline-item>

                        <v-timeline-item
                            dot-color="teal-lighten-3"
                            size="small"
                        >
                            <div class="d-flex">
                                <strong class="me-4">9-11am</strong>
                                <div>
                                    <strong>Finish Home Screen</strong>
                                    <div class="text-caption">
                                        Web App
                                    </div>
                                </div>
                            </div>
                        </v-timeline-item>
                    </v-timeline>
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>

</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import BookUpdateForm from './../components/BookUpdateForm.vue';
import BookDeleteConfirmation from './../components/BookDeleteConfirmation.vue';

const api = inject('api');
const route = useRoute();
const packageID = route.params.packageID;

const pkg = ref({});
const isLoading = ref(true);
const editDialoge = ref(false);

onMounted(async () => {
    await getData();
    isLoading.value = false;
});

const getData = async () => {
    const { data } = await api.pkg.get(packageID);
    pkg.value = data;
};

const onClose = () => {
    editDialoge.value = false;
    getData();
};  
</script>