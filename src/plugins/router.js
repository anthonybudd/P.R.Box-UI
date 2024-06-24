import { createRouter, createWebHistory } from 'vue-router';

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
                    path: '/pr-boxes',
                    name: 'PR Boxes',
                    component: () => import('@/views/PRBoxesIndex.vue'),
                },
                {
                    path: '/pr-boxes/:PRBoxID',
                    name: 'PRBoxSingle',
                    component: () => import('@/views/PRBoxSingle.vue'),
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
                    component: () => import('@/views/Auth/Login.vue'),
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
