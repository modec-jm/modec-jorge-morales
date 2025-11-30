// ======== CONFIGURACIÓN ========
const CARD = {
  nombre: "Jorge Morales",
  cargo: "Decoracion y estilo para tus espacios.",
  empresa: "MODEC",

  // 📞 Botón llamar (móvil principal)
  telFormateado: "55 3146 0489",      // no lo usamos en la info ahora
  telSoloNumeros: "5531460489",

  // ☎️ Teléfono fijo adicional
  fijoEtiquetado: "55 5579 2330",
  fijoSolo: "5555792330",

  // 📱 Número que irá debajo de CDMX (info breve)
  movilInfo: "5518279830",

  // 💬 WhatsApp (mismo que móvil principal para contacto rápido)
  waSolo: "5531460489",

  email: "modec.jorgem@gmail.com",
  web: "",
  facebook: "https://www.facebook.com/",
  instagram: "https://instagram.com/",

  direccion: "CDMX, México",
  mapa: "https://maps.app.goo.gl/vavewMdidbuJU7m39",

  nota: "",
  mensajeWhats: "Hola Jorge, me interesa una cotización."
};

// ======== HELPERS ========
const handleFromUrl = (url) => {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\//g, "");
    if (u.hostname.includes("instagram.com")) return path ? `@${path}` : "Instagram";
    if (u.hostname.includes("facebook.com")) return path ? `/${path}` : "Facebook";
    return u.hostname.replace("www.", "");
  } catch {
    return url;
  }
};

// ======== POBLAR UI ========
document.getElementById("name").textContent = CARD.nombre;
document.getElementById("role").textContent = CARD.cargo;
document.getElementById("company").textContent = CARD.empresa;

document.getElementById("address").textContent = CARD.direccion;

// 📱 Mostrar número debajo de CDMX en la fila info (#tel)
const telEl = document.getElementById("tel");
const m = CARD.movilInfo;
if (telEl) {
  // Formateo: 55 1827 9830
  const formateado = m.replace(/(\d{2})(\d{4})(\d{4})/, "$1 $2 $3");
  telEl.textContent = formateado;
  telEl.href = `tel:${m}`;
}

// Redes
const fbEl = document.getElementById("fb");
if (fbEl) {
  fbEl.textContent = handleFromUrl(CARD.facebook);
  fbEl.href = CARD.facebook;
  fbEl.target = "_blank";
  fbEl.rel = "noopener";
}

const igEl = document.getElementById("ig");
if (igEl) {
  igEl.textContent = handleFromUrl(CARD.instagram);
  igEl.href = CARD.instagram;
  igEl.target = "_blank";
  igEl.rel = "noopener";
}

// Botones rápidos
const btnCall = document.getElementById("btnCall");
if (btnCall) {
  btnCall.href = `tel:${CARD.telSoloNumeros}`;
}

const btnWa = document.getElementById("btnWa");
if (btnWa) {
  btnWa.href = `https://wa.me/52${CARD.waSolo}?text=${encodeURIComponent(CARD.mensajeWhats)}`;
  btnWa.target = "_blank";
  btnWa.rel = "noopener";
}

// Email
const btnMail = document.getElementById("btnMail");
if (btnMail) {
  btnMail.href = `mailto:${CARD.email}?subject=${encodeURIComponent("Contacto")}`;
}

// Web / Portafolio
const btnWeb = document.getElementById("btnWeb");
if (btnWeb) {
  btnWeb.href = CARD.web || "#";
  if (CARD.web) {
    btnWeb.target = "_blank";
    btnWeb.rel = "noopener";
  }
}

// 🗺 Botón "Visítanos" → abre el mapa real
const btnAdd = document.getElementById("btnAdd");
if (btnAdd) {
  btnAdd.href = CARD.mapa;
  btnAdd.target = "_blank";
  btnAdd.rel = "noopener";
}

// Nota / disponibilidad
const noteEl = document.getElementById("note");
if (noteEl) {
  const base = "Disponibilidad: Lun–Vie 9:00–18:00 · Sáb 9:00–14:00";
  noteEl.textContent = CARD.nota && CARD.nota.trim() ? `${base} · ${CARD.nota.trim()}` : base;
}

// ======== vCard ========
function descargarVCard() {
  const v = CARD;
  const vcf = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:;${v.nombre};;;`,
    `FN:${v.nombre}`,
    `ORG:${v.empresa}`,
    `TITLE:${v.cargo}`,
    // ☎️ Fijo (work)
    `TEL;TYPE=WORK,VOICE:${v.fijoSolo}`,
    // 📱 Móvil principal
    `TEL;TYPE=CELL,VOICE;PREF=1:${v.telSoloNumeros}`,
    // 📱 Móvil secundario
    `TEL;TYPE=CELL,VOICE:${v.movilInfo}`,
    // 💬 WhatsApp (mismo que el principal)
    `TEL;TYPE=CELL,VOICE;X-ABLabel="WhatsApp":+52${v.waSolo}`,
    `EMAIL;TYPE=INTERNET:${v.email}`,
    `item1.URL:${v.web}`,
    `item1.X-ABLabel:Website`,
    `item2.URL:${v.mapa}`,
    `item2.X-ABLabel:Ubicación`,
    `ADR;TYPE=WORK:;;${v.direccion};;;;`,
    `NOTE:${v.nota}`,
    "END:VCARD"
  ].join("\n");

  const blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${v.nombre.replace(/\s+/g,"_")}.vcf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}


// Guardar contacto
const saveBtn = document.getElementById("saveVcf");
if (saveBtn) {
  saveBtn.addEventListener("click", descargarVCard);
}

// Compartir / copiar enlace
const shareBtn = document.getElementById("shareBtn");
if (shareBtn) {
  shareBtn.addEventListener("click", async ()=>{
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${CARD.nombre} – ${CARD.empresa}`,
          text: CARD.nota || "Contacto",
          url: location.href
        });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(location.href);
        alert("Enlace copiado al portapapeles");
      } catch {
        alert("No se pudo copiar el enlace");
      }
    }
  });
}
