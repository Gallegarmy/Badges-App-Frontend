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
      statusEl.textContent = "No se pudieron cargar las medallas. Por favor, inicia sesión de nuevo.";
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

loadBadges();
