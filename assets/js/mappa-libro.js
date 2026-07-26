/**
 * mappa-libro.js — interazione della variante "tappa-libro": l'intera
 * pergamena è chiusa da un sigillo al centro; rompendolo, le due metà
 * della pagina si aprono a libro (invece del sigillo che si spacca in
 * due pezzi che cadono, come nel layout "tappa" originale — vedi app.js,
 * che resta invariato e gestisce solo #seal, qui inesistente).
 */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", setupLibro);

  function setupLibro() {
    var card = document.getElementById("libroCard");
    var seal = document.getElementById("libroSeal");
    var cover = document.getElementById("libroCover");
    var content = document.getElementById("content");
    if (!card || !seal || !cover || !content) return;

    var reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    seal.addEventListener("click", function onBreak() {
      seal.removeEventListener("click", onBreak);
      seal.setAttribute("aria-pressed", "true");

      if (reduceMotion) {
        card.classList.add("is-open");
        content.classList.add("is-visible");
        cover.style.display = "none";
        return;
      }

      // 1) la ceralacca si crepa sotto pressione
      card.classList.add("is-cracking");

      // 2) un attimo dopo il sigillo cede e i due lembi della mappa si aprono
      setTimeout(function () {
        card.classList.remove("is-cracking");
        card.classList.add("is-open");
        content.classList.add("is-visible");
      }, 220);

      // 3) a lembi aperti, la copertina esce dal flusso
      setTimeout(function () {
        cover.style.display = "none";
      }, 1300);
    });
  }
})();
