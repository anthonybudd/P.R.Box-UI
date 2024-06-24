import Group from './Group';
import Auth from './Auth';
import User from './User';
import PRBoxes from './PRBoxes';
import PKG from './PKG';


class API {
    constructor(JWT) {
        this.setJWT(JWT);
    }

    setJWT(JWT) {
        this.JWT = JWT;
        this.auth = new Auth(JWT);
        this.user = new User(JWT);
        this.group = new Group(JWT);
        this.books = new PRBoxes(JWT);
        this.pkg = new PKG(JWT);
    }

    getJWT() {
        return this.JWT;
    }
}


let instance;
if (!instance) instance = new API();
export default instance;
