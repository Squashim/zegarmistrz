import { redirectTo } from "../auth.js";
// Tablica zawierająca obiekty, z informacjami o wszystkich firmach na stronie
const brandData = [
	{
		name: "Adriatica",
		logo: "/zegarmistrz/assets/brands/adriatica.webp",
		location: "Moutelier, Szwajcaria",
		date: "1852r.",
		first_paragraph:
			"Początkowo były to dwie firmy (Adria i Adriatica), które połączyły się 17 lat po zakończeniu II wojny światowej. Do 1949 roku, biorąc pod uwagę zaistniałe okoliczności związane z wojnami, firmy nie prowadziły działalności.",
		second_paragraph:
			"Obydwie firmy, w szczególności Adriatica, były popularne m.in. w Finlandii. Do Polski zaczęto sprowadzać zegarki Adriatiki w 1990 roku.",
		third_paragraph:
			"Od 1998 roku przedsiębiorstwo Adriatica mieści się we włoskojęzycznym kantonie Szwajcarii Ticino, w miejscowości Dongio i jest własnością spółki PR & A Watch Sagl.",
		source: "https://pl.wikipedia.org/wiki/Adriatica",
	},
	{
		name: "Tissot",
		logo: "/zegarmistrz/assets/brands/tissot.webp",
		location: "Le Locle, Szwajcaria",
		date: "1853r.",
		first_paragraph:
			"Od lat 40. XX wieku następuje dynamiczny rozwój marki, która wytwarza własne kalibry i wprowadza do zegarków szereg usprawnień i innowacji. Jednym z celów Tissot jest tworzenie wysokiej jakości zegarków w atrakcyjnej i przystępnej cenie, a motto „złoto w cenie srebra” staje się jednym z ważnych elementów DNA marki.",
		second_paragraph:
			"W 1976 roku Tissot wypuszcza na rynek pierwszą kolekcję zegarków kwarcowych, ale nie wpływa to znacząco na poprawę sytuacji finansowej. Firma tnie koszty i zaprzestaje produkcji własnych mechanizmów.",
		third_paragraph:
			"Obecnie Tissot pozycjonowany jest na rynku jako marka oferująca zegarki ze średniej półki. Marka obecna jest w 160 krajach oferując szerokie portfolio zegarków.",
		source: "https://pl.wikipedia.org/wiki/Tissot_(przedsi%C4%99biorstwo)",
	},
	{
		name: "Festina",
		logo: "/zegarmistrz/assets/brands/festina.webp",
		location: "La Chaux-de-Fonds, Szwajcaria",
		date: "1902r.",
		first_paragraph:
			"W 1984 firma została kupiona przez hiszpańskiego inwestora Miguela Rodrigueza, właściciela firmy Lotus, także zajmującej się produkcją zegarków. Hiszpan połączył obie firmy i utworzył spółkę Festina Lotus S.A. ",
		second_paragraph:
			"Siedziba firmy została przeniesiona do Barcelony. Obecnie najdroższe modele zegarków montowane są w Barcelonie oraz Toledo w Hiszpanii.",
		third_paragraph:
			"Zegarki Festina ze średniej półki są napędzane japońskimi mechanizmami Miyota produkowanymi przez firmę Citizen Watch Company, podczas gdy ich modele z wyższej półki są produkowane w całości w siedzibach firmy w Szwajcarii i Hiszpanii.",
		source: "https://pl.wikipedia.org/wiki/Festina",
	},
	{
		name: "Citizen",
		logo: "/zegarmistrz/assets/brands/citizen.webp",
		location: "Tokio, Japonia",
		date: "1918r.",
		first_paragraph:
			"W 1924 roku fabryka zaprezentowała pierwszy zegarek kieszonkowy o nazwie „Citizen”, który stał się początkiem marki Citizen. Nazwa ta (citizen, ang. ‘obywatel’) miała znaczenie symboliczne. Zegarki Citizen miały „być blisko obywateli”.",
		second_paragraph:
			"Citizen pracował również nad alternatywnymi źródłami zasilania. W 1976 roku zaprezentowano pierwszy zegarek zasilany energią słoneczną – Citizen Quartz Crystron Solar Cell.",
		third_paragraph:
			"W 2011 na targach w Bazylei miała miejsce premiera zegarka Citizen Eco-Drive Satellite Wave, w którym synchronizacja czasu odbywała się za pomocą GPS. Zegarek przechwytuje sygnały daty i godziny, które satelita emituje z kosmosu, 20 000 kilometrów nad ziemią i dokonuje automatycznej korekty wskazań.",
		source: "https://pl.wikipedia.org/wiki/Citizen",
	},
	{
		name: "Certina",
		logo: "/zegarmistrz/assets/brands/certina.webp",
		location: "Grenchen, Szwajcaria",
		date: "1888r.",
		first_paragraph:
			"W 1906 roku firma zaprezentowała pierwszy model zegarka kieszonkowego, który sprzedawany był pod marką 'Grana'. Nazwa nawiązywała do miejscowości, w której produkowano zegarki. Późniejsza nazwa marki Certina (skrót od „certus” – bezpieczny pewny), po raz pierwszy pojawiła się w 1906 roku.",
		second_paragraph:
			"Od lat 60. XX wieku charakterystycznym symbolem marki była zielona skorupa żółwia. Ma ona symbolizować wytrzymałość, długowieczność i trwałość, które są elementami wyróżniającymi wszystkich zegarków Certina.",
		third_paragraph:
			"Konstrukcji zegarków z systemem DS ugruntowała pozycję marki na rynku zegarmistrzowskim i wzmocniła rozpoznawalność firmy. W 1963 roku Certina zatrudniała już ponad 800 pracowników, a produkcja zegarków przekraczała 500 000 sztuk rocznie",
		source: "https://pl.wikipedia.org/wiki/Certina",
	},
	{
		name: "Suunto",
		logo: "/zegarmistrz/assets/brands/suunto.webp",
		location: "Vantaa, Finlandia",
		date: "1936r.",
		first_paragraph:
			"Fińska firma produkująca i sprzedająca zegarki sportowe, komputery nurkowe, kompasy i instrumenty precyzyjne. Nazwa firmy pochodzi od fińskiego słowa suunta, oznaczającego 'kierunek' lub 'ścieżkę', lub w nawigacji 'namiar' lub 'kurs'.",
		second_paragraph:
			"Podczas II wojny światowej firma Suunto wprowadziła na rynek kompaktowy kompas celowniczy M/40, przeznaczony dla oficerów artylerii i innych użytkowników potrzebujących precyzyjnego przyrządu do pomiaru azymutu.",
		third_paragraph:
			"Suunto produkuje wielofunkcyjne elektroniczne zegarki na rękę,  które mogą zapewniać różne funkcje, w tym kompasu, wysokości,  a nawet lokalizację GPS, w zależności od modelu.",
		source: "https://en.wikipedia.org/wiki/Suunto",
	},
	{
		name: "Timex",
		logo: "/zegarmistrz/assets/brands/timex.webp",
		location: "Naugatuck Valley, Stany Zjednoczone",
		date: "1854r.",
		first_paragraph:
			"Podczas I wojny światowej firma rozpoczęła produkcję zegarków na rękę, a w 1933 na licencji Walta Disneya stworzyła pierwszy zegarek z Myszką Miki.",
		second_paragraph:
			"Podczas II wojny światowej nastąpiła zmiana nazwy na U.S. Time Company. W 1950 rozpoczęto produkcję zegarka naręcznego Timex, prezentowanego w serii reklam przedstawiających produkt poddawany różnym testom, jak np. zrzucenie z zapory Grand Coulee. Wkrótce spółka zmieniła nazwę na Timex Corporation. Sprzedaż sięgnęła ponad 500 milionów zegarków.",
		third_paragraph:
			"Firma przetrwała trudności okresu lat 70. i 80. i nadal utrzymuje się na rynku, straciła jednak pozycję lidera wśród producentów zegarków. W roku 2002 zatrudniała na czterech kontynentach 5500 pracowników.",
		source: "https://pl.wikipedia.org/wiki/Timex_Group_USA",
	},
	{
		name: "Vostok Europe",
		logo: "/zegarmistrz/assets/brands/vostok.webp",
		location: "Wilno, Litwa",
		date: "2004r.",
		first_paragraph:
			"Nazwa Wostok pochodzi od słynnej fabryki zegarków. Zakład, który mieści się w Czystopolu, 900 kilometrów na wschód od Moskwy, przez dekady dostarczał czasomierze masom mężczyzn. Jego dzieje sięgają 1942 roku. To wtedy, w obawie przed niemiecką ofensywą, część moskiewskiej fabryki zegarków przeniesiono na Wschód. I tak już zostało.",
		second_paragraph:
			"W 2004 Wostok wszedł w spółkę z wileńskim przedsiębiorstwem Koliz. Litwini zdążyli już zyskać pewne uznanie, projektując zaawansowane technicznie zegarki, ale potrzebowali zwiększyć swój potencjał.",
		third_paragraph:
			"Litewska marka jak mało kto udowadnia, że zegarmistrzostwo w Europie Wschodniej stoi na wysokim poziomie.",
		source:
			"https://www.nowiny.gliwice.pl/modele-zegarkow-za-ktorymi-kryje-sie-ciekawa-historia-czyli-vostok-europe",
	},
	{
		name: "Polar",
		logo: "/zegarmistrz/assets/brands/polar.webp",
		location: "Kempele, Finlandia",
		date: "1977r.",
		first_paragraph:
			"Producent pulsometrów wykorzystywanych w różnych dyscyplinach sportowych. Najbardziej zaawansowane technologicznie są modele Polara wykorzystywane w kolarstwie.",
		second_paragraph:
			"Oprócz pomiaru pracy serca urządzenie zapisuje w swej pamięci profil przebytej trasy, wykres prędkości, temperaturę otoczenia. Wszystkie dane można wczytać do komputera i przeglądać podczas treningu.",
		third_paragraph:
			"Na przełomie 2007/2008 Polar wprowadził do oferty model RS800G3 oraz sensor GPS G3 oparty na technologii SIRF III. Pełni on jedynie funkcję czujnika prędkości i dodatkowego altimetru, a nie nawigacji.",
		source:
			"https://www.nowiny.gliwice.pl/modele-zegarkow-za-ktorymi-kryje-sie-ciekawa-historia-czyli-vostok-europe",
	},
	{
		name: "Zeppelin",
		logo: "/zegarmistrz/assets/brands/zeppelin.webp",
		location: "Ismaning, Niemcy",
		date: "1997r.",
		first_paragraph:
			"Od roku 2002 POINT tec Electronic GmbH rozpoczyna produkcje zegarków pod marką Zeppelin. W 2007 r. firma POINT tec, na 20 lecie swojego istnienia, wyprodukowała, wyposażone w mechanizm ETA / Valjoux Kaliber 7753 zegarki JUNKERS IronAnnie JU 52 i ZEPPELIN LZ127.",
		second_paragraph:
			"Firma POINT tec Electronic GmbH współpracuje między innymi z producentem zegarków Gardé w Turyngii. POINT tec Electronic GmbH produkuje także zegarki sterowane falami radiowymi, pod marką Maximilian.",
		third_paragraph:
			"Linia eleganckich zegarków marki Zeppelin. Na tarczy i denku znajduje się sylwetka sterowca. Zegarki są wyposażone w szwajcarskie mechanizmy kwarcowe ETA i RONDA, szwajcarski mechanizm Pesseux z ręcznym naciągiem.",
		source: "https://pl.wikipedia.org/wiki/Junkers_i_Zeppelin",
	},
	{
		name: "G-Shock",
		logo: "/zegarmistrz/assets/brands/gshock.webp",
		location: "Shibuya, Japonia",
		date: "1983r.",
		first_paragraph:
			"Nazwa kolekcji zegarków marki Casio. Linia powstała w 1983 roku w wyniku prac nad wstrząsoodpornym zegarkiem który wytrzyma upadek na twardą powierzchnię z wysokości co najmniej 10 metrów. Pomysłodawcą projektu, który nazwano Project Team Tough był Kikuo Ibe – inżynier pracujący w firmie Casio.",
		second_paragraph:
			"Pierwszym modelem zegarka G-Shock był DW-5000C, który został wykorzystany w sławnej reklamie telewizyjnej gdzie hokeiści grali nim zamiast krążkiem hokejowym. Zegarek ten pojawił się też na nadgarstku Keanu Reevsa w filmie Speed: Niebezpieczna prędkość.",
		third_paragraph:
			"Z początku nieprzychylnie przyjęty przez Japończyków zegarek stał się hitem na rynku USA. Po kilku latach produkcji popularność zyskał również w swoim rodzimym kraju.",
		source: "https://pl.wikipedia.org/wiki/Casio",
	},
	{
		name: "Sekonda",
		logo: "/zegarmistrz/assets/brands/sekonda.webp",
		location: "Leicester, Wielka Brytania",
		date: "1966r.",
		first_paragraph:
			"Sekonda to brytyjski producent zegarków naręcznych, założony w 1966 roku. Zegarki Sekonda były pierwotnie produkowane w Związku Radzieckim. Wiele radzieckich zegarków Sekonda eksportowanych na zachód miało zmienianą nazwę na zegarki Poljot i Raketa.",
		second_paragraph:
			"Po rozpadzie Związku Radzieckiego Sekonda nie ma już rosyjskich powiązań, a wszystkie jej zegarki są produkowane w fabrykach w Hongkongu od 1993r.",
		third_paragraph:
			"W latach 1998-2002 Sekonda była sponsorem Superligi, ówczesnej najwyższej klasy rozgrywkowej w brytyjskim hokeju na lodzie i prekursorem Elite League.",
		source: "https://en.wikipedia.org/wiki/Sekonda",
	},
	{
		name: "Tommy Hilfiger",
		logo: "/zegarmistrz/assets/brands/tommy.webp",
		location: "Nowy Jork, Stany Zjednoczone",
		date: "1985r.",
		first_paragraph:
			"Marka premium Tommy Hilfiger jest jedną z najbardziej rozpoznawalnych grup odzieżowych na świecie, projektującą i wprowadzającą na rynek wysokiej jakości kolekcje odzieży męskiej, damskiej i dziecięcej.",
		second_paragraph:
			"Od 2001 roku Movado Group projektuje, produkuje i dystrybuuje zegarki Tommy Hilfiger na podstawie wyłącznej umowy licencyjnej z Tommy Hilfiger Licensing, Inc.",
		third_paragraph:
			"Zegarki Tommy Hilfiger, będące pierwszym krokiem korporacji w segmencie zegarków o statusie modowym, uzupełniają styl życia i estetykę marki Tommy Hilfiger, łącząc chłodny, klasyczny, ponadczasowy styl swobodnego wyrafinowania z wysokiej jakości rzemiosłem.",
		source: "https://watch-wiki.org/index.php?title=Tommy_Hilfiger",
	},

	//sekonda i tommy hilfiger
];

