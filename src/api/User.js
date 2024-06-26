import Service from './Service';

class User extends Service {
    get() {
        return this.axios.get('/user');
    }

    update(user) {
        return this.axios.post(`/user`, user);
    }

    resendVerificationEmail() {
        return this.axios.post(`/user/resend-verification-email`);
    }

    updatePassword(password) {
        return this.axios.post(`/user/update-password`, password);
    }

    updateAddress(address) {
        return this.axios.post(`/user/update-address`, address);
    }

    getCharges() {
        return this.axios.get('/user/charges');
    }

    getSetupIntent() {
        return this.axios.get('/user/stripe/setup-intent');
    }

    getLast4() {
        return this.axios.get('/user/stripe/last-4');
    }
}

export default User;
