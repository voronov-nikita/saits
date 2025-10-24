// ---- Высота блока даты = высоте блока с названием (с учетом padding!) ----
function syncHeaderBlocks() {
    const titleCard = document.getElementById("mainTitleCard");
    const dateCard = document.getElementById("dateWidgetCard");
    if (titleCard && dateCard) {
        dateCard.style.minHeight = titleCard.offsetHeight + "px";
        // сверху и снизу padding учитывается!
    }
}
window.addEventListener("resize", syncHeaderBlocks);
window.addEventListener("DOMContentLoaded", syncHeaderBlocks);

// --- Карусель партнёров с боковой анимацией ---
const partnersAll = [
    {
        src: "./img/partner_rostech.png",
        alt: "Ростех",
        name: "Ростех",
        key: "rostec",
    },
    { src: "./img/partner_1c.png", alt: "1C", name: "1C", key: "1c" },
    { src: "./img/partner_krok.png", alt: "КРОК", name: "КРОК", key: "krok" },
    {
        src: "./img/partner_astra.png",
        alt: "Астра",
        name: "Астра",
        key: "astra",
    },
    {
        src: "./img/Rosatom.jpg",
        alt: "Росатом",
        name: "Росатом",
        key: "rosatom",
    },
    {
        src: "./img/lyceum.png",
        alt: "Яндекс Лицей",
        name: "Яндекс Лицей",
        key: "yandex_lyceum",
    },
    {
        src: "./img/partner_it_school.png",
        alt: "IT Школа",
        name: "IT Школа",
        key: "it_school",
    },
    {
        src: "./img/partner_solar.png",
        alt: "Солар",
        name: "Солар",
        key: "solar",
    },
    {
        src: "./img/partner_rostelecom.png",
        alt: "Ростелеком",
        name: "Ростелеком",
        key: "rostelecom",
    },
    // ... добавляй своих
];

let partnerCarouselIndex = 0,
    animating = false;
let prevArr = [];
function renderPartnersGrid(animated = true, direction = "right") {
    const grid = document.getElementById("partnersGrid");
    if (!grid) return;
    const N = partnersAll.length;
    let start = partnerCarouselIndex;
    let arr = [];
    for (let i = 0; i < 9; ++i) arr.push(partnersAll[(start + i) % N]);

    // делаем для slide effect
    let newBlock = document.createElement("div");
    newBlock.className = "partner-cells-slide";
    arr.forEach((p) => {
        const cell = document.createElement("div");
        cell.className = "partner-cell";
        cell.setAttribute("data-partner", p.key);
        cell.innerHTML = `<img src="${p.src}" alt="${p.alt}" /><div class="partner-name">${p.name}</div>`;
        newBlock.appendChild(cell);
    });

    // Если не первый рендер — делаем слайд-анимацию!
    if (animated && grid.firstChild) {
        let oldBlock = grid.firstChild;
        newBlock.style.transform = `translateX(${
            direction === "right" ? "100%" : "-100%"
        })`;
        grid.appendChild(newBlock);
        setTimeout(() => {
            oldBlock.style.transform = `translateX(${
                direction === "right" ? "-100%" : "100%"
            })`;
            newBlock.style.transform = "translateX(0)";
        }, 30);

        setTimeout(() => {
            if (grid.children.length > 1) grid.removeChild(grid.firstChild); // очищаем старый блок
            bindPartnerModals(); // чтобы новые карточки были интерактивны
        }, 600);
    } else {
        grid.innerHTML = "";
        grid.appendChild(newBlock);
        bindPartnerModals();
    }
    prevArr = arr;
}
function tickPartners() {
    if (animating) return;
    animating = true;
    partnerCarouselIndex = (partnerCarouselIndex + 9) % partnersAll.length;
    renderPartnersGrid(true, "right");
    setTimeout(() => {
        animating = false;
    }, 650);
}
renderPartnersGrid(false);
setInterval(tickPartners, 2200);

// --- Модалки, описание компаний ---
const partnersDescriptions = {
    rostec: "Госкорпорация, развивающая высокотехнологичные отрасли в России.",
    "1c": "Экосистема ИТ-решений для бизнеса, образования и учёта.",
    krok: "Крупный ИТ-интегратор и поставщик облачных платформ.",
    astra: "Российский разработчик системы Astra Linux.",
    rosatom: "Госкорпорация по атомной энергии, лидер инноваций.",
    yandex_lyceum: "Проект Яндекса для обучения школьников программированию.",
    it_school: "Образовательная инициатива Samsung для ИТ-обучения.",
    solar: "Эксперт в кибербезопасности, цифровой защите.",
    rostelecom: "Национальный оператор связи, интернет и цифровые платформы.",
};
function bindPartnerModals() {
    document.querySelectorAll(".partner-cell").forEach((el) => {
        el.onclick = () => {
            const key = el.getAttribute("data-partner");
            document.getElementById("modal-title").textContent =
                el.querySelector(".partner-name").textContent;
            document.getElementById("modal-text").textContent =
                partnersDescriptions[key] || "Нет описания.";
            document.getElementById("modal-bg").style.display = "flex";
        };
    });
}
bindPartnerModals();

