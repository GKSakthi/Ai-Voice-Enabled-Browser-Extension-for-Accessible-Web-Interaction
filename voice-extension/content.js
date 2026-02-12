chrome.runtime.onMessage.addListener((msg) => {

  // -------- SCROLL DOWN --------
  if (msg.intent === "SCROLL_DOWN") {
    window.scrollBy({ top: 500, behavior: "smooth" });
  }

  // -------- SCROLL UP --------
  if (msg.intent === "SCROLL_UP") {
    window.scrollBy({ top: -500, behavior: "smooth" });
  }

  // -------- CLICK --------
  if (msg.intent === "CLICK") {
    const elements = document.querySelectorAll("button, a, input");

    // click option number (option 1, option 2)
    const match = msg.target.match(/\d+/);
    if (match) {
      const index = parseInt(match[0], 10) - 1;
      if (elements[index]) {
        elements[index].click();
        return;
      }
    }

    // click by text
    elements.forEach(el => {
      if (
        el.innerText &&
        el.innerText.toLowerCase().includes(msg.target)
      ) {
        el.click();
      }
    });
  }

  // -------- TYPE (FIXED PART) --------
  if (msg.intent === "TYPE") {
    const active = document.activeElement;

    if (
      active &&
      (active.tagName === "INPUT" || active.tagName === "TEXTAREA")
    ) {
      active.value += msg.text;

      // 🔑 THIS LINE WAS MISSING (VERY IMPORTANT)
      active.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

});
