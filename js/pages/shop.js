// Import funkcji sprawdzającej czy użytkownik jest zalogowany i funkcji przekierowywującej na inną stronę
import { isLoggedIn, redirectTo } from "../auth.js";

// Definicja zmiennych globalnych
let data = []; // Zmienna przechowująca tablicę obiektów znajdujących się w sklepie
let filteredData = []; // Zmienna przechowująca tablicę przefiltrowanych obiektów
let sortedData = []; // Zmienna zawierająca tablicę posortowanych obiektów
let sortBy = ""; // Zmienna definiująca aktualny tryb sortowania danych
let displayLimit = 10; // Zmienna definiująca jak wiele przedmiotów może być wyświetlonych jednocześnie na stronie
let activeFilters = []; // Zmienna przechowująca tablicę aktualnych filtrów

// Funkcja dodająca element okna dialogowego do zawartości strony
function appendDialog(id) {
	// Argument id - jest to numer oznaczający, który schemat dialogu należy wyświetlić na stronie
	// Tablica ze schematami okien dialogowych pojawiających się na stronie shop.html
	const templates = [
		`
    <div class="dialog-container">
    <h2>Aby kupić produkt należy się zalogować!</h2>
    <div class="buttons">
        <button class="btn btn-secondary login-btn">Przejdź do logowania</button>
        <button class="btn btn-secondary register-btn">Stwórz konto</button>
		<button class="btn btn-li cancel-btn">Anuluj</button>
    </div>
    </div>
  `,
		`<div class="dialog-container">
    <h2>Produkt został dodany</h2>

    <div class="buttons">
        <button class="btn btn-secondary to-shop-btn">Wróć do zakupów</button>
        <a
            href="/zegarmistrz/pages/cart.html"
            class="btn btn-secondary to-cart-btn">
            Przejdź do koszyka
        </a>
    </div>
</div>`,
	];

	// Stworzenie elementu typu div z klasą tła okna dialogowego
	const dialogBg = document.createElement("div");
	dialogBg.classList = "background";

	// Stworzenie elementu typu dialog i dodanie do jego treści schematu z tablicy 'templates' na podstawie przekazanego id
	const dialog = document.createElement("dialog");
	dialog.innerHTML = templates[id];

	// Ustawienie klasy okna dialogowego w zależności od wartości przekazanego argumentu 'id' do funkcji
	id === 0
		? (dialog.className = "guest-buy-dialog")
		: (dialog.className = "buy-dialog");

	// Dodanie do ciała dokumentu okna dialogowego i jego tła
	document.body.appendChild(dialogBg);
	document.body.appendChild(dialog);
}

