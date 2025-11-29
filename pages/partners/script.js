function syncHeaderBlocks() {
    const titleCard = document.getElementById("mainTitleCard");
    const dateCard = document.querySelector(".weather-time-wrapper");
    if (titleCard && dateCard) {
        dateCard.style.minHeight = titleCard.offsetHeight + "px";
    }
}
window.addEventListener("resize", syncHeaderBlocks);
window.addEventListener("DOMContentLoaded", syncHeaderBlocks);

const partnersAll = [
    { src: "./img/partners/Rostec.png", alt: "Ростех", name: "Ростех", key: "rostec" },
    { src: "./img/partners/1С.jpg", alt: "1C", name: "1C", key: "1c" },
    { src: "./img/partners/CROC.png", alt: "КРОК", name: "КРОК", key: "krok" },
    { src: "./img/partners/astra.png", alt: "Астра", name: "Астра", key: "astra" },
    { src: "./img/partners/Rosatom.png", alt: "Росатом", name: "Росатом", key: "rosatom" },
    { src: "./img/partners/lyceum.png", alt: "Яндекс Лицей", name: "Яндекс Лицей", key: "yandex_lyceum" },
    { src: "./img/partners/SAMSUNG.png", alt: "IT Школа", name: "IT Школа", key: "it_school" },
    { src: "./img/partners/Solar.png", alt: "Солар", name: "Солар", key: "solar" },
    { src: "./img/partners/ROSTELECOM.png", alt: "Ростелеком", name: "Ростелеком", key: "rostelecom" },
    { src: "./img/partners/roscosmos.png", alt: "Роскосмос", name: "Роскосмос", key: "rosspace" }
];

const partnersDescriptions = {
    rostec: "Госкорпорация, развивающая высокотехнологичные отрасли в России.",
    "1c": "Экосистема ИТ-решений для бизнеса, образования и учёта.",
    krok: "Крупный ИТ-интегратор и поставщик облачных платформ.",
    astra: "Российский разработчик системы Astra Linux.",
    rosatom: "Госкорпорация по атомной энергии, лидер инноваций.",
    yandex_lyceum: "Проект Яндекса для обучения школьников программированию.",
    it_school: "Образовательная инициатива Samsung для ИТ-обучения.",
    solar: "Эксперт в кибербезопасности и цифровой защите.",
    rostelecom: "Национальный оператор связи, интернет и цифровые платформы."
};

function bindModals() {
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

function buildPartnersTrack() {
    const track = document.getElementById("partnersTrack");
    if (!track) return;

    track.innerHTML = "";

    partnersAll.forEach((p) => {
        const cell = document.createElement("div");
        cell.className = "partner-cell";
        cell.setAttribute("data-partner", p.key);
        cell.innerHTML = `
            <img src="${p.src}" alt="${p.alt}">
            <div class="partner-name">${p.name}</div>
        `;
        track.appendChild(cell);
    });

    const clone = track.cloneNode(true);
    clone.id = "";
    clone.classList.add("partners-track");
    track.parentElement.appendChild(clone);

    bindModals();
}

buildPartnersTrack();

document.getElementById("modal-close").onclick = () => {
    document.getElementById("modal-bg").style.display = "none";
};
document.getElementById("modal-bg").onclick = (e) => {
    if (e.target.id === "modal-bg") {
        document.getElementById("modal-bg").style.display = "none";
    }
};

function leading0(n) {
    return n < 10 ? "0" + n : n;
}

function getRuWeekdayFull(d) {
    return ["воскресенье", "понедельник", "вторник", "среда",
        "четверг", "пятница", "суббота"][d.getDay()];
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatRuDate(d) {
    const formatter = new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long"
    });
    const parts = formatter.formatToParts(d);
    const dayPart = parts.find((p) => p.type === "day")?.value || "";
    const monthPart = parts.find((p) => p.type === "month")?.value || "";
    return `${dayPart} ${monthPart}`;
}

function updateDateTime() {
    const now = new Date();
    document.getElementById("time").textContent =
        `${leading0(now.getHours())}:${leading0(now.getMinutes())}`;
    const weekday = getRuWeekdayFull(now);
    document.getElementById("weekdayText").textContent =
        capitalizeFirst(weekday);
    document.getElementById("fulldate").textContent = formatRuDate(now);
    setTimeout(syncHeaderBlocks, 50);
}
setInterval(updateDateTime, 1000);
updateDateTime();

const API_KEY = "1df2eb92e9b510458f1e2edebaace0eb";
const CITY = "Moscow";

function fetchWeather() {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&lang=ru&appid=${API_KEY}`
    )
        .then((r) => r.json())
        .then((data) => {
            const temp = data.main?.temp;
            const feel = data.main?.feels_like;
            const desc = data.weather?.[0]?.description || "";

            document.getElementById("weather-temp").textContent =
                data.main
                    ? (temp > 0 ? "+" : "") + Math.round(temp) + "°"
                    : "--";

            document.getElementById("weather-feel").textContent =
                data.main
                    ? `По ощущениям ${(feel > 0 ? "+" : "") + Math.round(feel)}°`
                    : "";

            document.getElementById("weather-desc").textContent =
                desc ? desc[0].toUpperCase() + desc.slice(1) : "";

            document.getElementById("weather-wind").textContent =
                data.wind ? `${data.wind.speed} м/с` : "--";

            document.getElementById("weather-pressure").textContent =
                data.main
                    ? `${Math.round(data.main.pressure * 0.750062)} мм рт. ст.`
                    : "--";

            document.getElementById("weather-humidity").textContent =
                data.main ? `${data.main.humidity}%` : "--";

            const formatTime = (ts) => {
                if (!ts) return "--:--";
                const d = new Date(ts * 1000);
                return leading0(d.getHours()) + ":" + leading0(d.getMinutes());
            };

            document.getElementById("sunrise").textContent =
                formatTime(data.sys?.sunrise);
            document.getElementById("sunset").textContent =
                formatTime(data.sys?.sunset);
        })
        .catch(() => {
            document.getElementById("weather-temp").textContent = "--";
            document.getElementById("weather-feel").textContent = "";
            document.getElementById("weather-desc").textContent = "";
        });
}
fetchWeather();
setInterval(fetchWeather, 600000);
