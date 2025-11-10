// ====== CONFIGURA AQUÍ TU INFORMACIÓN (vCard y enlaces) ======
const BUSINESS = {
  nombre: "Persianas & Diseño de Interiores",
  tel: "+52 55 1234 5678",
  telWhats: "525512345678",               // solo números con LADA
  email: "contacto@tudominio.com",
  sitio: "https://tudominio.com",
  instagram: "https://instagram.com/tuempresa",
  empresa: "Persianas & Diseño de Interiores",
  cargo: "Asesoría y Ventas",
  direccion: "Av. Ejemplo 123, Col. Centro, Ciudad de México, MX",
  nota: "Persianas, pisos laminados y diseño de interiores. Agenda tu visita."
};

// Actualiza año en footer
document.getElementById('year').textContent = new Date().getFullYear();

// IntersectionObserver para animaciones (.fade)
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, {threshold:.12});
document.querySelectorAll('.fade').forEach(el => io.observe(el));

// Lightbox simple
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbClose = document.getElementById('lb-close');

const gallery = document.getElementById('gallery');
if (gallery) {
  gallery.addEventListener('click', (e)=>{
    const img = e.target.closest('img');
    if(!img) return;
    lbImg.src = img.src;
    lbImg.alt = img.alt || "Imagen de portafolio";
    lb.classList.add('open');
    lb.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  });
}

function closeLB(){
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden','true');
  lbImg.src = "";
  document.body.style.overflow = '';
}
lbClose.addEventListener('click', closeLB);
lb.addEventListener('click', (e)=>{ if(e.target===lb) closeLB(); });
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeLB(); });

// Generar y descargar vCard
function descargarVCard(){
  const v = BUSINESS;
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:;${v.nombre};;;`,
    `FN:${v.nombre}`,
    `ORG:${v.empresa}`,
    `TITLE:${v.cargo}`,
    `TEL;TYPE=CELL,VOICE:${v.tel}`,
    `EMAIL;TYPE=INTERNET:${v.email}`,
    `item1.URL:${v.sitio}`,
    `item1.X-ABLabel:Website`,
    `ADR;TYPE=WORK:;;${v.direccion};;;;`,
    `NOTE:${v.nota}`,
    "END:VCARD"
  ].join("\n");

  const blob = new Blob([vcard], {type:"text/vcard;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "contacto.vcf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Listeners de vCard
document.getElementById('btn-vcard')?.addEventListener('click', (e)=>{ e.preventDefault(); descargarVCard(); });
document.getElementById('btn-vcard-2')?.addEventListener('click', (e)=>{ e.preventDefault(); descargarVCard(); });

// Actualiza enlaces WhatsApp con número y mensaje
const waMsg = encodeURIComponent("Hola me gustaría cotizar");
document.querySelectorAll('.wa-link').forEach(a=>{
  a.href = `https://wa.me/${BUSINESS.telWhats}?text=${waMsg}`;
});


