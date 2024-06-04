//Importowanie klasy User oraz funkcji isLoggedIn i redirectTo z pliku auth.js
import { isLoggedIn, redirectTo } from "../auth.js";
import { User } from "../User.js";

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

// Funkcja służąca za wyświetlanie i aktualizacje ceny całego koszyka
function showCartSum() {
	// Pobranie elementu, w którym zostanie wyświetlona cena
	const sumElement = document.querySelector(".cart-price");
	// Pobranie wszystkich elementów, które zawierają ceny poszczególnych zegarków w koszyku, zapisujemy jako tablicę
	const cartContent = Array.from(document.querySelectorAll(".watch-price"));
	// Zmienna, która odpowiada za sumę cen w koszyku, początkowo ustawiona na zero
	let cartSum = 0;

	// Iterowanie przez każdy element znajdujący się w koszyku
	cartContent.forEach((item) => {
		// Argument item - jest to element DOM'u oznaczający pojedynczy przedmiot w koszyku

		// Dla każdego elementu, jego zawartość tekstowa jest pobierana, a następnie zamieniana na liczbę, usuwając znaki odstępu (\s), symbol waluty (zł) i zamieniając przecinki na kropki w celu poprawnego parsowania jako liczby zmiennoprzecinkowej
		let price = parseFloat(
			item.textContent.replace(/\s/g, "").replace(/zł/g, "").replace(/,/g, ".")
		);

		// Cena każdego produktu jest dodawana do zmiennej cartSum, aby obliczyć całkowitą sumę zegarków w koszyku
		cartSum += price;
	});

	// Na końcu, cena całkowita koszyka jest przekształcana za pomocą funkcji formatCurrency(), która jako argument przyjmuje cenę zegarka i zamienia ją na walutę polską z minimalnie i maksymalnie dwoma miejscami po przecinku.
	// Następnie wynik jest przypisywany do zawartości tekstowej elementu sumElement, który jest miejscem na stronie, gdzie ma być wyświetlona suma cen koszyka.
	sumElement.textContent = formatCurrency(cartSum);
}

