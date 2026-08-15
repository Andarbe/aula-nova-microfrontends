/* =====================================================================
   MICROFRONTEND: Perfil (dominio Cuenta)
   Independiente y con estado propio. Demuestra un tercer microfrontend
   compuesto en la misma pagina por el shell.
   ===================================================================== */
(function () {
  const perfil = {
    nombre: 'Juan Pérez', plan: 'Suscripción Premium',
    cursosEnCurso: 3, certificados: 5,
  };

  function render(container) {
    let editando = false;

    function paint() {
      container.innerHTML = `
        <h2 class="mf-title">👤 Perfil</h2>
        <p class="mf-sub">Microfrontend <b>Cuenta</b> · datos del estudiante</p>
        <div class="card" style="max-width:520px;margin:0 auto">
          ${editando ? `
            <label>Nombre</label>
            <input id="nombre" value="${perfil.nombre}"
              style="width:100%;height:var(--tap-min);border:1px solid var(--neutral-200);border-radius:8px;padding:0 10px;font-size:15px" />
            <div class="row" style="margin-top:16px">
              <button class="btn btn-primary" id="guardar">Guardar</button>
              <button class="btn btn-ghost" id="cancelar">Cancelar</button>
            </div>
          ` : `
            <p><b>Nombre:</b> ${perfil.nombre}</p>
            <p><b>Plan:</b> ${perfil.plan}</p>
            <div class="row" style="gap:24px">
              <span><b>${perfil.cursosEnCurso}</b> cursos en curso</span>
              <span><b>${perfil.certificados}</b> certificados</span>
            </div>
            <button class="btn btn-primary" style="margin-top:16px" id="editar">Editar</button>
          `}
        </div>`;

      if (editando) {
        container.querySelector('#guardar').addEventListener('click', () => {
          perfil.nombre = container.querySelector('#nombre').value || perfil.nombre;
          editando = false; paint();
        });
        container.querySelector('#cancelar').addEventListener('click', () => { editando = false; paint(); });
      } else {
        container.querySelector('#editar').addEventListener('click', () => { editando = true; paint(); });
      }
    }
    paint();
  }

  window.AulaNovaMF = window.AulaNovaMF || {};
  window.AulaNovaMF.perfil = { render };
})();
