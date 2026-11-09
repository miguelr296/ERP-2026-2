"use strict";

const formulario = document.querySelector("#selector-catalogo");
const canal = document.querySelector("#canal");
const tipoCliente = document.querySelector("#tipo-cliente");
const botonSinLista = document.querySelector("#probar-sin-lista");
const estado = document.querySelector("#estado-catalogo");
const productos = document.querySelector("#productos-catalogo");

function crearCelda(texto) {
  const celda = document.createElement("td");
  celda.textContent = texto;
  return celda;
}

function mostrarProductos(lista) {
  const filas = lista.map(producto => {
    const fila = document.createElement("tr");
    const precio = new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: producto.moneda
    }).format(producto.precioUnitario);

    fila.append(
      crearCelda(producto.codigo),
      crearCelda(`${producto.nombre} · ${producto.unidad}`),
      crearCelda(precio),
      crearCelda(producto.listaPrecio),
      crearCelda(`${producto.vigenteDesde} a ${producto.vigenteHasta}`)
    );
    return fila;
  });

  productos.replaceChildren(...filas);
}

async function consultarCatalogo(evento) {
  evento?.preventDefault();
  estado.textContent = "Consultando el catálogo…";
  productos.replaceChildren();

  const parametros = new URLSearchParams({
    canal: canal.value,
    tipoCliente: tipoCliente.value
  });

  try {
    const respuesta = await fetch(`/api/catalogo?${parametros}`);
    if (!respuesta.ok) {
      throw new Error("La API no pudo responder la consulta.");
    }

    const lista = await respuesta.json();
    mostrarProductos(lista);
    estado.textContent = lista.length > 0
      ? `Se encontraron ${lista.length} productos para ${canal.value} · ${tipoCliente.value}.`
      : `No hay productos configurados para ${canal.value} · ${tipoCliente.value}. El caso sin lista queda preparado.`;
  } catch {
    estado.textContent = "No se pudo consultar el catálogo. Comprueba que la API esté en marcha e inténtalo de nuevo.";
  }
}

formulario.addEventListener("submit", consultarCatalogo);

botonSinLista.addEventListener("click", () => {
  canal.value = "Tienda";
  tipoCliente.value = "Empresarial";
  consultarCatalogo();
});

consultarCatalogo();