// Funkcja dodająca dane o wybranej marce do elementów na stronie
function appendCustomData(brand) {
	// Argument brand - jest to obiekt z tablicy brandData, który zawiera wszystkie informacje o marce
	// Pobranie wszystkich elementów DOM potrzebnych do dodania treści o danej marce
	const brandName = document.querySelector(".mark-name");
	const brandLogo = document.querySelector(".mark-logo");
	const brandLocation = document.querySelector(".location");
	const brandDate = document.querySelector(".date");
	const firstParagraph = document.querySelector(".first-paragraph");
	const secondParagraph = document.querySelector(".second-paragraph");
	const thirdParagraph = document.querySelector(".third-paragraph");
	const brandSource = document.querySelector(".source");

	// Wstawienie danych o danej marce do odpowiednich elementów DOM'u znajdujących się na stronie
	brandName.textContent = brand.name;
	brandLogo.src = brand.logo;
	brandLogo.alt = brand.name;
	brandLocation.textContent = brand.location;
	brandDate.textContent = brand.date;
	firstParagraph.textContent = brand.first_paragraph;
	secondParagraph.textContent = brand.second_paragraph;
	thirdParagraph.textContent = brand.third_paragraph;
	brandSource.href = brand.source;
}

// Dodanie nasłuchiwania zdarzenia, które rozpocznie się po wczytaniu przez przeglądarkę całej treści dokumentu HTML
document.addEventListener("DOMContentLoaded", () => {
	// Pobranie parametrów URL z adresu bieżącej strony
	const searchParams = new URLSearchParams(window.location.search);
	// Pobranie wartości parametru "brand" z adresu URL
	const brandURL = searchParams.get("brand");
	// Zmienna informująca czy znaleziono markę, o nazwie podanej w adresie URL, w tablicy 'brandData'
	let isBrandFound = false;

	// Dla każdego obiektu w tablicy 'brandData' wykonujemy następujące instrukcje:
	brandData.forEach((brand) => {
		// -> brand reprezentuje bieżący obiekt, zawierający informacje o marce

		// Sprawdzenie czy nazwa firmy znajdująca się w obiekcie 'brand' jest taka sama jak wartość parametru podanego w adresie URL
		if (brand.name.toLowerCase() === brandURL) {
			// Jeśli tak to wywołujemy funkcję dodającą informacje o danej marce, przekazując jej obiekt jako argument
			appendCustomData(brand);
			// Ustawiamy zmienną na true, ponieważ znaleźliśmy odpowiednią markę
			isBrandFound = true;
		}
	});

	// Jeśli nie znaleźliśmy odpowiedniej marki w tablicy 'brandData' to przekierowywujemy użytkownika na stronę wyświetlającą odpowiedni błąd za pomocą funkcji zaimportowanej z modułu 'auth.js'
	if (!isBrandFound) {
		redirectTo("404.html");
	}
});
