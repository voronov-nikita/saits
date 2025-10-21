function leading0(n) {
    return n < 10 ? "0" + n : n;
}

function getRuWeekday(d) {
    return ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"][d.getDay()];
}

// Неделя с первого понедельника сентября/февраля, сбрасывается каждые полгода
function getStudyWeek(now) {
    let year = now.getFullYear();
    let startMonth, startYear;
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
    while (start.getDay() !== 1) {
        start.setDate(start.getDate() + 1);
    }
    let diff = now - start;
    let weekNum = Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1;
    if (weekNum < 1) weekNum = 1;
    return weekNum;
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
