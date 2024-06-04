// Zaimportowanie potrzebnych funkcji z modułu auth.js, do obsługi stanu użytkownika
import { isLoggedIn, logout, redirectTo } from "./auth.js";

// Funkcja obsługująca otwieranie i zamykanie menu rozwijanego w pasku nawigacji
function handleMenuOpening() {
	// Pobranie przycisku do przełączania menu
	const toggleBtn = document.querySelector(".nav-group-menu");
	// Pobranie ikony przycisku do przełączania menu
	const toggleBtnIcon = document.querySelector(
		".nav-group-menu .nav-link-icon span"
	);
	// Pobranie elementu menu rozwijanego
	const dropdownMenu = document.querySelector(".nav-links-dropdown");

	// Dodanie nasłuchiwania na kliknięcie przycisku do przełączania menu
	toggleBtn.addEventListener("click", () => {
		// Dodanie lub usunięcie klasy "open" dla menu rozwijanego
		dropdownMenu.classList.toggle("open");

		// Sprawdzenie, czy menu rozwijane jest otwarte
		const isOpen = dropdownMenu.classList.contains("open");

		// Zmiana ikony przycisku przełączania menu w zależności od stanu zmiennej 'isOpen'
		// Jeśli menu rozwijane jest otwarte zmieniamy ikonę na krzyżyk, w przeciwnym wypadku na ikonę menu
		toggleBtnIcon.innerHTML = isOpen ? "close" : "menu";
	});
}

// Funkcja obsługująca zmianę aktywnego elementu w pasku nawigacji na podstawie bieżącego adresu URL
function handleActiveNavElement() {
	// Pobieramy wszystkie elementy odpowiedzialne za nawigację na stronie
	const navigationLinks = document.querySelectorAll(".nav-link a");
	// Pobieramy wszystkie elementy z rozsuwanego menu odpowiedzialnego za nawigację na stronie
	const navigationLinksDropdown = document.querySelectorAll(".nav-link-dp a");

	// Funkcja ustawiająca aktywny element w pasku nawigacji na podstawie aktualnej ścieżki URL
	function setActiveLink(links) {
		// Pobranie aktualnej ścieżki URL
		const currentURL = window.location.pathname;

		// Iteracja po wszystkich elementach odpowiedzialnych za nawigację na stronie
		links.forEach((link) => {
			// Pobranie rodzica elementu odpowiedzialnego za nawigację
			const linkContainer = link.parentElement;

			// Sprawdzenie czy aktualnie iterowany element nawigacji ma atrybut 'href' równy aktualnej ścieżce URL
			if (link.getAttribute("href") === currentURL) {
				// Jeśli tak to do rodzica tego elementu dodajemy klasę 'active'
				linkContainer.classList.add("active");
			} else {
				// W przeciwnym wypadku usuwamy klasę 'active'
				linkContainer.classList.remove("active");
			}
		});
	}

	// Wywołanie funkcji ustawiającej dla elementów zwykłego menu i menu rozwijanego
	setActiveLink(navigationLinks);
	setActiveLink(navigationLinksDropdown);
}

