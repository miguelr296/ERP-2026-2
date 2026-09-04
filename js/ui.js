/**
 * ui.js
 * ---------------------------------------------------------
 * Controla el formulario: validación, estados visuales,
 * candado por intentos y el modal de recuperación.
 * No conoce cómo se valida una contraseña contra el backend;
 * eso se lo pide a FamiHogar.AuthService.
 * ---------------------------------------------------------
 */
(function(){
  "use strict";

  const CONFIG = window.FamiHogar.CONFIG;
  const AuthService = window.FamiHogar.AuthService;

  /* ---------------- DOM refs ---------------- */
  const form          = document.getElementById("loginForm");
  const emailInput    = document.getElementById("email");
  const passInput     = document.getElementById("password");
  const emailError    = document.getElementById("emailError");
  const passError     = document.getElementById("passwordError");
  const submitBtn     = document.getElementById("submitBtn");
  const banner        = document.getElementById("formBanner");
  const rememberBox   = document.getElementById("remember");
  const toggleBtn     = document.getElementById("togglePassword");
  const eyeIcon       = document.getElementById("eyeIcon");

  const forgotLink     = document.getElementById("forgotLink");
  const modalOverlay   = document.getElementById("modalOverlay");
  const modalCancel    = document.getElementById("modalCancel");
  const modalSend      = document.getElementById("modalSend");
  const recoverEmail   = document.getElementById("recoverEmail");
  const recoverSuccess = document.getElementById("recoverSuccess");

  /* ---------------- Init ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    const savedEmail = localStorage.getItem(CONFIG.storageKeys.remember);
    if(savedEmail){
      emailInput.value = savedEmail;
      rememberBox.checked = true;
    }
    reflectLockState();
  });

  function reflectLockState(){
    const lockUntil = Number(localStorage.getItem(CONFIG.storageKeys.lockUntil) || 0);
    const remaining = lockUntil - Date.now();
    if(remaining > 0){
      lockForm(remaining);
    }
  }

  function lockForm(ms){
    submitBtn.disabled = true;
    showBanner("lock", `Demasiados intentos. Vuelve a intentarlo en ${Math.ceil(ms / 1000)} s.`);
    setTimeout(() => {
      submitBtn.disabled = false;
      hideBanner();
      localStorage.removeItem(CONFIG.storageKeys.lockUntil);
      localStorage.removeItem(CONFIG.storageKeys.attempts);
    }, ms);
  }

  /* ---------------- Validación ---------------- */
  function isValidEmail(value){
    // acepta correos o nombres de usuario simples
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^[a-zA-Z0-9._-]{3,}$/.test(value);
  }

  function validateField(input, errorEl, condition){
    input.setAttribute("aria-invalid", String(!condition));
    errorEl.classList.toggle("show", !condition);
    return condition;
  }

  function clearFieldError(input, errorEl){
    input.setAttribute("aria-invalid", "false");
    errorEl.classList.remove("show");
  }

  emailInput.addEventListener("input", () => clearFieldError(emailInput, emailError));
  passInput.addEventListener("input", () => clearFieldError(passInput, passError));

  /* ---------------- Mostrar / ocultar contraseña ---------------- */
  toggleBtn.addEventListener("click", () => {
    const showing = passInput.type === "text";
    passInput.type = showing ? "password" : "text";
    toggleBtn.setAttribute("aria-label", showing ? "Mostrar contraseña" : "Ocultar contraseña");
    eyeIcon.style.opacity = showing ? "1" : ".55";
  });

  /* ---------------- Banner de estado ---------------- */
  function showBanner(kind, message){
    banner.textContent = message;
    banner.className = `form-banner show ${kind}`;
  }
  function hideBanner(){
    banner.className = "form-banner";
    banner.textContent = "";
  }

  /* ---------------- Envío del formulario ---------------- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideBanner();

    const email = emailInput.value.trim();
    const password = passInput.value;

    const emailOk = validateField(emailInput, emailError, email.length > 0 && isValidEmail(email));
    const passOk  = validateField(passInput, passError, password.length >= 6);

    if(!emailOk || !passOk) return;

    setLoading(true);
    const result = await AuthService.login(email, password);
    setLoading(false);

    if(result.ok){
      handleSuccess(email);
    }else{
      handleFailure(result.message);
    }
  });

  function setLoading(isLoading){
    submitBtn.classList.toggle("loading", isLoading);
    submitBtn.disabled = isLoading;
  }

  function handleSuccess(email){
    if(rememberBox.checked){
      localStorage.setItem(CONFIG.storageKeys.remember, email);
    }else{
      localStorage.removeItem(CONFIG.storageKeys.remember);
    }
    localStorage.removeItem(CONFIG.storageKeys.attempts);
    localStorage.removeItem(CONFIG.storageKeys.lockUntil);

    showBanner("lock", "Acceso correcto. Redirigiendo al panel…");
    // En producción: window.location.href = "/dashboard";
  }

  function handleFailure(message){
    const attempts = Number(localStorage.getItem(CONFIG.storageKeys.attempts) || 0) + 1;
    localStorage.setItem(CONFIG.storageKeys.attempts, String(attempts));

    if(attempts >= CONFIG.maxAttempts){
      const lockUntil = Date.now() + CONFIG.lockoutMs;
      localStorage.setItem(CONFIG.storageKeys.lockUntil, String(lockUntil));
      lockForm(CONFIG.lockoutMs);
      return;
    }

    const left = CONFIG.maxAttempts - attempts;
    showBanner("error", `${message} Te quedan ${left} intento${left === 1 ? "" : "s"}.`);
  }

  /* ---------------- Modal: recuperar contraseña ---------------- */
  function openModal(){
    modalOverlay.classList.add("show");
    recoverSuccess.classList.remove("show");
    recoverEmail.value = "";
    recoverEmail.focus();
  }
  function closeModal(){
    modalOverlay.classList.remove("show");
  }

  forgotLink.addEventListener("click", (e) => { e.preventDefault(); openModal(); });
  modalCancel.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => { if(e.target === modalOverlay) closeModal(); });
  document.addEventListener("keydown", (e) => { if(e.key === "Escape") closeModal(); });

  modalSend.addEventListener("click", () => {
    if(!isValidEmail(recoverEmail.value.trim())){
      recoverEmail.setAttribute("aria-invalid", "true");
      return;
    }
    recoverEmail.setAttribute("aria-invalid", "false");
    recoverSuccess.classList.add("show");
  });

})();
