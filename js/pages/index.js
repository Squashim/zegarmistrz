// Zawiera informacje o mieście i strefie czasowej, w której znajdują sie poszczególne zegarki

// Główna funkcja wywoływana po załadowaniu dokumentu HTML
document.addEventListener("DOMContentLoaded", () => {
	// Pobranie przycisku dodającego nowe zegarki
	const addWatchBtn = document.querySelector(".add-watch");
	// Pobranie przycisku akceptującego subskrypcję newslettera
	const newsletterBtn = document.querySelector(".newsletter-subscribe");
	// Pobranie sekcji zawierającej wszystkie zegarki
	const watchesSection = document.querySelector(".watches");
	// Zapisanie tablicy obiektów, zawierającej obiekty zegarków widocznych na stronie, tablicę odczytujemy z sessionStorage, natomiast jeśli tablica ta nie istnieje to domyślnie tworzymy tablicę zawierającą dwa zegarki o podanych danych
	const currentWatches = sessionStorage.getItem("currentWatches")
		? JSON.parse(sessionStorage.getItem("currentWatches"))
		: [
				{ city: "Lublin", timezone: "Europe/Warsaw", id: "0531531" },
				{ city: "Nowy Jork", timezone: "America/New_York", id: "1653632" },
		  ];
	//   Pobieramy pola formularzy znajdujące się na stronie index.html
	const newsletterInput = document.getElementById("email");
	const cityInput = document.getElementById("city");
	// Pobieramy elementy wyświetlające błędy odpowiadające polom formularzy
	const newsletterError = document.querySelector(".error-email");
	const cityError = document.querySelector(".city-error");

	// Funkcja dodająca okno dialogowe wyświetlające informacje o subskrypcji newslettera
	function appendDialog() {
		// Schemat okna dialogowego zapisany w zmiennej 'template'
		const template = `
			<div class="dialog-container">
			<h2>Dziękujemy za subskrypcje!</h2>
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
		dialog.className = "newsletter-dialog";

		// Dodanie tła i okna dialogowego do dokumentu
		document.body.appendChild(dialogBg);
		document.body.appendChild(dialog);

		// Wyświetlenie okna dialogowego na stronie wraz z jego tłem
		dialog.show();
		dialogBg.style.display = "block";

		// Pobranie przycisku z dialogu pozwalającego na jego zamknięcie
		const continueBtn = dialog.querySelector(".continue-btn");

		// Dodanie nasłuchiwania na kliknięcie przycisku kontynnuj
		continueBtn.addEventListener("click", () => {
			// Zamknięcie okna dialogowego
			dialog.close();
			// Usunięcie okna dialogowego i jego tła z drzewa DOM
			dialog.remove();
			dialogBg.remove();
		});
	}

	// Funkcja służąca do aktualizacji stanu wszystkich zegarków na stronie
	function updateClock() {
		// Pobranie potrzebnych elementów ze wszystkich zegarków do wyświetlenia godziny, zapisanie ich jako tablicy
		const hours = Array.from(document.querySelectorAll(".hour"));
		const minutes = Array.from(document.querySelectorAll(".minute"));
		const seconds = Array.from(document.querySelectorAll(".seconds"));
		// Pobranie wszystkich kontenerów wyświetlających godziny pod poszczególnymi zegarkami
		const timers = Array.from(document.querySelectorAll(".current-time"));

		// Dla każdego zegarka w tablicy 'currentWatches' wykonujemy następujące instrukcje:
		currentWatches.forEach((watch, index) => {
			// -> watch reprezentuje element bieżącego zegarka,
			// -> index reprezentuje jego indeks w tablicy

			// Destrukturyzacja obiektu 'watch', aby uzyskać dostęp do jego strefy czasowej
			const { timezone } = watch;

			// Wywołanie funkcji getTimeAndRotation() z argumentami "timezone"
			// Funkcja ta zwraca aktualny czas oraz obliczone wartości rotacji wskazówek zegara
			const { hr, min, sec, calcHr, calcMin, calcSec } =
				getTimeAndRotation(timezone);

			// Aktualizacja czasu wyświetlanego na poszczególnym zegarku
			timers[index].textContent = `${hr}:${min}:${sec}`;

			// Aktualizacja rotacji wskazówek poszczególnych zegarków
			hours[index].style.transform = `rotate(${calcHr}deg)`;
			minutes[index].style.transform = `rotate(${calcMin}deg)`;
			seconds[index].style.transform = `rotate(${calcSec}deg)`;
		});
	}

	// Funkcja pobierająca aktualny czas dla danej strefy czasowej i obliczająca odpowiednią pozycję wszystkich wskazówek zegarka
	function getTimeAndRotation(timezone) {
		// Argument timezone - jest to strefa czasowa, która zostanie użyta do wyświetlenia odpowiedniego czasu

		// Stworzenie obiektu daty zawierającej aktualną datę
		const dateNow = new Date();

		// Stworzenie obiektu daty dla określonej strefy czasowej
		const cityTime = new Date(
			// Przekonwertowanie bieżącej daty i czasu do czasu lokalnego dla danej strefy czasowej
			dateNow.toLocaleString("en-US", { timeZone: timezone })
		);

		// Stworzenie zmiennych zawierającyh aktualną godzinę, minutę i sekundę w danej strefie czasowej
		let hr = cityTime.getHours();
		let min = cityTime.getMinutes();
		let sec = cityTime.getSeconds();

		// Dodanie do zmiennych mniejszych od 10 zer wiodących
		min = (min < 10 ? "0" : "") + min;
		sec = (sec < 10 ? "0" : "") + sec;
		hr = (hr < 10 ? "0" : "") + hr;

		// Obliczenie rotacji wszystkich wskazówek zegara
		const calcHr = hr * 30 + min / 2;
		const calcMin = min * 6;
		const calcSec = sec * 6;

		// Zwrócenie obiektu zawierającego aktualny czas oraz obliczone wartości rotacji wskazówek zegara
		return { hr, min, sec, calcHr, calcMin, calcSec };
	}

	// Funkcja wyświetlająca wszystkie zegarki na stronie
	function showClocks() {
		// Pobranie wszystkich kontenerów zawierających zegarki i zapisanie ich w tablicy
		const clocks = Array.from(document.querySelectorAll(".watch-container"));

		// Dla tablicy wszystkich kontenerów zawierających zegarki wykonujemy poniższy kod:
		clocks.forEach((clock) => {
			// Argument clock - jest to pojedyczny kontener z zegarkiem i informacjami o miejscu i czasie

			// Usuwamy zegarek z drzewa DOM, wykonujemy reset przed ponownym wyświetleniem zegarków
			clock.remove();
		});

		// Dla tablicy przechowywującej obiekty z informacjami o poszczególnych zegarkach wykonujemy następujące kod:
		currentWatches.forEach((watch) => {
			// Argument watch - jest to pojedynczy obiekt przechowujące informacje o id zegarka, mieście i strefie czasowej

			// Tworzymy element typu div
			const container = document.createElement("div");
			// Dodajemy do niego klasę pojemnika na zegarek
			container.className = "watch-container";
			// Ustawiamy identyfikator danych danego kontenera zegarka na uniklany dla każdego zegarka identyfikator
			container.dataset.id = `${watch.id}`;

			// Ustawiamy zawartość każdego pojemnika na zegarek
			// prettier-ignore
			container.innerHTML = `<div class="watch-text">
						<h3>${watch.city}</h3>
						<p class="current-time"></p>
						<button class="remove-clock">
							<span class="btn-close material-symbols-outlined"> delete </span>
						</button>
					</div>
					<div class="strap">
						<div class="watch">
							<div class="pin"></div>
							<img
								src="/zegarmistrz/assets/watch_background.svg"
								alt="watch_bg" />
							<div class="hour hand"></div>
							<div class="minute hand"></div>
							<div class="seconds hand"></div>
						</div>
					</div>`;

			// Dodajemy nowo stworzony kontener z zegarkiem jako dziecko do sekcji zawierającej zegarki
			watchesSection.appendChild(container);
		});
	}

	// Funkcja dodająca nowy zegarek do strony
	function addClock() {
		// Pobieramy wartości z pola formularza do tworzenia nowego zegarka
		const timezone = document.getElementById("timezone").value;
		const cityName = document.getElementById("city").value;
		// Tworzymy unikalne id zegarka na podstawie bieżącej daty użytkownika
		const id = Date.now();

		// Sprawdzenie, czy liczba zegarków widocznych na stronie wynosi 4
		if (currentWatches.length === 4) {
			// Jeśli liczba zegarków wynosi 4, dezaktywuj przycisk dodawania zegarka
			addWatchBtn.disabled = true;
		}

		// Sprawdzenie, czy liczba zegarków widocznych na stronie wynosi 5
		if (currentWatches.length === 5) {
			// Jeśli liczba zegarków wynosi 5, to wychodzimy z funkcji dodawania zegarka
			return;
		}

		// Wyczyszczenie danych wpisanych przez użytkownika w polu formularza
		cityInput.value = "";

		// Dodanie nowego obiektu zegarka, zawierającego strefę czasową, nazwę miasta i unikalne id do tablicy currentWatches
		currentWatches.push({
			timezone: timezone,
			city: cityName,
			id: id.toString(),
		});

		// Zapisanie tablicy zawierającej widoczne na stronie zegarki w sessionStorage
		sessionStorage.setItem("currentWatches", JSON.stringify(currentWatches));

		// Wywołanie funkcji wyświetlającej zegarki na stronie
		showClocks();

		// Aktualizacja stanu zegarków znajdujących się na stronie
		updateClock();
	}

	// Funkcja obsługująca usunięcie zegarka
	function removeClock(button) {
		// Argument button -jest to element DOM będący przyciskiem usuwania, w kontenerze zegarka który chcemy usunąć

		// Pobranie identyfikatora zegarka do usunięcia na podstawie atrybutu data-id jego rodzica (konteneru zawierającego zegarek)
		const idToRemove = button.parentElement.parentElement.dataset.id;

		// Znalezienie indeksu zegarka do usunięcia w tablicy currentWatches
		const indexToRemove = currentWatches.findIndex(
			// Argument watch - jest to pojedynczy obiekt zegarka
			// Znajdujemy indeks obiektu w tablicy, którego id jest równe identyfikatorowi zegarka na stronie
			(watch) => watch.id === idToRemove
		);

		// Sprawdzenie, czy zegarek do usunięcia został znaleziony
		if (indexToRemove !== -1) {
			// Jeśli taki zegarek został znaleziony to usuwamy go z tablicy currentWatches
			currentWatches.splice(indexToRemove, 1);

			// Zapisanie zaktualizowanej tablicy currentWatches w sessionStorage, bez usuniętego zegarka
			sessionStorage.setItem("currentWatches", JSON.stringify(currentWatches));

			// Usunięcie kontenera z zegarkiem z interfejsu użytkownika, za pomocą funkcji closest() znajdujemy najbliższy dla klikniętego przycisku usuwania, kontener z zegarkiem i usuwamy go z drzewa DOM
			button.closest(".watch-container").remove();
		}

		// Sprawdzenie, czy po usunięciu liczba zegarków jest mniejsza niż 5
		if (currentWatches.length < 5) {
			// Jeśli liczba zegarków jest mniejsza niż 5, aktywujemy przycisk dodawania zegarka
			addWatchBtn.disabled = false;
		}
	}

	// Wywołanie funkcji wyświetlającej zegarki na stronie
	showClocks();

	// Ustawienie interwału dla funkcji updateClock, która będzie wywoływana co sekundę
	const setClock = setInterval(updateClock, 1000);

	// Nasłuchiwanie zdarzenia kliknięcia w sekcji zawierającej zegarki
	watchesSection.addEventListener("click", (event) => {
		// Argument event funkcji anonimowej zawiera informacje na temat zdarzenia, które właśnie wystąpiło takie jak typ zdarzenia, element docelowy itd.
		// Sprawdzenie, czy kliknięty element ma klasę odpowiadającą za dodanie zegarka

		if (event.target.classList.contains("add-watch")) {
			// Jeśli tak to sprawdzamy poprawność danych wprowadzonych do pola formularza zawierającego miasto
			if (cityInput.checkValidity()) {
				// Jeśli walidacja przebiegła pomyślnie wywołujemy funkcję dodającą nowy zegarek do strony
				addClock();
			} else {
				// W przeciwnym wypadku wyświetlamy odpowiedni błąd dla użytkownika
				cityError.textContent =
					"Nazwa miasta powinna zawierać od 3 do 32 liter i spacji.";
			}
			// Sprawdzenie, czy klikniętym elementem jest przycisk odpowiedzialny za usuwanie zegarka
		} else if (event.target.parentElement.classList.contains("remove-clock")) {
			// Wywołanie funkcji usuwającej zegarek, jako argument podajemy przycisk usuwania danego zegarka
			removeClock(event.target.parentElement);
		}
	});

	// Nasłuchiwanie wpisywania w polu formularza zawierającego nazwę miasta
	cityInput.addEventListener("input", () => {
		// Sprawdzenie poprawności danych wprowadzonych do pola miasta
		if (!cityInput.checkValidity()) {
			// Wyświetlenie komunikatu o błędzie, jeśli dane wprowadzone do pola miasta są nieprawidłowe
			cityError.textContent =
				"Nazwa miasta powinna zawierać od 3 do 32 liter i spacji.";
		} else {
			// Wyczyszczenie komunikatu o błędzie, jeśli dane wprowadzone do pola miasta są poprawne
			cityError.textContent = "";
		}
	});

	// Nasłuchiwanie na kliknięcie przycisku potwierdzającego subskrypcję newslettera
	newsletterBtn.addEventListener("click", () => {
		// Sprawdzenie poprawności danych wprowadzonych do pola email subskrypcji newslettera
		if (!newsletterInput.checkValidity()) {
			// Jeśli dane są niepoprawne wyświetlamy odpowiedni komunikat dla użytkownika
			newsletterError.textContent = "Podano nieprawidłowy adres email";
		} else {
			// W przeciwnym wypadku resetujemy zawartość wyświetlanego błędu i wpisanego w pole formularza adresu email
			newsletterError.textContent = "";
			newsletterInput.value = "";
			// Wywołujemy funkcję tworzącą i wyświetlającą okno dialogowe informujące o poprawnej subskrypcji newslettera
			appendDialog();
		}
	});

	// Nasłuchiwanie wpisywania w polu formularza zawierającego nazwę miasta
	newsletterInput.addEventListener("input", () => {
		// Sprawdzenie poprawności danych wprowadzonych do pola email subskrypcji newslettera
		if (!newsletterInput.checkValidity()) {
			// Jeśli dane są niepoprawne wyświetlamy odpowiedni komunikat dla użytkownika
			newsletterError.textContent = "Podano nieprawidłowy adres email";
		} else {
			// W przeciwnym wypadku resetujemy zawartość wyświetlanego błędu
			newsletterError.textContent = "";
		}
	});
});
