(() => {
  "use strict";

  if (window.FAMIHOGAR_OMITIR_DEMO || !window.FAMIHOGAR_DATOS_DEMO) return;

  const registros = Object.entries(window.FAMIHOGAR_DATOS_DEMO);
  const leer = () => Object.fromEntries(registros.map(([clave]) => [clave, localStorage.getItem(clave)]));

  function guardar(anteriores) {
    const escritos = [];
    try {
      for (const [clave, datos] of registros) {
        localStorage.setItem(clave, JSON.stringify(datos));
        escritos.push(clave);
      }
    } catch (error) {
      for (const clave of escritos) {
        const anterior = anteriores[clave];
        if (anterior === null) localStorage.removeItem(clave);
        else localStorage.setItem(clave, anterior);
      }
      throw error;
    }
  }

  function grupoVacio(guardado, modelo) {
    if (guardado === null) return true;
    const datos = JSON.parse(guardado);
    const tablas = Object.keys(modelo).filter(k => Array.isArray(modelo[k]));
    return datos?.version === modelo.version && tablas.every(k => Array.isArray(datos[k]) && !datos[k].length);
  }

  function prepararCarga(formulario) {
    const respaldo = formulario.querySelector("#descargar-respaldo");
    const aplicar = formulario.querySelector("button[type=submit]");
    const estado = formulario.querySelector("[role=status]");
    let copia;
    respaldo.disabled = false;

    respaldo.addEventListener("click", () => {
      try {
        copia = leer();
        const creado = new Date().toISOString();
        const archivo = { formato: "famihogar-respaldo-v1", origen: location.origin, creado, datos: copia };
        const url = URL.createObjectURL(new Blob([JSON.stringify(archivo, null, 2)], { type: "application/json" }));
        const enlace = document.createElement("a");
        enlace.href = url;
        enlace.download = "famihogar-respaldo-" + creado.replace(/[:.]/g, "-") + ".json";
        enlace.click();
        setTimeout(() => URL.revokeObjectURL(url), 30000);
        aplicar.disabled = false;
        estado.textContent = "Comprueba que el respaldo se descargó antes de reemplazar los registros.";
      } catch {
        copia = null;
        aplicar.disabled = true;
        estado.textContent = "No se pudo preparar el respaldo de los datos locales.";
      }
    });

    formulario.addEventListener("submit", evento => {
      evento.preventDefault();
      if (!copia) return;
      try {
        const actuales = leer();
        if (registros.some(([clave]) => actuales[clave] !== copia[clave])) {
          aplicar.disabled = true;
          estado.textContent = "Los datos cambiaron en otra pestaña. Descarga un respaldo actualizado para continuar.";
          return;
        }
        guardar(actuales);
        respaldo.disabled = true;
        aplicar.disabled = true;
        const tablas = registros.flatMap(([, datos]) => Object.values(datos).filter(Array.isArray));
        const total = tablas.reduce((suma, tabla) => suma + tabla.length, 0);
        estado.textContent = "Carga completada. " + total + " registros guardados en " + tablas.length + " tablas.";
      } catch {
        estado.textContent = "No se pudo completar la carga. Puedes volver a intentarlo.";
      }
    });
  }

  const formulario = document.querySelector("#formulario-demo");
  if (formulario) {
    prepararCarga(formulario);
    return;
  }

  try {
    const anteriores = leer();
    if (registros.every(([clave, modelo]) => grupoVacio(anteriores[clave], modelo))) guardar(anteriores);
  } catch (error) {
    console.warn("No se pudo inicializar la demostración del ERP.", error);
  }
})();
