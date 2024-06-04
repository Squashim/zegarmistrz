// Tablica elementów w stopce, które automatycznie będą dodawane do strony
const footerTemplates = [
	`<div class=" dialog-footer"><h2>1. Informacje ogólne</h2>

<p>Firma "Zegarmistrz" zobowiązuje się do ochrony prywatności użytkowników swojej strony internetowej oraz klientów korzystających z jej usług. Niniejsza polityka prywatności określa, w jaki sposób firma zbiera, wykorzystuje, ujawnia i chroni dane osobowe.</p>


    <h2>2. Udostępnianie informacji osobom trzecim</h2>

    <p>Firma "Zegarmistrz" może udostępniać zebrane informacje osobom trzecim tylko w zakresie niezbędnym do świadczenia usług (np. dostawcom usług płatności, dostawcom usług wysyłki).</p>

    <h2>3. Ochrona danych</h2>

    <p>Firma "Zegarmistrz" podejmuje odpowiednie środki techniczne i organizacyjne w celu ochrony zebranych danych osobowych przed nieuprawnionym dostępem, utratą lub zniszczeniem.</p>


    <h2>4. Zmiany w polityce prywatności</h2>

    <p>Firma "Zegarmistrz" zastrzega sobie prawo do wprowadzania zmian w niniejszej polityce prywatności. Wszelkie zmiany będą publikowane na tej stronie.</p>
    <div class="buttons">
        <button class="btn btn-secondary continue-btn">Powrót</button>	
    </div>
    </div>
    `,
	`<div class=" dialog-footer"><h2>Regulamin sklepu</h2>


<p><strong>Zakupy:</strong><br>
1. Warunkiem dokonania zakupów w sklepie jest założenie konta użytkownika.<br>
2. Wszystkie ceny podane w sklepie są cenami brutto i zawierają podatek VAT.</p>

<p><strong>Płatności:</strong><br>
1. Sklep umożliwia płatności za pomocą różnych metod, w tym płatności elektroniczne oraz płatności przy odbiorze.<br>
2. Zamówienia są realizowane po otrzymaniu płatności.</p>

<p><strong>Dostawa:</strong><br>
1. Dostawa towarów odbywa się za pośrednictwem firm kurierskich lub pocztą.<br>
2. Koszt dostawy jest uzależniony od wybranej metody dostawy oraz wagi paczki.</p>

<p><strong>Reklamacje:</strong><br>
1. Klient ma prawo do reklamacji towaru w przypadku wad fizycznych lub prawnych.<br>
2. Reklamacje są rozpatrywane w ciągu 14 dni od daty zgłoszenia.</p><div class="buttons">
        <button class="btn btn-secondary continue-btn">Powrót</button>	
    </div></div>`,
	`<div class=" dialog-footer"><h2>Warunki wymiany i zwrotu towaru</h2>

<p>W przypadku zakupu towaru w naszym sklepie, klient ma możliwość zwrotu lub wymiany towaru zgodnie z poniższymi warunkami:</p>

<p><strong>Wymiana towaru:</strong><br>
1. Klient ma prawo do wymiany towaru na inny, o podobnej wartości lub wyższej, w ciągu 14 dni od daty otrzymania przesyłki.<br>
2. Towar musi być nieużywany, w oryginalnym opakowaniu oraz posiadać wszystkie metki i akcesoria.</p>

<p><strong>Zwrot towaru:</strong><br>
1. Klient ma prawo do zwrotu towaru w ciągu 14 dni od daty otrzymania przesyłki, bez podania przyczyny.<br>
2. Towar musi być nieużywany, w oryginalnym opakowaniu oraz posiadać wszystkie metki i akcesoria.<br>
3. Koszty zwrotu towaru pokrywa klient.</p><div class="buttons">
        <button class="btn btn-secondary continue-btn">Powrót</button>	
    </div></div>`,
];

// Funkcja dodająca element okna dialogowego do zawartości strony
function appendDialog(id) {
	// Argument id - liczba oznaczająca element w tablicy footerTemplates

	// Stworzenie elementu typu dialog
	const dialog = document.createElement("dialog");

	// Stworzenie elementu typu div z tłem okna dialogowego
	const dialogBg = document.createElement("div");
	// Ustawienie klasy dialogBg
	dialogBg.classList = "background";

	// Na podstawie przekazanego id, klasa i treść okna dialogowego jest odpowiednio ustawiana,
	// treść jest pobierana z tablicy footerTemplates, w której znajdują się gotowe szablony
	switch (id) {
		case 0:
			dialog.innerHTML = footerTemplates[0];
			dialog.className = "policy-dialog footer-dialog";
			break;
		case 1:
			dialog.innerHTML = footerTemplates[1];
			dialog.className = "regulations footer-dialog";
			break;
		case 2:
			dialog.innerHTML = footerTemplates[2];
			dialog.className = "return-conditions footer-dialog";
			break;
	}

	// Dodanie do ciała dokumentu okna dialogowego i jego tła
	document.body.appendChild(dialogBg);
	document.body.appendChild(dialog);
}

// Dodanie nasłuchiwania zdarzenia, które rozpocznie się po wczytaniu przez przeglądarkę całej treści dokumentu HTML
document.addEventListener("DOMContentLoaded", () => {
	// Pobranie wszystkich przycisków ze stopki i zapisanie ich jako tablicy
	const footerBtns = Array.from(
		document.querySelectorAll(".footer-container button")
	);

	// Dla każdego przycisku w stopce wykonujemy następujące instrukcje:
	footerBtns.forEach((btn, id) => {
		// -> btn reprezentuje bieżący przycisk,
		// -> id reprezentuje jego indeks w tablicy

		// Dla każdego przycisku w stopce dodajemy nasłuchiwanie na kliknięcie
		btn.addEventListener("click", () => {
			// Dodanie do zawartości strony okna dialogowego o wybranej za pomocą id treści, wraz z jego tłem
			appendDialog(id);

			// Pobieramy z DOM'u niezbędne elementy związane z oknem dialogowym
			const dialog = document.querySelector(".footer-dialog");
			const dialogBg = document.querySelector(".background");
			const continueBtn = document.querySelector(".continue-btn");

			// Na elemencie dialogu wywołujemy metodę show() aby, wyświetlić okno dialogowe
			// Metoda show(), podobnie jak metoda close(), jest wbudowana dla elementów HTML typu dialog
			dialog.show();

			// Dodajemy nasłuchiwanie kliknięcia w przycisk konntynuuj, znajdujący się w oknie dialogowym
			continueBtn.addEventListener("click", () => {
				// Po kliknięciu zamykamy okno dialogowe za pomocą wbudowanej funkcji close()
				dialog.close();
				// Usuwamy element okna dialogowego i jego tła z drzewa DOM
				dialog.remove();
				dialogBg.remove();
			});
		});
	});
});