//Nasłuchiwanie na zdarzenie DOMContentLoaded co oznacza, że kod zostanie wykonany gdy cała strona zostanie załadowana
document.addEventListener("DOMContentLoaded", () => {
	// Pobranie elementu DOM, jest to miejsce, w którym będzie wyświetlany koszyk na stronie
	const anchor = document.querySelector(".cart-content");
	// Pobranie danych użytkownika przechowywanych w sessionStorage i parsowanie ich z formatu JSON na obiekt
	const userData = JSON.parse(sessionStorage.getItem("loggedIn"));

	//Sprawdzanie czy użytkownik jest zalogowany. Jeśli nie to zostaje przekierowany na stronę logowania
	if (!isLoggedIn()) {
		redirectTo("index.html");
	}

	// Destrukturyzacja obiektu userData w celu wyodrębnienia danych zawartych w  koszyku oraz pozostałych informacji o użytkowniku a następnie przypisanie ich do stałych
	const { cart, ...userInformation } = userData;

	// Stworzenie obiektu klasy User na podstawie danych użytkownika pobranych z sessionStorage
	const user = new User(userInformation);
	// Ustawienie dla obiektu user, aktualnej zawartości koszyka
	user.setCart(cart);

	// Funkcja pomocniczna obsługująca zakupienie wszystkich produktów znajdujących się w koszyku
	function handleProductsPurchase() {
		// Pobranie niezbędnych elementów DOM'u do obsługi kupna wszystkich produktów w koszyku
		const buyBtn = document.querySelector(".buy-products");
		const dialog = document.querySelector(".dialog-purchase");
		// Pobranie elementów znajdujących się w oknie dialogowym
		const applyBuyBtn = dialog.querySelector(".buy-btn");
		const cancelBtn = dialog.querySelector(".cancel-buy-btn");
		const dialogPrice = dialog.querySelector(".dialog-sum-price");
		// Pobranie listy zarejestrowanych na stronie użytkowników z localStorage i zapisanie ich w stałej
		const users = JSON.parse(localStorage.getItem("users"));
		// Pobranie elementu, w którym zawarta jest suma całego koszyka
		const sumElement = document.querySelector(".cart-price");

		// Stworzenie elementu typu div z klasą tła okna dialogowego
		const dialogBg = document.createElement("div");
		dialogBg.classList = "background";

		// Dodajemy nasłuchiwanie na kliknięcie przycisku kupowania zawartości koszyka
		buyBtn.addEventListener("click", () => {
			// Wyświetlenie okna dialogowego oraz jego tła
			// Metoda show(), podobnie jak metoda close(), jest wbudowana dla elementów HTML typu dialog
			document.body.appendChild(dialogBg);
			dialogBg.style.display = "block";
			dialog.show();

			// Dodanie sumy całego koszyka do okna dialogowego
			dialogPrice.textContent = sumElement.textContent;
		});

		// Dodajemy nasłuchiwanie na kliknięcie przycisku anulowanie kupna produktów
		cancelBtn.addEventListener("click", () => {
			// Zamykamy okno dialogowe
			dialog.close();

			// Usunięcie elementu tła okna dialogowego z drzewa DOM
			dialogBg.remove();
		});

		applyBuyBtn.addEventListener("click", () => {
			// Wyczyszczenie koszyka dla obiektu klasy User
			user.setCart([]);

			// Zaktualizowanie sessionStorage, przekazując obiekt klasy User z pustym koszykiem
			sessionStorage.setItem("loggedIn", JSON.stringify(user));

			// Aktualizacja danych użytkownika w localStorage'u, tak aby zaktualizowały wyczyszczenie koszyka danego użytkownika
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
		});
	}

	// Funkcji tworząca i obsługująca przycisk pozwalający na usunięcie wszystkich produktów z koszyka
	function handleClearCartBtn() {
		// Pobranie potrzebnych elementów do dodania przycisku
		const cartTopBar = document.querySelector(".cart-topbar");

		// Utworzenie przycisku, dodanie odpowiedniej klasy i zawartości
		const clearCartBtn = document.createElement("button");
		clearCartBtn.classList = "clear-cart";
		clearCartBtn.innerHTML = `  <span class="span-text">Wyczyść koszyk</span>
                                    <span class="btn-user material-symbols-outlined"> delete </span>`;

		// Dodanie przycisku do elementu DOM na stronie koszyka
		cartTopBar.appendChild(clearCartBtn);

		// Dodanie nasłuchiwania na kliknięcie w przycisk usuwania wszystkich produktów z koszyka
		clearCartBtn.addEventListener("click", () => {
			// Pobranie listy zarejestrowanych na stronie użytkowników z localStorage i zapisanie ich w stałej
			const users = JSON.parse(localStorage.getItem("users"));

			// Wyczyszczenie koszyka za pomocą metody klasy User
			user.setCart([]);

			// Aktualizacja danych użytkownika w sessionStorage, aby zaktualizowały usunięcie wszystkich produktów z koszyka
			sessionStorage.setItem("loggedIn", JSON.stringify(user));

			// Aktualizacja danych użytkownika w localStorage'u, tak aby zaktualizowały usunięcie wszystkich produktów
			// Dla każdego użytkownika zapisanego w tablicy users wykonujemy poniższe instrukcje:
			users.forEach((registeredUser) => {
				// Sprawdzamy czy aktualnie zalogowany użytkownik, ma taki sam email jak email iterowanych użytkowników w tablicy users
				if (registeredUser.email === user.email) {
					// Jeśli znajdziemy takiego samego użytkownika to podmieniamy dane aktualnie zalogowanej osoby w tablicy ze wszystkimi użytkownikami
					registeredUser.cart = user.cart;
				}
			});

			// Odświeżenie strony w celu zaktualizowania koszyka
			redirectTo("cart.html");
		});
	}

	// Funkcja służąca do stworzenia elementów DOM dla każdego produktu, umieszczenia i wyświetlenia ich na stronie
	function showCartContent() {
		// Wyswietlenie nagłówka koszyka, który zawiera takie informacje jak wartość produktów oraz przycisk "Kup produkty"
		anchor.innerHTML = `<h2>Wartość produktów: <span class="cart-price"></span></h2>
                            <button class="btn btn-primary buy-products">Kup produkty</button>
                            <p class="divider">lub</p>
                            <h3>Modyfikuj zawartość koszyka</h3>`;

		// Dodanie przycisku, który pozwoli na usunięcie wszystkich produktów w koszyku
		// Wywołanie funkcji dodającej obsługę przycisku pozwalającego na usunięcie wszystkich produktów z koszyka
		handleClearCartBtn();

		// Odwrócenie kolejności obiektów w koszyku, w celu wyświetlenia ostatnio dodanego produktu na samej górze. Następnie mapujemy każdy element tablicy tworząc dla niego odpowiedni kontener
		cart.reverse().map((watch, id) => {
			// Argument watch - jest to obiekt będący pojedynczym produktem w koszyku
			// Argument id - są to kolejne liczby pozwalające na identyfikację poszczególnych produktów w koszyku

			// Funkcja zwracająca schemat HTML zawierający informacje o cenie zegarka, zwykłej i tej po przecenie
			function renderWatchPriceInfo() {
				// Zmienna przechowująca znaczniki HTML w formie tekstu
				let priceInfo = "";

				// Jeśli zegarek jest przeceniony ustawiamy schemat na taki, który wyświetla cenę przed i po zniżce, dodatkowo ceny zegarka formatujemy z wykorzystaniem funkcji formatCurrency(), która jako argument przyjmuje cenę zegarka
				// prettier-ignore
				if (watch.onSale) {
					priceInfo = `<div class="watch-price-container">
                                    <h3 class="watch-price">${formatCurrency(newPrice)}</h3>
                                    <span class="watch-price-old">${formatCurrency(watchPrice)}</span>
                                </div>`;
				} else {
					// W przeciwnym wypadku schemat zostaje ustawiony wyłącznie na cenę podstawową, bez obniżki. Cenę również formatujemy za pomocą funkcji formatCurrency()
					priceInfo = `<h3 class="watch-price">${formatCurrency(watchPrice)}</h3>`;
				}

				// Zwracamy schemat ze znacznikami HTML zawierający odpowiednią dla danego zegarka cenę
				return priceInfo;
			}

			// Stworzenie kontentera dla pojedynczego elementu koszyka
			const container = document.createElement("div");
			// Ustawienie odpowiedniej klasy dla kontenera
			container.className = "cart-item-container";
			// Ustawianie atrybutu dataset dla kontenera na unikalny identyfikator elementu koszyka
			container.dataset.id = id;

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

			// prettier-ignore
			// Stała zawierająca schemat HTML konteneru dla danego zegarka
			const template = `
            <div class="watch-img-container">
                ${/* Dodanie zdjęcia wybranego zegarka wraz z tekstem alternatywnym oznaczającym jego markę i model */ ''}
                <img src="../data/${watch.imagePath}" alt="${watch.manufacture} ${watch.name}" /> 
            </div>
            <div class="watch-info">
                <div class="watch-identification">
                    <h3 class="watch-name">Zegarek Męski ${watch.manufacture} ${watch.name}</h3>
                    <p class="watch-model">Nazwa modelu: ${watch.model}</p>
                </div>
                <div class="watch-user">
                    <div class="quantity-container">
                        <button class="decrement">-</button>
                        <span class="quantity">1</span>
                        <button class="increment">+</button>
                    </div>
                    ${ renderWatchPriceInfo() /* Wywołanie funkcji dodającej do kontenera cenę wybranego zegarka */}
                    <button class="remove"><span class=" btn-close material-symbols-outlined"> delete </span></button>
                </div>
            </div>`;

			// Dodanie do kontenera zawartości schematu
			container.innerHTML = template;

			// Dołączenie jako dziecko do głównego pojemnika, kontenera z wygenerowanymi danymi o danym produkcie w koszyku
			anchor.appendChild(container);
		});
	}

	// Sprawdzenie czy koszyk użytkownika jest pusty za pomocą metody klasy User
	if (user.isEmpty()) {
		// Jeśli tak na stronie wyświetlenia jest informacja o pustym koszyku
		anchor.innerHTML = `<h2>Jest pusty...</h2>`;
	} else {
		// W przeciwnym razie wyświetlamy zawartość koszyka
		showCartContent();
		// Wywołujemy funkcję do obliczenia i wyświetlenia sumy w koszyku
		showCartSum();
		// Wywołujemy funkcję obsługującą zakupienie produktów w koszyku
		handleProductsPurchase();

		// Pobranie wszystkich elementów DOM'u, które reprezentują poszczególne produkty w koszyku
		const products = document.querySelectorAll(".cart-item-container");

		// Iteracja po wszystkich produktach znajdujących się w koszyku
		products.forEach((product) => {
			// Argument product - jest to element DOM będący pojedynczym produktem w koszyku użytkownika

			// Pobranie poszczególnych elementów wewnątrz kontenera produktu, takich jak przycisk usuwania, przyciski zmniejszania i zwiększania ilości, element wyświetlający ilość oraz element wyświetlający bieżącą cenę produktu
			const removeBtn = product.querySelector(".remove");
			const decrementBtn = product.querySelector(".decrement");
			const incrementBtn = product.querySelector(".increment");
			const quantitySpan = product.querySelector(".quantity");
			const priceSpan = product.querySelector(".watch-price");

			// Pobranie listy zarejestrowanych na stronie użytkowników z localStorage i zapisanie ich w stałej
			const users = JSON.parse(localStorage.getItem("users"));

			// Funkcja aktualizująca wyświetlaną ilość oraz aktualną cenę produktu, a także zaktualizowaną cenę całkowitą koszyka
			function updateQuantity() {
				// Wyłączenie przycisku zmniejszania, jeśli ilość wynosi 1
				decrementBtn.disabled = quantity === 1;

				// Wyłączenie przycisku zwiększania, jeśli ilość wynosi 10
				incrementBtn.disabled = quantity === 10;

				// Obliczenie sformatowanej ceny za pomocą ilości i ceny jednostkowej
				const formattedPrice = formatCurrency(quantity * price);

				// Wyświetlenie sformatowanej ceny w kontenerze danego produktu
				priceSpan.textContent = formattedPrice;

				// Odświeżenie ceny całkowitej koszyka
				showCartSum();
			}

			// Dodanie nasłuchiwania kliknięcia na przycisku usuwania produktu z koszyka
			removeBtn.addEventListener("click", () => {
				// Wyodrębnienie identyfikatora produktu do usunięcia z atrybutu data-id jego kontenera
				const id = product.dataset.id;
				// Pobranie elementu odpowiadającego za wyświetlanie w pasku nawigacyjnym ilości przedmiotów w koszyku
				const cartElement = document.querySelector(".cart-quantity");

				// Usunięcie produktu z koszyka użytkownika
				userData.cart.splice(id, 1);

				// Aktualizacja danych użytkownika w sessionStorage, aby zaktualizowały usunięcie produktu z koszyka
				sessionStorage.setItem("loggedIn", JSON.stringify(userData));

				// Aktualizacja danych użytkownika w localStorage'u, tak aby zaktualizowały usunięcie wybranego produktu
				// Dla każdego użytkownika zapisanego w tablicy users wykonujemy poniższe instrukcje:
				users.forEach((registeredUser) => {
					// Sprawdzamy czy aktualnie zalogowany użytkownik, ma taki sam email jak email iterowanych użytkowników w tablicy users
					if (registeredUser.email === userData.email) {
						// Jeśli znajdziemy takiego samego użytkownika to podmieniamy dane aktualnie zalogowanej osoby w tablicy ze wszystkimi użytkownikami
						registeredUser.cart = userData.cart;
					}
				});

				// Podmieniamy w localStorage zaktualizowaną tablicę użytkowników zamieniając jej obiekt w format JSON
				localStorage.setItem("users", JSON.stringify(users));

				// Usunięcie elementu reprezentującego produkt z koszyka bez konieczności ponownego ładowania strony
				product.remove();

				// Aktualizacja liczby przedmiotów w koszyku wyświetlanej w pasku nawigacyjnym poprzez zmniejszenie jej liczby o jeden
				cartElement.textContent = parseInt(cartElement.textContent - 1);
				// Sprawdzamy czy został usunięty ostatni element z koszyka
				if (cartElement.textContent === "0") {
					// Jeśli tak to koszyk jest pusty, dodatkowo ukrywamy elemement przed użytkownikiem
					cartElement.style.display = "none";
				}

				// Sprawdzenie, czy koszyk użytkownika jest pusty
				if (userData.cart.length === 0) {
					// Jeśli tak na stronie wyświetlenia jest informacja o pustym koszyku
					anchor.innerHTML = `<h2>Jest pusty...</h2>`;
				} else {
					// W przeciwnym wypadku odświeżamy aktualną cenę koszyka
					showCartSum();
				}
			});

			// Obsługa zmiany ilości danego produktu
			// Pobranie ilości produktu oraz ceny produktu, które są przechowywane jako tekst w elementach HTML, a następnie przekształcenie ich w liczby
			let quantity = parseInt(quantitySpan.textContent);

			// Zamieniamy cenę na liczbę, usuwając znaki odstępu (\s), symbol waluty (zł) i zamieniając przecinki na kropki w celu poprawnego parsowania jako liczby zmiennoprzecinkowej
			let price = parseInt(
				priceSpan.textContent.replace(/[^\d.-]/g, "").slice(0, -2)
			);

			// Wywołanie funkcji updateQuantity(), która zaktualizuje wyświetlaną ilość i cenę danego produktu
			updateQuantity();

			// Dodanie nasłuchiwania na kliknięcie przycisku zmniejszenia ilości danego produktu
			decrementBtn.addEventListener("click", () => {
				// Sprawdzamy czy ilość jest większa od jednego
				if (quantity > 1) {
					// Jeśli tak to od ilości odejmujemy jeden
					quantity -= 1;
					// Wyświetlamy nową wartość ilości produktu
					quantitySpan.textContent = quantity;
				}
				// Ponowne wywołanie funkcji updateQuantity(), która zaktualizuje wyświetlaną ilość i cenę danego produktu
				updateQuantity();
			});

			// Dodanie nasłuchiwania na kliknięcie przycisku zwiększenia ilości danego produktu
			incrementBtn.addEventListener("click", () => {
				// Dodajemy jeden do ilości produktu
				quantity += 1;
				// Wyświetlamy nową wartość ilości produktu
				quantitySpan.textContent = quantity;
				// Ponowne wywołanie funkcji updateQuantity(), która zaktualizuje wyświetlaną ilość i cenę danego produktu
				updateQuantity();
			});
		});
	}
});
