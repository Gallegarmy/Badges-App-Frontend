function buildHexBadge(badge) {
  const hex = document.createElement("div");
  hex.className = "hex";

  const img = document.createElement("img");
  img.src = badge.image_url;
  img.alt = badge.name || "badge";

  hex.appendChild(img);
  return hex;
}

function normalizeTextValue(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const OTHER_BADGE_NAMES = new Set([
  normalizeTextValue("Aniversario Sysarmy 2026"),
  normalizeTextValue("OlivArmy Tech+Beers Febrero 2026"),
  normalizeTextValue("Admin Cañas Febrero 2026"),
  normalizeTextValue("Python Coruña Febrero 2026"),
]);

const OTHER_BADGE_IMAGE_HINTS = [
  "medalla aniversario 2026",
  "medalla sysarmy vigo febrero 2026",
  "febrero 2026 png",
];

const SPONSOR_BADGE_NAMES = new Set([
  normalizeTextValue("Stand Accenture LareiraConf 2026"),
  normalizeTextValue("Stand Denodo LareiraConf 2026"),
  normalizeTextValue("Stand Dinahosting LareiraConf 2026"),
  normalizeTextValue("Stand Docuten LareiraConf 2026"),
  normalizeTextValue("Stand Gradiant LareiraConf 2026"),
  normalizeTextValue("Stand Raiola LareiraConf 2026"),
  normalizeTextValue("Stand Wordpress LareiraConf 2026"),
]);

const SPONSOR_BADGE_IMAGE_HINTS = [
  "accenture",
  "denodo",
  "dinahosting",
  "docuten",
  "gradiant",
  "raiola",
  "wordpress",
];

function isOtherBadge(badge) {
  const name = normalizeTextValue(badge && badge.name);
  if (OTHER_BADGE_NAMES.has(name)) return true;

  const imageUrl = normalizeTextValue(badge && badge.image_url);
  return OTHER_BADGE_IMAGE_HINTS.some(function (hint) {
    return imageUrl.includes(hint);
  });
}

function isSponsorBadge(badge) {
  const name = normalizeTextValue(badge && badge.name);
  if (SPONSOR_BADGE_NAMES.has(name)) return true;

  const imageUrl = normalizeTextValue(badge && badge.image_url);
  if (
    SPONSOR_BADGE_IMAGE_HINTS.some(function (hint) {
      return imageUrl.includes(hint);
    })
  ) {
    return true;
  }

  const slug = normalizeTextValue(badge && badge.slug);
  return SPONSOR_BADGE_IMAGE_HINTS.some(function (hint) {
    return slug.includes(hint);
  });
}

function createSection(title, galleryClass, badges) {
  const section = document.createElement("section");
  section.className = "badge-section";

  const heading = document.createElement("h2");
  heading.className = "badge-section-title";
  heading.textContent = title;
  section.appendChild(heading);

  const gallery = document.createElement("div");
  gallery.className = galleryClass;

  const fragment = document.createDocumentFragment();
  badges.forEach(function (badge) {
    fragment.appendChild(buildHexBadge(badge));
  });
  gallery.appendChild(fragment);

  section.appendChild(gallery);
  return section;
}

function renderSeparatedBadges(badges) {
  const root = document.getElementById("hexGallery");
  root.innerHTML = "";
  root.className = "badges-layout";

  const otherBadges = badges.filter(isOtherBadge);

  const lareiraBadges = badges.filter(function (b) {
    return !isOtherBadge(b);
  });

  const patrosBadges = lareiraBadges.filter(isSponsorBadge);

  const comunidadesBadges = lareiraBadges.filter(function (b) {
    return !isSponsorBadge(b);
  });

  if (otherBadges.length > 0) {
    const otherSection = createSection(
      "Eventos anteriores",
      "single-row-gallery",
      otherBadges,
    );
    root.appendChild(otherSection);
  }

  const divider = document.createElement("div");
  divider.className = "lareiraconf-divider";
  divider.textContent = "LareiraConf 2026";
  root.appendChild(divider);

  const statusEl = document.getElementById("badges-status");
  if (statusEl) {
    divider.insertAdjacentElement("afterend", statusEl);
    statusEl.classList.add("lareira-status-message");
  }

  const patrosSection = createSection(
    "Patros",
    "hexagon-gallery section-gallery patros-gallery",
    patrosBadges,
  );

  root.appendChild(patrosSection);

  const comunidadesSection = createSection(
    "Comunidades",
    "hexagon-gallery section-gallery",
    comunidadesBadges,
  );
  root.appendChild(comunidadesSection);
}

async function loadBadges() {
  const token = getToken();
  if (!token) {
    location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(API + "/my-badges", {
      headers: { Authorization: "Bearer " + token },
    });

    if (!res.ok) {
      statusEl.textContent =
        "No se pudieron cargar las medallas. Por favor, inicia sesion de nuevo.";
      statusEl.hidden = false;
      return;
    }

    const badges = await res.json();

    if (!badges.length) {
      statusEl.textContent = "Aun no tienes medallas.";
      statusEl.hidden = false;
      return;
    }

    renderSeparatedBadges(badges);
  } catch (error) {
    statusEl.textContent = ERR_NETWORK;
    statusEl.hidden = false;
  }
}

async function loadPatrosBadgesStatus() {
  const token = getToken();
  if (!token) return;

  const statusEl = document.getElementById("badges-status");

  try {
    const res = await fetch(API + "/patros-badges", {
      headers: { Authorization: "Bearer " + token },
    });

    if (!res.ok) return;

    const data = await res.json();
    const patros = data["patros-badge"];
    const comunidades = data["comunidades-badge"];

    if (patros === 0 && comunidades === 0) return;

    if (patros < 7) {
      statusEl.textContent =
        "Has escaneado " +
        patros +
        "/7 medallas, escanea las restantes para participar del sorteo LareiraConf 2026";
      statusEl.hidden = false;
      return;
    }

    if (patros === 7 && comunidades < 12) {
      statusEl.textContent = `Ya estas participando en el sorteo LareiraConf 2026.
      Escanea todas las medallas de comunidades para duplicar tus posibilidades.
      Actualmente tienes ${comunidades}/12 medallas.`;
      statusEl.hidden = false;
      return;
    }

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