document.getElementById("modal-close").onclick = () => {
    document.getElementById("modal-bg").style.display = "none";
};
document.getElementById("modal-bg").onclick = (e) => {
    if (e.target === document.getElementById("modal-bg")) {
        document.getElementById("modal-bg").style.display = "none";
    }
};

// --- Виджет даты, времени и недели ---
function leading0(n) {
    return n < 10 ? "0" + n : n;
}
function getRuWeekday(d) {
    return ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"][d.getDay()];
}
function getStudyWeek(now) {
    let year = now.getFullYear(),
        startMonth,
        startYear;
    if (now.getMonth() + 1 >= 9) {
        startMonth = 8;
        startYear = year;
    } else if (now.getMonth() + 1 >= 2) {
        startMonth = 1;
        startYear = year;
    } else {
        startMonth = 8;
        startYear = year - 1;
    }
    let start = new Date(startYear, startMonth, 1);
    while (start.getDay() !== 1) start.setDate(start.getDate() + 1);
    let diff = now - start;
    let weekNum = Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1;
    return weekNum < 1 ? 1 : weekNum;
}
function updateDateWidget() {
    const now = new Date();
    document.getElementById("weekday").textContent = getRuWeekday(now);
    document.getElementById("time").textContent = `${leading0(
        now.getHours()
    )}:${leading0(now.getMinutes())}`;
    document.getElementById(
        "fulldate"
    ).textContent = `${now.getDate()} ${now.toLocaleString("ru-RU", {
        month: "long",
    })}`;
    document.getElementById("weeknumber").textContent = getStudyWeek(now);
    document.getElementById("schedule").textContent = "Перерыв";
    setTimeout(syncHeaderBlocks, 100); // обязательно чуть позже для высоты
}
setInterval(updateDateWidget, 1000);
updateDateWidget();

// ---- Динамическая погода (оставь свою реализацию)
const API_KEY = "1df2eb92e9b510458f1e2edebaace0eb"; // вставь свой API-ключ!
const CITY = "Moscow";

function fetchWeather() {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&lang=ru&appid=${API_KEY}`
    )
        .then((resp) => resp.json())
        .then((data) => {
            document.getElementById("weather-temp").textContent = data.main
                ? data.main.temp > 0
                    ? `+${Math.round(data.main.temp)}`
                    : `${Math.round(data.main.temp)}`
                : "--";
            document.getElementById("weather-feel").textContent =
                data.main && typeof data.main.feels_like === "number"
                    ? `По ощущению ${
                          data.main.feels_like > 0 ? "+" : ""
                      }${Math.round(data.main.feels_like)}`
                    : "";
            document.getElementById("weather-desc").textContent =
                data.weather && data.weather[0]
                    ? data.weather[0].description[0].toUpperCase() +
                      data.weather[0].description.slice(1)
                    : "";
            document.getElementById("weather-wind").textContent = data.wind
                ? `${data.wind.speed} м/с`
                : "--";
            document.getElementById("weather-pressure").textContent = data.main
                ? `${Math.round(data.main.pressure * 0.750062)} мм рт. ст.`
                : "--";
            document.getElementById("weather-humidity").textContent = data.main
                ? `${data.main.humidity}%`
                : "--";
            function formatTime(ts) {
                if (!ts) return "--:--";
                const date = new Date(ts * 1000);
                return (
                    leading0(date.getHours()) +
                    ":" +
                    leading0(date.getMinutes())
                );
            }
            document.getElementById("sunrise").textContent = formatTime(
                data.sys && data.sys.sunrise
            );
            document.getElementById("sunset").textContent = formatTime(
                data.sys && data.sys.sunset
            );
        })
        .catch(() => {
            document.getElementById("weather-temp").textContent = "--";
            document.getElementById("weather-feel").textContent = "";
            document.getElementById("weather-desc").textContent = "";
            document.getElementById("weather-wind").textContent = "--";
            document.getElementById("weather-pressure").textContent = "--";
            document.getElementById("weather-humidity").textContent = "--";
            document.getElementById("weather-gm").textContent = "--";
            document.getElementById("sunrise").textContent = "--:--";
            document.getElementById("sunset").textContent = "--:--";
        });
}
fetchWeather();
setInterval(fetchWeather, 600000);
