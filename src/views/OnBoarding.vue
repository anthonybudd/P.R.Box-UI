<template>
    <v-card
        rounded="0"
        class="fill-height"
        flat
    >
        <v-window
            v-model="onboarding"
            class="fill-height"
        >
            <v-window-item class="fill-height">
                <v-card
                    class="mx-auto justify-center align-center text-center w-100"
                    elevation="0"
                    max-width="400"
                >
                    <v-form v-model="isValidVerificationCode">
                        <h2>Verify Email Address</h2>
                        <v-text-field
                            v-model="verificationCode"
                            label="Verification Code"
                            class="v-text-field--verification-code"
                            placeholder="- - - - - -"
                            variant="outlined"
                            :rules="[rules.required]"
                            @update:modelValue="maybeSubmitVerificationForm"
                        ></v-text-field>
                        <v-btn
                            text
                            class="text-medium-emphasis"
                        >Resend Verificaion Code</v-btn>
                    </v-form>
                </v-card>
            </v-window-item>
            <v-window-item class="fill-height">
                <v-card
                    class="d-flex justify-center align-center text-center w-100"
                    elevation="0"
                    max-width="400"
                >
                    <h2>2</h2>
                </v-card>
            </v-window-item>
            <v-window-item class="fill-height">
                <v-card
                    class="d-flex justify-center align-center text-center w-100"
                    elevation="0"
                >
                    <h2>3</h2>
                </v-card>
            </v-window-item>
            <v-window-item class="fill-height">
                <v-card
                    class="d-flex justify-center align-center text-center w-100"
                    elevation="0"
                >
                    <h2>4</h2>
                </v-card>
            </v-window-item>
        </v-window>

        <v-card-actions class="v-card-actions--bottom justify-space-between">
            <v-btn
                variant="text"
                size="x-large"
                :disabled="true"
                @click="prev"
            >Back</v-btn>
            <v-item-group
                v-model="onboarding"
                class="text-center"
                mandatory
            >
                <v-item
                    v-for="n in 4"
                    :key="`btn-${n}`"
                    v-slot="{ isSelected, toggle }"
                >
                    <v-btn
                        :variant="isSelected ? 'outlined' : 'text'"
                        icon="mdi-record"
                        @click="toggle"
                    ></v-btn>
                </v-item>
            </v-item-group>
            <v-btn
                v-if="onboarding !== stages.length"
                variant="flat"
                color="primary"
                @click="next"
                size="x-large"
            >
                Next
            </v-btn>
            <v-btn
                v-else
                variant="flat"
                color="primary"
                @click="next"
                size="x-large"
            >
                Submit
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref, inject, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

const api = inject('api');
const rules = inject('rules');
const route = useRoute();
const store = useStore();

const isLoading = ref(false);
const isValidVerificationCode = ref(false);
const verificationCode = ref('');
let onboarding = ref(0);

const stages = ref([
    'Email',
    'ID',
    'Billing',
    'Review',
]);

const user = computed(() => store.state.user);

onMounted(async () => {
    // await getData();
});

const prev = () => {
    onboarding.value = onboarding.value - 1 <= 0
        ? stages.value.length
        : onboarding.value - 1;
};

const next = () => {
    onboarding.value = onboarding.value + 1;
};

const maybeSubmitVerificationForm = async () => {
    if (verificationCode.value.length > 6) verificationCode.value = verificationCode.value.substring(0, 6);
    if (verificationCode.value.length === 6) {
        const { data } = await api.auth.verifyEmail(verificationCode.value);
        if (data.verified) onboarding.value = 2;
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