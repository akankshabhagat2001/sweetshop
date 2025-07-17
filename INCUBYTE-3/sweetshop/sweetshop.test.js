const SweetShop = require('./sweetshop');
describe('SweetShop', () => {
    it('should add a sweet', () => {
        const shop = new SweetShop();
        const sweet = shop.addSweet('Ladoo', 10, 50, 'Traditional');
        expect(sweet).toMatchObject({
            id: 1,
            name: 'Ladoo',
            price: 10,
            quantity: 50,
            category: 'Traditional'
        });
        expect(shop.sweets.length).toBe(1);
    });

    it('should update a sweet\'s details', () => {
        const shop = new SweetShop();
        shop.addSweet('Ladoo', 10, 50, 'Traditional');
        const updated = shop.updateSweet(1, { name: 'Barfi', price: 15, quantity: 30, category: 'Milk' });
        expect(updated).toMatchObject({
            id: 1,
            name: 'Barfi',
            price: 15,
            quantity: 30,
            category: 'Milk'
        });
        expect(shop.sweets[0].name).toBe('Barfi');
    });

    it('should delete a sweet by id', () => {
        const shop = new SweetShop();
        shop.addSweet('Ladoo', 10, 50, 'Traditional');
        const deleted = shop.deleteSweet(1);
        expect(deleted).toBe(true);
        expect(shop.sweets.length).toBe(0);
    });

    it('should search sweets by name (case-insensitive)', () => {
        const shop = new SweetShop();
        shop.addSweet('Ladoo', 10, 50, 'Traditional');
        shop.addSweet('Barfi', 15, 30, 'Milk');
        const results = shop.searchSweets('la');
        expect(results.length).toBe(1);
        expect(results[0].name).toBe('Ladoo');
    });

    it('should sort sweets by price ascending', () => {
        const shop = new SweetShop();
        shop.addSweet('Ladoo', 10, 50, 'Traditional');
        shop.addSweet('Barfi', 15, 30, 'Milk');
        const sorted = shop.sortSweets('price');
        expect(sorted[0].name).toBe('Ladoo');
        expect(sorted[1].name).toBe('Barfi');
    });

    it('should return all sweets', () => {
        const shop = new SweetShop();
        shop.addSweet('Ladoo', 10, 50, 'Traditional');
        shop.addSweet('Barfi', 15, 30, 'Milk');
        const all = shop.getAllSweets();
        expect(all.length).toBe(2);
    });
});