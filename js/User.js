// Import klasy koszyka
import { Cart } from "./Cart.js";

// Klasa użytkownik dziedziczy klasę koszyk
export class User extends Cart {
	// wywołanie konstruktruktora z domyślnymi wartościami
	constructor({
		title,
		name,
		age = null,
		country,
		email,
		phone,
		password,
		newsletter = false,
	}) {
		// przypisujemy atrybuty i za pomocą polecenia super zyskujemy dostęp do elementów klasy Koszyk
		super();
		this.title = title;
		this.name = name;
		this.age = age;
		this.email = email;
		this.country = country;
		this.phone = phone;
		this.password = password;
		this.newsletter = newsletter;
	}
}
