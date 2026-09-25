# Proyecto (E-commerce)

Sitio de una sola página (`index.html`) que lista productos de ropa consumidos desde una API, con ficha de detalle en modal y carrito de compras persistente en `localStorage`.

## Tecnologías utilizadas

| Herramienta                              | Función dentro del proyecto                                                                                                                                                                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **HTML5**                                | Estructura semántica de toda la página: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<figure>`.                                                                                                   |
| **CSS3 + TailwindCSS** (vía CDN)         | Estilos utilitarios (`grid`, `flex`, espaciados, colores) aplicados directamente en las clases del HTML. Se usa para el diseño responsive y la coherencia visual.                                                                     |
| **CSS personalizado** (bloque `<style>`) | Variables de color (`--papel`, `--tinta`, `--tinte`, etc.) para mantener una paleta única en modo claro y oscuro, tipografías (Bricolage Grotesque + Instrument Sans), animaciones del sidebar/modal y ajustes que Tailwind no cubre. |
| **JavaScript (vanilla)**                 | Toda la lógica de negocio: pedir los productos, dibujar las cards, manejar el modal, el carrito y los filtros. No usa ningún framework.                                                                                               |
| **Fetch API**                            | `fetch('https://fakestoreapi.com/products')` trae el catálogo real. Si falla la conexión, la página cae a un catálogo local de emergencia y avisa al usuario, para que la demo nunca quede en blanco.                                 |
| **DOM (Document Object Model)**          | Se usa para crear dinámicamente las cards del catálogo, las filas del carrito y los botones de categorías a partir de los datos recibidos, y para escuchar los clics (delegación de eventos).                                         |
| **LocalStorage**                         | Guarda el contenido del carrito (`hilo_carrito`) para que sobreviva a un refresh de la página. Se actualiza en cada acción: agregar, sumar, restar, eliminar, vaciar o finalizar compra.                                              |
| **Google Fonts**                         | Carga las tipografías Bricolage Grotesque (títulos) e Instrument Sans (texto general) desde `fonts.googleapis.com`.                                                                                                                   |

## Estructura del archivo

El proyecto está en un único archivo `index.html` con tres partes:

1. `<head>`: metadatos, fuentes, configuración de Tailwind y estilos propios.
2. `<body>`: marcado HTML de encabezado, categorías, portada, catálogo, modal de detalle, sidebar del carrito y avisos.
3. `<script>` (al final): toda la lógica en JavaScript, organizada en funciones pequeñas.

## Funcionalidades principales

- **Listado de productos**: pide los datos a la API y arma una card por producto (imagen, categoría, título y precio).
- **Modal de detalle**: al tocar una card se abre un modal con título, precio y descripción completos. Se cierra con la "X", con "Agregar al carrito", haciendo clic afuera o con la tecla `Escape`.
- **Carrito de compras**: sidebar lateral que lista cada producto agregado con imagen, título, controles de cantidad (`−` / `+`), botón para eliminarlo y el precio final según la cantidad.
  - El botón `−` se deshabilita cuando la cantidad llega a 1.
  - "Finalizar compra" vacía el carrito, borra el `localStorage` y muestra un mensaje de confirmación.
  - "Vaciar el carrito" elimina todos los productos de una vez.
  - Ambos botones quedan deshabilitados cuando el carrito está vacío.
- **Badge del carrito**: burbuja sobre el ícono del carrito con la cantidad total de unidades (no de productos distintos).
- **Buscador**: filtra el catálogo por texto en tiempo real (título y descripción).
- **Navegación por categorías**: los botones de categoría se generan según los datos de la API y filtran el catálogo al tocarlos.
- **Mensajes al usuario (toasts)**: avisos breves al agregar, eliminar, vaciar o finalizar la compra, y también si la API no responde.

## Accesibilidad

- Etiquetas semánticas de HTML5 en toda la estructura.
- Modal y sidebar con `role="dialog"`, `aria-modal` y manejo de foco (el foco vuelve al elemento que abrió el panel al cerrarlo).
- Mensajes de estado con `aria-live` para que se anuncien automáticamente.
- Soporte para `prefers-reduced-motion` (desactiva animaciones si el usuario lo pidió en su sistema).

## Cómo probarlo

Basta con abrir `index.html` con doble clic en cualquier navegador moderno; no requiere instalación ni servidor. Con conexión a internet trae los productos reales de FakeStore API.
