import Service from './Service';

class AdminItem extends Service {
    index() {
        return this.axios.get(`/items`);
    }

    get(itemID) {
        return this.axios.get(`/items/${itemID}`);
    }
}

export default AdminItem;
