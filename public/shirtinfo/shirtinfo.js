
document.addEventListener("DOMContentLoaded", function() {
    var shirtInfo = document.querySelector('.shirtinfo');
    shirtInfo.style.display = 'none';
});

function toggleShirtInfo() {
    var shirtInfo = document.querySelector('.shirtinfo');
    if (shirtInfo.style.display === 'none' || shirtInfo.style.display === '') {
        shirtInfo.style.display = 'block';
    } else {
        shirtInfo.style.display = 'none';
    }
}










let lista = document.getElementById('lista-imagenes');
let contador = document.getElementById('contador');
let botonMoverIzquierda = document.querySelector('.botonmoverizq');
let botonMoverDerecha = document.querySelector('.botonmoverder');
let scrollAmount = 310;
let currentIndex = 0;
let startX;

function actualizarContador() {
    contador.textContent = `${currentIndex + 1}/${lista.children.length}`;
}

function actualizarVisibilidadBotones() {
    botonMoverIzquierda.style.display = currentIndex === 0 ? 'none' : 'block';
    botonMoverDerecha.style.display = currentIndex === lista.children.length - 1 ? 'none' : 'block';
}

function handleTouchStart(e) {
    startX = e.touches[0].clientX;
}

function handleTouchMove(e) {
    if (!startX) return;

    let currentX = e.touches[0].clientX;
    let diffX = startX - currentX;

    if (diffX > 50) {
        moverDerecha();
        startX = null;
    } else if (diffX < -50) {
        moverIzquierda();
        startX = null;
    }
}

function moverDerecha() {
    if (currentIndex < lista.children.length - 1) {
        currentIndex++;
        lista.style.transform = `translateX(-${currentIndex * scrollAmount}px)`;
        actualizarContador();
        actualizarVisibilidadBotones();
    }
}

function moverIzquierda() {
    if (currentIndex > 0) {
        currentIndex--;
        lista.style.transform = `translateX(-${currentIndex * scrollAmount}px)`;
        actualizarContador();
        actualizarVisibilidadBotones();
    }
}

lista.addEventListener('touchstart', handleTouchStart);
lista.addEventListener('touchmove', handleTouchMove);

// Inicializar el contador y la visibilidad de los botones
actualizarContador();
actualizarVisibilidadBotones();















// Mostrar Datos 1 automáticamente al cargar la página
window.onload = function() {
mostrarDatos1();
};

// Función para mostrar datos 1
function mostrarDatos1() {
var datos = [
{ a: "S", b: 18, c: 28, d: 8.2 },
{ a: "M", b: 20, c: 29, d: 8.5 },
{ a: "L", b: 22, c: 30, d: 8.7 },
{ a: "XL", b: 24, c: 31, d: 9.1 },
{ a: "XXL", b: 26, c: 32, d: 9.2 },
{ a: "3XL", b: 28, c: 33, d: 9.5 },
];

actualizarTabla(datos, "encabezado1");
// Resaltar el botón seleccionado
document.getElementById("boton1").classList.add("active");
document.getElementById("boton2").classList.remove("active");
}

// Función para mostrar datos 2
function mostrarDatos2() {
var datos = [
{ a: "S", b: 45.7, c: 71.1, d: 20.9 },
{ a: "M", b: 50.8, c: 73.6, d: 21.6 },
{ a: "L", b: 55.9, c: 76.2, d: 22.2 },
{ a: "XL", b: 60.1, c: 78.7, d: 22.9 },
{ a: "XXL", b: 66.1, c: 81.3, d: 23.5 },
{ a: "3XL", b: 71.1, c: 83.9, d: 24.1 },
];

actualizarTabla(datos, "encabezado2");
// Resaltar el botón seleccionado
document.getElementById("boton1").classList.remove("active");
document.getElementById("boton2").classList.add("active");
}

// Función para actualizar la tabla con nuevos datos y encabezados
function actualizarTabla(datos, encabezadoId) {
// Ocultar todos los encabezados
document.getElementById("encabezado1").style.display = "none";
document.getElementById("encabezado2").style.display = "none";

// Mostrar el encabezado correspondiente al conjunto de datos
document.getElementById(encabezadoId).style.display = "table-header-group";

var cuerpoTabla = document.getElementById("cuerpoTabla");
cuerpoTabla.innerHTML = "";

for (var i = 0; i < datos.length; i++) {
var fila = cuerpoTabla.insertRow(i);
var celdaa = fila.insertCell(0);
var celdab = fila.insertCell(1);
var celdac = fila.insertCell(2);
var celdad = fila.insertCell(3);

celdaa.innerHTML = datos[i].a;
celdab.innerHTML = datos[i].b;
celdac.innerHTML = datos[i].c;
celdad.innerHTML = datos[i].d;

celdaa.innerHTML = '<strong>' + datos[i].a + '</strong>';
celdab.innerHTML = datos[i].b;
celdac.innerHTML = datos[i].c;
}
}

function toggleShirtInfo() {
    var shirtInfo = document.querySelector('.shirtinfo');
    if (shirtInfo.style.display === 'none' || shirtInfo.style.display === '') {
        shirtInfo.style.display = 'block';
        shirtInfo.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        shirtInfo.style.display = 'none';
    }
}
