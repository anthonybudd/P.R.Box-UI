<template>
    <v-container>
        <h1 class="text-h5 font-weight-bold mb-2">Dashboard</h1>

        <v-row v-if="false">
            <v-col>
                <v-alert
                    v-if="!user.emailVerified && !verifyEmailSent"
                    density="compact"
                    title="Verify your email"
                    close-label="Close Alert"
                    type="warning"
                    border="start"
                    variant="tonal"
                    closable
                    prominent
                >
                    You must verify your email address. Click the button below to resend the verification email.
                    <br>

                    <v-btn
                        @click="resendVerificationEmail"
                        :disabled="isLoading"
                        :loading="isLoading"
                        size="small"
                        variant="flat"
                    >
                        Resend Verification Email
                    </v-btn>
                </v-alert>
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
                            <template v-slot:item.status="{ item }">
                                <v-chip
                                    :color="({ Received: 'blue', Shipped: 'light-blue', Delivered: 'green' })[item.status]"
                                    label
                                >
                                    {{ item.status }}
                                </v-chip>
                            </template>
                            <template v-slot:item.actions="{ item }">
                                <v-btn
                                    variant="tonal"
                                    size="small"
                                    :to="`/items/${item.id}`"
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
import DashboardStats from '@/components/DashboardStats.vue';
import { ref, computed, inject, onMounted } from 'vue';
import { useNotification } from '@kyvg/vue3-notification';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const user = computed(() => store.state.user);
const { notify } = useNotification();
const verifyEmailSent = ref(false);
const isLoading = ref(false);
const api = inject('api');
const store = useStore();
const router = useRouter();

const items = ref([]);
const search = ref('');
const headers = [
    { title: 'Image', key: 'image' },
    { title: 'Status', key: 'status' },
    { title: 'Shipping Info.', key: 'shipping' },
    { title: 'Actions', key: 'actions' }
];

onMounted(async () => {
    try {
        if (user.value.type === 'Admin') router.push('/admin/items');
        const { data } = await api.items.index();
        items.value = data;
    } catch (error) {
        requestFailed.value = true;
    } finally {
        isLoading.value = false;
    }
});

const resendVerificationEmail = async () => {
    try {
        isLoading.value = true;
        await api.user.resendVerificationEmail();
        notify('Verification email sent. Check your inbox.');
        verifyEmailSent.value = true;
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};  
</script>