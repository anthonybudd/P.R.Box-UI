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
                    <v-card-item title="Packages"></v-card-item>
                    <v-card-text>
                        <v-data-table
                            :search="search"
                            :headers="headers"
                            :items="packages"
                            :loading="isLoading"
                        >
                            <template v-slot:item.image="{ item }">

                                {{ item.image }}

                            </template>
                            <template v-slot:item.tracking="{ item }">
                                <span v-if="item.status == 'Shipped'">
                                    {{ item.id }}
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
                            <template v-slot:item.price="{ item }">
                                {{ item.price }}
                            </template>

                            <template v-slot:item.actions="{ item }">
                                <v-btn
                                    variant="tonal"
                                    size="small"
                                    :to="`/pr-boxes/${item.id}`"
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


const packages = ref([]);
const search = ref('');
const headers = [
    { title: 'Image', key: 'image' },
    { title: 'Status', key: 'status' },
    { title: 'Tracking', key: 'tracking' },
    { title: 'Price', key: 'price' },
    { title: 'Actions', key: 'actions' }
];

const lineChart = {
    data: {
        labels: Array.from(Array(14).keys()).map((i) => moment().subtract(i, 'days').format('D MMM')).reverse(),
        datasets: [
            {
                label: 'Daily Sales',
                tension: 0.3,
                data: Array.from(Array(14).keys()).map(() => Math.floor(Math.random() * (600 - 200 + 1)) + 200).reverse(),
            },
        ]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
        },
        tooltips: {
            enabled: false
        },
        scales: {
            x: {
                grid: {
                    drawBorder: false,
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    drawBorder: false,
                    display: false,
                },
                ticks: {
                    precision: 0,
                },
            }
        }
    }
};

const pieChart = {
    labels: ['50+', '30-39', '18-29', '40-49'],
    options: {
        responsive: true,
        maintainAspectRatio: false
    },
    datasets: [
        {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
            data: [40, 20, 80, 10]
        }
    ]
};




onMounted(async () => {
    try {
        const { data } = await api.pkg.index();
        packages.value = data;
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