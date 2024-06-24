<template>
    <router-view v-if="appLoaded" />
    <notifications />
</template>

<script setup>
import { useNotification } from '@kyvg/vue3-notification';
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, inject } from 'vue';
import { useStore } from 'vuex';
import { onLogin } from './plugins';

const api = inject('api');
const route = useRoute();
const router = useRouter();
const store = useStore();
const { notify } = useNotification();
const errorHandler = inject('errorHandler');

const appLoaded = ref(false);

const skipAuthOnTheseUrls = ['/login', '/sign-up', '/forgot', '/reset'];


onMounted(async () => {
    // Auth init 
    const skipAuth = new RegExp(skipAuthOnTheseUrls.join('|')).test(window.location.href);
    if (skipAuth) return appLoaded.value = true;


    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('access_token')) localStorage.setItem('AccessToken', urlParams.get('access_token'));
    const accessToken = localStorage.getItem('AccessToken');
    if (!accessToken) {
        appLoaded.value = true;
        router.push('/logout');
    } else {
        try {
            api.setJWT(accessToken);
            await onLogin(api, store, router);
        } catch (error) {
            console.error(error);
            errorHandler(error, (data, code, error) => {
                router.push('/logout');
            });
        } finally {
            appLoaded.value = true;
        }
    }


    await router.isReady();
    if (route.query.email_verified) notify('Email verified successfully');

});
</script>
