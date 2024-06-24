import Service from './Service';

class PKG extends Service {
    index() {
        return this.axios.get(`/packages`);
    }

    get(packageID) {
        return this.axios.get(`/packages/${packageID}`);
    }

    create(pkg) {
        return this.axios.post(`/packages`, pkg);
    }

    update(packageID, pkg) {
        return this.axios.post(`/packages/${packageID}`, pkg);
    }

    delete(packageID) {
        return this.axios.delete(`/packages/${packageID}`);
    }
}

export default PKG;
