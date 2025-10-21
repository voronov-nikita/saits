function updateDateTime() {
    const now = new Date();
    const options = { weekday: "long" };
    document.getElementById("clock").textContent =
        now.toLocaleTimeString("ru-RU");
    document.getElementById("date").textContent = now.toLocaleDateString(
        "ru-RU",
        { year: "numeric", month: "long", day: "numeric" }
    );
    document.getElementById("weekday").textContent =
        now.toLocaleDateString("ru-RU", options).charAt(0).toUpperCase() +
        now.toLocaleDateString("ru-RU", options).slice(1);
}
setInterval(updateDateTime, 1000);
updateDateTime();
