let loadedBadges = [];

function getHoneycombConfig(galleryWidth, badgeCount) {
  const hexGap = galleryWidth <= 520 ? 10 : 14;
  const minHexWidth = galleryWidth <= 520 ? 92 : 108;
  const maxHexWidth = galleryWidth <= 520 ? 150 : 200;

  const maxCapacityByWidth = Math.max(
    2,
    Math.floor((galleryWidth + hexGap) / (minHexWidth + hexGap))
  );

  const desiredByCount = Math.max(2, Math.ceil(Math.sqrt(Math.max(1, badgeCount) * 0.9)));
  const hardCap = galleryWidth <= 520 ? 3 : galleryWidth <= 760 ? 4 : galleryWidth <= 1100 ? 6 : 7;

  const longRowCapacity = Math.max(
    2,
    Math.min(maxCapacityByWidth, desiredByCount, hardCap)
  );

  const totalGap = hexGap * (longRowCapacity - 1);
  const maxHexWidthByColumns = Math.floor((galleryWidth - totalGap) / longRowCapacity);
  const hexWidth = Math.max(minHexWidth, Math.min(maxHexWidth, maxHexWidthByColumns));
  const hexHeight = Math.round(hexWidth * 1.1547);

  const shortRowCapacity = Math.max(1, longRowCapacity - 1);

  const gridColTrack = (hexWidth + hexGap) / 2;
  const gridColCount = longRowCapacity * 2;
  const gridRowStep = Math.round(hexHeight * 0.75 + hexGap * 0.5);

  return {
    hexWidth,
    hexHeight,
    hexGap,
    longRowCapacity,
    shortRowCapacity,
    gridColTrack,
    gridColCount,
    gridRowStep,
  };
}

function renderHoneycombBadges() {
  const gallery = document.getElementById("hexGallery");
  gallery.innerHTML = "";

  if (!loadedBadges.length) {
    return;
  }

  const config = getHoneycombConfig(gallery.clientWidth || window.innerWidth, loadedBadges.length);
  gallery.style.setProperty("--hex-width", `${config.hexWidth}px`);
  gallery.style.setProperty("--hex-height", `${config.hexHeight}px`);
  gallery.style.setProperty("--hex-gap", `${config.hexGap}px`);
  gallery.style.setProperty("--grid-col-track", `${config.gridColTrack}px`);
  gallery.style.setProperty("--grid-col-count", String(config.gridColCount));
  gallery.style.setProperty("--grid-row-step", `${config.gridRowStep}px`);

  const fragment = document.createDocumentFragment();
  let badgeIndex = 0;
  let row = 1;
  const isSingleBadge = loadedBadges.length === 1;

  while (badgeIndex < loadedBadges.length) {
    const isShortRow = row % 2 === 0;
    const rowCapacity = isShortRow ? config.shortRowCapacity : config.longRowCapacity;
    let colStart = isShortRow ? 2 : 1;

    if (isSingleBadge && row === 1) {
      colStart = Math.floor(config.gridColCount / 2);
    }

    for (let i = 0; i < rowCapacity && badgeIndex < loadedBadges.length; i += 1) {
      const b = loadedBadges[badgeIndex];
      const hex = document.createElement("div");
      hex.className = "hex";
      hex.style.gridRow = String(row);
      hex.style.gridColumn = `${colStart + i * 2} / span 2`;

      const img = document.createElement("img");
      img.src = b.image_url;
      img.alt = b.name || "badge";

      hex.appendChild(img);
      fragment.appendChild(hex);
      badgeIndex += 1;
    }

    row += 1;
  }

  gallery.appendChild(fragment);
}

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

    loadedBadges = await res.json();

    if (!badges.length) {
      statusEl.textContent = "Aún no tienes medallas.";
      statusEl.hidden = false;
      return;
    }

    statusEl.hidden = true;
    renderHoneycombBadges();
  } catch {
    statusEl.textContent = ERR_NETWORK;
    statusEl.hidden = false;
  }
}

let resizeTimer = null;
window.addEventListener("resize", () => {
  if (!loadedBadges.length) {
    return;
  }

  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    //timeout prevents excesive rendering while resizing window
    renderHoneycombBadges();
  }, 120);
});


loadBadges();
