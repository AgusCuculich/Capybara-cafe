"use strict";
document.addEventListener("DOMContentLoaded", main);


//variables globales que serán utilizadas por varios procesos a lo largo del código.
let reservas = [];
let form = document.querySelector("#form");
const capacidad = 16;

function main() {
    // declaracion de variable
    let btnMenos = document.querySelector("#btn_menos");
    let btnMas = document.querySelector("#btn_mas");
    let btnTres = document.querySelector("#btn_tres");
    let date = new Date;
    let diaHoy = date.getDate();
    let ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();


    //declaración funciones iniciales
    cargarTabla();
    cargarDias(diaHoy, ultimoDia);
    cargarObj(diaHoy);
    cargarMesas();
    console.table(reservas);


    //eventos
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let mensaje = document.querySelector(".mensaje");
        let formData = new FormData(form);
        let dia = formData.get("dia_escogido");
        let infoCliente = obtenerDatos(formData);
        let posicionArr = recorrerArr(dia);
        let mesasActuales = reservas[posicionArr].totalMesas - infoCliente.mesas;
        mensaje.classList.add("elementoOculto");
        if (mesasActuales < 0) {
            mostrarMensaje(mensaje);
        } else {
            descontarMesas(dia, infoCliente, posicionArr);
            let indiceCliente = reservas[posicionArr].clientes.push(infoCliente) - 1;
            let resumen = document.querySelector("#resumenBody");
            añadirFila(infoCliente, resumen, dia);
            let btnEliminarTabla = document.querySelector("#btn_eliminar_tabla");
            btnEliminarTabla.classList.remove("elementoOculto");
            btnEliminarTabla.addEventListener("click", function(e) {
                borrarTabla(resumen, diaHoy, btnEliminarTabla);
            });
        }
    });


    btnMas.addEventListener("click", function (e) {
        adicion(1);
    });

    btnMenos.addEventListener("click", function (e) {
        adicion(-1);
    });

    btnTres.addEventListener("click", function (e) {
        adicion(3);
    });


}


function borrarTabla(resumen, diaHoy, btnEliminarTabla) {
    resumen.innerHTML = ``;
    reservas = [];
    cargarObj(diaHoy);
    cargarMesas();
    btnEliminarTabla.classList.add("elementoOculto");
}


function añadirFila(infoCliente, resumen, dia) {
    let atributosObj = Object.values(infoCliente);
    let filaNueva = resumen.insertRow(-1);
    let celdaNueva = -1;
    for (let i = 1; i < atributosObj.length; i++) {
        celdaNueva = filaNueva.insertCell(-1);
        celdaNueva.innerHTML = atributosObj[i];
    }
    celdaNueva.innerHTML = `<button type="button" class="btn_eliminar_fila">-</button>`;



    let boton = celdaNueva.querySelector(".btn_eliminar_fila");
    
    boton.addEventListener("click", function (e) {
        let fila = this.parentElement;
        fila.parentElement.remove();

        eliminarReserva(dia, infoCliente.id);
    });
}


function recorrerArr(dia) {
    //Encuentra el dia ingresado por el usuario dentro del objeto.
    let i = 0;
    let encontrado = false;
    while (i < reservas.length && !encontrado) {
        if (dia == reservas[i].dia) {
            encontrado = true;
        }
        i++;
    }
    return (encontrado) ? i - 1 : -1;
}


function descontarMesas(diaIngresado, infoCliente, posicionArr) {
    let pos = 0;
    let dias = document.querySelectorAll(".dia");
    while (pos < dias.length && dias[pos].innerHTML != diaIngresado) {
        pos++;
    }

    reservas[posicionArr].totalMesas -= infoCliente.mesas;

    let mesasDisponibles = Number(dias[pos].nextElementSibling.innerHTML);
    dias[pos].nextElementSibling.innerHTML = reservas[posicionArr].totalMesas;
}


function mostrarMensaje(mensaje) {
    mensaje.classList.remove("elementoOculto");
}


function obtenerDatos(formData) {
    let infoCliente = {
        "id": Date.now().toPrecision(),
        "nombre": formData.get("nombre"),
        "apellido": formData.get("apellido"),
        "mesas": Number(formData.get("cant_mesas")),
        "telefono": formData.get("telefono"),
    }
    return infoCliente;
}

function cargarObj(dia) {
    let diasCalendario = document.querySelectorAll(".dia");
    for (let i = 0; i < diasCalendario.length; i++) {
        reservas.push({ "dia": dia, "clientes": [], totalMesas: capacidad});
        dia++;
    }
    precargarArr();
}


function cargarMesas() {
    let mesas = document.querySelectorAll(".mesas");
    for (let i = 0; i < mesas.length; i++) {
        mesas[i].innerHTML = reservas[i].totalMesas;
    }
}


function cargarDias(dia, ultimoDia) {
    let celdas = document.querySelector(".diasCalendario").getElementsByTagName("td");
    for (let i = 0; i < celdas.length; i++) {
        celdas[i].setAttribute('name', dia);
        celdas[i].innerHTML = `<p class="dia">${dia}</p>` + `<p class="mesas"></p>`;
        if (dia === ultimoDia) {
            dia = 1;
        } else {
            dia++;
        }
    }
}


function cargarTabla() {
    const maxFila = 3;
    let calendario = document.querySelector(".diasCalendario");
    let filaNueva = calendario.insertRow(-1);
    let columna = 1;
    for (let fila = 1; fila <= maxFila; fila++) {
        while (columna <= 7) {
            let celdaNueva = filaNueva.insertCell();
            columna++;
        }
        if (fila < maxFila) {
            filaNueva = calendario.insertRow(-1);
            columna = 1;
        }
    }
}


function eliminarReserva(dia, idCliente) {
    let indiceReserva = recorrerArr(dia);
    let indiceCliente = reservas[indiceReserva].clientes.findIndex(cliente => cliente.id == idCliente);
    let datosReserva = reservas[indiceReserva].clientes.splice(indiceCliente, 1);
    reservas[indiceReserva].totalMesas += datosReserva[0].mesas;
    actualizarDia(dia);
}





function actualizarDia(dia) {
    let reserva = reservas.find((reserva) => reserva.dia == dia);
    let celda = document.querySelector(`.diasCalendario [name="${dia}"]`);
    celda.innerHTML = `<p class="dia" dia="${dia}">${dia}</p>` + `<p class="mesas">${reserva.totalMesas}</p>`;
}

function adicion(num) {
    /*Se encarga de sumar -1, 1 0 3 a lo que haya en el input de cant_mesas (que al iniciar la pagina por 
    default será 0). Agarra el valor que este en el input y lo almacenar en una variable a la que se le 
    sumara el num y luego mostraará dentro del DOM la variable obtenida... este proceso se repetira cada 
    vez que el usuario sume o reste un valor (de manera que siempre se mostrara el ultimo cambio en la 
    variable).*/
    let mesasReservada = Number(document.querySelector("#cant_mesas").value);
    mesasReservada += num;
    document.querySelector("#cant_mesas").value = mesasReservada;
}


function precargarArr() {
    let clientes = [{
        "nombre": "Justo",
        "apellido": "Bolsa",
        "mesas": 2,
        "telefono": 22222222,
    }, {
        "nombre": "Martina",
        "apellido": "Martinez",
        "mesas": 2,
        "telefono": 333333,
    }];
    reservas[0].clientes.push(clientes);
    reservas[0].totalMesas = 12;
}