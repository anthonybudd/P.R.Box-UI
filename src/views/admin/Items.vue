<template>
    <v-container>


        <v-row>
            <v-col>
                <h1 class="text-h5 font-weight-bold mb-2">Items</h1>
            </v-col>
            <v-col class="text-right">
                <v-dialog max-width="500">
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn
                            v-bind="activatorProps"
                            color="primary"
                            text="Add Item"
                            variant="flat"
                        ></v-btn>
                    </template>

                    <template v-slot:default="{ isActive }">
                        <v-card title="Add Item">
                            <v-card-text>
                                <p class="mb-4">Take a photo of the package clearly showing the shipping label</p>

                                <v-combobox
                                    label="P.R. Box"
                                    :items="prBoxes"
                                    variant="outlined"
                                    density="compact"
                                    item-title="name"
                                    item-value="id"
                                ></v-combobox>

                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="camera"
                                    ref="openCamera"
                                    class="camera-input mb-4 d-none"
                                    @change="onImageCapture($event.target.files)"
                                />
                                <v-btn
                                    @click="$refs.openCamera.click()"
                                    block
                                    large
                                    color="primary"
                                    class="mb-4"
                                >
                                    <v-icon class="mr-2">mdi-camera-outline</v-icon>
                                    Upload Image
                                </v-btn>

                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    text="Cancel"
                                    @click="isActive.value = false"
                                ></v-btn>

                                <v-btn
                                    color="primary"
                                    variant="flat"
                                    @click="isActive.value = false"
                                >Add</v-btn>
                            </v-card-actions>
                        </v-card>
                    </template>
                </v-dialog>
            </v-col>
        </v-row>


        <!-- <DashboardStats></DashboardStats> -->

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
                            <!-- <template v-slot:item.tracking="{ item }">
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
                            </template> -->
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>


<script setup>
import DashboardStats from '@/components/DashboardStats.vue';
import { ref, computed, inject, onMounted, getCurrentInstance } from 'vue';
import { useNotification } from '@kyvg/vue3-notification';
import { useStore } from 'vuex';
import moment from 'moment';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, ArcElement, Legend } from 'chart.js';
import { Line, Pie } from 'vue-chartjs';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, ArcElement, Legend);

const user = computed(() => store.state.user);
const instance = getCurrentInstance();
const { notify } = useNotification();
const verifyEmailSent = ref(false);
const isLoading = ref(false);
const api = inject('api');
const store = useStore();


const items = ref([]);
const prBoxes = ref([]);
const newItem = ref({});
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

        const { data: prBoxes_ } = await api.admin.prBoxes.index();
        prBoxes.value = prBoxes_;
    } catch (error) {
        requestFailed.value = true;
    } finally {
        isLoading.value = false;
    }
});

const onImageCapture = async (files) => {
    console.log(files);
    const image = files[0];
    newItem.value.image = image;
    const reader = new FileReader();
    reader.onload = (e) => (instance.ctx.$refs.imagePreview.src = e.target.result);
    reader.readAsDataURL(image);
};

const onClickCreatePRBox = async () => {
    try {
        await api.admin.items.create(newItem.value);
    } catch (error) {
        requestFailed.value = true;
    } finally {
        isLoading.value = false;
    }
};

const onChangeStatus = async (item) => {
    const { data } = await api.admin.items.setStatus(item.id, item.status);
    items.value = data;
};
</script>