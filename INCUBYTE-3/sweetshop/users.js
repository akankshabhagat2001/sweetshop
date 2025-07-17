const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const USERS_FILE = path.join(__dirname, 'users.json');

class UserStore {
    constructor() {
        this.users = [];
        this.nextId = 1;
        this.load();
    }

    load() {
        if (fs.existsSync(USERS_FILE)) {
            const data = JSON.parse(fs.readFileSync(USERS_FILE));
            this.users = data.users || [];
            this.nextId = data.nextId || 1;
        }
    }

    save() {
        fs.writeFileSync(USERS_FILE, JSON.stringify({ users: this.users, nextId: this.nextId }, null, 2));
    }

    findByUsername(username) {
        return this.users.find(u => u.username === username);
    }

    addUser(username, password) {
        if (this.findByUsername(username)) return null;
        const hash = bcrypt.hashSync(password, 10);
        const user = { id: this.nextId++, username, password: hash };
        this.users.push(user);
        this.save();
        return { id: user.id, username: user.username };
    }

    validateUser(username, password) {
        const user = this.findByUsername(username);
        if (!user) return null;
        if (!bcrypt.compareSync(password, user.password)) return null;
        return { id: user.id, username: user.username };
    }
}

module.exports = new UserStore();