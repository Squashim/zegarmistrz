// Funkcja sprawdzająca, czy użytkownik jest zalogowany
export function isLoggedIn() {
	// Sprawdzenie, czy w sessionStorage istnieje klucz "loggedIn"
	// Jeśli istnieje to funkcja zwraca wartość true, w przeciwnym wypadku zwraca false
	if (sessionStorage.getItem("loggedIn")) return true;
	else return false;
}

// Funkcja wylogowująca użytkownika
export function logout() {
	// Usunięcie klucza "loggedIn" z sessionStorage
	sessionStorage.removeItem("loggedIn");
}

// Funkcja przekierowująca użytkownika do strony wpisanej jako argument
export function redirectTo(page) {
	// Argument page - jest to tekst zawierający nazwę strony, na którą chcemy przejść

	// Sprawdzenie czy podany tekst jest równy dla strony głównej, jeśli tak wywołujemy przekierowanie na odpowiedni adres URL
	if (page === "index.html") {
		// Przekierowanie użytkownika do strony index.html poprzez zamianę adresu URL w przeglądarce
		window.location.href = `/zegarmistrz/${page}`;
	} else {
		// Przekierowanie użytkownika do strony podanej jako argument poprzez zamianę adresu URL w przeglądarce
		window.location.href = `/zegarmistrz/pages/${page}`;
	}
}
