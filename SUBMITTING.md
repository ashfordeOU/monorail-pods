# Submitting a pod

Thank you for building one. Every pod in this catalogue is read and tried by a person before it's listed,
so people can install it with confidence.

## Before you start

- Build it and try it in Monorail's **Pod Playground** until it works in each size you offer.
- Ask for as little as you can: only the hosts you really call, the slowest refresh that still makes
  sense, and the smallest storage. People see every permission before they install.
- Sign it with your own key (`scripts/pod keygen`, then `scripts/pod pack … --key`). Keep the key private
  and backed up: it's how Monorail knows an update came from you.

## The pull request

1. Fork this repository and add:
   - `pods/<name>/`: the source, exactly what you packed (`pod.json`, `main.js`, the layouts, `icon.png`,
     any pictures), plus a `LICENSE` file for your pod (MIT or another open licence) and, if you like, a
     `README.md`.
   - `packages/<name>.monorail-pod`: the signed package, packed from that folder.
   - An entry in `catalogue.json`:

     ```json
     {
       "id": "pod.com.example.weather",
       "kind": "pod",
       "title": "Weather",
       "summary": "Today's weather where you are.",
       "symbol": "cloud.sun",
       "author": "Example Ltd",
       "category": "Pods",
       "podID": "com.example.weather",
       "version": "1.0.0",
       "download": "https://raw.githubusercontent.com/ashfordeOU/monorail-pods/main/packages/weather.monorail-pod",
       "sha256": "<the package file's SHA-256, from scripts/pod inspect>",
       "publisherKey": "<your key's 16-digit id, from scripts/pod inspect>",
       "url": "https://github.com/ashfordeOU/monorail-pods/tree/main/pods/weather"
     }
     ```

2. In the pull request, say what it does, which hosts it calls and why, and anything a reviewer needs to
   try it (a free account, a test token). Never include a real token or key.

## What we check

- The package opens in Monorail, matches the source folder, and is signed; the catalogue's SHA-256 and
  key id match it.
- Its id is yours (reverse-DNS of a domain or account you control). Ids starting `org.ashforde.` or
  `com.ashforde.` are reserved.
- It does what it says, asks only for what it uses, and sends nothing personal anywhere it doesn't say.
- It's readable: no minified or obfuscated script, nothing fetched from the network and run as code.
- It's kind to the Mac: no tight loops, sensible refresh times.
- Its words are plain and its icon is your own.

We may ask for changes. Once it's merged, we add it to Monorail's add-on gallery.

## Updates

Bump `version` in `pod.json`, pack and sign with the same key, replace the package, and update the
version and `sha256` in `catalogue.json`. An update that asks for more (a new host, alerts, a secret)
shows people the review sheet again with just what's new.

## Removing a pod

Open a pull request that removes it, or an issue if you can't. We remove anything that turns out to be
unsafe, without waiting.