// Dodanie nasłuchiwania zdarzenia, które rozpocznie się po wczytaniu przez przeglądarkę całej treści dokumentu HTML
document.addEventListener("DOMContentLoaded", () => {
	// Pobranie wszystkich elementów o klasie "nav-hidden" i zapisanie ich do tablicy
	const navHidden = Array.from(document.querySelectorAll(".nav-hidden"));
	// Pobranie elementu odpowiadającego za logowanie
	const navLogin = document.querySelector("#nav-login");
	// Pobranie wszystkich przycisków służących do wylogowania i zapisanie ich do tablicy
	const logoutButtons = Array.from(document.querySelectorAll(".logout-btn"));
	// Pobranie elementu, który w nawigacji wyświetla aktualną liczbę przedmiotów w koszyku
	const cartElement = document.querySelector(".cart-quantity");
	// Pobranie danych aktualnie zalogowanego użytkownika z sessionStorage jako obiekt
	const userData = JSON.parse(sessionStorage.getItem("loggedIn"));

	// Funkcja dodająca okno dialogowe potwierdzające wylogowanie
	function appendDialog() {
		// Schemat okna dialogowego zapisany w zmiennej 'template'
		let template = `
							<div class="dialog-container">
							<h2>Czy na pewno chcesz się wylogować?</h2>
							<div class="buttons">
							<button class="btn btn-secondary logout-btn">Wyloguj</button>
								<button class="btn btn-secondary cancel-btn">Anuluj</button>
							</div>
							</div>
					   `;

		// Utworzenie diva z klasą "background" jako tło dla okna dialogowego
		const dialogBg = document.createElement("div");
		dialogBg.classList = "background";

		// Utworzenie elementu dialogowego i wstawienie do niego szablonu
		const dialog = document.createElement("dialog");
		dialog.innerHTML = template;
		dialog.className = "logout-dialog";

		// Dodanie tła i okna dialogowego do dokumentu
		document.body.appendChild(dialogBg);
		document.body.appendChild(dialog);
	}

	// Funkcja obsługująca wylogowanie użytkownika ze swojego konta
	function handleLogout() {
		// Dodanie do DOM'u okna dialogowego
		appendDialog();

		// Pobieramy z DOM'u niezbędne elementy związane z oknem dialogowym
		const logoutDialog = document.querySelector(".logout-dialog");
		const dialogBg = document.querySelector(".background");

		// Na elemencie typu dialogu wywołujemy metodę show() aby, wyświetlić okno dialogowe
		// Metoda show(), podobnie jak metoda close(), jest wbudowana dla elementów HTML typu dialog
		logoutDialog.show();
		// Zmieniamy styl tła okna dialogowego tak aby było widoczne dla użytkownika
		dialogBg.style.display = "block";

		// Pobranie przycisku z okna dialogowego odpowiadającego za anulowanie dialogu
		const cancelBtn = logoutDialog.querySelector(".cancel-btn");
		// Nasłuchiwanie na kliknięcie takiego przycisku
		cancelBtn.addEventListener("click", () => {
			// Zamknięcie okna dialogowego
			logoutDialog.close();

			// Usuwamy element okna dialogowego i jego tła z drzewa DOM
			logoutDialog.remove();
			dialogBg.remove();
		});

		// Pobranie przycisku z okna dialogowego odpowiadającego za wylogowanie użytkownika
		const logoutBtn = logoutDialog.querySelector(".logout-btn");
		// Nasłuchiwanie na kliknięcie takiego przycisku
		logoutBtn.addEventListener("click", () => {
			// Następuje wywołanie zaimportowanej funkcji logout()
			logout();
			// Przeniesienie użytkownika na stronę główną index.html
			redirectTo("index.html");
		});
	}

	// Sprawdzamy czy użytkownik jest zalogowany, za pomocą zaimportowanej funkcji
	if (isLoggedIn()) {
		// Ukrywamy element logowania w pasku nawigacji
		navLogin.classList.add("nav-hidden");

		// Wyświetlamy każdy element ukryty w pasku nawigacji,
		// Ukryte elementy odnoszą się do tych, które powinien zobaczyć tylko zalogowany użytkownik
		navHidden.forEach((element) => {
			// Argument element - odpowiada każdemu elementowi DOM, który jest schowany dla użytkownika
			// Usuwamy klasę odpowiadającą za schowanie elementu w pasku nawigacji
			element.classList.remove("nav-hidden");
		});

		// Dodaj obsługę kliknięcia dla wszystkich przycisków wylogowywania znajdujących się w pasku nawigacji
		logoutButtons.forEach((button) => {
			// Dodajemy nasłuchiwanie do każdego przycisku wylogowania znajdującego się na stronie,
			// Po kliknięciu wywołujemy funkcję obsługującą wylogowanie użytkownika
			button.addEventListener("click", handleLogout);
		});

		// Jeśli zawartość koszyka aktualnie zalogowanego użytkownika nie jest pusta to:
		if (userData.cart.length > 0) {
			// Zmiana stylu elementu wyświetlającego liczbę, tak aby był on widoczny dla użytkownika
			cartElement.style.display = "flex";
			// Ustawiamy liczbę przedmiotów wyświetloną w nawigacji na ilość obiektów zapisanych w koszyku zalogowanego użytkownika
			cartElement.innerHTML = userData.cart.length;
		}
	}

	// Wywołanie funkcji odpowiedzialnej za obsługę zmiany aktywnego elementu w pasku nawigacji
	handleActiveNavElement();

	// Wywołanie funkcji odpowiedzialnych za obsługę otwierania i zamykania menu rozwijanego w pasku nawigacji
	handleMenuOpening();
});
