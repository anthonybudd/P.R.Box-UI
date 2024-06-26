<template>
    <v-container
        class="fill-height"
        fluid
    >
        <v-row
            align="center"
            justify="center"
        >
            <v-col
                md="3"
                xs="12"
                class="text-center"
            >
                <v-sheet
                    rounded
                    border
                >
                    <v-container class="px-4 py-4">
                        <v-img
                            class="mb-4 d-block m-auto"
                            width="60"
                            min-width="60"
                            src="./../../assets/logo.png"
                        ></v-img>
                        <v-row>
                            <v-col class="px-8">
                                <h2 class="text-center mb-4">Sign-up</h2>
                                <v-text-field
                                    v-model="email"
                                    :disabled="isLoading"
                                    variant="outlined"
                                    label="Email"
                                    required
                                    density="compact"
                                    :error-messages="(errors.email) ? errors.email.msg : []"
                                ></v-text-field>
                                <v-text-field
                                    v-model="password"
                                    :disabled="isLoading"
                                    variant="outlined"
                                    type="password"
                                    label="Password"
                                    required
                                    density="compact"
                                    :error-messages="(errors.password) ? errors.password.msg : []"
                                ></v-text-field>
                                <div class="d-flex">
                                    <v-text-field
                                        v-model="firstName"
                                        :disabled="isLoading"
                                        variant="outlined"
                                        label="First Name"
                                        class="pr-2"
                                        required
                                        density="compact"
                                        :error-messages="(errors.firstName) ? errors.firstName.msg : []"
                                    ></v-text-field>
                                    <v-text-field
                                        v-model="lastName"
                                        :disabled="isLoading"
                                        variant="outlined"
                                        label="Last Name"
                                        required
                                        density="compact"
                                        :error-messages="(errors.lastName) ? errors.lastName.msg : []"
                                    ></v-text-field>
                                </div>

                                <v-checkbox
                                    required
                                    v-model="tos"
                                    value="2024-06-25"
                                    class="my-0"
                                    validate-on-blur
                                    :error-messages="(errors.tos) ? errors.tos.msg : []"
                                >
                                    <template v-slot:label>
                                        I agree to the P.R Box Terms of Service
                                    </template>
                                </v-checkbox>

                                <vue-hcaptcha
                                    :key="key"
                                    @verify="onVerifyHcaptcha"
                                    @expired="onExpiredHcaptcha"
                                    @error="onErrorHcaptcha"
                                    :sitekey="hCaptchaSiteKey"
                                ></vue-hcaptcha>

                                <div class="d-flex">
                                    <v-btn
                                        block
                                        :disabled="isLoading"
                                        color="primary"
                                        variant="text"
                                        @click="onClickLogin"
                                    >Login</v-btn>

                                    <v-btn
                                        block
                                        :disabled="isLoading || htoken === ''"
                                        :loading="isLoading"
                                        color="primary"
                                        @click="onClickSignUp"
                                    >Sign-up</v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
import { ref, inject } from "vue";
import api from "./../../api";
import { onLogin } from './../../plugins';
import router from "@/plugins/router";
import { useStore } from "vuex";

const hCaptchaSiteKey = import.meta.env.VITE_H_CAPTCHA_SITE_KEY;
const store = useStore();
const errorHandler = inject('errorHandler');
const isLoading = ref(false);
const errors = ref({});
const key = ref(1);

const email = ref("");
const password = ref("");
const firstName = ref("");
const lastName = ref("");
const tos = ref("");
const htoken = ref("");

const onClickLogin = () => router.push("/login");

const onVerifyHcaptcha = async (token) => {
    htoken.value = token;
};
const onExpiredHcaptcha = async () => {
    htoken.value = '';
};
const onErrorHcaptcha = async () => {
    htoken.value = '';
};

const onClickSignUp = async () => {
    try {
        isLoading.value = true;
        const { data } = await api.auth.signUp({
            email: email.value,
            password: password.value,
            firstName: firstName.value,
            lastName: lastName.value,
            tos: tos.value,
            htoken: htoken.value,
        });

        localStorage.setItem("AccessToken", data.accessToken);
        api.setJWT(data.accessToken);
        await onLogin(api, store, router);
    } catch (error) {
        errorHandler(error, (data, code) => {
            if (code === 422) errors.value = data;
            key.value++;
        });
    } finally {
        isLoading.value = false;

    }
};
</script>
