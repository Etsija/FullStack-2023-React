export default class ShoppingItem {

    type: string = "";
    count: number = 0;
    price: number = 0;
    id: number = 0;

    constructor(type: string, count: number, price: number, id: number) {
        this.type = type;
        this.count = count;
        this.price = price;
        this.id = id;
    }
}