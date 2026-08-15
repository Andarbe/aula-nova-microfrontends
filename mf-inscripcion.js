/* =====================================================================
   MICROFRONTEND: Inscripcion (dominio Checkout)
   Estado propio (store Flux-lite): accion -> reducer puro -> re-render.
   Incluye asincronia con manejo de error. Recibe el curso por props.
   ===================================================================== */
(function () {
  const PASOS = ['Modalidad', 'Horario', 'Pago'];   // 3 pasos (Ley de Miller)

  function estadoInicial(curso) {
    return { curso: curso || null, paso: 1, form: {}, estado: 'idle', error: null };
  }
  // Reducer puro (patron Flux de la Entrega 2)
  function reducer(s, a) {
    switch (a.type) {
      case 'NEXT': return { ...s, paso: Math.min(s.paso + 1, PASOS.length) };
      case 'PREV': return { ...s, paso: Math.max(s.paso - 1, 1) };
      case 'FORM': return { ...s, form: { ...s.form, [a.campo]: a.valor } };
      case 'SUBMIT_START': return { ...s, estado: 'submitting', error: null };
      case 'SUBMIT_OK': return { ...s, estado: 'success' };
      case 'SUBMIT_ERR': return { ...s, estado: 'error', error: a.error };
      case 'RESET': return estadoInicial(s.curso);
      default: return s;
    }
  }

  function render(container, props) {
    let state = estadoInicial(props && props.curso);
    const dispatch = (a) => { state = reducer(state, a); paint(); };

    // Accion asincrona: simula el backend y contempla el fallo
    async function enviar() {
      dispatch({ type: 'SUBMIT_START' });
      try {
        await new Promise((res, rej) => setTimeout(() => Math.random() > 0.15 ? res() : rej(), 900));
        dispatch({ type: 'SUBMIT_OK' });
      } catch {
        dispatch({ type: 'SUBMIT_ERR', error: 'No se pudo completar la inscripción. Intenta de nuevo.' });
      }
    }

    function paint() {
      if (!state.curso) {
        container.innerHTML = `
          <h2 class="mf-title">📝 Inscripción</h2>
          <p class="mf-sub">Selecciona un curso en el Catálogo para iniciar la inscripción.</p>
          <div style="text-align:center">
            <button class="btn btn-ghost" id="ir-catalogo">Ir al catálogo</button>
          </div>`;
        container.querySelector('#ir-catalogo').addEventListener('click',
          () => window.AulaNova.navigate('catalogo'));
        return;
      }

      const pct = Math.round((state.paso / PASOS.length) * 100);
      if (state.estado === 'success') {
        container.innerHTML = `
          <h2 class="mf-title">📝 Inscripción</h2>
          <div class="card" style="max-width:520px;margin:0 auto;border-color:var(--success-500)">
            <b style="color:var(--success-500)">¡Inscripción confirmada!</b>
            <p>Te enviamos los detalles de <b>${state.curso.titulo}</b> a tu correo.</p>
            <button class="btn btn-ghost" id="otra">Nueva inscripción</button>
          </div>`;
        container.querySelector('#otra').addEventListener('click', () => dispatch({ type: 'RESET' }));
        return;
      }

      const campo = ['modalidad', 'horario', 'metodoPago'][state.paso - 1];
      const opciones = [
        ['Virtual en vivo', 'A tu ritmo'],
        ['Mañana', 'Tarde', 'Noche'],
        ['Tarjeta', 'PSE'],
      ][state.paso - 1];

      container.innerHTML = `
        <h2 class="mf-title">📝 Inscripción</h2>
        <p class="mf-sub">Microfrontend <b>Inscripción</b> · curso: <b>${state.curso.titulo}</b></p>
        <div class="card" style="max-width:520px;margin:0 auto">
          <div class="progress"><i style="width:${pct}%"></i></div>
          <p style="font-size:13px;color:var(--neutral-600)">Paso ${state.paso} de ${PASOS.length}: ${PASOS[state.paso - 1]}</p>
          <label>${PASOS[state.paso - 1]}</label>
          <select id="campo">
            <option value="">Selecciona…</option>
            ${opciones.map(o => `<option ${state.form[campo] === o ? 'selected' : ''}>${o}</option>`).join('')}
          </select>
          ${state.estado === 'error' ? `<p style="color:var(--danger-500);font-weight:600">${state.error}</p>` : ''}
          <div class="row" style="margin-top:16px">
            <button class="btn btn-ghost" id="atras" ${state.paso === 1 ? 'disabled' : ''}>Atrás</button>
            ${state.paso < PASOS.length
              ? `<button class="btn btn-primary" id="sig">Siguiente</button>`
              : `<button class="btn btn-primary" id="conf" ${state.estado === 'submitting' ? 'disabled' : ''}>${state.estado === 'submitting' ? 'Enviando…' : 'Confirmar inscripción'}</button>`}
          </div>
        </div>`;

      container.querySelector('#campo').addEventListener('change',
        (e) => { state.form[campo] = e.target.value; });
      const atras = container.querySelector('#atras');
      if (atras) atras.addEventListener('click', () => dispatch({ type: 'PREV' }));
      const sig = container.querySelector('#sig');
      if (sig) sig.addEventListener('click', () => dispatch({ type: 'NEXT' }));
      const conf = container.querySelector('#conf');
      if (conf) conf.addEventListener('click', enviar);
    }

    paint();
  }

  window.AulaNovaMF = window.AulaNovaMF || {};
  window.AulaNovaMF.inscripcion = { render };
})();
