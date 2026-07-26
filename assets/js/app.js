/**
 * app.js — logica condivisa per tutte le pagine della Mappa del Malandrino.
 *
 * Con Jekyll il contenuto di ogni tappa è già presente nell'HTML generato
 * in fase di build (a partire dal front matter della singola pagina), quindi
 * qui non serve più alcun fetch: resta solo l'animazione delle orme.
 * L'interazione del sigillo/apertura a libro è in mappa-libro.js.
 */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", setupFoottrail);

  function setupFoottrail() {
    var camminatori = window.CAMMINATORI || [];
    var trails = document.querySelectorAll(".trail");
    if (!camminatori.length || !trails.length) return;

    // durata (s) e numero di passi "normale" di ciascun corridoio: deve
    // combaciare con l'animation-duration e lo steps(..., N) di fallback
    // in style.css per ogni .trail--X
    var DURATIONS = { a: 10, b: 11 };
    var BASE_STEPS = { a: 36, b: 40 };
    // ritardo "di base" (s) di ciascun corridoio, quello con cui la
    // sequenza di quel trail è sfalsata dall'altro (vedi il valore
    // -5.5s inline in foottrail.html)
    var BASE_DELAY = { a: 0, b: -5.5 };
    // "s" (piedino) fa più passi, più corti, sullo stesso corridoio:
    // un'andatura più incerta invece di una falcata lunga e sicura
    var SMALL_STEP_MULTIPLIER = 2.3;

    // nome attualmente mostrato per ciascun corridoio (data-trail),
    // così da non pescarne mai uno già in uso da un altro corridoio
    var current = {};

    // "sacchetto" condiviso tra i corridoi: un giro casuale di TUTTI i
    // camminatori, consumato in ordine, senza ripetizioni finché non
    // sono passati tutti — quando si svuota viene rimescolato da capo.
    // Pescare a caso ad ogni giro (come prima) poteva far ripetere lo
    // stesso nome molte volte prima che altri comparissero anche solo
    // una volta; questo garantisce che ognuno passi prima di rivedersi.
    var bag = [];
    var lastOut = null;

    function refillBag() {
      bag = camminatori.slice();
      for (var i = bag.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = bag[i]; bag[i] = bag[j]; bag[j] = tmp;
      }
      // evita che il primo del nuovo giro sia proprio l'ultimo pescato
      // dal giro precedente (altrimenti si vedrebbe un mini "doppione"
      // proprio a cavallo del rimescolamento)
      if (bag.length > 1 && bag[0].nome === lastOut) {
        var swapWith = 1 + Math.floor(Math.random() * (bag.length - 1));
        var t = bag[0]; bag[0] = bag[swapWith]; bag[swapWith] = t;
      }
    }

    // pesca il prossimo del sacchetto, saltando chi è già in uso su un
    // altro corridoio in questo stesso istante (per non mostrare due
    // volte la stessa persona contemporaneamente); resta comunque nel
    // sacchetto per essere pescato più avanti, non viene scartato
    function drawFromBag(exclude) {
      if (!bag.length) refillBag();
      var idx = 0;
      for (var i = 0; i < bag.length; i++) {
        if (exclude.indexOf(bag[i].nome) === -1) { idx = i; break; }
      }
      var pick = bag.splice(idx, 1)[0];
      lastOut = pick.nome;
      return pick;
    }

    trails.forEach(function (trail) {
      var id = trail.getAttribute("data-trail");
      var nameEl = trail.querySelector(".foot-name__text");
      var syncEl = trail.querySelector(".foot-name");
      var frontMarks = trail.querySelectorAll(".foot:not(.foot--back) .foot__mark");
      var backMarks = trail.querySelectorAll(".foot--back .foot__mark");
      var feet = trail.querySelectorAll(".foot");

      assign(id, nameEl, frontMarks, backMarks, feet);
      if (syncEl) {
        syncEl.addEventListener("animationiteration", function () {
          assign(id, nameEl, frontMarks, backMarks, feet);
        });
      }
    });

    function assign(id, nameEl, frontMarks, backMarks, feet) {
      var others = Object.keys(current)
        .filter(function (k) { return k !== id; })
        .map(function (k) { return current[k]; });

      var pick = drawFromBag(others);
      current[id] = pick.nome;

      var tipo = pick.tipo || "l";
      frontMarks.forEach(function (mark) {
        mark.classList.remove("foot__mark--l", "foot__mark--s", "foot__mark--d");
        mark.classList.add("foot__mark--" + tipo);
      });
      // "d" (quadrupede) e "s" (bimbo che gattona) mostrano anche la
      // coppia posteriore — zampe per "d", piedini per "s"; per "l"
      // restano senza classe, quindi invisibili
      backMarks.forEach(function (mark) {
        mark.classList.remove("foot__mark--l", "foot__mark--s-foot", "foot__mark--d");
        if (tipo === "d") mark.classList.add("foot__mark--d");
        else if (tipo === "s") mark.classList.add("foot__mark--s-foot");
      });

      // distanza dell'etichetta dal gruppo, calibrata per tipo: le
      // orme non sono tutte della stessa taglia (l arriva a ~46px, d
      // a ~20px, le mani di s sono ancora più piccole). Ora che sia
      // l'orma che il testo sono correttamente centrati sul proprio
      // punto di ancoraggio, la distanza deve coprire metà dell'orma
      // PIÙ metà dell'altezza del testo, altrimenti si sovrappongono.
      var NAME_LIFT = { l: "-40px", s: "-24px", d: "-27px" };
      if (nameEl) {
        nameEl.textContent = pick.nome;
        nameEl.style.setProperty("--name-lift", NAME_LIFT[tipo] || "-28px");
      }

      var duration = DURATIONS[id] || 10;
      var steps = BASE_STEPS[id] || 30;
      if (tipo === "s") steps = Math.round(steps * SMALL_STEP_MULTIPLIER);
      var baseDelay = BASE_DELAY[id] || 0;
      // metà di un passo: è questo scarto tra sinistra e destra che fa
      // leggere l'andatura come alternata invece che sincronizzata, e va
      // ricalcolato ogni volta che "steps" cambia (es. con "s")
      var halfStride = duration / (2 * steps);

      if (nameEl) {
        nameEl.parentElement.style.setProperty("--stepcount", steps);
        // a metà strada tra il ritardo del piede sinistro e quello del
        // destro: se il nome seguisse solo il sinistro, nell'istante in
        // cui i due piedi sono a punti diversi del passo (è così quasi
        // sempre, è l'alternanza) il nome sembrerebbe sbilanciato verso
        // quel lato — tanto più quanto più lungo è il passo (l/d)
        var nameMoveDelay = baseDelay + halfStride / 2;
        nameEl.parentElement.style.animationDelay = nameMoveDelay + "s, " + baseDelay + "s";
      }

      feet.forEach(function (foot) {
        foot.style.setProperty("--stepcount", steps);
        var isRight = foot.classList.contains("foot--right");
        var moveDelay = baseDelay + (isRight ? halfStride : 0);
        foot.style.animationDelay = moveDelay + "s, " + baseDelay + "s";
      });
    }
  }
})();
