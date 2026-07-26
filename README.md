# 🗺️ La Mappa del Malandrino — Caccia al Tesoro (versione Jekyll)

Stessa Mappa del Malandrino di prima (pergamena, sigillo di ceralacca che si
spacca in due, orme che camminano su tutta la pagina), ma ora costruita con
**Jekyll**: il motore di siti statici che GitHub Pages sa compilare da solo,
senza bisogno di configurare nessuna build.

## Perché Jekyll

- **Zero configurazione su GitHub Pages**: basta fare push del repository,
  GitHub lo compila automaticamente. Non serve Node, non serve una GitHub
  Action.
- **Un solo layout, zero HTML ripetuto**: la pergamena, il sigillo e le orme
  sono scritti una sola volta (`_layouts/tappa.html`, `_includes/`). Ogni
  pagina di tappa è solo una manciata di righe di dati.
- **Niente più problema del `file://`**: nella versione precedente il
  contenuto veniva caricato via `fetch()` di un file `.json`, il che
  impediva di aprire le pagine con un doppio click. Ora il contenuto viene
  scritto dentro l'HTML già in fase di build: le pagine funzionano ovunque
  vengano servite, anche da un hosting statico "semplice".

## Struttura del progetto

```
_config.yml           → configurazione minima del sito
Gemfile                → per testare in locale con le stesse identiche versioni di GitHub Pages
_layouts/
  tappa.html            → l'UNICO template: pergamena + sigillo + orme + contenuto
_includes/
  foottrail.html         → le orme che camminano su tutta la pagina
  seal.html               → il sigillo di ceralacca (crepa, due metà, frammenti)
assets/
  css/style.css           → stile condiviso (invariato rispetto a prima)
  js/app.js                → interazione del sigillo (niente più fetch)

index.html             → HOME — front matter con i dati, il resto lo fa il layout
tappa1-yf81joVDNqHTmSAbB7WR.html         → Tappa 1
tappa2-76v1FjHo3eOApWnmPuJ0.html         → Tappa 2
tappa-finale-TgXA32wM1ym4qnJe6fHp.html   → Tappa finale
chiusura.html          → Pagina di chiusura
```

## Come funziona una pagina di tappa

Ogni pagina è solo **front matter** (i dati tra `---`), niente HTML:

```yaml
---
layout: tappa
title: "Tappa 1 · Il Verdetto di Azkaban"   # titolo nella scheda del browser
heading: "🗝️ Il Verdetto di Azkaban"        # titolo grande sulla pergamena
eyebrow: "Tappa 1"                           # etichetta piccola sopra il titolo
intro: "📜 La Sentenza"                       # sottotitolo
paragraphs:                                  # uno o più paragrafi di testo
  - "Primo paragrafo…"
  - "Secondo paragrafo…"
mission:                                     # opzionale: riquadro rosso "missione foto"
  label: "📸 Missione Foto"
  text: "Testo della missione"
destination:                                 # opzionale: riquadro dorato "meta finale"
  label: "📍 La Meta"
  text: "Indirizzo del luogo"
  requirement: "Eventuale requisito d'ingresso"
footerNote: "Piccola nota in corsivo in fondo"
---
```

Usa `mission` **oppure** `destination`, non servono entrambi sulla stessa tappa.

## Come aggiungere una tappa intermedia

1. Crea un nuovo file, es. `tappa1b-<20 caratteri alfanumerici casuali>.html`
   (il suffisso casuale serve a rendere l'URL non indovinabile: chi ha il
   link della tappa precedente non può "saltare avanti" tentando nomi ovvi).
2. Incollaci un front matter come quello sopra, con i tuoi contenuti.
3. Fatto. Non c'è nient'altro da toccare: nessun HTML da copiare, nessuno
   script da aggiornare. Il layout condiviso fa tutto il resto.

## Come testare in locale (opzionale)

Serve Ruby (una volta sola):

```bash
bundle exec jekyll serve --host 0.0.0.0 --livereload
```

poi apri `http://localhost:4000`. Ogni modifica ai file viene ricompilata
automaticamente.

Se non vuoi installare Ruby, puoi anche solo modificare i file e pubblicarli
direttamente: GitHub Pages farà la build al posto tuo (vedi sotto).

## Come pubblicare su GitHub Pages

1. Crea un repository su GitHub e caricaci tutti questi file (root del repo).
2. Vai su **Settings → Pages**, in "Build and deployment" scegli
   **Deploy from a branch**, seleziona il branch `main` e la cartella `/ (root)`.
3. Dopo un minuto il sito sarà live su `https://tuonome.github.io/nome-repo/`.

Se pubblichi come **Project Page** (l'URL contiene `/nome-repo/`), apri
`_config.yml` e scommenta/imposta:

```yaml
baseurl: "/nome-repo"
```

altrimenti i link a CSS e JS non si caricheranno correttamente. Se invece usi
un dominio personalizzato o un sito utente (`tuonome.github.io`), lascialo
commentato.

## Alternative gratuite a GitHub Pages

Anche **Netlify** e **Vercel** sanno buildare Jekyll: basta collegare il
repository e impostare come comando di build `bundle exec jekyll build` e
come cartella di pubblicazione `_site`. Utile se preferisci quei servizi o
se vuoi un URL di anteprima diverso da quello di GitHub.

## Ricordati di

Inserire l'indirizzo reale della Piscina Currule nel campo `destination.text`
di `tappa-finale-TgXA32wM1ym4qnJe6fHp.html` (ora c'è un segnaposto tra parentesi quadre).
