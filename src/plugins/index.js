import Notifications from '@kyvg/vue3-notification';
import { loadFonts } from './webfontloader';
import errorHandler from './errorHandler';
import api from './../api/index.js';
import vuetify from './vuetify';
import router from './router';
import moment from 'moment';
import store from './store';
import './../styles/custom.scss';

export function registerPlugins(app) {
    loadFonts();
    app
        .use(Notifications)
        .use(store)
        .use(vuetify)
        .use(router)
        .use({
            install: (app) => {
                app.provide('errorHandler', errorHandler);
                app.provide('api', api);
                app.provide('rules', {
                    required: (value) => !!value || 'This field is required.',
                    isEmail: (value) => !value || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'Must be valid email',
                    isZipcode: (value) => !value || /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value) || 'Must be a valid zipcode',
                });

                app.config.globalProperties.$formatDate = (timestamp, format = 'lll') => {
                    if (timestamp === undefined || timestamp === null) return '';
                    return moment(timestamp).format(format);
                };

                app.config.globalProperties.$currency = (value) => {
                    if (value === undefined || value === null) return '';
                    const formatter = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    });
                    return formatter.format(value);
                };
            },
        });
}


export async function onLogin(api, store, router) {
    const { data: user } = await api.user.get();
    store.commit('setUser', user);

    let lastGroupID = localStorage.getItem('lastGroupID');
    let lastGroup;
    for (const g of user.Groups) {
        if (g.id === lastGroupID) lastGroup = g;
    }

    const useZerothGroup = async () => {
        const { data: group } = await api.group.get(user.Groups[0].id);
        store.commit('setGroup', group);
    };

    if (lastGroup) {
        try {
            const { data: group } = await api.group.get(lastGroup.id);
            store.commit('setGroup', group);
        } catch (e) {
            useZerothGroup(); // May have been removed from group
        }
    } else if (user.Groups[0]) {
        useZerothGroup();
    }



    if (user.status === 'Blocked') {
        router.push('/blocked');
        return true;
    }

    if (user.status === 'Pending') {
        router.push('/on-boarding');
        return true;
    }

    return false;
}