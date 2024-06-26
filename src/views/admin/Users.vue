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
                            <template v-slot:item.email="{ item }">
                                <p><b>{{ item.firstName }} {{ item.lastName }}</b></p>
                                <p>{{ item.email }}</p>
                                <p><small>{{ item.type }}</small></p>
                            </template>
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
                            <template v-slot:item.status="{ item }">
                                <!-- <v-select
                                    v-model="item.status"
                                    density="compact"
                                    :items="['Pending', 'Approved']"
                                    variant="outlined"
                                    @update:modelValue="onChangeStatus(item)"
                                ></v-select> -->
                                <v-chip
                                    :color="({ Pending: 'blue', Approved: 'green' })[item.status]"
                                    label
                                >
                                    {{ item.status }}
                                </v-chip>
                            </template>
                            <template v-slot:item.prBox="{ item }">
                                <span v-if="item.PRBox">
                                    {{ item.PRBox.name }}
                                </span>
                            </template>
                            <template v-slot:item.billing="{ item }">
                                <v-chip
                                    v-if="item.stripeLast4"
                                    color="green"
                                    label
                                >
                                    Ready
                                </v-chip>
                            </template>
                            <template v-slot:item.actions="{ item }">
                                <v-btn
                                    v-if="!item.PRBoxID"
                                    variant="tonal"
                                    size="small"
                                    class="mr-2"
                                    :disabled="isLoadingAssignPRBox"
                                    :loading="isLoadingAssignPRBox"
                                    @click="onClickAssignPRBox(item)"
                                >
                                    Assign P.R. Box
                                </v-btn>
                                <v-btn
                                    variant="tonal"
                                    size="small"
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
import errorHandler from '@/plugins/errorHandler';


const user = computed(() => store.state.user);
const { notify } = useNotification();
const verifyEmailSent = ref(false);
const isLoading = ref(false);
const isLoadingAssignPRBox = ref(false);
const api = inject('api');
const store = useStore();


const items = ref([]);
const search = ref('');
const headers = [
    { title: 'Email', key: 'email' },
    { title: 'Status', key: 'status' },
    { title: 'Address', key: 'address' },
    { title: 'P.R. Box', key: 'prBox' },
    { title: 'Billing', key: 'billing' },
    { title: 'Actions', key: 'actions' }
];

onMounted(async () => {
    getData();
});

const getData = async (item) => {
    try {
        const { data } = await api.admin.users.index();
        items.value = data;
    } catch (error) {
        requestFailed.value = true;
    } finally {
        isLoading.value = false;
    }
};

const onChangeStatus = async (item) => {
    await api.admin.users.setStatus(item.id, item.status);
};

const onClickAssignPRBox = async (item) => {
    try {
        isLoadingAssignPRBox.value = true;
        await api.admin.users.assignPRBox(item.id);
        getData();
    } catch (error) {
        errorHandler(error);
    } finally {
        isLoadingAssignPRBox.value = false;
    }
};

</script>