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
                                <h2 class="text-center mb-4">Login</h2>
                                <v-text-field
                                    v-model="email"
                                    :disabled="isLoading"
                                    variant="outlined"
                                    label="Email"
                                    required
                                    density="compact"
                                    @keydown.enter.prevent="onClickLogin"
                                ></v-text-field>
                                <v-text-field
                                    v-model="password"
                                    :disabled="isLoading"
                                    variant="outlined"
                                    type="password"
                                    label="Password"
                                    required
                                    density="compact"
                                    @keydown.enter.prevent="onClickLogin"
                                    :error-messages="isError
                                        ? ['Incorrect email or password']
                                        : []
                                        "
                                ></v-text-field>
                                <div class="d-flex">
                                    <v-btn
                                        block
                                        :disabled="isLoading"
                                        color="primary"
                                        variant="text"
                                        @click="onClickSignUp"
                                    >Sign-up</v-btn>
                                    <v-btn
                                        block
                                        :disabled="isLoading"
                                        :loading="isLoading"
                                        color="primary"
                                        @click="onClickLogin"
                                    >Login</v-btn>
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
import { ref } from "vue";
import api from "./../../api";
import { onLogin } from './../../plugins';
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();

const isLoading = ref(false);
const isError = ref(false);
const email = ref("");
const password = ref("");

const onClickSignUp = () => router.push("/sign-up");

const onClickLogin = async () => {
    try {
        isLoading.value = true;
        const { data } = await api.auth.login({
            email: email.value,
            password: password.value,
        });

        localStorage.setItem("AccessToken", data.accessToken);
        api.setJWT(data.accessToken);
        await onLogin(api, store, router);

        if (store.state.user.type === 'Admin') {
            router.push('/admin');
        }
    } catch (error) {
        isLoading.value = false;
        isError.value = true;
        console.error(error);
        router.push("/login");
    }
};
</script>
