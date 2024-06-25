<template>

    <v-container>
        <v-row>
            <v-col>
                <span class="text-h5 font-weight-bold">Package: <small v-if="item.id">{{ item.id }}</small></span>
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
                                    :color="({ Received: 'blue', Shipped: 'light-blue', Delivered: 'green' })[item.status]"
                                    label
                                    size="x-large"
                                >
                                    {{ item.status }}
                                </v-chip>
                            </v-card-text>

                            <v-card-title
                                v-if="item.tracking"
                                class="text-overline"
                            >
                                Tracking:
                                <div class="text-h5">
                                    {{ item.tracking }}
                                </div>
                            </v-card-title>

                            <v-card-title
                                v-if="item.weight"
                                class="text-overline"
                            >
                                Weight:
                                <div class="text-h5">
                                    {{ item.weight }}g
                                </div>
                            </v-card-title>
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
                            dot-color="orange"
                            size="small"
                            v-if="item.receivedAt"
                        >
                            <div>
                                <strong class="me-4">{{ $formatDate(item.receivedAt, 'lll') }}</strong>
                                <div>
                                    <h2>Item Received</h2>
                                    <v-img
                                        v-if="item.image"
                                        :src="item.image"
                                    ></v-img>
                                </div>
                            </div>
                        </v-timeline-item>
                        <v-timeline-item
                            dot-color="blue"
                            size="small"
                            v-if="item.shippedAt"
                        >
                            <div>
                                <strong class="me-4">{{ $formatDate(item.shippedAt, 'lll') }}</strong>
                                <div>
                                    <h2>Item Shipped</h2>
                                    <p>Tracking: {{ item.tracking }}</p>
                                </div>
                            </div>
                        </v-timeline-item>
                        <v-timeline-item
                            dot-color="green"
                            size="small"
                            v-if="item.deliveredAt"
                        >
                            <div>
                                <strong class="me-4">{{ $formatDate(item.deliveredAt, 'lll') }}</strong>
                                <div>
                                    <h2>Delivered</h2>
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

const api = inject('api');
const route = useRoute();
const itemID = route.params.itemID;

const item = ref({});
const isLoading = ref(true);
const editDialoge = ref(false);

onMounted(async () => {
    await getData();
    isLoading.value = false;
});

const getData = async () => {
    const { data } = await api.items.get(itemID);
    item.value = data;
};

</script>