console.log("Content script active on:", window.location.href);

/* ===================== TEXT TO SPEECH ===================== */

function speak(text) {

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);

}

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

  /* ---------- READ PAGE ---------- */

  if (text.includes("read page")) {

    speak("Reading page content");

    const content = document.body.innerText.slice(0, 800);

    speak(content);

    return;
  }

  /* ---------- SEARCH ---------- */

  if (text.startsWith("search")) {

    const query = text.replace("search", "").trim();

    if (query.length > 0) {

      speak("Searching for " + query);

      window.location.href =
        "https://www.google.com/search?q=" +
        encodeURIComponent(query);

    }

    return;
  }

  /* ---------- OPEN WEBSITE ---------- */

  if (text.startsWith("open")) {

    const site = text.replace("open", "").trim();

    if (site.length > 0) {

      speak("Opening " + site);

      window.location.href =
        "https://www." + site + ".com";

    }

    return;
  }

  /* ---------- SCROLL ---------- */

  if (text.includes("scroll down")) {

    speak("Scrolling down");

    window.scrollBy({ top: 600, behavior: "smooth" });

    return;
  }

  if (text.includes("scroll up")) {

    speak("Scrolling up");

    window.scrollBy({ top: -600, behavior: "smooth" });

    return;
  }

  /* ---------- TYPE ---------- */

  if (text.startsWith("type")) {

    const content = text.replace("type", "").trim();

    const active = document.activeElement;

    if (
      active &&
      (active.tagName === "INPUT" || active.tagName === "TEXTAREA")
    ) {

      speak("Typing text");

      active.value += content;

      active.dispatchEvent(new Event("input", { bubbles: true }));

    }

    return;
  }

  /* ---------- CLICK ---------- */

  if (text.startsWith("click")) {

    const target = text.replace("click", "").trim();

    speak("Clicking " + target);

    const elements = document.querySelectorAll("button, a");

    const match = target.match(/\d+/);

    if (match) {

      const index = parseInt(match[0], 10) - 1;

      if (elements[index]) {

        elements[index].click();
        return;

      }

    }

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

  /* ---------- SELECT DROPDOWN ---------- */

  if (text.startsWith("select")) {

    const value = text.replace("select", "").trim();

    const selects = document.querySelectorAll("select");

    selects.forEach(select => {

      Array.from(select.options).forEach(option => {

        if (option.text.toLowerCase().includes(value)) {

          speak("Selecting " + option.text);

          select.value = option.value;

          select.dispatchEvent(new Event("change", { bubbles: true }));

        }

      });

    });

    return;
  }

}
