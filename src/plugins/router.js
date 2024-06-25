import { createRouter, createWebHistory } from 'vue-router';

import { jwtDecode } from 'jwt-decode';
import api from './../api';

const isAdmin = function (to, from, next) {
    const jwt = jwtDecode(api.getJWT());
    if (jwt.type === 'Admin') return next();
    console.error('You do not have access to this page');
    return next('/');
};


export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/layouts/default/Default.vue'),
            children: [
                {
                    path: '',
                    name: 'Dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                },
                {
                    path: '/items/:itemID',
                    name: 'PRBoxSingle',
                    component: () => import('@/views/ItemSingle.vue'),
                },
                {
                    path: '/account',
                    name: 'Account',
                    component: () => import('@/views/Account.vue'),
                },

            ],
        },

        {
            path: '/',
            component: () => import('@/layouts/default/OnBoarding.vue'),
            children: [
                {
                    path: '/on-boarding',
                    name: 'OnBoarding',
                    component: () => import('@/views/OnBoarding.vue'),
                },
            ],
        },


        {
            path: '/admin',
            component: () => import('@/layouts/default/Admin.vue'),
            children: [
                {
                    path: '/',
                    name: 'AdminDashboard',
                    beforeEnter: [
                        isAdmin,
                        async (to, from, next) => next('/admin/items'),
                    ],
                },
                {
                    path: 'items',
                    name: 'AdminItems',
                    beforeEnter: isAdmin,
                    component: () => import('@/views/admin/Items.vue'),
                },
                {
                    path: 'items/:itemID',
                    name: 'AdminItemsSingle',
                    beforeEnter: isAdmin,
                    component: () => import('@/views/admin/ItemSingle.vue'),
                },
                {
                    path: 'users',
                    name: 'AdminUsers',
                    beforeEnter: isAdmin,
                    component: () => import('@/views/admin/Users.vue'),
                },
                {
                    path: 'pr-boxes',
                    name: 'AdminPRBoxes',
                    beforeEnter: isAdmin,
                    component: () => import('@/views/admin/PRBoxes.vue'),
                },
            ],
        },

        {
            path: '/',
            component: () => import('@/layouts/default/Auth.vue'),
            children: [
                {
                    path: '/login',
                    name: 'Login',
                    component: () => import('@/views/Auth/Login.vue'),
                },
                {
                    path: '/sign-up',
                    name: 'SignUp',
                    component: () => import('@/views/Auth/SignUp.vue'),
                },
                {
                    path: '/forgot-password',
                    name: 'ForgotPassword',
                    component: () => import('@/views/Auth/Login.vue'),
                },
                {
                    path: '/reset-password',
                    name: 'ResetPassword',
                    component: () => import('@/views/Auth/Login.vue'),
                },
                {
                    path: '/logout',
                    name: 'Logout',
                    beforeEnter: async (to, from, next) => {
                        console.warn('/logout');
                        localStorage.removeItem('AccessToken');
                        console.log('logout', localStorage.getItem("AccessToken"));
                        if (to.query.redirect) {
                            next(`/login?redirect=${to.query.redirect}`);
                        } else {
                            next('/login');
                        }
                    },
                },
            ],
        },
    ]
});
