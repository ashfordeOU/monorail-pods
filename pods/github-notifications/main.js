// GitHub Notifications: the unread count and the latest few, from api.github.com/notifications.
// The token is a declared secret: Monorail keeps it in the Keychain and adds it to requests for
// api.github.com when asked with { secret: "token" }. This script never sees it.

const API = "https://api.github.com/notifications?per_page=50";

const SYMBOLS = { PullRequest: "arrow.triangle.pull", Issue: "smallcircle.filled.circle", Release: "tag", Discussion: "bubble.left.and.bubble.right" };

async function refresh() {
  try {
    const response = await monorail.fetch(API, {
      secret: "token",
      headers: { accept: "application/vnd.github+json" }
    });
    if (response.status === 401) {
      monorail.state.set({ count: "–", fraction: 0, summary: "Add your token in Settings ▸ Add-ons.", latest: [] });
      return;
    }
    if (!response.ok) throw new Error("GitHub answered " + response.status);
    const list = JSON.parse(response.text);
    const latest = list.slice(0, 4).map(n => ({
      title: n.repository.name + ": " + n.subject.title,
      symbol: SYMBOLS[n.subject.type] || "bell",
    }));
    const count = list.length >= 50 ? "50+" : String(list.length);
    monorail.state.set({
      count,
      fraction: Math.min(1, list.length / 20),
      summary: list.length === 0 ? "All caught up" : list.length === 1 ? "1 unread" : count + " unread",
      latest
    });
  } catch (error) {
    monorail.state.set({ summary: "Couldn't reach GitHub." });
    monorail.log("refresh failed: " + error);
  }
}

function onAction(action) {
  if (action === "inbox" || action === "open") monorail.openURL("https://github.com/notifications");
}
