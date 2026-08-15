# Aula Nova — Microfrontends (composición en el cliente)

Prototipo de la **Unidad 4 · Arquitectura Front-End**. Aplica **microfrontends con
composición en el cliente** (§4.1) bajo el **patrón de Shell / contenedor principal**
(§5.2): una sola página integra dinámicamente microfrontends independientes y, al
interactuar, la sección de contenido se **actualiza** con el microfrontend
correspondiente. Continúa el caso *Aula Nova* de las Entregas 1 y 2.

## 🔗 Demo en vivo (GitHub Pages)
https://andarbe.github.io/aula-nova-microfrontends/

## ▶️ Cómo ejecutar en local
No requiere instalación ni build. Con un servidor estático:
```bash
python -m http.server 8080
```
Abre http://localhost:8080 (también puedes usar la extensión **Live Server** de VS Code).

## 🧩 Microfrontends (dominios de negocio)
| Archivo | Microfrontend | Dominio |
|---|---|---|
| `mf-catalogo.js`   | Catálogo    | Descubrimiento |
| `mf-inscripcion.js`| Inscripción | Checkout |
| `mf-perfil.js`     | Perfil      | Cuenta |

## ⚙️ Cómo funciona
- `index.html` + `app.js` son el **shell** (contenedor). El shell **no tiene lógica de
  negocio**: solo orquesta.
- Al pulsar un botón, el shell **carga dinámicamente** (bajo demanda, una sola vez) el
  archivo del microfrontend y llama a su `render(sección)`, que pinta su contenido en
  la **misma página**.
- Interacción entre microfrontends **sin acoplarlos**: al pulsar *Inscribirme* en un
  curso del Catálogo, este publica el evento `aula-nova:navigate`; el shell lo escucha
  y compone el microfrontend de **Inscripción** en la misma página, con el curso
  elegido. Los microfrontends nunca se importan entre sí.
- Cada microfrontend conserva su **estado propio** (patrón Flux de la Entrega 2).

## 🎥 Recorrido para el video (3–5 min)
1. Abrir la app: el shell carga por defecto el microfrontend **Catálogo**.
2. Filtrar por categoría (Ley de Hick) — la sección se actualiza sin recargar.
3. Pulsar **Inscribirme** en un curso: el shell **carga Inscripción en la misma
   página** con ese curso (clic → otro microfront).
4. Recorrer el wizard de 3 pasos con barra de progreso (Miller) y confirmar
   (éxito o manejo de error). CTA de área ≥ 44 px (Fitts).
5. Pulsar **Perfil**: se compone un tercer microfrontend independiente.
6. Explicar `app.js` (shell que orquesta y carga dinámicamente) y un `mf-*.js`.

## 📁 Estructura
```
index.html        # Shell: cabecera + navegación + sección de contenido
styles.css        # Design tokens (Entrega 1) + estilos
app.js            # Shell: orquesta y carga dinámicamente los microfrontends
mf-catalogo.js    # Microfrontend Catálogo (estado propio)
mf-inscripcion.js # Microfrontend Inscripción (Flux + asincronía)
mf-perfil.js      # Microfrontend Perfil (estado propio)
```

## Autores
Johan José Donado Banderas · Juan Camilo Peña Neita · Rodolfo Andrés Arbeláez Rojas
Institución Universitaria Politécnico Grancolombiano — Arquitectura Front-End
