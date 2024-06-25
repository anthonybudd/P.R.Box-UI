import Service from './../Service';

class PRBoxes extends Service {
    index() {
        return this.axios.get(`/admin/pr-boxes`);
    }
}

export default PRBoxes;
