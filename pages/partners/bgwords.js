// bgwords.js

const BG_WORD = "Технопарк"; // Можете менять на любое слово
const WORDS_COUNT = 10; // Количество слов на фоне

function randomBetween(a, b) {
    return Math.random() * (b - a) + a;
}

function createBgWords() {
    if (document.querySelector(".bg-words")) return;
    const bg = document.createElement("div");
    bg.className = "bg-words";
    document.body.prepend(bg);

    for (let i = 0; i < WORDS_COUNT; i++) {
        const div = document.createElement("div");
        div.className = "bg-word";
        div.textContent = BG_WORD;

        // Рандомизация параметров для естественности
        const left = randomBetween(-10, 85); // в vw
        const delay = randomBetween(0, 6); // с
        const rotate = randomBetween(-12, -6); // градусы
        const fontSize = randomBetween(12, 19); // vw

        div.style.left = left + "vw";
        div.style.animationDelay = delay + "s";
        div.style.transform = `rotate(${rotate}deg)`;
        div.style.fontSize = fontSize + "vw";
        div.style.zIndex = -100;

        // По желанию индивидуальная прозрачность
        div.style.opacity = randomBetween(0.07, 0.07);

        document.querySelector(".bg-words").appendChild(div);
    }
}

window.addEventListener("DOMContentLoaded", createBgWords);
