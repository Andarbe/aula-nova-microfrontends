# Aula Nova - Prototipo de Microfrontends 

Evolucion de la arquitectura Front-End de **Aula Nova** hacia un modelo de
**microfrontends** con **composicion en el cliente** mediante *Module Federation*.


## Arquitectura

| Pieza | Rol | Puerto | Dominio de negocio |
|------|-----|--------|--------------------|
| `packages/shell` | Host / App Shell | 5173 | Orquestacion, layout, enrutamiento |
| `packages/mf-catalog` | Remoto | 5001 | Descubrimiento de cursos |
| `packages/mf-enrollment` | Remoto | 5002 | Inscripcion / Checkout |

- **Composicion en cliente:** el shell (host) importa en tiempo de ejecucion el
  `remoteEntry.js` de cada microfrontend y monta el dominio activo.
- **Contrato de integracion:** cada remoto expone `mount(container, props)` y
  devuelve una funcion de limpieza (`unmount`). El host no conoce los detalles
  internos (framework-agnostico en la frontera).
- **Comunicacion desacoplada:** los microfrontends NO se importan entre si. El
  Catalogo publica el evento de dominio `aula-nova:enroll`; el shell lo escucha y
  enruta hacia Inscripcion. Patron pub/sub sobre `window`.
- **Estado por dominio:** se conserva el patron **Flux** de la Entrega 2, pero el
  store deja de ser global y unico y pasa a ser **propio de cada microfrontend**.
- **Dependencias compartidas:** `react` y `react-dom` se comparten como singletons.
- **Coherencia visual:** todos consumen los mismos **design tokens** (Entrega 1).

## Requisitos
- Node.js 18+ y npm 9+

## Instalacion
```bash
npm install
```

## Ejecucion (build + preview, recomendado para Module Federation)
Module Federation con Vite necesita el `remoteEntry.js` generado en build.
En **tres terminales** (o build unico + tres previews):

```bash
npm run build            # construye remotos y host
npm run preview:catalog     # http://localhost:5001
npm run preview:enrollment  # http://localhost:5002
npm run preview:shell       # http://localhost:5173  <- abrir aqui
```
Abre el shell en **http://localhost:5173**.

## Prueba de autonomia (cada MFE corre solo)
```bash
npm run dev:catalog      # http://localhost:5001  (catalogo aislado)
npm run dev:enrollment   # http://localhost:5002  (wizard aislado)
```


## Leyes UX heredadas
- **Hick:** agrupacion por categorias en el catalogo.
- **Miller:** wizard de 3 pasos con barra de progreso.
- **Fitts:** CTAs con area tactil >= 44 px.



## Estructura
```
aula-nova-microfrontends/
  package.json            # workspaces + scripts de orquestacion
  packages/
    shell/                # HOST: App Shell, enrutamiento, escucha de eventos
    mf-catalog/           # REMOTO: dominio Descubrimiento (Flux propio)
    mf-enrollment/        # REMOTO: dominio Inscripcion (Flux propio + async)
```
