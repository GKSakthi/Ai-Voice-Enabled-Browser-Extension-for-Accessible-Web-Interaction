let listening = false;

document.getElementById("start").addEventListener("click", async () => {
  if (!listening) {
    listening = true;
    listenLoop();
  }
});

document.getElementById("stop").addEventListener("click", () => {
  listening = false;
});

async function listenLoop() {
  if (!listening) return;

  try {
    const res = await fetch("http://127.0.0.1:5000/listen");
    const data = await res.json();

    // OPEN WEBSITE
    if (data.intent === "OPEN") {
      chrome.tabs.create({
        url: "https://www." + data.site + ".com"
      });
    }

    // SEARCH
    else if (data.intent === "SEARCH") {
      chrome.tabs.create({
        url:
          "https://www.google.com/search?q=" +
          encodeURIComponent(data.query)
      });
    }

    // PAGE ACTIONS
    else if (
      data.intent &&
      data.intent !== "NO_SPEECH" &&
      data.intent !== "UNKNOWN"
    ) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, data);
      });
    }

  } catch (e) {
    console.error(e);
  }

  // listen again
  setTimeout(listenLoop, 800);
}
