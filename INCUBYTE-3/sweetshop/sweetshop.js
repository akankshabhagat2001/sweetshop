const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(__dirname, 'sweets.json');

class Sweet {
    constructor(id, name, price, quantity, category) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.category = category;
    }
}

class SweetShop {
    constructor() {
        this.sweets = [];
        this.nextId = 1001;
        this.load();
    }

    save() {
        fs.writeFileSync(DATA_FILE, JSON.stringify({ sweets: this.sweets, nextId: this.nextId }, null, 2));
    }

    load() {
        if (fs.existsSync(DATA_FILE)) {
            const data = JSON.parse(fs.readFileSync(DATA_FILE));
            this.sweets = data.sweets || [];
            this.nextId = data.nextId || 1;
        }
    }

    addSweet(name, price, quantity, category) {
        const sweet = new Sweet(this.nextId++, name, price, quantity, category);
        this.sweets.push(sweet);
        this.save();
        return sweet;
    }

    updateSweet(id, updates) {
        const sweet = this.sweets.find(s => s.id === id);
        if (!sweet) return null;
        if (updates.name !== undefined) sweet.name = updates.name;
        if (updates.price !== undefined) sweet.price = updates.price;
        if (updates.quantity !== undefined) sweet.quantity = updates.quantity;
        if (updates.category !== undefined) sweet.category = updates.category;
        this.save();
        return sweet;
    }

    deleteSweet(id) {
        const index = this.sweets.findIndex(s => s.id === id);
        if (index === -1) return false;
        this.sweets.splice(index, 1);
        this.save();
        return true;
    }

    searchSweets(query) {
        return this.sweets.filter(s =>
            s.name.toLowerCase().includes(query.toLowerCase())
        );
    }

    sortSweets(field) {
        return [...this.sweets].sort((a, b) => {
            if (a[field] < b[field]) return -1;
            if (a[field] > b[field]) return 1;
            return 0;
        });
    }

    getAllSweets() {
        return this.sweets;
    }
}

module.exports = SweetShop;