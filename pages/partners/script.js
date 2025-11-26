// Партнёры
const partnersAll = [
    {
        src: "./img/Rostec.png",
        alt: "Ростех",
        name: "Ростех",
        key: "rostec",
    },
    { src: "./img/1С.jpg", alt: "1C", name: "1C", key: "1c" },
    { src: "./img/CROC.png", alt: "КРОК", name: "КРОК", key: "krok" },
    {
        src: "./img/astra.png",
        alt: "Астра",
        name: "Астра",
        key: "astra",
    },
    {
        src: "./img/Rosatom.png",
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
        src: "./img/SAMSUNG.png",
        alt: "IT Школа",
        name: "IT Школа",
        key: "it_school",
    },
    {
        src: "./img/Solar.png",
        alt: "Солар",
        name: "Солар",
        key: "solar",
    },
    {
        src: "./img/ROSTELECOM.png",
        alt: "Ростелеком",
        name: "Ростелеком",
        key: "rostelecom",
    },
    {
        src: "./img/roscosmos.png",
        alt: "Роскосмос",
        name: "Роскосмос",
        key: "rosspace",
    },
];

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

let partnerIndex = 0;
const visibleCount = 3;

function renderCarousel() {
    const track = document.getElementById("carouselTrack");
    if (!track) return;
    track.innerHTML = "";
    for (let i = 0; i < visibleCount; i++) {
        const idx = (partnerIndex + i) % partnersAll.length;
        const p = partnersAll[idx];
        const cell = document.createElement("div");
        cell.className = "carousel-partner";
        cell.setAttribute("data-partner", p.key);
        cell.innerHTML = `<img src="${p.src}" alt="${p.alt}"><div class="partner-name">${p.name}</div>`;
        track.appendChild(cell);
    }
    bindModals();
}

function nextSlide() {
    partnerIndex = (partnerIndex + 1) % partnersAll.length;
    slideCarousel();
}

function slideCarousel() {
    const track = document.getElementById("carouselTrack");
    if (track) {
        track.style.transform = "translateX(-124px)";
        setTimeout(() => {
            track.style.transition = "none";
            track.style.transform = "translateX(0)";
            renderCarousel();
            setTimeout(() => {
                track.style.transition = "";
            }, 30);
        }, 700);
    }
}

setInterval(nextSlide, 2900);
renderCarousel();

// --- модальное окно ---
function bindModals() {
    document.querySelectorAll(".carousel-partner").forEach((el) => {
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
document.getElementById("modal-close").onclick = () => {
    document.getElementById("modal-bg").style.display = "none";
};
document.getElementById("modal-bg").onclick = (e) => {
    if (e.target.id === "modal-bg") {
        document.getElementById("modal-bg").style.display = "none";
    }
};

// --- ваши блоки для даты и погоды ---
// (оставьте свой скрипт, он полностью подходит)
