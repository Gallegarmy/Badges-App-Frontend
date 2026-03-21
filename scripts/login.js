document.getElementById("forgot-link").addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const errorEl = document.getElementById("login-error");

  errorEl.hidden = true;

  if (!email) {
    errorEl.textContent = "Introduce tu correo electrónico primero.";
    errorEl.hidden = false;
    return;
  }

  try {
    await fetch(`${API}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    errorEl.textContent =
      "Si el correo existe, recibirás un enlace para restablecer tu contraseña.";
    errorEl.hidden = false;
  } catch {
    errorEl.textContent = ERR_NETWORK;
    errorEl.hidden = false;
  }
});

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorEl = document.getElementById("login-error");

  errorEl.hidden = true;

  if (!email || !password) {
    errorEl.textContent = "Debes ingresar correo y contraseña.";
    errorEl.hidden = false;
    return;
  }

  postForm("/auth/login", { email, password }, errorEl, (data) => {
    if (!data?.token) {
      errorEl.textContent = "Credenciales inválidas.";
      errorEl.hidden = false;
      return;
    }

    saveToken(data.token);
    location.href = "profile.html";
  });
});
