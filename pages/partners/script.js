// ------ Виджет даты/недели ------
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
}
setInterval(updateDateWidget, 1000);
updateDateWidget();

// ------ Погодный виджет из OpenWeatherMap ------
const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; // замените на свой ключ
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
            document.getElementById("weather-gm").textContent = "--";
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
                data.sys && data.sys.sunrise ? data.sys.sunrise : undefined
            );
            document.getElementById("sunset").textContent = formatTime(
                data.sys && data.sys.sunset ? data.sys.sunset : undefined
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

// ------ Модальное описание партнера ------
const partnersDescriptions = {
    rostec: "Государственная корпорация, развивающая промышленность и технологии.",
    "1c": "Разработчик программного обеспечения для бизнеса, учёта и автоматизации.",
    krok: "IT-интегратор, решения для бизнеса, инфраструктуры и облаков.",
    astra: "Российские операционные системы и корпоративное ПО.",
    rosatom: "Лидер атомной отрасли, инновации в энергетике.",
    yandex_lyceum: "Образовательная платформа Яндекса для школьников.",
    it_school: "Школа Samsung — обучение программированию и IT.",
    solar: "Кибербезопасность и решения для защиты данных.",
    rostelecom: "Крупнейший российский телеком-оператор и цифровые сервисы.",
};

document.querySelectorAll(".partner-card").forEach((el) => {
    el.addEventListener("click", () => {
        const id = el.getAttribute("data-partner");
        document.getElementById("modal-title").textContent =
            el.querySelector(".partner-name").textContent;
        document.getElementById("modal-text").textContent =
            partnersDescriptions[id] || "";
        document.getElementById("modal-bg").style.display = "flex";
    });
});
// Закрытие модалки
document.getElementById("modal-close").onclick = () => {
    document.getElementById("modal-bg").style.display = "none";
};
document.getElementById("modal-bg").onclick = (e) => {
    if (e.target === document.getElementById("modal-bg")) {
        document.getElementById("modal-bg").style.display = "none";
    }
};
