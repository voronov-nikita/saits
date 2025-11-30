// const PROXY = "https://corsproxy.io/?";
const NEWS_URL =  "https://priem.mirea.ru/news";

const SITE_ORIGIN = "https://priem.mirea.ru";
// путь от корня твоего dev-сервера
const PLACEHOLDER = "/img/";

let newsCards = [];
let newsIndex = 0;

function renderCurrentNews() {
  const card = newsCards[newsIndex];
  const imgEl = document.getElementById("newsImage");
  const titleEl = document.getElementById("newsTitle");
  const dateEl = document.getElementById("newsDate");
  const linkEl = document.getElementById("newsLink");
  const tagsEl = document.getElementById("newsTags");
  const excerptEl = document.getElementById("newsExcerpt");

  if (!card) {
    titleEl.textContent = "Не удалось получить новости.";
    dateEl.textContent = "";
    excerptEl.textContent = "";
    tagsEl.textContent = "";
    imgEl.src = PLACEHOLDER;
    imgEl.alt = "Нет изображения";
    linkEl.href = "#";
    return;
  }

  imgEl.src = card.image || PLACEHOLDER;
  imgEl.alt = card.title;
  titleEl.textContent = card.title;
  dateEl.textContent = card.date || "";
  excerptEl.textContent = card.excerpt || "";
  linkEl.href = card.url;

  tagsEl.textContent = card.tags.length ? card.tags.join(", ") : "";
}

async function fetchNews() {
  const titleEl = document.getElementById("newsTitle");
  titleEl.textContent = "Загрузка новостей...";

  try {
    const resp = await fetch(NEWS_URL, {mode: "no-cors"});
    const html = await resp.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const cards = [];

    // каждый блок новости на странице приёмной комиссии
    doc.querySelectorAll("div.article").forEach((el) => {
      // картинка и ссылка
      const imgLink = el.querySelector(
        ".article-intro-image a[href*='/news/']"
      );
      const img = imgLink ? imgLink.querySelector("img") : null;

      // заголовок
      const titleLink = el.querySelector(".article-header h2 a");

      // дата
      const dateEl = el.querySelector(
        ".article-info time, .article-info .published"
      );

      // теги
      const tagEls = el.querySelectorAll("ul.tags li a");

      // краткое описание
      const introP = el.querySelector(".article-introtext p");

      if (!titleLink) return;

      // URL новости
      const href = (imgLink || titleLink).getAttribute("href") || "#";
      const url = href.startsWith("http") ? href : SITE_ORIGIN + href;

      // картинка: относительный src -> абсолютный
      let imgSrc = img ? img.getAttribute("src") || "" : "";
      if (imgSrc && !imgSrc.startsWith("http")) {
        imgSrc = SITE_ORIGIN + imgSrc; // на сайте src начинается с /
      }

      // теги
      const tags = Array.from(tagEls).map((t) => t.textContent.trim());

      cards.push({
        title: titleLink.textContent.trim(),
        url,
        image: imgSrc,
        date: dateEl ? dateEl.textContent.trim() : "",
        tags,
        excerpt: introP ? introP.textContent.trim() : ""
      });
    });

    // берём только первые 5
    newsCards = cards.slice(0, 5);
    newsIndex = 0;
    renderCurrentNews();
  } catch (e) {
    newsCards = [];
    renderCurrentNews();
  }
}

// первая загрузка
fetchNews();

// обновление данных раз в 15 минут
setInterval(fetchNews, 15 * 60 * 1000);

// цикличная смена 5 новостей
setInterval(() => {
  if (!newsCards.length) return;
  newsIndex = (newsIndex + 1) % newsCards.length;
  renderCurrentNews();
}, 8000);
