<template>
    <v-card
        rounded="0"
        class="fill-height"
        flat
    >
        <v-window
            v-if="!isLoading"
            v-model="onboarding"
            class="fill-height"
        >
            <v-window-item
                class="fill-height"
                align-self="center"
            >
                <v-row
                    class="fill-height"
                    align="center"
                    justify="center"
                >
                    <v-col
                        md="3"
                        xs="12"
                        class="text-center"
                    >
                        <v-card
                            class="w-100"
                            elevation="0"
                        >
                            <v-card-text>
                                <h2>Verify Email Address</h2>
                                <p class="text-subtitle-1">Check your email</p>
                                <v-otp-input
                                    v-model="verificationCode"
                                    @update:modelValue="maybeSubmitVerificationForm"
                                ></v-otp-input>
                                <p
                                    v-if="!isLoadingVerificationCode"
                                    class="text-medium-emphasis c-pointer"
                                    @click="resendVerificationCode"
                                ><small>Resend verification code</small></p>
                                <v-progress-circular
                                    v-else
                                    indeterminate
                                    color="blue"
                                    size="20"
                                ></v-progress-circular>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-window-item>
            <v-window-item
                class="fill-height"
                align-self="center"
            >
                <v-row
                    class="fill-height"
                    align="center"
                    justify="center"
                >
                    <v-col
                        md="3"
                        xs="11"
                        class="text-center"
                    >
                        <v-card
                            class="w-100"
                            elevation="0"
                        >
                            <v-card-text>
                                <v-form v-model="isValidAddress">
                                    <h1>🇵🇷</h1>
                                    <h2>Puerto Rico Address</h2>
                                    <p class="text-subtitle-1 mb-2">Enter the address you would like us to ship your
                                        packages to
                                    </p>
                                    <v-text-field
                                        v-model="user.addressLine1"
                                        :error-messages="(addressErrors.addressLine1) ? addressErrors.addressLine1.msg : []"
                                        hide-details="auto"
                                        label="Address Line 1"
                                        variant="outlined"
                                        density="compact"
                                        type="text"
                                        class="mb-4"
                                        :rules="[rules.required]"
                                        required
                                    ></v-text-field>
                                    <v-text-field
                                        v-model="user.addressLine2"
                                        :error-messages="(addressErrors.addressLine2) ? addressErrors.addressLine2.msg : []"
                                        hide-details="auto"
                                        label="Address Line 2"
                                        variant="outlined"
                                        density="compact"
                                        type="text"
                                        class="mb-4"
                                    ></v-text-field>
                                    <v-text-field
                                        v-model="user.addressLine3"
                                        :error-messages="(addressErrors.addressLine3) ? addressErrors.addressLine3.msg : []"
                                        hide-details="auto"
                                        label="Address Line 3"
                                        variant="outlined"
                                        density="compact"
                                        type="text"
                                        class="mb-4"
                                    ></v-text-field>
                                    <v-text-field
                                        v-model="user.city"
                                        :error-messages="(addressErrors.city) ? addressErrors.city.msg : []"
                                        hide-details="auto"
                                        label="City"
                                        variant="outlined"
                                        density="compact"
                                        type="text"
                                        class="mb-4"
                                        :rules="[rules.required]"
                                        required
                                    ></v-text-field>
                                    <v-text-field
                                        v-model="user.zipcode"
                                        :error-messages="(addressErrors.zipcode) ? 'Must be a valid Puerto Rico zipcode' : []"
                                        hide-details="auto"
                                        label="Zipcode"
                                        variant="outlined"
                                        density="compact"
                                        type="text"
                                        class="mb-4"
                                        :rules="[rules.required, rules.isZipcode]"
                                        required
                                    ></v-text-field>
                                    <v-text-field
                                        v-model="user.state"
                                        :error-messages="(addressErrors.state) ? addressErrors.state.msg : []"
                                        hide-details="auto"
                                        label="Territory"
                                        variant="outlined"
                                        density="compact"
                                        type="text"
                                        class="mb-4"
                                        disabled=""
                                    ></v-text-field>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-window-item>

            <v-window-item
                class="fill-height"
                align-self="center"
            >
                <v-row
                    class="fill-height"
                    align="center"
                    justify="center"
                >
                    <v-col
                        md="3"
                        xs="12"
                        class="text-center"
                    >
                        <v-card
                            class="w-100"
                            elevation="0"
                        >
                            <v-card-text>
                                <h2>Account In Review</h2>
                                <p class="text-subtitle-1 mb-2">A team member is reviewing your details, we will reach
                                    out
                                    when your P.R Box is ready to go!</p>

                                <p
                                    v-if="!isLoadingCheckAccountStatus"
                                    class="text-medium-emphasis c-pointer"
                                    @click="checkAccountStatus"
                                ><small>Check Account Status</small></p>
                                <v-progress-circular
                                    v-else
                                    indeterminate
                                    color="blue"
                                    size="20"
                                ></v-progress-circular>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-window-item>
        </v-window>

        <v-card-actions class="v-card-actions--bottom justify-space-between">
            <v-btn
                variant="text"
                size="large"
                @click="onClickLogout"
            >Logout</v-btn>
            <v-item-group
                v-model="onboarding"
                class="text-center"
                mandatory
            >
                <v-item
                    v-for="n in stages.length"
                    :key="`btn-${n}`"
                    v-slot="{ isSelected, toggle }"
                >
                    <v-btn
                        :variant="isSelected ? 'outlined' : 'text'"
                        icon="mdi-record"
                        readonly
                    ></v-btn>
                </v-item>
            </v-item-group>
            <v-btn
                v-if="onboarding !== stages.length"
                variant="flat"
                color="primary"
                @click="next"
                :disabled="!isValid || isLoading"
                :loading="isLoading"
                size="large"
            >
                Next
            </v-btn>
            <v-btn
                v-else
                variant="flat"
                color="primary"
                size="large"
                @click="next"
            >
                Submit
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { useNotification } from '@kyvg/vue3-notification';
import { ref, inject, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const { notify } = useNotification();
const errorHandler = inject('errorHandler');
const rules = inject('rules');
const api = inject('api');
const route = useRoute();
const router = useRouter();
const store = useStore();

const isLoading = ref(true);
let onboarding = ref(0);

const stages = ref([
    'Email',
    'ID',
    'Review',
]);

const user = computed(() => store.state.user);

const isValid = computed(() => {
    switch (onboarding.value) {
        case 0:
            return (/^\d{6}$/gm.test(verificationCode.value));
        case 1:
            return isValidAddress.value;
        default:
            return false;
    }
});

onMounted(async () => {
    const { data: user } = await api.user.get();
    if (user.status === 'Approved') return router.push('/');
    if (!user.emailVerified) {
        onboarding.value = 0;
    } else if (!user.addressLine1) {
        onboarding.value = 1;
    } else {
        onboarding.value = 2;
    }
    isLoading.value = false;
});

const next = () => {
    switch (onboarding.value) {
        case 0:
            onboarding.value = onboarding.value + 1;
        case 1:
            submitAddressForm();
        default:
            return false;
    }
};

const onClickLogout = () => router.push('/logout');


////////////////////////////////////////////
// 1 - Email
const isLoadingVerificationCode = ref(false);
const verificationCode = ref('');

const resendVerificationCode = async () => {
    isLoadingVerificationCode.value = true;
    await api.user.resendVerificationEmail();
    setTimeout(() => {
        isLoadingVerificationCode.value = false;
        verificationCode.value = '';
        notify('Verification sent. Check your email');
    }, 1500);
};

const maybeSubmitVerificationForm = async () => {
    try {
        if (!isValid.value) return;
        const { data } = await api.auth.verifyEmail(verificationCode.value);
        if (data.verified) onboarding.value = 1;
    } catch (error) {
        errorHandler(error, () => {
            verificationCode.value = '';
        });
    } finally {
        isLoadingVerificationCode.value = false;
    }
};

////////////////////////////////////////////
// 2 - Address
const addressErrors = ref({});
const isValidAddress = ref(false);

const submitAddressForm = async () => {
    try {
        isLoading.value = true;
        await api.user.updateAddress({
            addressLine1: user.value.addressLine1,
            addressLine2: user.value.addressLine2,
            addressLine3: user.value.addressLine3,
            city: user.value.city,
            zipcode: user.value.zipcode,
            state: user.value.state,
        });
        onboarding.value = 2;
    } catch (error) {
        errorHandler(error, (data, code) => {
            if (code === 422) addressErrors.value = data;
        });
    } finally {
        isLoading.value = false;
    }
};

////////////////////////////////////////////
// 3 - Review
const isLoadingCheckAccountStatus = ref(false);

const checkAccountStatus = async () => {
    isLoadingVerificationCode.value = true;
    const { data: user } = await api.user.get();
    if (user.status === 'Approved') {
        notify('Account Approved');
        router.push('/');
    } else {
        notify('Account Pending');
    }
};


</script>

<style scoped>
.v-card-actions--bottom {
    position: absolute;
    bottom: 0px;
    width: 100%;
}
</style>