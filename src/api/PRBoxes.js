import Service from './Service';

class PRBoxes extends Service {
    get() {
        return this.axios.get(`/pr-box`);
    }
}

export default PRBoxes;
