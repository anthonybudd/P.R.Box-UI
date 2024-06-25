<template>
    <v-container>
        <h1 class="text-h5 font-weight-bold mb-2">P.R. Boxes</h1>

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
                            <template v-slot:item.address="{ item }">
                                <p>
                                    <small>
                                        {{ item.addressLine1 }} <br />
                                        {{ item.addressLine2 }} <br />
                                        <span v-if="item.addressLine3">{{ item.addressLine3 }} <br /></span>
                                        {{ item.zipcode }} <br />
                                        {{ item.city }} , {{ item.state }} <br />
                                    </small>
                                </p>
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

const isLoading = ref(false);
const api = inject('api');
const store = useStore();

const items = ref([]);
const search = ref('');
const headers = [
    { title: 'ID', key: 'id' },
    { title: 'Address', key: 'address' },
];

onMounted(async () => {
    try {
        const { data } = await api.admin.prBoxes.index();
        items.value = data;
    } catch (error) {
        requestFailed.value = true;
    } finally {
        isLoading.value = false;
    }
});
</script>