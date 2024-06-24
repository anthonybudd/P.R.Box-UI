import Service from './../Service';

class Items extends Service {
    index() {
        return this.axios.get(`/admin/items`);
    }

    get(itemID) {
        return this.axios.get(`/admin/items/${itemID}`);
    }

    setStatus(itemID, status) {
        return this.axios.post(`/admin/items/${itemID}/set-status`, { status });
    }
}

export default Items;
