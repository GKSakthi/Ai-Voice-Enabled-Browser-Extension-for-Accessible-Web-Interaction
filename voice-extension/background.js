chrome.commands.onCommand.addListener(async (command) => {
  if (command === "start-listening") {

    const res = await fetch("http://127.0.0.1:5000/listen");
    const data = await res.json();

    if (data.intent === "OPEN") {
      chrome.tabs.create({ url: "https://www." + data.site + ".com" });
      return;
    }

    if (data.intent === "SEARCH") {
      chrome.tabs.create({
        url: "https://www.google.com/search?q=" +
             encodeURIComponent(data.query)
      });
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0]) return;
      chrome.tabs.sendMessage(tabs[0].id, data);
    });
  }
});
