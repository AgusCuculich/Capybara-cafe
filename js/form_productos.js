"use strict";

let captcha = captchaGen();
document.querySelector("#captchaGenerador").innerHTML = captcha.join(" ");

let btnAceptar = document.querySelector("#btn-aceptar");
btnAceptar.addEventListener("click", verificarCaptcha);

let btnEnviar = document.querySelector("#btn-enviar");

let btnReset = document.querySelector("#btn-reset");
btnReset.addEventListener("click", resetearCaptcha);

let form = document.querySelector("#form_venta");
form.addEventListener("submit", cancelarEnvio);

let parrafo = document.querySelector("#parrafoOculto");




function cancelarEnvio(e) {
    e.preventDefault();
    form.classList.toggle("elementoOculto");
    parrafo.classList.toggle("elementoOculto");
}


function crearArr(max_size) {
    let arr = [];
    for (let i = 0; i < max_size; i++) {
        arr[i] = Math.floor(Math.random() * 10);
    }
    return arr;
}

function captchaGen() {
    const max_size = 6;
    let arreglo = crearArr(max_size);
    return arreglo;
}

function verificarCaptcha() {
    let suma = 0;
    let captchaIngresado = conversionCaptcha();
    if (captchaIngresado.length === captcha.length) {
        for (let i = 0; i < captchaIngresado.length; i++) {
            if (captcha[i] == captchaIngresado[i]) {
                suma++;
            }
        }
    } else {
        document.querySelector("#captcha").value = "";
        document.querySelector("#captcha").placeholder = "Captcha inválido";
    }
    if (suma === captcha.length) {
        btnEnviar.classList.toggle("elementoOculto")
    } else if (suma != captcha.length && suma != 0) {
        document.querySelector("#captcha").value = "";
        document.querySelector("#captcha").placeholder = "Captcha incorrecto";
    }
}

function conversionCaptcha() {
    let ingresoUsuario = document.querySelector("#captcha").value;
    let arrCaptchaIngresado = [];
    for (let i = 0; i < ingresoUsuario.length; i++) {
        arrCaptchaIngresado.push(ingresoUsuario.charAt(i));
    }
    return arrCaptchaIngresado;
}


function resetearCaptcha() {
    captcha = captchaGen();
    document.querySelector("#captchaGenerador").innerHTML = captcha.join(" ");
    btnEnviar.classList.add("elementoOculto");
}