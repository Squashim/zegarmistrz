// eksportujemy klasę Koszyk
export class Cart {
	// wywołujemy konstruktor z domyślnym argumentem równym pustemu koszykowi
	constructor(cart = []) {
		this.cart = cart;
	}

	// metoda pozwalająca na ustawienie zawartości koszyka
	setCart(cart) {
		this.cart = cart;
	}

	// metoda zwracająca czy koszyk jest pusty
	isEmpty() {
		return this.cart.length === 0;
	}

	// dodanie do koszyka pojedynczego elementu
	addToCart(item) {
		this.cart.push(item);
	}

	// metoda pozwalająca na usunięcie podanego jako argument elementu z koszyka
	removeFromCart(itemToRemove) {
		this.cart = this.cart.filter((item) => item !== itemToRemove);
	}

	// metoda zwracająca zawartość koszyka
	getItems() {
		return this.cart;
	}
}
