"use strict";

window.Permisos = (() => {
  const esSuperAdmin = actor => actor?.rol === "Super Admin";
  const tieneRol = (actor, roles) => esSuperAdmin(actor) || roles.includes(actor?.rol);

  return { esSuperAdmin, tieneRol };
})();
