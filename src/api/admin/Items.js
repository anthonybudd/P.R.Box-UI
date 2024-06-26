import Service from './../Service';

class AdminItems extends Service {
    index() {
        return this.axios.get(`/admin/items`);
    }

    get(itemID) {
        return this.axios.get(`/admin/items/${itemID}`);
    }

    create(fd) {
        return this.axios.post(`/admin/items`, fd);
    }

    ship(itemID, fd) {
        return this.axios.post(`/admin/items/${itemID}/ship`, fd);
    }
}

export default AdminItems;
