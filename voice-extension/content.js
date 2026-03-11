console.log("Content script active on:", window.location.href);

let intervalId = null;

/* ===================== POLLING ===================== */

function startPolling() {

  if (intervalId) return;

  console.log("🚀 Polling started");

  intervalId = setInterval(async () => {

    try {
      const res = await fetch("http://127.0.0.1:5000/get");
      const data = await res.json();

      console.log("Backend data:", data);

      if (data.command && data.command.trim() !== "") {
        executeCommand(data.command.toLowerCase());
      }

    } catch (err) {
      console.error("Polling error:", err);
    }

  }, 6000);
}

function stopPolling() {
  clearInterval(intervalId);
  intervalId = null;
  console.log("🛑 Polling stopped");
}

/* ===================== STORAGE LISTENER ===================== */

chrome.storage.local.get("listening", (result) => {
  if (result.listening) {
    startPolling();
  }
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.listening) {
    if (changes.listening.newValue) {
      startPolling();
    } else {
      stopPolling();
    }
  }
});

/* ===================== COMMAND EXECUTION ===================== */

function executeCommand(text) {

  console.log("Executing:", text);

  // ---------- OPEN WEBSITE ----------
  if (text.startsWith("open")) {
    const site = text.replace("open", "").trim();
    if (site.length > 0) {
      window.location.href = "https://www." + site + ".com";
    }
    return;
  }

  // ---------- SEARCH ----------
  if (text.startsWith("search")) {
    const query = text.replace("search", "").trim();
    if (query.length > 0) {
      window.location.href =
        "https://www.google.com/search?q=" +
        encodeURIComponent(query);
    }
    return;
  }

  // ---------- SCROLL ----------
  if (text.includes("scroll down")) {
    window.scrollBy({ top: 600, behavior: "smooth" });
    return;
  }

  if (text.includes("scroll up")) {
    window.scrollBy({ top: -600, behavior: "smooth" });
    return;
  }

  // ---------- TYPE ----------
  if (text.startsWith("type")) {
    const content = text.replace("type", "").trim();
    const active = document.activeElement;

    if (
      active &&
      (active.tagName === "INPUT" || active.tagName === "TEXTAREA")
    ) {
      active.value += content;
      active.dispatchEvent(new Event("input", { bubbles: true }));
    }
    return;
  }

  // ---------- CLICK ----------
  if (text.startsWith("click")) {

    const target = text.replace("click", "").trim();

    const elements = document.querySelectorAll("button, a");

    // Click by number (option 1, option 2)
    const match = target.match(/\d+/);
    if (match) {
      const index = parseInt(match[0], 10) - 1;
      if (elements[index]) {
        elements[index].click();
        return;
      }
    }

    // Click by text match
    elements.forEach(el => {
      if (
        el.innerText &&
        el.innerText.toLowerCase().includes(target)
      ) {
        el.click();
      }
    });

    return;
  }

  // ---------- SELECT DROPDOWN ----------
  if (text.startsWith("select")) {

    const value = text.replace("select", "").trim();
    const selects = document.querySelectorAll("select");

    selects.forEach(select => {
      Array.from(select.options).forEach(option => {
        if (option.text.toLowerCase().includes(value)) {
          select.value = option.value;
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });
    });

    return;
  }

}
