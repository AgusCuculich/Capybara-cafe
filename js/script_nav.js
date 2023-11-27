let navegacion = document.querySelector(".barra_nav");

let btnMenu = document.querySelector("#btn-menu");
btnMenu.addEventListener("click", toggleMenu);

function toggleMenu() {
    navegacion.classList.toggle("elementoOculto");
}