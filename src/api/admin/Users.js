import Service from './../Service';

class Users extends Service {
    index() {
        return this.axios.get(`/admin/users`);
    }

    setStatus(userID, status) {
        return this.axios.post(`/admin/users/${userID}/set-status`, { status });
    }

    assignPRBox(userID) {
        return this.axios.post(`/admin/users/${userID}/assign-prbox`);
    }
}

export default Users;
