# Monorail Pods

Pods are small add-ons for [Monorail](https://monorail.ashforde.org), the Mac app. A pod is a layout,
a short JavaScript file and a list of permissions, packed into one signed `.monorail-pod` file.
Monorail shows who made it and what it may do before it installs anything, runs it in a sandbox, and
draws it in its own style, in the Island and on the Dashboard among other places, wherever you allow.

This repository is the public catalogue: every listed pod's source, its packed file, and how to add yours.

## What's here

| Pod | What it does | Asks for |
| --- | --- | --- |
| [Headlines](pods/headlines) | The latest BBC News headlines, every 15 minutes. Tap one to read it. | feeds.bbci.co.uk |
| [Crypto Price](pods/crypto-price) | Bitcoin and Ether with the day's change and a line of recent prices. | api.coingecko.com |
| [GitHub Notifications](pods/github-notifications) | Your unread GitHub notifications and the latest few. | api.github.com, with your token kept in the Keychain |
| [World Word of the Day](pods/word-of-the-day) | A word from one of the world's languages each day. | Nothing: it never connects to the internet |

- `pods/<name>/`: each pod's source, as `scripts/pod pack` takes it (`pod.json`, `main.js`, `layout.json`, `icon.png`…).
- `packages/<name>.monorail-pod`: the packed file.
- `catalogue.json`: the list, in the same format as Monorail's add-on gallery (schema 1, pod entries only), with each package's SHA-256.

These four are built into Monorail, so you don't need to download them: open **Settings → Devices &
Sharing → Add-ons**, choose **Pods**, and click **Install…**.

## Install a pod

1. Download its `.monorail-pod` file from `packages/` (or from the page its author gives you).
2. Double-click it, or choose **Install from File…** in Monorail's add-on gallery.
3. Read the review sheet: who signed it and every permission it asks for. Nothing is installed until you agree.

A pod signed by a publisher you haven't trusted yet asks you to trust them first. Unsigned pods only
install with **Allow unsigned add-ons (developers)** turned on.

## Build a pod

The full guide, with every rule a package is checked against, is
[Build a pod](https://monorail.ashforde.org/addons/pods.html). In short:

```
my-pod/
  pod.json        id, name, version, author, description, icon, minMonorail, entry, layouts, permissions
  main.js         refresh() runs on a schedule; onAction(action, index) runs on a tap
  layout.json     stacks, rows, text, images, rings, bars, sparklines, buttons and lists, bound to your state
  icon.png        256 x 256
```

```js
async function refresh() {
  const response = await monorail.fetch("https://api.example.com/today");
  const data = JSON.parse(response.text);
  monorail.state.set({ title: data.title });
}
```

A pod can only reach the hosts it lists in `permissions.network` (https only), keep a little storage, and
open a link when you tap. It can't read your files, run programs or see other apps.

**Try it live.** Monorail's **Pod Playground** (Settings → Devices & Sharing → Add-ons → Pod Playground…)
runs the pod you're writing on the real runtime, with the same sandbox and limits, shows it as the Island
or the Dashboard would, and packs it. Turn on **Allow unsigned add-ons (developers)** first.

**Pack and sign** with `scripts/pod` from Monorail's repository (Python 3, nothing else needed):

```sh
scripts/pod keygen ~/keys/my-pods.key                    # once; keep the key private and backed up
scripts/pod pack my-pod/ -o packages/my-pod.monorail-pod --key ~/keys/my-pods.key
scripts/pod verify packages/my-pod.monorail-pod
scripts/pod inspect packages/my-pod.monorail-pod         # the file's SHA-256 and the content digest
```

## Add yours

See [SUBMITTING.md](SUBMITTING.md). In short: open a pull request with your pod's source in
`pods/<name>/`, its signed package in `packages/`, and its entry in `catalogue.json`. Every pod is read
and tried before it's listed.

## Licence

The catalogue, the four Ashforde pods and this documentation are under the [MIT licence](LICENSE),
© Ashforde OÜ. Each submitted pod keeps its own author's licence, stated in its folder. Monorail® is a
trademark of Ashforde OÜ.
