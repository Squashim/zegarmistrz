// Import klasy użytkownika i funkcji do przekierowania
import { User } from "../User.js";
import { redirectTo } from "../auth.js";

// Funkcja sprawdzająca, czy w localStorage istnieje już użytkownik o wartości przekazanej w argumencie funkcji
function userExists(value, key) {
	// argument value - wartość pola w formularzu, którą chcemy porównać z zapisanymi danymi
	// argument key - wartość reprezentująca rózne pola danych użytkownika zapisanych w localStorage
	// zmienna users - tablica użytkowników pobrana z localStorage
	// funkcja zwraca zmieną typu boolean

	// Pobranie danych użytkowników z localStorage
	const users = JSON.parse(localStorage.getItem("users"));

	// Sprawdzamy czy w localStorage istnieje tablica z zarejestrowanymi użytkownikami
	if (users) {
		// Sprawdzamy czy jakiś użytkownik ma wartość pola 'key' ustawioną na 'value',
		// -> jeśli tak oznacza to że istnieje użytkownik o danych wprowadzonych w formularzu, zwracamy true
		// -> w przeciwnym wypadku nie istnieje taki użytkownik, zwracamy false
		return users.some((user) => user[key] === value);

		// Jeśli tablica użytkowników nie istnieje, to nie ma też użytkownika o tych samych danych, zwracamy false
	} else return false;
}

