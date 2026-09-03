/**
 * auth-service.js
 * ---------------------------------------------------------
 * Toda la lógica de "¿son válidas estas credenciales?" vive
 * aquí, aislada de la interfaz. Hoy responde con datos de
 * demostración; el día que exista backend, solo se reemplaza
 * el cuerpo de login() por una llamada fetch() real.
 *
 * Contrato que debe respetar cualquier implementación futura:
 *   AuthService.login(email, password) -> Promise<{ ok, message }>
 * ---------------------------------------------------------
 */
window.FamiHogar = window.FamiHogar || {};

window.FamiHogar.AuthService = {

  async login(email, password){
    await wait(650); // simula latencia de red

    // --- Integración real (ejemplo con backend propio) ---
    // const res = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // });
    // const data = await res.json();
    // return { ok: res.ok, message: data.message };

    const DEMO_USER = "admin@famihogar.pe";
    const DEMO_PASS = "famihogar123";

    if(email.toLowerCase() === DEMO_USER && password === DEMO_PASS){
      return { ok: true, message: "Bienvenido de nuevo." };
    }
    return { ok: false, message: "Usuario o contraseña incorrectos." };
  }

};

function wait(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}
