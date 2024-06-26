<template>
    <v-container>
        <v-row>
            <v-col
                md="12"
                cols="12"
            >
                <h3>Charges</h3>
            </v-col>

            <v-col cols="12">
                <v-sheet
                    width="100%"
                    rounded
                    border
                >
                    <v-data-table
                        :headers="headers"
                        :items="items"
                        :loading="isLoading"
                    >
                        <template v-slot:item.createdAt="{ item }">
                            {{ $formatDate(item.createdAt) }}
                        </template>
                        <template v-slot:item.amount="{ item }">
                            {{ $currency(item.amount) }}
                        </template>
                    </v-data-table>
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { useNotification } from '@kyvg/vue3-notification';
import { ref, inject, computed, onMounted, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';

const errorHandler = inject('errorHandler');
const instance = getCurrentInstance();
const { notify } = useNotification();
const rules = inject('rules');
const api = inject('api');
const store = useStore();

const user = computed(() => store.state.user);
const group = computed(() => store.state.group);
const isValid = ref(true);
const isLoading = ref(true);
const inviteUser = ref('');
const errors = ref({});
const items = ref([]);
const headers = [
    { title: 'Created At', key: 'createdAt' },
    // { title: 'ID', key: 'ID' },
    // { title: 'Status', key: 'status' },
    { title: 'Amount', key: 'amount' },
    { title: 'Description', key: 'description' },
];

onMounted(async () => {
    try {
        isLoading.value = true;
        const { data: charges } = await api.user.getCharges();
        items.value = charges;
    } catch (error) {
        errorHandler(error);
    } finally {
        isLoading.value = false;
    }
});
</script>
