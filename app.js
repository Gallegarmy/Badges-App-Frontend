const API = "/api";
const ERR_NETWORK = "Error de red. Por favor, comprueba tu conexión.";

// ── Shared form helper ────────────────────────────────────────────────────────
async function postForm(endpoint, body, errorEl, onSuccess) {
  errorEl.hidden = true;
  try {
    const res = await fetch(`${API}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      errorEl.textContent = data.error || "Algo salió mal. Por favor, inténtalo de nuevo.";
      errorEl.hidden = false;
      return;
    }
    onSuccess(data);
  } catch {
    errorEl.textContent = ERR_NETWORK;
    errorEl.hidden = false;
  }
}

// ── Token helpers ─────────────────────────────────────────────────────────────
function saveToken(token) {
  const item = {
    token,
    expiry: new Date().getTime() + 1800000,
  };
  localStorage.setItem("token", JSON.stringify(item));
}

function getToken() {
  const itemStr = localStorage.getItem("token");
  if (!itemStr) return null;
  const item = JSON.parse(itemStr);
  if (new Date().getTime() > item.expiry) {
    localStorage.removeItem("token");
    return null;
  }
  return item.token;
}
