"use strict";

// Catálogo de áreas del ERP (un área por sprint, D07).
// "ruta" es la pantalla del área; mientras sea null, la tarjeta solo avisa que está pendiente.
// Comercial: "comercial/index.html" se crea en S1-18 (Luis). Agregar áreas solo cuando el equipo acuerde su alcance.
const catalogo = [
  {
    nombre: "Comercial",
    descripcion: "Clientes, cotizaciones, anticipos y órdenes de venta",
    icono: "↗",
    etapa: "Sprint 1 · demos 05/11 a 19/11",
    ruta: null
  },
  {
    nombre: "Logística",
    descripcion: "Alcance por definir con su fuente",
    icono: "▦",
    etapa: "Fecha por confirmar",
    ruta: null
  }
];

// Sesión simulada (D12): solo nombre y rol, sin contraseña ni permisos reales.
// Se guarda en sessionStorage para que las pantallas de cada área sepan el rol
// (por ejemplo, Tesorería confirma anticipos). Se borra al salir o al cerrar la pestaña.
const CLAVE_SESION = "famihogar.sesion";

function leerSesion() {
  try {
    const guardada = sessionStorage.getItem(CLAVE_SESION);
    return guardada ? JSON.parse(guardada) : null;
  } catch {
    return null;
  }
}

function guardarSesion(sesion) {
  try {
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  } catch {
    // Si el navegador no permite guardar, la sesión vive solo en esta página.
  }
}

function borrarSesion() {
  try {
    sessionStorage.removeItem(CLAVE_SESION);
  } catch {
    // Nada que borrar.
  }
}

// Elementos de la página
const acceso = document.querySelector("#acceso");
const aplicaciones = document.querySelector("#aplicaciones");
const formulario = document.querySelector("#formulario-acceso");
const nombre = document.querySelector("#nombre");
const rol = document.querySelector("#rol");
const error = document.querySelector("#error");
const identidad = document.querySelector("#identidad");
const buscar = document.querySelector("#buscar");
const modulos = document.querySelector("#modulos");
const sinResultados = document.querySelector("#sin-resultados");
const estado = document.querySelector("#estado");

// Minúsculas y sin tildes, para que "logistica" encuentre "Logística".
function normalizar(texto) {
  return texto
    .trim()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function crearTarjeta(modulo) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "modulo";

  const partes = [
    ["icono", modulo.icono],
    ["nombre", modulo.nombre],
    ["descripcion", modulo.descripcion],
    ["etapa", modulo.etapa]
  ];
  for (const [clase, texto] of partes) {
    const elemento = document.createElement("span");
    elemento.className = clase;
    elemento.textContent = texto;
    if (clase === "icono") elemento.setAttribute("aria-hidden", "true");
    boton.append(elemento);
  }

  boton.addEventListener("click", () => {
    if (modulo.ruta) {
      window.location.href = modulo.ruta;
    } else {
      estado.textContent = `${modulo.nombre}: pantalla pendiente; se habilita cuando se conecte a la API.`;
    }
  });
  return boton;
}

function dibujarModulos() {
  const filtro = normalizar(buscar.value);
  const lista = catalogo.filter(modulo => normalizar(modulo.nombre).includes(filtro));
  modulos.replaceChildren(...lista.map(crearTarjeta));
  sinResultados.hidden = lista.length !== 0;
}

function mostrarAplicaciones(sesion) {
  identidad.textContent = `${sesion.nombre} · ${sesion.rol}`;
  acceso.hidden = true;
  aplicaciones.hidden = false;
  dibujarModulos();
  document.querySelector("#titulo-aplicaciones").focus();
}

function mostrarAcceso() {
  aplicaciones.hidden = true;
  acceso.hidden = false;
  formulario.reset();
  identidad.textContent = "";
  buscar.value = "";
  estado.textContent = "";
  nombre.focus();
}

formulario.addEventListener("submit", evento => {
  evento.preventDefault();
  if (!nombre.value.trim() || !rol.value) {
    error.textContent = "Escribe tu nombre y selecciona un rol.";
    nombre.focus();
    return;
  }
  error.textContent = "";
  const sesion = { nombre: nombre.value.trim(), rol: rol.value };
  guardarSesion(sesion);
  mostrarAplicaciones(sesion);
});

buscar.addEventListener("input", () => {
  estado.textContent = "";
  dibujarModulos();
});

document.querySelector("#salir").addEventListener("click", () => {
  borrarSesion();
  mostrarAcceso();
});

// Al volver desde la pantalla de un área (o al recargar), se conserva la sesión de la pestaña.
const sesionActual = leerSesion();
if (sesionActual && sesionActual.nombre && sesionActual.rol) {
  mostrarAplicaciones(sesionActual);
}
