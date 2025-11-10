// ======== CONFIGURACIÓN (rellena con datos reales del cliente) ========
const CARD = {
  nombre: "Jorge Morales",
  cargo: "Diseño y estilo en tus espacios.",
  empresa: "MODEC", // nombre de la empresa o profesional

  // Teléfono que SE MUESTRA y que se usa para "Llamar" (FIJO)
  telFormateado: "+52 55 5579 2330",
  telSoloNumeros: "525555792330",            // solo números con LADA (para btnCall y el link del tel en la info)

  // Teléfono móvil (para mostrar en "Información breve")
  movilFormateado: "+52 55 1827 9830",
  movilSolo: "525518279830",

  // WhatsApp (MÓVIL) — sin "+"
  waSolo: "525531460489",

  email: "modec.jorgem@gmail.com",
  web: "",
  facebook: "https://www.facebook.com/", // aqui poner el link de facebook
  instagram: "https://instagram.com/",  // aqui poner el link de instagram
  // cambio direccion 09-11-2025

// En tu objeto CARD:
direccion: "CDMX, México",
mapa: "https://maps.app.goo.gl/vavewMdidbuJU7m39",


  nota: "", // si lo dejas vacío, mostramos solo el horario base
  mensajeWhats: "Hola Jorge, me interesa una cotización."
};

// ======== helpers visuales ========
// Mostrar handle corto en redes: @usuario (IG) y /pagina (FB)
const handleFromUrl = (url) => {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\//g, "");
    if (u.hostname.includes("instagram.com")) return path ? `@${path}` : "Instagram";
    if (u.hostname.includes("facebook.com")) return path ? `/${path}` : "Facebook";
    return u.hostname.replace("www.", "");
  } catch { return url; }
};

// ======== POBLAR INTERFAZ ========
document.getElementById("name").textContent = CARD.nombre;
document.getElementById("role").textContent = CARD.cargo;
document.getElementById("company").textContent = CARD.empresa;

document.getElementById("address").textContent = CARD.direccion;

// ⚠️ Aquí ahora mostramos el MÓVIL en la sección de información y al hacer clic se llama al móvil
document.getElementById("tel").textContent = CARD.movilFormateado;
document.getElementById("tel").href = `tel:${CARD.movilSolo}`;

// Facebook (fila de info)
document.getElementById("fb").textContent = handleFromUrl(CARD.facebook);
document.getElementById("fb").href = CARD.facebook;
document.getElementById("fb").target = "_blank";

// Instagram (fila de info)
document.getElementById("ig").href = CARD.instagram;
document.getElementById("ig").textContent = handleFromUrl(CARD.instagram);

// Botones rápidos
document.getElementById("btnCall").href = `tel:${CARD.telSoloNumeros}`; // ➜ llama al FIJO
document.getElementById("btnWa").href =
  `https://wa.me/${CARD.waSolo}?text=${encodeURIComponent(CARD.mensajeWhats)}`; // ➜ WhatsApp al MÓVIL
document.getElementById("btnMail").href =
  `mailto:${CARD.email}?subject=${encodeURIComponent("Contacto")}`;
document.getElementById("btnWeb").href = CARD.web;

document.getElementById("note").textContent = (function(){
  // Nota con fallback elegante
  const baseDisp = "Disponibilidad: Lun–Vie 9:00–18:00 · Sáb 9:00–14:00";
  return CARD.nota && CARD.nota.trim()
    ? `${baseDisp} · ${CARD.nota.trim()}`
    : baseDisp;
})();

// ======== vCard ========
function descargarVCard() {
  const v = CARD;
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:;${v.nombre};;;`,
    `FN:${v.nombre}`,
    `ORG:${v.empresa}`,
    `TITLE:${v.cargo}`,
    `TEL;TYPE=WORK,VOICE:${v.telFormateado}`, // fijo como WORK
    `TEL;TYPE=CELL,VOICE:${v.movilFormateado}`, // móvil
    `TEL;TYPE=CELL,VOICE;X-ABLabel="WhatsApp":${v.waSolo}`, // WhatsApp
    `EMAIL;TYPE=INTERNET:${v.email}`,
// modificacion vCard 09-11-2025

    `item1.URL:${v.web || v.mapa}`,
    `item1.X-ABLabel:${v.web ? "Website" : "Ubicación"}`,

    `ADR;TYPE=WORK:;;${v.direccion};;;;`,
    `NOTE:${v.nota}`,
    "END:VCARD"
  ].join("\n");

  const blob = new Blob([vcard], {type:"text/vcard;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; 
  a.download = `${v.nombre.replace(/\s+/g,'_')}.vcf`;
  document.body.appendChild(a); 
  a.click(); 
  a.remove();
  URL.revokeObjectURL(url);
}

document.getElementById("saveVcf").addEventListener("click", descargarVCard);

// ======== Compartir nativo / respaldo copiar ========
document.getElementById("shareBtn").addEventListener("click", async ()=>{
  if (navigator.share) {
    try{
      await navigator.share({
        title: `${CARD.nombre} – ${CARD.empresa}`,
        text: CARD.nota || "Contacto",
        url: location.href
      });
    }catch(e){}
  } else {
    try{
      await navigator.clipboard.writeText(location.href);
      alert("Enlace copiado al portapapeles");
    }catch(e){
      alert("No se pudo compartir automáticamente");
    }
  }
});

// ======== "Visítanos" → abrir Google Maps ========
document.getElementById("btnAdd").addEventListener("click", (e)=>{
  e.preventDefault();
  const url = "https://maps.app.goo.gl/vavewMdidbuJU7m39"; // 🔹 tu enlace real
  window.open(url, "_blank", "noopener");
});


/* ======== Tema claro / oscuro ======== */
const html = document.documentElement;
const themeBtn = document.getElementById("toggleTheme");
const themeIcon = document.querySelector("#toggleTheme img"); // icono dentro del botón

// Cargar preferencia guardada o usar modo oscuro por defecto
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  html.setAttribute("data-theme", savedTheme);
  themeIcon.src = savedTheme === "light"
    ? "img/icons/luz.png"
    : "img/icons/luna.png";
} else {
  html.setAttribute("data-theme", "dark");
  themeIcon.src = "img/icons/luna.png";
}

// Alternar tema al hacer clic
themeBtn.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  const newTheme = current === "light" ? "dark" : "light";
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  // Cambiar icono según tema
  themeIcon.src = newTheme === "light"
    ? "img/icons/luz.png"
    : "img/icons/luna.png";
});
