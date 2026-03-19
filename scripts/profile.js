async function loadBadges() {
  const token = getToken();
  if (!token) {
    location.href = "login.html";
    return;
  }

  const statusEl = document.getElementById("badges-status");

  try {
    const res = await fetch(`${API}/my-badges`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      statusEl.textContent =
        "No se pudieron cargar las medallas. Por favor, inicia sesión de nuevo.";
      statusEl.hidden = false;
      return;
    }

    const badges = await res.json();

    if (!badges.length) {
      statusEl.textContent = "Aún no tienes medallas.";
      statusEl.hidden = false;
      return;
    }

    const fragment = document.createDocumentFragment();
    badges.forEach((b) => {
      const hex = document.createElement("div");
      hex.className = "hex";
      const img = document.createElement("img");
      img.src = b.image_url;
      img.alt = b.name || "badge";
      hex.appendChild(img);
      fragment.appendChild(hex);
    });
    document.getElementById("hexGallery").appendChild(fragment);
  } catch {
    statusEl.textContent = ERR_NETWORK;
    statusEl.hidden = false;
  }
}

async function loadPatrosBadgesStatus() {
  const token = getToken();
  if (!token) return;

  const statusEl = document.getElementById("badges-status");

  try {
    const res = await fetch(`${API}/patros-badges`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return;

    const data = await res.json();
    const patros = data["patros-badge"];
    const comunidades = data["comunidades-badge"];

    // Condition 1: Both 0 - don't display anything
    if (patros === 0 && comunidades === 0) {
      return;
    }

    // Condition 2: patros < 7 (and at least one is not 0)
    if (patros < 7) {
      statusEl.textContent = `Haz escaneado ${patros}/7 medallas, escanea las restantes para participar del sorteo LareiraConf 2026`;
      statusEl.hidden = false;
      return;
    }

    // Condition 3: patros = 7 AND comunidades < 12
    if (patros === 7 && comunidades < 12) {
      statusEl.textContent = `Ya estas participando en el sorteo LareiraConf 2026, escanea todas las medallas de comunidades para duplicar tus posibilidades, actualmente tienes ${comunidades}/12 medallas`;
      statusEl.hidden = false;
      return;
    }

    // Condition 4: patros = 7 AND comunidades = 12
    if (patros === 7 && comunidades === 12) {
      statusEl.textContent =
        "Ya estas participando en el sorteo LareiraConf 2026 con tus posibilidades duplicadas, gracias por escanear todas las medallas";
      statusEl.hidden = false;
    }
  } catch (error) {
    console.error("Error loading patros badges status:", error);
  }
}

loadBadges();
loadPatrosBadgesStatus();