// Funkcja służąca do zmiany kolejności elementów w tablicy, zwraca pomieszaną tablicę
function shuffleArray(array) {
	// Argument array - jest to tablica, w której następuje losowa zamiana kolejności poszczególnych elementów

	// Stworzenie kopii tablicy, aby nie zmieniać oryginalnej
	const shuffledArray = [...array];

	// Pętla iterująca od ostatniego elementu tablicy do pierwszego
	for (let i = shuffledArray.length - 1; i > 0; i--) {
		// Losowanie indeksu z przedziału [0, i]
		const j = Math.floor(Math.random() * (i + 1));

		// Zamiana miejscami elementów o indeksach i oraz j w tablicy
		[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
	}

	// Zwrócenie pomieszanej tablicy
	return shuffledArray;
}

// Funkcja pomocnicza do obliczenia ceny z uwzględnieniem ewentualnej obniżki
function getPriceWitchDiscount(watch) {
	// Argument watch - jest to obiekt zegarka znajdującego się w tablicy
	// Jeśli zegarek jest na wyprzedaży to:
	if (watch.onSale) {
		// Stała zawierająca odpowiednio sformatowaną starą cenę zegarka
		const watchPrice = parseInt(watch.price.replace(" ", ""));
		// Pobranie liczby procentów obniżki ceny zegarka
		const discountPercent = parseInt(watch.discount);

		// Zwracamy nową cenę po obniżce
		return watchPrice - (watchPrice * discountPercent) / 100;
	} else {
		// W przeciwnym wypadku zwracamy podstawową cenę zegarka odpowiednio sformatowaną
		return parseInt(watch.price.replace(" ", ""));
	}
}

// Funkcja służąca do sortowania obiektów w tablicy
function sortData() {
	// Wybór sposobu sortowania na podstawie wartości globalnej zmiennej 'sortBy'
	switch (sortBy) {
		// Sortowanie według nowości przedmiotu
		case "new":
			// Zwracana jest tablica obiektów, której obiekty zawierają wartość 'isNew' ustawioną na wartość true
			return data.filter((item) => item.isNew === true);

		// Sortowanie według popularności przedmiotu
		case "popular":
			// Zwracana jest tablica obiektów, której obiekty zawierają wartość 'isBestseller' ustawioną na wartość true
			return data.filter((item) => item.isBestseller === true);

		// Sortowanie według ceny (od najniższej do najwyższej)
		case "price-low":
			// Zwracana jest skopiowana tablica posortowana według ceny poszczególnych obiektów
			return data.slice().sort(
				// Wykorzystanie funkcji porównującej, jeśli cena obiektu a jest większa od ceny obiektu b zwracana jest wartość dodatnia, w przeciwnym wypadku wartość ujemna, a gdy wartości są takie same zwracane jest zero. W ten sposób za pomocą metody sort() jesteśmy w stanie posortować obiekty w sposób rosnący po ich cenie
				(a, b) => {
					// Obliczenie ceny z uwzględnieniem ewentualnej przeceny dla obiektów a i b, wykorzystując funkcję pomocniczą
					const priceA = getPriceWitchDiscount(a);
					const priceB = getPriceWitchDiscount(b);

					// Zwrócenie porównania cen obiektów a i b
					return priceA - priceB;
				}
			);

		// Sortowanie według ceny (od najwyższej do najniższej)
		case "price-high":
			// Zwracana jest skopiowana tablica posortowana według ceny poszczególnych obiektów
			return data.slice().sort(
				// Wykorzystanie funkcji porównującej, jeśli cena obiektu b jest większa od ceny obiektu a zwracana jest wartość dodatnia, w przeciwnym wypadku wartość ujemna, a gdy wartości są takie same zwracane jest zero. W ten sposób za pomocą metody sort() jesteśmy w stanie posortować obiekty w sposób malejący po ich cenie
				(a, b) => {
					// Obliczenie ceny z uwzględnieniem ewentualnej przeceny dla obiektów a i b, wykorzystując funkcję pomocniczą
					const priceA = getPriceWitchDiscount(a);
					const priceB = getPriceWitchDiscount(b);

					// Zwrócenie porównania cen obiektów a i b
					return priceB - priceA;
				}
			);
		// Domyślny przypadek, gdy zmienna 'sortBy' nie odpowiada pozostałym przypadkom, następuje zwrócenie tablicy w której obiekty mają losowo zamieniane miejsca ze sobą za pomocą funkcji shuffleArray
		default:
			return shuffleArray(data);
	}
}

// Funkcja asynchroniczna służąca do pobrania danych za pomocą fetcha i zwrócenia ich w formacie JSON
async function fetchData() {
	try {
		const response = await fetch("/zegarmistrz/data/dane.json");
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return await response.json();
	} catch (error) {
		console.error("Fetch error:", error);
	}
}

// Funkcja mająca na celu stworzenie elementów DOM dla każdego przedmiotu w sklepie, a także wyświetlenie i obsługę kupna poszczególnych produktów
function createShopContent(array) {
	// Argument array - jest to tablica obiektów zawierająca poszczególne przedmioty w sklepie

	// Pobranie elementu DOM będącego kontenerem na wszystkie przedmioty w sklepie
	const shop = document.querySelector(".shop");
	// Zmienna przechowująca wartość true/false zwróconą przez zaimportowaną funkcję, sprawdzającą czy aktualny użytkownik jest zalogowany
	const isLogged = isLoggedIn();

	// Mapowanie tablicy wszystkich obiektów znajdujących się w tablicy przekazanej jako argument funkcji
	array.map((watch) => {
		// Argument watch - jest to pojedynczy obiekt zegarka znajdujący się w tablicy 'array'

		// Utworzenie kontenera dla zegarka i nadanie mu odpowiedniej klasy
		const container = document.createElement("div");
		container.className = "watch-container";

		// Parsowanie ceny zegarka na liczbę zmiennoprzecinkową, wraz z usunięciem wszystkich białych znaków
		let watchPrice = parseFloat(watch.price.split(" ").join(""));
		let discountPercent; // Zmienna zawierająca liczbę procent zniżki dla danego zegarka
		let newPrice; // Zmienna przechowująca nową cenę zegarka po obniżce

		// Jeśli obiekt zegarek zawiera wartość onSale ustawioną na true, to obliczamy zniżkę
		if (watch.onSale) {
			// Parsowanie procentu zniżki na liczbę całkowitą
			discountPercent = parseInt(watch.discount);
			// Obliczenie nowej obniżonej ceny zegarka
			newPrice = watchPrice - watchPrice * (discountPercent / 100);
		}

		// Funkcja formatująca cenę jako walutę polską
		function formatCurrency(price) {
			// Argument price - jest to tekst zawierający cenę zegarka
			// Zwracamy cenę sformatowaną jako polską walutę, zawierającą minimum i maksimum dwa miejsca po przecinku
			return price.toLocaleString("pl-PL", {
				style: "currency",
				currency: "PLN",
				maximumFractionDigits: 2,
				minimumFractionDigits: 2,
			});
		}

		// Funkcja zwracająca schemat HTML zawierający specjalne informacje o wybranym zegarku
		function renderWatchSpecialInfo() {
			// Zmienna przechowująca znaczniki HTML w formie tekstu
			let specialInfo = "";

			// Dodanie informacji o przecenie i jej procencie, jeśli zegarek jest przeceniony
			if (watch.onSale) {
				specialInfo += `<span class="sale">Wyprzedaż -${discountPercent}%</span>`;
			}

			// Dodanie informacji o nowości zegarka, jeśli zegarek jest nowy
			if (watch.isNew) {
				specialInfo += `<span class="new">Nowość</span>`;
			}

			// Dodanie informacji o tym czy wybrany zegarek jest bestsellerem
			if (watch.isBestseller) {
				specialInfo += `<span class="bestseller">Bestseller</span>`;
			}

			// Zwracamy schemat zawierający specjalne informacje, dodatkowo umieszczając go w dodatkowym kontenerze
			return `<div class="watch-special">${specialInfo}</div>`;
		}

		// Funkcja zwracająca schemat HTML zawierający informacje o cenie zegarka, zwykłej i tej po przecenie
		function renderWatchPriceInfo() {
			// Zmienna przechowująca znaczniki HTML w formie tekstu
			let priceInfo = "";

			// Jeśli zegarek jest przeceniony ustawiamy schemat na taki, który wyświetla cenę przed i po zniżce, dodatkowo ceny zegarka formatujemy z wykorzystaniem funkcji formatCurrency(), która jako argument przyjmuje cenę zegarka
			if (watch.onSale) {
				priceInfo = `
				<div class="watch-price-container">
					<p class="watch-price">${formatCurrency(newPrice)}
					</p>
        			<span class="watch-price-old">${formatCurrency(watchPrice)}
					</span>
     			</div>`;
			} else {
				// W przeciwnym wypadku schemat zostaje ustawiony wyłącznie na cenę podstawową, bez obniżki. Cenę również formatujemy za pomocą funkcji formatCurrency()
				priceInfo = `
				<p class="watch-price">${formatCurrency(watchPrice)}
				</p>`;
			}

			// Zwracamy schemat ze znacznikami HTML zawierający odpowiednią dla danego zegarka cenę
			return priceInfo;
		}

		// Funkcja zwracająca schemat HTML zawierający przycisk pozwalający na zakup zegarka
		function renderWatchBuyBtn() {
			// Zmienna przechowująca znaczniki HTML w formie tekstu
			let buttonInfo = "";

			// Sprawdzamy czy aktualny użytkownik jest zalogowany
			if (isLogged) {
				// Jeśli tak to ustawiamy schemat aby zawierał przycisk pozwalający zalogowanemu użytkownikowi na dodanie zegarka do koszyka
				buttonInfo =
					'<button class="add-cart-btn btn btn-primary">Dodaj do koszyka</button>';
			} else {
				// W przeciwnym razie schemat ustawiamy tak aby zawierał przycisk pozwalający na zakup zegarka użytkownikowi bez konta
				buttonInfo =
					'<button class="guestBuy btn btn-primary">Kup jako gość</button>';
			}

			// Zwracamy schemat z odpowiednim dla danego użytkownika przyciskiem zakupu zegarka
			return buttonInfo;
		}

		// Funkcja obsługująca dodanie wybranego zegarka do koszyka, localStorage'a i aktywnej sesji zalogowanego użytkownika
		function handleAddToCart() {
			// Pobranie danych aktualnie zalogowanego użytkownika z sessionStorage i zapisanie ich w stałej
			const user = JSON.parse(sessionStorage.getItem("loggedIn"));
			// Pobranie listy zarejestrowanych na stronie użytkowników z localStorage i zapisanie ich w stałej
			const users = JSON.parse(localStorage.getItem("users"));
			// Pobranie elementu wyświetlającego w pasku nawigacji aktualną liczbę przedmiotów w koszyku
			const cartElement = document.querySelector(".cart-quantity");

			// Dodanie do koszyka, aktualnie zalogowanego użytkownika, wybranego zegarka
			user.cart.push(watch);

			// Zapisanie w sessionStorage obiektu zalogowanego użytkownika, wraz z zaktualizowanym koszykiem, zamienionego w format JSON
			sessionStorage.setItem("loggedIn", JSON.stringify(user));

			// Dla każdego użytkownika zapisanego w tablicy users wykonujemy poniższe instrukcje:
			users.forEach((registeredUser) => {
				// Sprawdzamy czy aktualnie zalogowany użytkownik, ma taki sam email jak email iterowanych użytkowników w tablicy users
				if (registeredUser.email === user.email) {
					// Jeśli znajdziemy takiego samego użytkownika to podmieniamy dane aktualnie zalogowanej osoby w tablicy ze wszystkimi użytkownikami
					registeredUser.cart = user.cart;
				}
			});

			// Podmieniamy w localStorage zaktualizowaną tablicę użytkowników zamieniając jej obiekt w format JSON
			localStorage.setItem("users", JSON.stringify(users));

			// Sprawdzamy czy liczba przedmiotów w koszyku jest większa od zera
			if (parseInt(cartElement.textContent) > 0) {
				// Jeśli tak to zwiększamy licznik zawartości koszyka o jeden w górę
				cartElement.textContent = parseInt(cartElement.textContent) + 1;
			} else {
				// Jeśli koszyk jest pusty to ustawiamy ilość przedmiotów w koszyku na jeden
				cartElement.textContent = 1;
			}

			// Zmieniamy styl elementu tak aby był on widoczny dla użytkownika
			cartElement.style.display = "flex";
		}

		// Funkcja dodająca obsługę przycisku dodawania do koszyka/kupna produktu
		function handleAddButton() {
			// Sprawdzamy czy aktualny użytkownik jest zalgowany
			if (isLogged) {
				// Pobranie elementu przycisku dodawania do koszyka
				const addButton = container.querySelector(".add-cart-btn");

				// Nasłuchiwanie na kliknięcie na przycisk dodawania do koszyka
				addButton.addEventListener("click", () => {
					// Wyświetlenie okna dialogowego z argumentem id = 1, oznacza okno dialogowe dla zalogowanego użytkownika
					appendDialog(1);

					// Pobranie elementów DOM'u potrzebny do obsługi okna dialogowego
					const dialog = document.querySelector(".buy-dialog");
					const dialogBg = document.querySelector(".background");
					// Pobranie przycisku przekierowywującego do sklepu
					const toShop = dialog.querySelector(".to-shop-btn");

					// Wyświetlenie okna dialogowego oraz jego tła
					// Metoda show(), podobnie jak metoda close(), jest wbudowana dla elementów HTML typu dialog
					dialog.show();
					dialogBg.style.display = "block";

					// Dodanie nasłuchiwania na przycisk okna dialogowego służącego do powrotu na stronę z ofertą sprzedaży zegarków
					toShop.addEventListener("click", () => {
						// Zamknięcie okna dialogowego
						dialog.close();

						// Usunięcie elementu okna dialogowego i jego tła z drzewa DOM
						dialog.remove();
						dialogBg.remove();
					});

					// Wywołanie funkcji obsługującej dodanie danego zegarka, do koszyka i zapisanie w localStorage'u
					handleAddToCart();
				});
			} else {
				// Jeśli użytkownik nie jest zalogowany wykonujemy poniższy kod:

				// Pobranie elementu przycisku dodawania do koszyka dla niezalogowanego użytkownika
				const guestAddButton = container.querySelector(".guestBuy");

				// Nasłuchiwanie na kliknięcie na przycisk dodawania do koszyka dla niezalogowanego użytkownika
				guestAddButton.addEventListener("click", () => {
					// Wyświetlenie okna dialogowego z argumentem id = 0, oznacza okno dialogowe dla niezalogowanego użytkownika
					appendDialog(0);

					// Pobranie elementów DOM'u potrzebny do obsługi okna dialogowego
					const dialog = document.querySelector(".guest-buy-dialog");
					const dialogBg = document.querySelector(".background");
					// Pobranie przycisków znajdujących się w oknie dialogowym
					const toLogin = dialog.querySelector(".login-btn");
					const toRegister = dialog.querySelector(".register-btn");
					const cancel = dialog.querySelector(".cancel-btn");

					// Wyświetlenie okna dialogowego oraz jego tła
					// Metoda show(), podobnie jak metoda close(), jest wbudowana dla elementów HTML typu dialog
					dialog.show();
					dialogBg.style.display = "block";

					// Dodanie nasłuchiwania na przycisk okna dialogowego służącego do przejścia na stronę logowania
					toLogin.addEventListener("click", () => {
						// Zamknięcie okna dialogowego
						dialog.close();

						// Przejście na stronę logowania za pomocą zaimportowanej funkcji podmieniającej adres URL w przeglądarce na przekazany argument
						redirectTo("login.html");
					});

					// Dodanie nasłuchiwania na przycisk okna dialogowego służącego do przejścia na stronę rejestracji
					toRegister.addEventListener("click", () => {
						// Zamknięcie okna dialogowego
						dialog.close();

						// Przejście na stronę rejestracji za pomocą zaimportowanej funkcji podmieniającej adres URL w przeglądarce na przekazany argument
						redirectTo("register.html");
					});

					// Dodanie nasłuchiwania na przycisk okna dialogowego służącego do przejścia na stronę rejestracji
					cancel.addEventListener("click", () => {
						// Zamknięcie okna dialogowego
						dialog.close();

						// Usunięcie elementu okna dialogowego i jego tła z drzewa DOM
						dialog.remove();
						dialogBg.remove();
					});
				});
			}
		}

		// prettier-ignore
		// Stała zawierająca schemat HTML konteneru dla danego zegarka
		const template = `
		<div class="watch-img-container">
			${renderWatchSpecialInfo() /* Wywołanie funkcji dodającej do kontenera informacje takie jak czy zegarek jest na przecenie, jest najnowszy itd. */}

			${/* Dodanie zdjęcia wybranego zegarka wraz z tekstem alternatywnym oznaczającym jego markę i model */ ''}
            <img src="../data/${watch.imagePath}" alt="${watch.manufacture} ${watch.name}" /> 
        </div>
        <div class="watch-info">
            <h3 class="watch-name">
				${/* Dodanie w wyświetlonej na stronie nazwie zegarka, linku, który po kliknięciu przekieruje użytkownika na nową stronę z informacjami o firmie produkującej wybrany produkt */ ''}
                <a class="brand-link" target="_blank" href="/zegarmistrz/pages/company.html?brand=${watch.manufacture.toLowerCase()}">Zegarek Męski ${watch.manufacture} ${watch.name}</a>
            </h3>
            <h4 class="watch-model">${watch.model}</h4>
			${ renderWatchPriceInfo() /* Wywołanie funkcji dodającej do kontenera cenę wybranego zegarka */}
			${ renderWatchBuyBtn() /* Wywołanie funkcji  dodającej do kontenera przycisk umożliwiający zakup wybranego zegarka */}
        </div>`;

		// Dodanie do kontenera zawartości schematu
		container.innerHTML = template;
		// Dołączenie jako dziecko do głównego pojemnika, kontenera z wygenerowanymi danymi o wybranym zegarku
		shop.appendChild(container);

		// Dodanie obsługi przycisków znajdujących się w kontenerze, pozwalających na zakup wybranego zegarka
		handleAddButton();
	});
}

// Funkcja odpowiadająca za stworzenie elementów DOM i przypisanie ich do strony, dla każdego elementu znajdującego się w tablicy podanej jako argument
function displayShopContent(array) {
	// Argument array - jest to tablica obiektów zawierająca poszczególne przedmioty w sklepie

	// Sprawdzamy czy przekazana tablica obiektów jest pusta, jeśli tak to, wyświetlamy odpowiedni komunikat
	if (array.length === 0) {
		// Pobranie elementu DOM będącego kontenerem na wszystkie przedmioty w sklepie
		const shop = document.querySelector(".shop");

		// Zmieniamy zawartość sklepu, informując użytkownika, że w tablicy nie istnieją przedmioty o podanych przez niego filtrach
		shop.innerHTML = `<div class="not-found-container">
                        <h2>Niestety nic nie znaleźliśmy!</h2>
                        <h3>Spróbuj zmienić swoje filtry</h3>
            </div>`;

		// Kończymy wykonywanie funkcji
		return;
	}

	// Jeśli tablica przekazanych obiektów nie jest pusta, wówczas wykonujemy następującą funkcję mającą na celu stworzenie elementów DOM i wyświetlenie ich na stronie sklepu, jako argument podajemy tablicę z obiektami znajdującymi się w sklepie
	createShopContent(array);
}

function handleShopDisplay() {
	// Pobranie elementu DOM będącego kontenerem na wszystkie przedmioty w sklepie
	const shop = document.querySelector(".shop");

	// Wyczyszczenie zawartości sklepu
	shop.innerHTML = "";

	// Sortowanie pobranych danych
	sortedData = sortData(data, sortBy);

	// Utworzenie zmiennej zawierającej tablicę obiektów, które zostaną wyświetlone użytkownikowi
	let slicedData = sortedData
		// Przejście po każdym produkcie w posortowanej tabeli, tak aby zwrócić te elementy, które są w posortowanej tablicy
		// Za pomocą takiego zabiegu jesteśmy w stanie jednocześnie wyświetlać odpowiednio posortowane i przefiltrowane produkty w sklepie
		.filter((item) => filteredData.includes(item))
		// Przycięcie tablicy z posortowanymi danymi, do ilości maksymalnej liczby wyświetlanych przedmiotów na stronie
		.slice(0, displayLimit);

	// Wyświetlenie posortowanych i przefiltrowanych przedmiotów na stronie sklepu
	displayShopContent(slicedData);

	// Dodanie przycisku wyświetlającego kolejne przedmioty w sklepie
	const showMoreBtn = document.createElement("button");
	// Dodanie klasy i treści do przycisku
	showMoreBtn.className = "show-more-btn btn-secondary btn";
	showMoreBtn.innerHTML = `Pokaż więcej <span class="material-symbols-outlined"> expand_more </span>`;

	// Funkcja sprawdzająca, czy liczba wyświetlanych elementów na stronie nie przekracza liczby dostępnych elementów w tablicy, po zastosowaniu filtrów i sortowania
	function isMoreThanDisplayLimit() {
		if (
			displayLimit >
			sortedData.filter((item) => filteredData.includes(item)).length
		) {
			// Jeśli tak to zwracamy true
			return true;

			// W przeciwnym wypadku zwracamy false
		} else return false;
	}

	// Sprawdzenie, czy liczba wyświetlanych elementów nie przekracza liczby dostępnych elementów po zastosowaniu filtrów i sortowania
	// Dzięki temu gdy nie będzie więcej produktów do wyświetlenia, użytkownik nie zobaczy przycisku żeby pokazać wiecęj obiektów
	if (isMoreThanDisplayLimit()) {
		// Jeśli maksymalna ilość wyświetlanych elementów jest większa niż ilość produktów mających być wyświetlonych na stronie to chowamy przycisk przed użytkownikiem
		showMoreBtn.style.display = "none";
	}

	// Dodajemy element przycisku do kontenera zawierającego wszystkie przedmioty w sklepie
	shop.append(showMoreBtn);

	// Dodanie nasłuchiwania na kliknięcie w przycisk wyświetlający kolejne przedmioty w sklepie
	showMoreBtn.addEventListener("click", () => {
		// Zwiększenie ilości wyświetlanych pozycji o pięć
		displayLimit += 5;

		// Ponowne utworzenie tablicy
		let slicedData = sortedData
			.filter((item) => filteredData.includes(item))
			.slice(0, displayLimit);
		// Wyczyszczenie zawartości sklepu
		shop.innerHTML = "";

		// Ponowne wyświetlenie wszystkich zegarków w sklepie
		displayShopContent(slicedData);

		// Sprawdzenie, czy liczba wyświetlanych elementów nie przekracza liczby dostępnych elementów po zastosowaniu filtrów i sortowania
		if (!isMoreThanDisplayLimit()) {
			// Jeśli nie przekracza to dodajemy kolejny element przycisku do kontenera zawierającego wszystkie przedmioty w sklepie
			shop.append(showMoreBtn);
		}
	});
}

// Funkcja wyświetlająca filtry dotyczące marki
function displayMarkFilters() {
	// Pobranie elementu DOM będącego pustą listą marek zegarków
	const marksUl = document.querySelector(".filter-mark");
	// Utworzenie pustej tablicy na nazwy marek zegarków
	const marks = [];
	// Iteracja po wszystkich obiektach zapisanych w tablicy 'data'
	data.forEach((watch) => {
		// Argument watch - jest to obiekt znajdujący się w tablicy obiektów 'data'

		// Jeśli marka zegarka nie znajduje się jeszcze w tablicy marks, dodaj ją
		if (!marks.includes(watch.manufacture)) {
			marks.push(watch.manufacture);
		}
	});

	// Utworzenie HTML zawierającego filtry marek zegarków
	const filterMarks = marks
		.map(
			// Iteracja po wszystkich nazwach marek zapisanych w tablicy 'marks'

			// Dla każdej marki tworzymy element li z odpowiednimi danymi:
			// Każdy element listy li zawiera atrybut data-filter równy nazwie marki, a także nazwę marki i ikonę, która jest widoczna tylko po zaznaczeniu danego filtra
			(mark) =>
				`  <li data-filter="${mark}">
                    <p>${mark}</p>
                    <span class="check-icon material-symbols-outlined"> done </span>
                </li>`
		)
		// Połączenie wszystkich elementów listy w jeden ciąg znaków
		.join("");

	// Wstawienie wygenerowanego HTML do listy filtrów zawierającej marki zegarków
	marksUl.innerHTML = filterMarks;
}

// Funkcja odpowiedzialna za obsługę sortowania elementów na stronie sklepu
function handleSorting() {
	// Pobranie elementów DOM potrzebnych do obsługi sortowania

	// Pobranie elementu będącego menu całego sortowania
	const sortMenu = document.querySelector(".sort-menu");
	// Pobranie przycisku zamykającego menu sortowania
	const sortCloseBtn = document.querySelector(".sortCloseBtn");
	// Pobranie przycisku otwierającego menu sortowania
	const sortOpenBtn = document.querySelector(".sortOpenBtn");
	// Pobranie przycisku resetującego ustawione opcje sortowania
	const resetSortingBtn = document.querySelector(".reset-sorting-btn");
	// Pobranie wszystkich opcji sortowania z drzewa DOM'u i zapisanie ich w tablicy
	const sortOptions = Array.from(document.querySelectorAll(".sort-option"));

	// Dodanie nasłuchiwania na kliknięcie przycisku resetującego sortowanie
	resetSortingBtn.addEventListener("click", () => {
		// Usunięcie klasy 'checked' ze wszystkich opcji sortowania
		sortOptions.forEach((option) => option.classList.remove("checked"));
		// Ustawienie wartości sortowania na domyślną
		sortBy = "default";
		// Wyświetlenie danych z nowym trybem sortowaniem
		handleShopDisplay();
	});

	// Dodanie nasłuchiwania na kliknięcie przycisku otwierającego menu sortowania
	sortOpenBtn.addEventListener("click", () => {
		// Dodanie klasy 'open' do menu sortowania
		sortMenu.classList.add("open");
	});

	// Dodanie nasłuchiwania na kliknięcie przycisku zamykającego menu sortowania
	sortCloseBtn.addEventListener("click", () => {
		// Usunięcie klasy 'open' z menu sortowania
		sortMenu.classList.remove("open");
	});

	// Iteracja po wszystkich opcjach sortowania
	sortOptions.forEach((sortOption) => {
		// Atrybut sortOption - jest to element DOM, będący opcją filtrowania wyświetlaną na stronie

		// Dodanie nasłuchiwania na kliknięcie opcji sortowania
		sortOption.addEventListener("click", () => {
			// Usunięcie klasy 'checked' ze wszystkich opcji sortowania, wyczyszczenie sortowania
			sortOptions.forEach((option) => option.classList.remove("checked"));

			// Ustawienie sortowania według wybranego datasetu sortowania zawartego w danej opcji sortowania
			sortBy = sortOption.dataset.sort;

			// Wyrenderowanie danych z nowym sortowaniem
			handleShopDisplay();

			// Dodanie klasy 'checked' do wybranej opcji sortowania
			sortOption.classList.add("checked");

			// Ukrycie menu sortowania po 700ms
			setTimeout(() => {
				sortMenu.classList.remove("open");
			}, 700);
		});
	});
}

// Funkcja odpowiedzialna za obsługę filtrowania produktów, obejmuje dodawania, usuwanie aktywnych filtrów, resetowanie wszystkich filtrów, zatwierdzanie filtrów, a także wyświetlanie aktywnych filtrów znajdujących się na stronie sklepu
function handleFiltering() {
	// Pobranie elementów DOM potrzebnych do obsługi sortowania
	// Pobranie elementu będącego menu całego filtrowania
	const filterMenu = document.querySelector(".filter-menu");
	// Pobranie przycisku zamykającego menu filtrowania
	const filterCloseBtn = document.querySelector(".filterCloseBtn");
	// Pobranie przycisku otwierającego menu filtrowania
	const filterOpenBtn = document.querySelector(".filterOpenBtn");
	// Pobranie przycisku usuwającego wszystkie filtry
	const removeAllFiltersBtn = document.querySelector(".removeAllFilters");
	// Pobranie elemenu zawierającego aktywnie wybrane filtry
	const selectedFiltersContainer = document.querySelector(
		".selected-filters-content"
	);
	// Pobranie przycisku do zatwierdzenia aktualnie wybranych filtrów
	const applyFiltersBtn = document.querySelector(".apply-filters-btn");
	// Pobranie wszystkich opcji filtrowania i zapisanie ich w tablicy
	const filterOptions = Array.from(document.querySelectorAll(".filter-option"));
	// Pobranie wszystkich pól dotyczących filtrowania po cenie przedmiotu i zapisanie ich w tablicy
	const priceFilterInputs = Array.from(
		document.querySelectorAll(".filter-price input")
	);

	// Dodanie nasłuchiwania na kliknięcie przycisku otwierającego menu filtrów
	filterOpenBtn.addEventListener("click", () => {
		// Dodanie klasy 'open' do menu filtrowania
		filterMenu.classList.add("open");
	});

	// Dodanie nasłuchiwania na kliknięcie przycisku zamykającego menu filtrów
	filterCloseBtn.addEventListener("click", () => {
		// Usunięcie klasy 'open' z menu filtrowania
		filterMenu.classList.remove("open");
	});

	// Obsługa kliknięcia przycisku usuwania wszystkich aktywnych filtrów
	removeAllFiltersBtn.addEventListener("click", () => {
		// Pobranie wszystkich elementów zagnieżdzonej listy danej opcji filtrowania
		const filterOptions = document.querySelectorAll(".filter-option ul li");
		// Pobranie inputów zawierających filtrowanie po cenie przedmiotu
		const priceFrom = document.querySelector("#price-from");
		const priceTo = document.querySelector("#price-to");

		// Usunięcie wszystkich aktywnych filtrów
		activeFilters = [];

		// Wyzerowanie cen w inputach dotyczących filtrowania po cenie
		priceFrom.value = "";
		priceTo.value = "";

		// Schowanie przed użytkownikiem menu z aktywnymi filtrami
		selectedFiltersContainer.parentElement.style.display = "none";

		// Usunięcie wszystkich ikon, oznaczających zaznaczoną opcję filtrowania, z elementów zagnieżdzonej listy danej opcji filtrowania
		filterOptions.forEach((filter) => filter.classList.remove("checked"));

		// Ustawienie zmiennej z filtrowanymi danymi, na dane podstawowe, zatem resetujemy dane w tablicy 'filteredData'
		filteredData = data;

		// Wyrenderowanie danych z nowym filtrowaniem
		handleShopDisplay();
	});

	// Iteracja po wszystkich inputach z filtrami cenowymi
	priceFilterInputs.forEach((priceFilter) => {
		// Nasłuchiwanie na zdarzenie wpisywania wartości w bieżącym filtrze cenowym
		priceFilter.addEventListener("input", () => {
			// Pobranie elementów DOM'u będacych inputami
			const priceFromInput = document.querySelector("#price-from");
			const priceToInput = document.querySelector("#price-to");

			// Pobranie wartości zapisanych w inputach związanych z filtrowaniem po cenie
			let priceFrom = priceFromInput.value;
			let priceTo = priceToInput.value;

			// Usunięcie poprzednich filtrów dotyczących ceny
			activeFilters = activeFilters.filter(
				// Dla każdego filtra w tablicy aktywnych filtrów zwracamy te, które nie są filtrami cenowymi
				// Innymi słowami usuwamy filtry cenowe z tablicy aktywnych filtrów
				(filter) =>
					!filter.filterName.includes("Od ") &&
					!filter.filterName.includes("Do ")
			);

			// Sprawdzenie czy wartość w polu odpowiadającym za cenę początkową jest ustawiona
			if (priceFrom !== "") {
				// Jeśli użytkownik wpisał wartość to:
				// Do tablicy aktywnych filtrów dodajemy nowy obiekt składający się z nazwy filtra, jego typu i ceny
				activeFilters.push({
					filterName: "Od " + priceFrom + "zł",
					filterType: "filter-price",
					filterPrice: priceFrom,
				});
			}

			// Sprawdzenie czy wartość w polu odpowiadającym za cenę końcową jest ustawiona
			if (priceTo !== "") {
				// Jeśli użytkownik wpisał wartość to:
				// Do tablicy aktywnych filtrów dodajemy nowy obiekt składający się z nazwy filtra, jego typu i ceny
				activeFilters.push({
					filterName: "Do " + priceTo + "zł",
					filterType: "filter-price",
					filterPrice: priceTo,
				});
			}

			// Wyświetlenie aktywnych filtrów na stronie
			showActiveFilters();
		});
	});

	// Obsluga kliknięcia w przycisk zatwierdzenia aktywnych filtrów
	applyFiltersBtn.addEventListener("click", () => {
		// Sprawdzamy jeśli tablica z aktywnymi filtrami nie jest pusta to:
		if (activeFilters.length !== 0) {
			// Przypisujemy do tablicy przefiltrowanych danych, wynik funkcji dodającej filtry, z argumentem zmiennej globalnej 'data' zawierającej podstawowe dane
			filteredData = applyFilters(data);

			// Wyrenderowanie danych z nowym sortowaniem
			handleShopDisplay();
		}
	});

	// Iteracja po wszystkich opcjach filtrowania, dla każdej opcji wykonujemy następujący kod:
	filterOptions.forEach((filterOption) => {
		// Argument filterOption - jest to element DOM zawierający wewnątrz siebie kolejne zagnieżdzone elementy do filtrowania

		// Pobranie dla każdej opcji filtrowania, przycisku do otwierania/zamykania zagnieżdzonych opcji danego filtra
		const filterOptionBtn = filterOption.querySelector(".filter-option-btn");
		// Pobranie dla każdej opcji filtrowania kontenera, w którym znajduja się zagnieżdzone elementy filtrowania
		const filterOptionContainer = filterOption.querySelector(
			".filter-option-container"
		);

		// Pobranie wszystkich zagnieżdzonych filtrów w danej opcji filtrowania i zapisanie ich w tablicy
		const filterOptionList = Array.from(filterOption.querySelectorAll("ul li"));

		// Obsługa kliknięcia przycisku do otwierania/zamykania zagnieżdzonych filtrów w danej opcji filtrowania
		filterOptionBtn.addEventListener("click", () => {
			// Dodanie/usunięcie klasy 'open' do przycisku
			filterOptionBtn.classList.toggle("open");

			// Otworzenie/zamknięcie zagnieżdzonej listy filtrów
			filterOptionContainer.classList.toggle("open");

			// Zmienna przechowująca wartość true/false w zależności od tego czy istnieje otwarta zagnieżdzona lista filtrów
			let isOpen = Array.from(
				document.querySelectorAll(".filter-option-container")
				// Pobieramy jako tablicę wszystkie zagnieżdzone kontenery w poszczególnych opcjach filtrowania
				// Jeśli jakikolwiek z kontenerów jest otwarty zmienna przyjmie wartość true
			).some((container) => container.classList.contains("open"));

			// Wyświetlamy kontener z aktywnymi filtrami tylko wtedy gdy żadne z zagnieżdzonych filtrów w poszczególnych opcjach filtrowania jest zamknięte, a dodatkowo tablica aktywnych filtrów nie może być pusta
			if (!isOpen && activeFilters.length !== 0) {
				// Jeśli spełnimy wyżej wymienione warunki wyświetlamy kontener z aktywnymi filtrami
				selectedFiltersContainer.parentElement.style.display = "block";
			} else {
				// W przeciwnym wypadki ukrywamy kontener z aktywnymi filrami przed użytkownikiem
				selectedFiltersContainer.parentElement.style.display = "none";
			}
		});

		// Dla każdego filtra zagnieżdzonego w poszczególnych opcjach filtrowania wykonujemy następujące instrukcje:
		filterOptionList.forEach((li) => {
			// Argument li - jest to element DOM odpowiadający pojedynczemu zagnieżdzonemu filtrowi

			// Pobieramy nazwę danego zagnieżdzonego filtru
			const filterText = li.querySelector("p").textContent;
			// Pobieramy typ danego zagnieżdzonego filtru poprzez pobranie wszystkich klas rodzica wybranego elementu filtrowania, następnie klasy zamieniamy na tekst i dzielimy na tablicę zawierającą pojedyncze klasy, na koniec wybieramy drugi element tablicy zawierającej klasy, który odpowiada za typ danego filtru i zapisanie go do zmiennej
			const filterType = li.parentElement.classList.toString().split(" ")[1];

			// Dodajemy nasłuchiwanie na kliknięcie wybranego zagnieżdzonego filtra
			li.addEventListener("click", () => {
				// Sprawdzamy jeśli rodzic klikniętego filtra należy do filtrów wyprzedaży to wówczas:
				if (li.parentElement.classList.contains("filter-sale")) {
					// Pobieramy wszystkie zagnieżdzone filtry dotyczące filtrowania według wyprzedaży i zapisujemy w tablicy
					const filtersSales = Array.from(
						document.querySelectorAll(".filter-sale li")
					);

					// Dla każdego filtra wyprzedaży usuwamy klasę 'checked', zatem usuwamy ikonę odpowiadającą zaznaczonemu filtrowi
					// Chodzi o to aby użytkownik mógł zaznaczyć wyłącznie jeden z dwóch filtrów dotyczących wyprzedaży
					filtersSales.forEach((li) => li.classList.remove("checked"));

					// Usuń z tablicy aktywnych filtrów wszystkie filtry dotyczące wyprzedaży
					activeFilters = activeFilters.filter(
						(filter) =>
							!filter.filterName.includes("Na wyprzedaży") &&
							!filter.filterName.includes("Nie na wyprzedaży")
					);
				}

				// Zaznaczamy kliknięty filtr, wyświetlamy ikonę aktywnego filtra
				li.classList.add("checked");

				// Sprawdzamy czy kliknięty filtr znajduje się już w tablicy aktywnych filtrów
				if (
					// Jeśli w tablicy aktywnych filtrów znaleziono filtr o takiej samej nazwie jak bieżąca nazwa zagnieżdzonego filtru, to nic nie robimy
					// Oznacza to, że w tablicy aktywnych filtrów istnieje już taki sam filtr
					!activeFilters.some((filter) => filter.filterName === filterText)
				) {
					// W przeciwnym wypadku do tablicy aktywnych filtrów dodajemy obiekt, składający się z nazwy bieżącego filtru i jego typu
					activeFilters.push({
						filterName: filterText,
						filterType: filterType,
					});
				}

				// Zaktualizowanie wyglądu aktywnych filtrów
				showActiveFilters();
			});
		});
	});

	// Funkcje służąca do zatwierdzenia aktualnych filtrów i zwrócenia danych zgodnych z aktywnymi filtrami.
	// Funkcja zwraca tablicę przefiltrowanych zegarków, tych które spełniają wszystkie warunki zaznaczonych aktywnych filtrów
	function applyFilters(array) {
		// Argument array - jest to  tablica obiektów zawierająca dane przedmiotów znajdujących się w sklepie

		// Funkcja zwraca tablicę przedmiotów podaną jako argument, zawierającą tylko te produkty, które zawierają odpowiadające filtry wybrane przez użytkownika
		return array.filter((watch) => {
			//Argument watch - oznacza pojedyczny produkt/zegarek znajdujący się w tablicy array

			// Stała przechowująca obiekty znajdujące się na liście aktywnych filtrów, które należą do filtrowania po marce
			const markFilters = activeFilters.filter(
				// Z tablicy aktywnych filtrów zwracamy te filtry, których typ jest równy filtrom marki
				(filter) => filter.filterType === "filter-mark"
			);

			// Stała przechowująca obiekty znajdujące się na liście aktywnych filtrów, które należą do filtrowania po wyprzedaży
			const saleFilters = activeFilters.filter(
				// Z tablicy aktywnych filtrów zwracamy te filtry, których typ jest równy filtrom wyprzedaży
				(filter) => filter.filterType === "filter-sale"
			);

			// Stała przechowująca obiekty znajdujące się na liście aktywnych filtrów, które należą do filtrowania po cenie
			const priceFilters = activeFilters.filter(
				// Z tablicy aktywnych filtrów zwracamy te filtry, których typ jest równy filtrom ceny
				(filter) => filter.filterType === "filter-price"
			);

			// Stała przechowuje wartości true/false w zależności od aktywnych filtrów marki
			// Sprawdzenie czy nazwa producent zegarka pasuje do co najmniej jednego aktywnego filtra marki
			const markMatch =
				// Jeśli nie ma aktywnych filtrów marki, zwracamy true (wszystkie marki są dopuszczalne w procesie filtrowania)
				markFilters.length === 0 ||
				// Sprawdź, czy przynajmniej jeden z filtrów marki pasuje do nazwy producenta zegarka
				markFilters.some((filter) =>
					// Dla każdego filtra marki sprawdzamy czy nazwa producenta, zamieniona na małe litery, danego zegarka zawiera nazwę filtru marki
					watch.manufacture
						.toLowerCase()
						.includes(filter.filterName.toLowerCase())
				);

			// Stała przechowuje wartości true/false w zależności od aktywnych filtrów wyprzedaży
			// Sprawdzenie czy dany zegarek jest na wyprzedaży/nie jest na wyprzedaży
			const saleMatch =
				// Jeśli nie ma aktywnych filtrów przeceny, zwracamy true (wszystkie zegarki są dopuszczone)
				saleFilters.length === 0 ||
				// Sprawdź, czy przynajmniej jeden z filtrów przeceny pasuje do statusu przeceny zegarka
				saleFilters.some((saleFilter) => {
					// Dla każdego filtra wyprzedaży sprawdzamy czy nazwa filtr jest ustawiony na zegarki na wyprzedaży/nie na wyprzedaży
					if (saleFilter.filterName === "Na wyprzedaży") {
						// Jeśli aktywny filtr oznacza na wyprzedaży, zwracamy ten zegarek, którego wartość onSale jest ustawiona na true
						return watch.onSale === true;
					} else if (saleFilter.filterName === "Nie na wyprzedaży") {
						// W przeciwnym wypadku jeśli aktywny filtr oznacza zegarki nie na przecenie, to zwracamy te, których wartość onSale jest równa false
						return watch.onSale === false;
					}
				});

			// Stała przechowuje wartości true/false w zależności od aktywnych filtrów ceny
			// Sprawdzenie czy cena zegarka pasuje do wszystkich aktywnych filtrów ceny
			const priceMatch =
				// Jeśli nie ma aktywnych filtrów ceny, zwracamy true (wszystkie ceny są dopuszczone)
				priceFilters.length === 0 ||
				// Sprawdź, czy cena zegarka pasuje do wszystkich aktywnych filtrów ceny
				priceFilters.every((priceFilter) => {
					// Dla każdego filtra ceny pobieramy, parsujemy i pozbywamy się białych znaków, dla ceny danego zegarka
					const watchPrice = parseFloat(watch.price.split(" ").join(""));
					// Definiujemy zmienną z obniżoną ceną, domyślnie jest to oryginalna cena zegarka
					let newPrice = watchPrice;

					// Jeśli zegarek jest przeceniony, obliczamy cenę po obniżce
					if (watch.onSale) {
						// Stała oznaczająca procent obniżki danego zegarka
						const discountPercent = parseInt(watch.discount);

						// Obliczamy nową cenę po obniżce
						newPrice = watchPrice - (watchPrice * discountPercent) / 100;
					}

					// Jeśli aktywny filtr ceny jest wartością początkową, od której chcemy filtrować zegarki to:
					if (priceFilter.filterName.includes("Od ")) {
						// Zwracamy true (wybrany zegarek) jeśli cena zegarka jest większa lub równa cenie wpisanej w filtr ceny
						return newPrice >= parseFloat(priceFilter.filterPrice);
					} else if (priceFilter.filterName.includes("Do ")) {
						// Jeśli aktywny filtr ceny jest wartością końcową, do której chcemy filtrować zegarki to:
						// Zwracamy true (wybrany zegarek) jeśli cena zegarka jest mniejsza lub równa cenie wpisanej w filtr ceny
						return newPrice <= parseFloat(priceFilter.filterPrice);
					}
				});
			// Zwróć true, jeśli zegarek pasuje do wszystkich aktywnych filtrów, w przeciwnym razie zwróć false
			// Jeśli wszystkie warunki są spełnione dla danego zegarka, to zapisujemy go w tablicy wynikowej. Natomiast jeśli którykolwiek z warunków nie zostanie spełniony, zegarek nie zostanie dodany do tablicy wynikowej zwracanej przez funkcję
			return markMatch && saleMatch && priceMatch;
		});
	}

	// Funkcja służąca do usunięcia wybranego aktywnego filtra
	function removeFilter(filterName) {
		// Argument filterName - jest to nazwa filtra, który ma zostać usunięty z tablicy aktywnych filtrów

		// Znajdujemy indeks filtra, który ma zostać usunięty poprzez porównanie jego nazwy ze wszystkimi filrami znajdującymi się w tablicy aktywnych filtrów
		const index = activeFilters.findIndex(
			(filter) => filter.filterName === filterName
		);

		// Jeśli podana jako argument nazwa filtra istnieje w tablicy aktywnych filtrów to:
		if (index !== -1) {
			// Usuwamy wybrany filtr z tablicy aktywnych filtrów
			activeFilters.splice(index, 1);

			// Sprawdzenie czy usuwany filtr dotyczy filtrów zawierających filtrowanie po cenie
			if (filterName.includes("Od ")) {
				// Resetujemy wartość znajdującą się w filtrze ceny początkowej
				document.querySelector("#price-from").value = "";
			} else if (filterName.includes("Do ")) {
				// Resetujemy wartość znajdującą się w filtrze ceny końcowej
				document.querySelector("#price-to").value = "";
			} else {
				// W przeciwnym wypadku pobieramy element listy z filtrami, który chcemy usunąć na podstawie datasetu zawierającego nazwę filtra
				const filterItemToRemove = document.querySelector(
					'.filter-option-container li[data-filter="' + filterName + '"]'
				);

				// Sprawdzamy jeśli taki element istnieje, to usuwamy z niego ikonę świadczącą o wybraniu danego filtru
				if (filterItemToRemove) {
					filterItemToRemove.classList.remove("checked");
				}
			}

			// Ponowne wyświetlenie aktywnych filtrów
			showActiveFilters();

			// Przypisujemy do tablicy przefiltrowanych danych, wynik funkcji dodającej filtry, z argumentem zmiennej globalnej 'data' zawierającej podstawowe dane
			filteredData = applyFilters(data);

			// Wyrenderowanie danych z nowymi filtrami
			handleShopDisplay();
		}
	}

	// Funkcja służąca do wyświetlania aktywnych filtrów na stronie
	function showActiveFilters() {
		// Usunięcie poprzedniej zawartości kontenera
		selectedFiltersContainer.innerHTML = "";

		// Tworzenie elementów typu div dla każdego filtru
		// Sprawdzamy czy tablica aktywnych filtrów nie jest pusta, jeśli nie jest to wykonujemy następujące kroki:
		if (activeFilters.length > 0) {
			// Mapowanie aktywnych filtrów znajdujących się w tablicy na elementy DOM i zapisanie ich do zmiennej
			const filterContainers = activeFilters.map((filter) => {
				// Dla każdego filtru w tabeli wykonujemy instrukcje:

				// Tworzymy odpowiednie elementy HTML potrzebne do wyświetlenia pojedynczego filtra
				const div = document.createElement("div");
				const p = document.createElement("p");
				const removeBtn = document.createElement("button");

				// Dodajemy odpowiednią klasę do kontenera
				div.className = "active-filter";
				// Dodajemy nazwę aktualnego filtra
				p.textContent = filter.filterName;
				// Do przycisku usuwania filtra dodajemy odpowiednią ikonę
				removeBtn.innerHTML = `<span class="material-symbols-outlined"> close </span>`;

				// Dodajemu nasłuchiwanie na kliknięcie przycisku usunięcia wybranego aktywnego filtra
				removeBtn.addEventListener("click", () =>
					// Wywołujemy funkcję pozwalającą na usunięcie pojedynczego filtra, pprzekazując jako argument jego nazwę
					removeFilter(filter.filterName)
				);

				// Do kontenera dodajemy nazwę filtra i przycisku pozwalającego na jego usunięcie
				div.appendChild(p);
				div.appendChild(removeBtn);

				// Zwracamy kontener z całą przygotowaną zawartością
				return div;
			});

			// Dla każdego filtra znajdującego się w zmiennej 'filerContainers' wykonujemy:
			filterContainers.forEach((div) =>
				// Argument div - jest to element DOM zawierający pojedynczy aktywny filtr

				// Do kontenera z wybranymi filtrami dołączamy wszystkie aktywne filtry
				selectedFiltersContainer.appendChild(div)
			);
		} else {
			// W przeciwnym wypadku jeśli nie ma aktywnych filtrów, ukrywamy kontener przed użytkownikiem
			selectedFiltersContainer.parentElement.style.display = "none";

			// Przypisujemy do tablicy przefiltrowanych danych pobrane dane, resetujemy w ten sposób przefiltrowane dane
			filteredData = data;

			// Wyrenderowanie danych z usuniętymi filtrami
			handleShopDisplay();
		}
	}
}

// Dodanie nasłuchiwania zdarzenia, które rozpocznie się po wczytaniu przez przeglądarkę całej treści dokumentu HTML, dodatkowo wykorzystujemy słowa kluczowego async tak aby wewnątrz funkcji użyć funkcji asynchronicznych
document.addEventListener("DOMContentLoaded", async () => {
	// Pobranie danych
	data = await fetchData();

	// Przypisanie pobranych danych do zmiennych zawierających przefiltrowane i posortowane dane. Po pierwszym wyświetleniu strony przefiltrowane i posortowane tablice z obiektami produktów są równe domyślnej tablicy obiektów znajdujących się w sklepie.
	filteredData = data;
	sortedData = data;

	// Wywołanie funkcji zajmującej się wyświetleniem produktów znajdujących się na stronie sklepu wraz ze wszystkimi pozostałymi elementami potrzebnymi do obsługi działania sklepu
	handleShopDisplay();

	// Wywołanie funkcji tworzącej i wyświetlającej filtry wszystkich marek zegarków
	displayMarkFilters();

	// Wywołanie funkcji odpowiedzialnej za obsługę sortowania elementów na stronie sklepu
	handleSorting();

	// Wywołanie funkcji odpowiedzialnej za obsługę filtrowania elementów na stronie
	handleFiltering();
});
