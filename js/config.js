/**
 * config.js
 * ---------------------------------------------------------
 * Parámetros ajustables del login. Se agrupan aquí para que
 * cambiar un límite, una clave de almacenamiento o un texto
 * no obligue a tocar la lógica de auth-service.js ni ui.js.
 * ---------------------------------------------------------
 */
window.FamiHogar = window.FamiHogar || {};

window.FamiHogar.CONFIG = {
  // Intentos fallidos permitidos antes de bloquear el formulario
  maxAttempts: 5,

  // Duración del bloqueo, en milisegundos
  lockoutMs: 30000,

  // Claves usadas en localStorage (evita strings sueltos por el código)
  storageKeys: {
    remember:  "famihogar_remember_email",
    attempts:  "famihogar_login_attempts",
    lockUntil: "famihogar_lock_until"
  }
};
