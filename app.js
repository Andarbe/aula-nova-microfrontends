/* =====================================================================
   SHELL (host) de Aula Nova
   - Registra los microfrontends en window.AulaNovaMF
   - Al pulsar un boton, CARGA DINAMICAMENTE el archivo del microfrontend
     (una sola vez) y renderiza su contenido en la seccion #contenido.
   - Los microfrontends NO se conocen entre si: se comunican con el shell
     por un evento de dominio ('aula-nova:navigate').
   ===================================================================== */
window.AulaNovaMF = window.AulaNovaMF || {};

const loaded = {};                 // control de carga: cada MF se descarga una sola vez
const contenido = () => document.getElementById('contenido');

// Carga dinamica del script del microfrontend (independiente y bajo demanda)
function loadMF(name) {
  return new Promise((resolve, reject) => {
    if (loaded[name]) return resolve();
    const s = document.createElement('script');
    s.src = 'mf-' + name + '.js';
    s.onload = () => { loaded[name] = true; resolve(); };
    s.onerror = () => reject(new Error('No se pudo cargar el microfrontend: ' + name));
    document.body.appendChild(s);
  });
}

// Navegacion: carga (si hace falta) y monta el MF activo en la seccion
async function navigate(name, props) {
  const host = contenido();
  host.innerHTML = '<p style="text-align:center;color:var(--neutral-600)">Cargando…</p>';
  try {
    await loadMF(name);
    const mf = window.AulaNovaMF[name];
    if (!mf || typeof mf.render !== 'function') throw new Error('MF invalido: ' + name);
    host.innerHTML = '';
    const section = document.createElement('section');
    section.className = 'fade';
    host.appendChild(section);
    mf.render(section, props || {});          // el MF pinta SU contenido en la seccion
  } catch (e) {
    host.innerHTML = '<p style="color:var(--danger-500)">' + e.message + '</p>';
  }
  // marca el boton activo
  document.querySelectorAll('.nav-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.mf === name));
}
window.AulaNova = { navigate };            // API que el shell expone a los MF

// Comunicacion entre microfrontends por evento de dominio (pub/sub)
window.addEventListener('aula-nova:navigate', (e) => navigate(e.detail.to, e.detail.props));

// Cableado de los botones del shell
document.getElementById('nav').addEventListener('click', (e) => {
  const btn = e.target.closest('.nav-btn');
  if (btn) navigate(btn.dataset.mf);
});

// Vista inicial
navigate('catalogo');
