import $ from "jquery";
import "../styles/navbarTop.css";
import { searchArticles } from "./searchResults";

function loadNavbarTop() {
  const navbarHTML = `
    <section id="navbar-top-wrap">
      <section id="nav-date-wrap">
        <span id="nav-date"></span>
      </section>

      <section id="nav-search">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="currentColor" fill-rule="evenodd" d="M18.319 14.433A8.001 8.001 0 0 0 6.343 3.868a8 8 0 0 0 10.564 11.976l.043.045l4.242 4.243a1 1 0 1 0 1.415-1.415l-4.243-4.242zm-2.076-9.15a6 6 0 1 1-8.485 8.485a6 6 0 0 1 8.485-8.485"/>
        </svg>
        <input 
          id="search-field" 
          type="text" 
          placeholder="BUSCAR"
        >
      </section>
    </section>
  `;
  $("#navbar-top").html(navbarHTML);

  // Adicionando a função de clique ao ícone de busca
  $("#nav-search svg").on("click", function () {
    const searchField = $("#search-field");
    const navDateWrap = $("#nav-date-wrap");
    const navSearch = $("#nav-search");

    if (searchField.css("display") === "none") {
      searchField.css("display", "block");
      if ($(window).width() <= 620) {
        navSearch.addClass("expanded");
        navDateWrap.addClass("hidden");
      }
    } else {
      searchField.css("display", "none");
      navSearch.removeClass("expanded");
      navDateWrap.removeClass("hidden");
    }
  });

  $("#search-field").on("keypress", function (e) {
    if (e.which === 13) { // Enter key
      const query = $(this).val();
      searchArticles(query);
    }
  });
}

// API de data, World Time API
function loadDate() {
  $.ajax({
    url: "https://worldtimeapi.org/api/timezone/America/Sao_Paulo",
    method: "GET",
    success: function (response) {
      const currentDateTime = new Date(response.datetime);
      const formattedDate = currentDateTime.toLocaleString("pt-BR", {
        weekday: "long",
        // year: "numeric",
        month: "long",
        day: "numeric",
      });
      $("#nav-date").html(`${formattedDate}`);
    },
    error: function (err) {
      console.error("Erro ao obter a data: ", err);
    },
  });
}

document.addEventListener("DOMContentLoaded", function () {
  loadNavbarTop();
  loadDate();
});
