# Aula Nova — Microfrontends (composición en el cliente)

Prototipo de **Arquitectura Front-End**. Aplica **microfrontends con
composición en el cliente** (§4.1) bajo el **patrón de Shell / contenedor principal**
(§5.2): una sola página integra dinámicamente microfrontends independientes y, al
interactuar, la sección de contenido se **actualiza** con el microfrontend
correspondiente. Continúa el caso *Aula Nova* 

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
- Cada microfrontend conserva su **estado propio** (patrón Flux).



## 📁 Estructura
```
index.html        # Shell: cabecera + navegación + sección de contenido
styles.css        # Design tokens (Entrega 1) + estilos
app.js            # Shell: orquesta y carga dinámicamente los microfrontends
mf-catalogo.js    # Microfrontend Catálogo (estado propio)
mf-inscripcion.js # Microfrontend Inscripción (Flux + asincronía)
mf-perfil.js      # Microfrontend Perfil (estado propio)
```


