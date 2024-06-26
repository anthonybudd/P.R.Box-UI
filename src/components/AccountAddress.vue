<template>
    <v-container>
        <v-form
            v-model="isValid"
            @submit.prevent="submitForm"
        >
            <v-row>
                <v-col
                    md="12"
                    cols="12"
                >

                </v-col>
                <v-col
                    md="6"
                    cols="12"
                    v-if="prBox !== false"
                >
                    <h3>Your PR Box Address</h3>
                    <p class="mb-2 text-medium-emphasis">Ship items to this address.</p>
                    <v-card
                        variant="tonal"
                        color="surface-variant"
                    >
                        <v-card-text>
                            <p class="text-h5">
                                <b>{{ prBox.name }}</b><br />
                                {{ prBox.addressLine1 }}<br />
                                {{ prBox.addressLine2 }}<br />
                                {{ prBox.city }},<br />
                                {{ prBox.state }}, {{ prBox.zipcode }}<br />
                            </p>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col
                    md="6"
                    cols="12"
                >
                    <h3>Your Puerto Rico Address</h3>
                    <p class="mb-4 text-medium-emphasis">This is where your packages will be sent to.</p>
                    <v-text-field
                        v-model="user.addressLine1"
                        :error-messages="(errors.addressLine1) ? errors.addressLine1.msg : []"
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
                        :error-messages="(errors.addressLine2) ? errors.addressLine2.msg : []"
                        hide-details="auto"
                        label="Address Line 2"
                        variant="outlined"
                        density="compact"
                        type="text"
                        class="mb-4"
                        :rules="[rules.required]"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="user.addressLine3"
                        :error-messages="(errors.addressLine3) ? errors.addressLine3.msg : []"
                        hide-details="auto"
                        label="Address Line 3"
                        variant="outlined"
                        density="compact"
                        type="text"
                        class="mb-4"
                        :rules="[rules.required]"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="user.city"
                        :error-messages="(errors.city) ? errors.city.msg : []"
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
                        :error-messages="(errors.zipcode) ? errors.zipcode.msg : []"
                        hide-details="auto"
                        label="Zipcode"
                        variant="outlined"
                        density="compact"
                        type="text"
                        class="mb-4"
                        :rules="[rules.required]"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="user.state"
                        :error-messages="(errors.state) ? errors.state.msg : []"
                        hide-details="auto"
                        label="State"
                        variant="outlined"
                        density="compact"
                        type="text"
                        class="mb-4"
                        :rules="[rules.required]"
                        readonly
                        disabled=""
                    ></v-text-field>
                </v-col>
                <v-col
                    md="12"
                    cols="12"
                    class="text-right"
                >
                    <v-btn
                        color="primary"
                        variant="flat"
                        class="mb-4"
                        @click="submitForm"
                        :disabled="isLoading"
                        :loading="isLoading"
                    >
                        Update Address
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>

<script setup>
import { useNotification } from '@kyvg/vue3-notification';
import { ref, inject, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const errorHandler = inject('errorHandler');
const { notify } = useNotification();
const rules = inject('rules');
const api = inject('api');
const store = useStore();

const user = computed(() => store.state.user);
const errors = ref({});
const isValid = ref(false);
const isLoading = ref(false);
const prBox = ref(false);

onMounted(async () => {
    try {
        isLoading.value = true;
        const { data } = await api.prBox.get();
        prBox.value = data;
    } catch (error) {
        errorHandler(error);
    } finally {
        isLoading.value = false;
    }
});

const submitForm = async () => {
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
        notify('Address updated');
    } catch (error) {
        errorHandler(error, (data, code) => {
            if (code === 422) errors.value = data;
        });
    } finally {
        isLoading.value = false;
    }
}; 
</script>
