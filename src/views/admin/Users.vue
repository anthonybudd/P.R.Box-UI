<template>
    <v-container>
        <h1 class="text-h5 font-weight-bold mb-2">Users</h1>

        <v-row>
            <v-col
                md="12"
                xs="12"
            >
                <v-card class="fill-height">
                    <v-card-text>
                        <v-data-table
                            :search="search"
                            :headers="headers"
                            :items="items"
                            :loading="isLoading"
                        >
                            <template v-slot:item.image="{ item }">
                                <div class="px-4 py-4">
                                    <v-img
                                        :width="200"
                                        aspect-ratio="1/1"
                                        cover
                                        :src="item.image"
                                    ></v-img>
                                </div>
                            </template>
                            <template v-slot:item.tracking="{ item }">
                                <span v-if="item.tracking">
                                    {{ item.tracking }}
                                </span>
                                <div
                                    v-else
                                    class="d-flex"
                                >
                                    <v-text-field
                                        v-model="item.tracking"
                                        label="Tracking"
                                        variant="outlined"
                                        density="dense"
                                    ></v-text-field>
                                    <v-btn
                                        size="small"
                                        color="primary"
                                        class="ml-2"
                                    >Set</v-btn>
                                </div>
                            </template>
                            <template v-slot:item.status="{ item }">
                                <v-select
                                    v-model="item.status"
                                    :disabled="item.status === 'Delivered'"
                                    density="dense"
                                    :items="['Received', 'Shipped', 'Delivered']"
                                    variant="outlined"
                                    @update:modelValue="onChangeStatus(item)"
                                ></v-select>
                            </template>
                            <template v-slot:item.price="{ item }">
                                <span v-if="item.price">
                                    {{ item.price }}
                                </span>
                                <div
                                    v-else
                                    class="d-flex"
                                >
                                    <v-text-field
                                        v-model="item.price"
                                        label="Price"
                                        variant="outlined"
                                        density="dense"
                                    ></v-text-field>
                                    <v-btn
                                        size="small"
                                        color="primary"
                                        class="ml-2"
                                    >Set</v-btn>
                                </div>
                            </template>
                            <template v-slot:item.actions="{ item }">
                                <v-btn
                                    variant="tonal"
                                    size="small"
                                    :to="`/admin/items/${item.id}`"
                                >
                                    Open
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>


<script setup>
import { ref, computed, inject, onMounted } from 'vue';
import { useNotification } from '@kyvg/vue3-notification';
import { useStore } from 'vuex';
import moment from 'moment';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, ArcElement, Legend } from 'chart.js';
import { Line, Pie } from 'vue-chartjs';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, ArcElement, Legend);

const user = computed(() => store.state.user);
const { notify } = useNotification();
const verifyEmailSent = ref(false);
const isLoading = ref(false);
const api = inject('api');
const store = useStore();


const items = ref([]);
const search = ref('');
const headers = [
    { title: 'Image', key: 'image' },
    { title: 'Status', key: 'status' },
    { title: 'Tracking No.', key: 'tracking' },
    { title: 'Price', key: 'price' },
    { title: 'Actions', key: 'actions' }
];

onMounted(async () => {
    try {
        const { data } = await api.admin.items.index();
        items.value = data;
    } catch (error) {
        requestFailed.value = true;
    } finally {
        isLoading.value = false;
    }
});

const onChangeStatus = async (item) => {
    const { data } = await api.admin.items.setStatus(item.id, item.status);
    items.value = data;
};
</script>