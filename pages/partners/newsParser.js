const NEWS_URL = "https://corsproxy.io/?https://priem.mirea.ru/news";
let newsCards = [];
let newsIndex = 0;

function renderCurrentNews() {
    const card = newsCards[newsIndex];
    const imgEl = document.getElementById("newsImage");
    const titleEl = document.getElementById("newsTitle");
    const dateEl = document.getElementById("newsDate");
    const linkEl = document.getElementById("newsLink");

    if (!card) {
        titleEl.textContent = "Не удалось получить новости.";
        dateEl.textContent = "";
        imgEl.src = "./img/placeholder.jpg";
        linkEl.href = "#";
        linkEl.style.display = "none";
        return;
    }

    imgEl.src = card.image || "./img/placeholder.jpg";
    imgEl.alt = card.title;
    titleEl.textContent = card.title;
    dateEl.textContent = card.date || "";
    linkEl.href = card.url;
    linkEl.style.display = "inline-block";
}

async function fetchNews() {
    const titleEl = document.getElementById("newsTitle");
    titleEl.textContent = "Загрузка новостей...";

    try {
        const resp = await fetch(NEWS_URL, { mode: "cors" });
        const html = await resp.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const cards = [];
        doc.querySelectorAll(".news-item, article, .card").forEach((el) => {
            const link = el.querySelector("a[href*='/news/']");
            const img = el.querySelector("img");
            const dateEl = el.querySelector("time, .date, .news-date");
            const titleElInner = el.querySelector("h2, h3, .title, .news-title");

            if (!link || !titleElInner) return;

            const url = link.getAttribute("href") || "#";
            const fullUrl = url.startsWith("http")
                ? url
                : "https://priem.mirea.ru" + url;

            cards.push({
                title: titleElInner.textContent.trim(),
                url: fullUrl,
                image: img ? img.getAttribute("src") : "",
                date: dateEl ? dateEl.textContent.trim() : ""
            });
        });

        newsCards = cards.slice(0, 8);
        newsIndex = 0;
        renderCurrentNews();
    } catch (e) {
        newsCards = [];
        renderCurrentNews();
    }
}

fetchNews();
setInterval(fetchNews, 15 * 60 * 1000);

setInterval(() => {
    if (!newsCards.length) return;
    newsIndex = (newsIndex + 1) % newsCards.length;
    renderCurrentNews();
}, 8000);
