import Group from './Group';
import Auth from './Auth';
import User from './User';
import PRBoxes from './PRBoxes';
import Items from './Items';

import AdminItems from './admin/Items';
import AdminUsers from './admin/Users';
import AdminPRBoxes from './admin/PRBoxes';


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
        this.items = new Items(JWT);

        this.admin = {};
        this.admin.items = new AdminItems(JWT);
        this.admin.users = new AdminUsers(JWT);
        this.admin.prBoxes = new AdminPRBoxes(JWT);
    }

    getJWT() {
        return this.JWT;
    }
}


let instance;
if (!instance) instance = new API();
export default instance;
