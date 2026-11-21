// Crypto Price: Bitcoin and Ether from CoinGecko's keyless public API.
// Keeps the last 48 prices in storage for the sparkline, and (with the alerts permission) says so in
// the Island when Bitcoin moves more than 5% in a day, at most once a day.

const URL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true";

function money(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function change(n) {
  const sign = n >= 0 ? "+" : "−";
  return sign + Math.abs(n).toFixed(1) + "%";
}

async function refresh() {
  try {
    const response = await monorail.fetch(URL, { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error("CoinGecko answered " + response.status);
    const data = JSON.parse(response.text);
    const btc = data.bitcoin, eth = data.ethereum;
    const history = (monorail.storage.get("history") || []).concat([btc.usd]).slice(-48);
    monorail.storage.set("history", history);
    monorail.state.set({
      btc: { price: money(btc.usd), change: change(btc.usd_24h_change), tint: btc.usd_24h_change >= 0 ? "green" : "red", history },
      eth: { price: money(eth.usd), change: change(eth.usd_24h_change), tint: eth.usd_24h_change >= 0 ? "green" : "red" },
      message: null
    });
    const today = new Date().toDateString();
    if (Math.abs(btc.usd_24h_change) >= 5 && monorail.storage.get("alerted") !== today) {
      monorail.storage.set("alerted", today);
      monorail.notify("Bitcoin " + change(btc.usd_24h_change) + " today", "Now " + money(btc.usd));
    }
  } catch (error) {
    monorail.state.set({ message: "Couldn't reach CoinGecko." });
    monorail.log("refresh failed: " + error);
  }
}

function onAction(action) {
  if (action === "open") monorail.openURL("https://www.coingecko.com/en/coins/bitcoin");
}
