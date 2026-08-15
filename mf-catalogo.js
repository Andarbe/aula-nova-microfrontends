/* =====================================================================
   MICROFRONTEND: Catalogo (dominio Descubrimiento)
   Independiente: tiene su propio estado (store Flux-lite) y su propia UI.
   Se comunica con el shell por un evento de dominio; NO conoce a los
   demas microfrontends.
   ===================================================================== */
(function () {
  // --- Estado propio del dominio (single source of truth acotada) ---
  const cursos = [
    { id: 'c1', titulo: 'Fundamentos de Análisis de Datos', categoria: 'Datos', nivel: 'Básico', horas: 12 },
    { id: 'c2', titulo: 'React desde Cero a Producción', categoria: 'Desarrollo', nivel: 'Intermedio', horas: 20 },
    { id: 'c3', titulo: 'Arquitectura Front-End Moderna', categoria: 'Desarrollo', nivel: 'Avanzado', horas: 16 },
    { id: 'c4', titulo: 'Marketing Digital de Resultados', categoria: 'Marketing', nivel: 'Básico', horas: 10 },
    { id: 'c5', titulo: 'Finanzas Personales y de Producto', categoria: 'Finanzas', nivel: 'Básico', horas: 8 },
    { id: 'c6', titulo: 'Visualización de Datos con Python', categoria: 'Datos', nivel: 'Intermedio', horas: 14 },
  ];
  const store = { categoriaActiva: 'Todos' };

  function categorias() {
    return ['Todos', ...Array.from(new Set(cursos.map(c => c.categoria)))];
  }

  // --- Vista: pinta su contenido dentro del contenedor que da el shell ---
  function render(container) {
    const visibles = store.categoriaActiva === 'Todos'
      ? cursos : cursos.filter(c => c.categoria === store.categoriaActiva);

    container.innerHTML = `
      <h2 class="mf-title">📚 Catálogo de cursos</h2>
      <p class="mf-sub">Microfrontend <b>Descubrimiento</b> · equipo autónomo</p>
      <div class="row" id="filtros" style="justify-content:center;margin-bottom:16px">
        ${categorias().map(cat => `
          <button class="chip ${cat === store.categoriaActiva ? 'active' : ''}" data-cat="${cat}">${cat}</button>
        `).join('')}
      </div>
      <div class="grid">
        ${visibles.map(c => `
          <article class="card" style="display:flex;flex-direction:column;gap:8px">
            <span style="font-size:12px;color:var(--primary-500);font-weight:700">${c.categoria.toUpperCase()}</span>
            <h3 style="margin:0;font-size:17px">${c.titulo}</h3>
            <span style="color:var(--neutral-600);font-size:14px">${c.nivel} · ${c.horas} h</span>
            <button class="btn btn-primary" style="margin-top:auto" data-inscribir="${c.id}">Inscribirme</button>
          </article>
        `).join('')}
      </div>`;

    // Filtro por categoria (Ley de Hick)
    container.querySelector('#filtros').addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      store.categoriaActiva = chip.dataset.cat;
      render(container);
    });

    // Interaccion CLAVE: al inscribirse, el shell carga el microfront de
    // Inscripcion EN LA MISMA PAGINA con el curso elegido (evento de dominio).
    container.querySelectorAll('[data-inscribir]').forEach(btn => {
      btn.addEventListener('click', () => {
        const curso = cursos.find(c => c.id === btn.dataset.inscribir);
        window.dispatchEvent(new CustomEvent('aula-nova:navigate', {
          detail: { to: 'inscripcion', props: { curso } },
        }));
      });
    });
  }

  window.AulaNovaMF = window.AulaNovaMF || {};
  window.AulaNovaMF.catalogo = { render };
})();
