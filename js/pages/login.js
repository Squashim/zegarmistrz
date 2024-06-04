// Import funkcji do przekierowania
import { redirectTo } from "../auth.js";
// Funkcja obsługująca walidację danych wprowadzanych przez użytkownika w pole formularza
function checkInput(element, errorBox) {
	// Argument element - jest to pole formularza, zwykły element typu input
	// Argument errorBox - jest to element drzewa DOM, odpowiadający danemu polu formularza, wyświetla błędy walidacji

	// Nasłuchiwanie zdarzenia wpisywania na polu formularza
	element.addEventListener("input", () => {
		// Wyczyszczenie komunikatu o błędzie po wprowadzeniu danych przez użytkownika
		errorBox.textContent = "";

		// Wywołanie metody checkValidity() w celu sprawdzenia poprawności danych w danym polu formularza
		// Metoda checkValidity() jest metodą wbudowaną dla elementów formularza w języku JS.
		element.checkValidity();
	});

	// Nasłuchiwanie zdarzenia, takiego że użytkownik błędnie wprowadził dane w wybranym polu formularza
	element.addEventListener("invalid", () => {
		// Wyświetlenie komunikatu o błędzie na stronie
		// Właściwość validationMessage jest właściwością wbudowaną dla elementów formularza w języku JS i zawiera odpowiednie teksty związane z walidacją danych w polu formularza
		errorBox.textContent = element.validationMessage;

		// Zaznaczenie pola formularza, w którym użytkownik błędnie wpisał dane
		element.focus();
	});
}

// Funkcja dodająca okno dialogowe wyświetlające informacje o poprawnym logowaniu
function appendDialog() {
	// Schemat okna dialogowego zapisany w zmiennej 'template'
	const template = `
                <div class="dialog-container">
                <h2>Pomyślnie zalogowano</h2>
                <div class="buttons">
                    <button class="btn btn-secondary continue-btn">Kontynnuj</button>	
                </div>
                </div>
           `;

	// Utworzenie diva z klasą "background" jako tło dla okna dialogowego
	const dialogBg = document.createElement("div");
	dialogBg.classList = "background";

	// Utworzenie elementu dialogowego i wstawienie do niego szablonu
	const dialog = document.createElement("dialog");
	dialog.innerHTML = template;
	dialog.className = "login-dialog";

	// Dodanie tła i okna dialogowego do dokumentu
	document.body.appendChild(dialogBg);
	document.body.appendChild(dialog);
}

// Funkcja obsługująca poprawne logowanie
function handleSuccesfullLogin() {
	// Wywołanie funkcji dodającej okno dialogowego do drzewa DOM'u
	appendDialog();

	// Pobranie okna dialogowego odpowiedzialnego za logowanie, i jego tła
	const loginDialog = document.querySelector(".login-dialog");
	const dialogBg = document.querySelector(".background");

	// Na elemencie typu dialogu wywołujemy metodę show() aby, wyświetlić okno dialogowe
	// Metoda show(), podobnie jak metoda close(), jest wbudowana dla elementów HTML typu dialog
	loginDialog.show();
	// Zmieniamy styl tła okna dialogowego tak aby było widoczne dla użytkownika
	dialogBg.style.display = "block";

	// Pobranie przycisku z okna dialogowego pozwalającego na przejście dalej
	const continueBtn = loginDialog.querySelector(".continue-btn");
	// Nasłuchiwanie na kliknięcie takiego przycisku
	continueBtn.addEventListener("click", () => {
		// Zamknięcie okna dialogowego
		loginDialog.close();
		// Przekierowanie użytkownika na stronę główną za pomocą zaimportowanej z modułu funkcji 'redirectTo'
		redirectTo("index.html");
	});
}

// Główna funkcja wywoływana po załadowaniu dokumentu HTML
document.addEventListener("DOMContentLoaded", () => {
	// Pobranie elementu formularza z DOM'u
	const form = document.querySelector("form");
	// Stworzenie tablic ze wszystkimi polami formularza i odpowiadającymi im polami wyświetlającymi błędy walidacji
	const inputs = Array.from(document.querySelectorAll("form input"));
	const errorBoxes = Array.from(document.querySelectorAll("form p"));
	// Pobranie elementów odpowiadających za pole formularza związanych z emailem i jego błędem
	const email = document.querySelector("#email");
	const emailError = document.querySelector(".error-email");
	// Pobranie elementów odpowiadających za pole formularza związanych z hasłem i jego błędem
	const password = document.querySelector("#password");
	const passwordError = document.querySelector(".error-passw");

	// Obsługa zdarzenia przesłania formularza
	form.addEventListener("submit", (e) => {
		// Zatrzymanie domyślnego przesłania formularza
		e.preventDefault();

		// Sprawdzenie czy formularz nie zawiera błędów przy wpisywaniu przez użytkownika, jeśli zawiera to kończymy obsługę formularza
		if (!form.checkValidity()) {
			return;
		}

		// Pobierz listę użytkowników z localStorage'a lub utwórz nową listę, jeśli nie ma żadnych danych
		const users = JSON.parse(localStorage.getItem("users")) || [];
		// Znajdź użytkownika o podanym w polu formularza adresie e-mail
		const user = users.find((user) => user.email === email.value);

		// Jeśli użytkownik o wpisanym w pole formularza adresie email nie istnieje to:
		if (!user) {
			// Wyświetlamy komunikat o błędzie dotyczącym adresu e-mail
			emailError.textContent = "Nie istnieje użytkownik o podanym emailu";
			// Usunięcie treści błędu hasła
			passwordError.textContent = "";
			// Zaznaczenie pola z adresem email, tak aby użytkownik mógł od razu wprowadzić poprawione dane
			email.focus();
			// Przerwanie dalszej obsługi formularza
			return;
		}

		// Jeśli znajdziemy użytkownika o podanym adresie email, to sprawdzamy poprawność wpisanego hasła. Jeśli wpisane w formularzu hasło różni się od tego znajdującego się w localStorage'u to:
		if (user.password !== password.value) {
			// Wyświetlamy komunikat o błędzie dotyczącym poprawności hasła
			passwordError.textContent = "Niepoprawne hasło";
			// Usunięcie treści błędnego adresu email
			emailError.textContent = "";
			// Zaznaczenie pola z hasłem, tak aby użytkownik mógł od razu wprowadzić poprawione dane
			password.focus();
			// Przerwanie dalszej obsługi formularza
			return;
		}

		// Jeśli walidacja przebiegła pomyślnie to ustawiamy w sessionStorage obiekt z danymi aktualnie zalogowanego użytkownika
		sessionStorage.setItem("loggedIn", JSON.stringify(user));

		// Wywołanie funkcji obsługującej poprawne logowanie danego użytkownika
		handleSuccesfullLogin();
	});

	// Dla każdego pola formularza wykonujemy następujące czynności:
	inputs.forEach((element, index) => {
		// Argument element - jest to aktualnie przetwarzane pole formularza
		// Argument index - jest to indeks tego elementu w tablicy 'inputs'

		// Tablice 'errorBoxes' i 'inputs' są tej samej długości zatem każde pole formularza ma odpowiadający mu elemeny wyświetlające błąd
		const errorElement = errorBoxes[index];

		// Wywołujemy funkcję sprawdzającą poprawność pola formularza, a jako atrybut przekazujemy aktualne pole formularza i odpowiadający mu element wyświetlający błędy walidacji
		checkInput(element, errorElement);
	});
});
