const resetToken = new URLSearchParams(window.location.search).get("token");

document.getElementById("reset-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const password = document.getElementById("password").value;
  const errorEl = document.getElementById("reset-error");

  if (!resetToken) {
    errorEl.textContent = "Enlace inválido. Solicita un nuevo correo de restablecimiento.";
    errorEl.hidden = false;
    return;
  }

  await postForm(
    "/auth/reset-password",
    { token: resetToken, password },
    errorEl,
    () => { location.href = "login.html"; }
  );
});
