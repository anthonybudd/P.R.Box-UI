import Service from './Service';

class PRBoxes extends Service {
    index() {
        return this.axios.get(`/pr-boxes`);
    }

    get(bookID) {
        return this.axios.get(`/pr-boxes/${bookID}`);
    }

    create(book) {
        return this.axios.post(`/pr-boxes`, book);
    }

    update(bookID, book) {
        return this.axios.post(`/pr-boxes/${bookID}`, book);
    }

    delete(bookID) {
        return this.axios.delete(`/pr-boxes/${bookID}`);
    }
}

export default PRBoxes;