// Funkcja dodająca okno dialogowe wyświetlające poprawną rejestrację
function appendDialog() {
	// Schemat okna dialogowego zapisany w zmiennej 'template'
	let template = `
	<div class="dialog-container">
	<h2>Pomyślnie zarejestrowano!</h2>
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
	dialog.className = "register-dialog";

	// Dodanie tła i okna dialogowego do dokumentu
	document.body.appendChild(dialogBg);
	document.body.appendChild(dialog);
}

// Funkcja sprawdzająca czy istnieje użytkownik o wpisanych w pola formularza danych w localStorage'u
function localStorageValidation(value) {
	// Argument value - jest to obiekt z wartościami wpisanymi w pole formularza przez użytkownika
	// Pobranie elementów DOM potrzebnych do wyświetlenia, błędów związanych z istnieniem użytkownika o podanych danych w localStoragu
	const email = document.querySelector("#email");
	const phone = document.querySelector("#phone");
	const phoneError = document.querySelector(".error-phone");
	const emailError = document.querySelector(".error-email");
	// Zmienna oznaczająca czy walidacja przebiegła pomyślnie
	let isValid = true;

	// Sprawdzamy czy w pliku jest zapisany użytkownik o podanym adresie email. Jeśli istnieje to zostaje wyświetlony odpowiedni komunikat i następuje automatyczne zaznaczenie błędnego pola formularza, tak aby od razu można było poprawić dane. Następnie przerywamy obsługę formularza. W przeciwnym wypadku kontynuujemy walidację.
	if (userExists(value.email, "email")) {
		// Wyświetlenie błędu związanego z niepoprawnym emailem
		emailError.textContent = "Istnieje użytkownik o takim emailu";
		// Zaznaczenie pola z adresem email, tak aby użytkownik mógł od razu wprowadzić poprawione dane
		email.focus();
		// Ustawienie zmiennej, że walidacja przebiegła niepoprawnie
		isValid = false;
	}

	// Wykonujemy to samo tylko dla innej wartości, sprawdzamy czy w pliku jest zapisany użytkownik o podanym numerze telefonu. Jeśli istnieje to zostaje wyświetlony odpowiedni komunikat i następuje automatyczne zaznaczenie błędnego pola formularza, tak aby od razu można było poprawić dane. Następnie kończymy obsługę formularza. W przeciwnym wypadku kontynuujemy walidację.
	if (userExists(value.phone, "phone")) {
		// Wyświetlenie błędu związanego z niepoprawnym numerem telefonu
		phoneError.textContent = "Istnieje użytkownik o takim numerze telefonu";
		// Zaznaczenie pola z numerem telefonu, tak aby użytkownik mógł od razu wprowadzić poprawione dane
		phone.focus();
		// Ustawienie zmiennej, że walidacja przebiegła niepoprawnie
		isValid = false;
	}

	// Zwracamy wartość true/false w zależności czy walidacja przebiegła pomyślnie
	return isValid;
}

// Funkcję tworząca użytkownika i zapisująca go w tablicy użytkowników do localStorage'a
function handleUserCreation(value) {
	// Atrybut value - jest to obiekt zawierający wszystkie wartości wprowadzone w polach formularza
	// Utworzenie obiektu nowego użytkownika należącego do klasy User, ze wszystkimi danymi, które zostały podane w formularzu.
	const newUser = new User({
		title: value.title,
		name: value.name,
		age: value.age,
		country: value.country,
		email: value.email,
		phone: value.phone,
		password: value.password,
		newsletter: value.newsletter,
	});

	// Pobieramy z localStorage zapisaną tablicę zawierającą obiekty zarejestrowanych użytkowników, lub jeśli taka nie istnieje to tworzymy pustą tablicę.
	const users = JSON.parse(localStorage.getItem("users")) || [];

	// Do tablicy dodajemy nowo utworzony obiekt użytkownika.
	users.push(newUser);
	// Uzupełnioną tablicę użytkowników zapisujemy w localStorage pod nazwą klucza 'users' i wartością, która konwertuje tablicę obiektów na jego reprezentację w formacie JSON.
	localStorage.setItem("users", JSON.stringify(users));
}

// Funkcja obsługująca wyświetlone użytkownikowi okno dialogowe po poprawnej rejestracji
function handleDialog() {
	// Pobieramy z DOM'u niezbędne elementy związane z oknem dialogowym
	const registerDialog = document.querySelector(".register-dialog");
	const dialogBg = document.querySelector(".background");

	// Na elemencie typu dialogu wywołujemy metodę show() aby, wyświetlić okno dialogowe
	// Metoda show(), podobnie jak metoda close(), jest wbudowana dla elementów HTML typu dialog
	registerDialog.show();
	// Zmieniamy styl tła okna dialogowego tak aby było widoczne dla użytkownika
	dialogBg.style.display = "block";

	// Pobranie przycisku z okna dialogowego służącego do przejścia na stronę logowania
	const continueBtn = registerDialog.querySelector(".continue-btn");
	// Nasłuchiwanie na kliknięcie takiego przycisku
	continueBtn.addEventListener("click", () => {
		// Zamknięcie okna dialogowego
		registerDialog.close();
		// Przekierowanie użytkownika na stronę logowania za pomocą zaimportowanej z modułu funkcji 'redirectTo'
		redirectTo("login.html");
	});
}

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

// Główna funkcja wywoływana po załadowaniu dokumentu HTML
document.addEventListener("DOMContentLoaded", () => {
	// Pobranie elementu formularza z DOM'u
	const form = document.querySelector("form");
	// Stworzenie tablic ze wszystkimi polami formularza i odpowiadającymi im polami wyświetlającymi błędy walidacji
	const inputs = Array.from(document.querySelectorAll("form input"));
	const errorBoxes = Array.from(document.querySelectorAll("form p"));

	// Usunięcie niepotrzebnych pól w walidacji z tablicy takich jak: pole wyboru tytułu, pole otrzymywania newsletterów
	inputs.splice(0, 3);
	inputs.pop();

	// Obsługa zdarzenia przesłania formularza
	form.addEventListener("submit", (e) => {
		// Zatrzymanie domyślnego przesłania formularza
		e.preventDefault();

		// Utworzenie obiektu FormData zawierającego wszystkie dane z formularza
		const data = new FormData(e.target);
		// Zamiana danych z formularza w postać obiektu
		const value = Object.fromEntries(data.entries());

		// Sprawdzenie czy formularz nie zawiera błędów przy wpisywaniu przez użytkownika, jeśli zawiera to kończymy obsługę formularza.
		if (!form.checkValidity()) {
			return;
		}

		// Wywołanie funkcji sprawdzającej czy istnieje użytkownik o wpisanych danych w localStorage'u
		// Jeśli funkcja zwróci fałsz, to oznacza, że istnieje użytkownik o podanych danych, zatem przerywamy obsługę formularza
		// Jako argument przekazujemy obiekt z danymi z formularza
		if (!localStorageValidation(value)) {
			return;
		}

		// W tym miejsca wiemy, że walidacja została przeprowadzona poprawnie, zatem wywołujemy funkcję tworzącą nowego użytkownika i zapisującą go do localStorage'a
		// Jako argument przekazujemy obiekt z danymi z formularza
		handleUserCreation(value);

		// Wyświetlenie użytkownikowi okna dialogowego o poprawnym zakończeniu rejestracji konta
		appendDialog();

		// Wywołanie funkcji, która obsługuje wyświetlone okno dialogowe
		handleDialog();
	});

	// Funkcja sprawdzająca poprawność wpisanego hasła i jego potwierdzenia
	function checkPasswords() {
		// Pobranie pól formularza zawierających hasło i jego potwierdzenie
		const passwConfirm = document.querySelector("#passw_conf");
		const passw = document.querySelector("#password");
		// Pobranie elementów zawierających błędy walidacji hasła i jego potwierdzenia
		const passwConfirmError = document.querySelector(".error-passw_conf");
		const passwError = document.querySelector(".error-passw");

		// Zmienne typu stałego zawierające komunikaty o błędach związanych z hasłami
		const passwConfirmErrorText = "Hasła muszą być takie same";
		const passwErrorText =
			"Hasło musi mieć minimum 8 znaków i zawierać przynajmniej jedną cyfrę oraz małą i dużą literę";

		// Funkcja obsługująca wprowadzanie hasła w pole formularza
		function handlePasswordInput() {
			// Wyczyszczenie komunikatu o błędzie hasła
			passwError.textContent = "";
			// Wyczyszczenie niestandarowej wiadomości o błędzie dla pola hasła
			passw.setCustomValidity("");

			// Sprawdzenie, czy hasła w obywdu polach formularza są takie same
			if (passw.value !== passwConfirm.value) {
				// Jeśli wartości hasła różnią się ustawiamy niestandardową wiadomość o błędzie dla pola potwierdzenia hasła
				passwConfirm.setCustomValidity(passwConfirmErrorText);
			} else {
				// Jeśli hasła są takie same, usuwamy niestandardową wiadomość o błędzie
				passwConfirm.setCustomValidity("");
				// Wyczyszczenie komunikatu o błędzie dla pola potwierdzenia hasła
				passwConfirmError.textContent = "";
				// Ponowne sprawdzenie poprawności pola potwierdzenia hasła
				passwConfirm.checkValidity();
			}

			// Sprawdzenie poprawności pola hasła
			passw.checkValidity();
		}

		// Funkcja obsługująca wprowadzanie potwierdzenia hasła w pole formularza
		function handlePasswordConfirmInput() {
			// Sprawdzenie, czy hasła w obywdu polach formularza są takie same
			if (passw.value !== passwConfirm.value) {
				// Jeśli wartości hasła różnią się ustawiamy niestandardową wiadomość o błędzie dla pola potwierdzenia hasła
				passwConfirm.setCustomValidity(passwConfirmErrorText);
			} else {
				// Jeśli hasła są takie same, usuwamy niestandardową wiadomość o błędzie
				passwConfirm.setCustomValidity("");
				// Wyczyszczenie komunikatu o błędzie dla pola potwierdzenia hasła
				passwConfirmError.textContent = "";
				// Ponowne sprawdzenie poprawności pola potwierdzenia hasła
				passwConfirm.checkValidity();
			}

			// Sprawdzenie poprawności pola potwierdzenia hasła
			passwConfirm.checkValidity();
		}

		// Po wpisaniu w pole formularza z hasłem, zostaje wywołana funkcja obsługująca wprowadzenie hasła
		passw.addEventListener("input", handlePasswordInput);

		// Nasłuchiwanie zdarzenia, takiego że użytkownik błędnie wprowadził swoje hasło
		passw.addEventListener("invalid", () => {
			// Ustawienie niestandardowej wiadomości o błędzie dla pola hasła
			passw.setCustomValidity(passwErrorText);
			// Wyświetlenie komunikatu o błędzie dla pola hasła
			// Właściwość validationMessage jest właściwością wbudowaną dla elementów formularza w języku JS i zawiera odpowiednie teksty związane z walidacją danych w polu formularza
			passwError.textContent = passw.validationMessage;
			// Zaznaczenie pola hasła, tak aby użytkownik mógł od razu wprowadzić poprawne hasło
			passw.focus();
		});

		// Po wpisaniu w pole formularza z potwierdzeniem hasłem, zostaje wywołana funkcja obsługująca wprowadzenie potwierdzenia hasła
		passwConfirm.addEventListener("input", handlePasswordConfirmInput);

		// Nasłuchiwanie zdarzenia, takiego że użytkownik błędnie wprowadził potwierdzenie hasła
		passwConfirm.addEventListener("invalid", () => {
			// Wyświetlenie komunikatu o błędzie dla pola potwierdzenia hasła
			// Właściwość validationMessage jest właściwością wbudowaną dla elementów formularza w języku JS i zawiera odpowiednie teksty związane z walidacją danych w polu formularza
			passwConfirmError.textContent = passwConfirm.validationMessage;
			// Zaznaczenie pola hasła, tak aby użytkownik mógł od razu wprowadzić poprawne hasło
			passwConfirm.focus();
		});
	}

	// Dla każdego pola formularza wykonujemy następujące czynności:
	inputs.forEach((element, index) => {
		// Argument element - jest to aktualnie przetwarzane pole formularza
		// Argument index - jest to indeks tego elementu w tablicy 'inputs'

		// Tablice 'errorBoxes' i 'inputs' są tej samej długości zatem każde pole formularza ma odpowiadający mu elemeny wyświetlające błąd
		const errorElement = errorBoxes[index];

		// Jeśli elementem jest pole zawierające hasło, lub pole zawierające potwierdzenie hasła to wywołujemy odpowiednią dla nich funkcję sprawdzającą poprawność wpisanych haseł.
		// Index = 4 i index = 5 odnosi się to pól formularza zawierających hasło i potwierdzenie hasła
		if (index === 4 || index === 5) {
			checkPasswords();
		} else {
			// W przeciwnym wypadku wywołujemy funkcję sprawdzającą standardowe pole formularza, a jako atrybut przekazujemy aktualne pole formularza i odpowiadający mu element wyświetlający błędy walidacji
			checkInput(element, errorElement);
		}
	});
});
