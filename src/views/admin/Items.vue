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
                                    v-model="PRBoxID"
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
                                    class="mb-4 w-100"
                                >
                                    <v-icon class="mr-2">mdi-camera-outline</v-icon>
                                    Upload Image
                                </v-btn>

                                <img
                                    class="d-block w-100 mb-4"
                                    style="max-width: 400px"
                                    ref="imagePreview"
                                >
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    text="Cancel"
                                    :disabled="isLoadingCreateNewItem"
                                    @click="isActive.value = false"
                                ></v-btn>
                                <v-btn
                                    color="primary"
                                    variant="flat"
                                    :disabled="isLoadingCreateNewItem"
                                    :loading="isLoadingCreateNewItem"
                                    @click="onClickCreateItem(isActive)"
                                >Add Item</v-btn>
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

                            <template v-slot:item.status="{ item }">
                                <v-chip
                                    :color="({ Received: 'blue', Shipped: 'light-blue', Delivered: 'green' })[item.status]"
                                    label
                                >
                                    {{ item.status }}
                                </v-chip>
                            </template>

                            <template v-slot:item.shipping="{ item }">
                                <span v-if="item.tracking">
                                    Tracking: {{ item.tracking }} <br />
                                    Carrier: {{ item.carrier }} <br />
                                    Price: {{ $currency(item.price) }} <br />
                                </span>
                                <span
                                    v-else
                                    class="text-medium-emphasis"
                                >
                                    Not shipped yet
                                </span>
                            </template>
                            <template v-slot:item.actions="{ item }">
                                <v-dialog
                                    max-width="500"
                                    v-if="item.status === 'Received'"
                                >
                                    <template v-slot:activator="{ props: activatorProps }">
                                        <v-btn
                                            v-bind="activatorProps"
                                            text="Ship Item"
                                            color="info"
                                            variant="flat"
                                            size="small"
                                        ></v-btn>
                                    </template>



                                    <template v-slot:default="{ isActive }">
                                        <v-card title="Ship Item">
                                            <v-card-text>
                                                <v-text-field
                                                    v-model="item.price"
                                                    label="Shipping Price"
                                                    type="number"
                                                    variant="outlined"
                                                    density="compact"
                                                ></v-text-field>
                                                <v-text-field
                                                    v-model="item.weight"
                                                    label="Weight"
                                                    placeholder="500"
                                                    variant="outlined"
                                                    density="compact"
                                                >
                                                    <template v-slot:append-inner>
                                                        Grams
                                                    </template>
                                                </v-text-field>
                                                <v-text-field
                                                    v-model="item.carrier"
                                                    label="Carrier"
                                                    placeholder="UPS, FedEX"
                                                    variant="outlined"
                                                    density="compact"
                                                ></v-text-field>
                                                <v-text-field
                                                    v-model="item.tracking"
                                                    label="Tracking"
                                                    variant="outlined"
                                                    density="compact"
                                                ></v-text-field>

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    capture="camera"
                                                    ref="openCameraShip"
                                                    class="camera-input mb-4 d-none"
                                                    @change="onImageCaptureShip(item, $event.target.files)"
                                                />
                                                <v-btn
                                                    @click="$refs.openCameraShip.click()"
                                                    block
                                                    large
                                                    color="primary"
                                                    class="mb-4 w-100"
                                                >
                                                    <v-icon class="mr-2">mdi-camera-outline</v-icon>
                                                    Upload Image
                                                </v-btn>

                                                <img
                                                    class="d-block w-100 mb-4"
                                                    style="max-width: 400px"
                                                    ref="imagePreviewShip"
                                                >
                                            </v-card-text>

                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                    text="Cancel"
                                                    :disabled="item.isLoading"
                                                    @click="isActive.value = false"
                                                ></v-btn>
                                                <v-btn
                                                    color="primary"
                                                    variant="flat"
                                                    :disabled="item.isLoading"
                                                    :loading="item.isLoading"
                                                    @click="onClickShipItem(item, isActive)"
                                                >Ship Item</v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </template>
                                </v-dialog>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>


<script setup>
import { ref, inject, onMounted } from 'vue';

const isLoading = ref(false);
const errorHandler = inject('errorHandler');
const api = inject('api');

const isLoadingCreateNewItem = ref(false);
const PRBoxID = ref('');
const imagePreview = ref(null);
const imagePreviewShip = ref(null);

const items = ref([]);
const prBoxes = ref([]);
const newItem = ref({});
const search = ref('');
const headers = [
    { title: 'Image', key: 'image' },
    { title: 'Status', key: 'status' },
    { title: 'Shipping', key: 'shipping' },
    { title: 'Actions', key: 'actions' }
];

onMounted(async () => {
    getData();
});

const getData = async (files) => {
    try {
        const { data } = await api.admin.items.index();
        items.value = data;

        const { data: prBoxes_ } = await api.admin.prBoxes.index();
        prBoxes.value = prBoxes_;
    } catch (error) {
        errorHandler(error);
    } finally {
        isLoading.value = false;
    }
};

const onImageCapture = async (files) => {
    const image = files[0];
    newItem.value.image = image;
    const reader = new FileReader();
    reader.onload = (e) => (imagePreview.value.src = e.target.result);
    reader.readAsDataURL(image);
};

const onClickCreateItem = async (isActive) => {
    try {
        isLoadingCreateNewItem.value = true;
        const fd = new FormData();
        Object.keys(newItem.value).forEach((key) => fd.append(key, newItem.value[key]));
        fd.append('PRBoxID', PRBoxID.value.id);
        await api.admin.items.create(fd);
        isActive.value = false;
        getData();
    } catch (error) {
        errorHandler(error);
    } finally {
        isLoadingCreateNewItem.value = false;
    }
};


/////////////////////////////
// Shipping
const onImageCaptureShip = async (item, files) => {
    const image = files[0];
    item.imageShipped = image;
    const reader = new FileReader();
    reader.onload = (e) => (imagePreviewShip.value.src = e.target.result);
    reader.readAsDataURL(image);
};

const onClickShipItem = async (item, isActive) => {
    try {
        item.isLoading = true;
        const fd = new FormData();
        fd.append('carrier', item.carrier);
        fd.append('weight', item.weight);
        fd.append('price', item.price);
        fd.append('tracking', item.tracking);
        fd.append('imageShipped', item.imageShipped);
        await api.admin.items.ship(item.id, fd);
        isActive.value = false;
        getData();
    } catch (error) {
        errorHandler(error);
    } finally {
        item.isLoading = false;
    }
};
</script>