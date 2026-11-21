// Headlines: the top stories from BBC News's RSS feed.
// A pod's script defines refresh() (called at start and on its schedule) and, optionally,
// onAction(action, index) for taps. It talks to Monorail only through `monorail`.

const FEED = "https://feeds.bbci.co.uk/news/rss.xml";

function decode(text) {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"")
    .replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, "&")
    .trim();
}

function tag(block, name) {
  const match = block.match(new RegExp("<" + name + "[^>]*>([\\s\\S]*?)</" + name + ">"));
  return match ? decode(match[1]) : "";
}

function time() {
  const d = new Date();
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}

async function refresh() {
  try {
    const response = await monorail.fetch(FEED, { headers: { accept: "application/rss+xml" } });
    if (!response.ok) throw new Error("The feed answered " + response.status);
    const items = [];
    const blocks = response.text.split("<item>").slice(1);
    for (const block of blocks.slice(0, 8)) {
      const title = tag(block, "title");
      const link = tag(block, "link");
      if (title && link.startsWith("https://")) items.push({ title, link });
    }
    monorail.storage.set("items", items);
    monorail.state.set({ items, message: items.length ? null : "No headlines right now.", updated: time() });
  } catch (error) {
    const saved = monorail.storage.get("items") || [];
    monorail.state.set({ items: saved, message: saved.length ? null : "Couldn't reach BBC News.", updated: "" });
    monorail.log("refresh failed: " + error);
  }
}

function onAction(action, index) {
  const items = monorail.storage.get("items") || [];
  if (action === "open" && items[index]) monorail.openURL(items[index].link);
}
