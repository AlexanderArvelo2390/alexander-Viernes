(() => {
  "use strict";

  const API = "https://fakestoreapi.com/products";
  const CLAVE = "hilo_carrito";

  let productos = [];
  let carrito = [];
  let categoria = "todas";
  let busqueda = "";
  let ultimoFoco = null;

  const $ = (sel) => document.querySelector(sel);
  const grilla = $("#grilla");
  const lista = $("#listaCarrito");
  const precio = (n) => "$" + Number(n).toFixed(2);

  function dibujo(forma, color) {
    const cuerpos = {
      remera:
        '<path d="M62,34 85,22 Q100,36 115,22 L138,34 168,62 146,84 138,74 138,206 Q100,214 62,206 L62,74 54,84 32,62Z"/>',
      buzo: '<path d="M62,42 85,26 Q100,44 115,26 L138,42 168,70 146,92 138,82 138,206 Q100,214 62,206 L62,82 54,92 32,70Z"/><path d="M80,26 Q100,54 120,26" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="4"/>',
      campera:
        '<path d="M62,34 88,22 100,40 112,22 138,34 168,64 146,86 138,76 138,208 Q100,216 62,208 L62,76 54,86 32,64Z"/><path d="M100,40 100,210" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="3"/>',
      pantalon:
        '<path d="M64,28 136,28 144,210 110,210 100,120 90,210 56,210Z"/><path d="M64,50 136,50" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="3"/>',
      vestido:
        '<path d="M64,32 85,22 Q100,36 115,22 L136,32 152,72 134,80 158,212 Q100,224 42,212 L66,80 48,72Z"/>',
      gorra:
        '<path d="M38,138 Q40,62 100,58 Q160,62 162,138 Z"/><path d="M162,138 Q196,142 196,164 L120,164 Q126,142 162,138Z"/>',
    };
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" fill="${color}">${cuerpos[forma] || cuerpos.remera}</svg>`;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }

  function leerCarrito() {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE));
      return Array.isArray(guardado) ? guardado : [];
    } catch {
      return [];
    }
  }
  function guardarCarrito() {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(carrito));
    } catch {}
  }
  function borrarAlmacenamiento() {
    try {
      localStorage.removeItem(CLAVE);
    } catch {}
  }

  function avisar(texto, tono = "ok") {
    const caja = document.createElement("p");
    caja.className =
      "px-4 py-3 rounded-sm border text-sm shadow-lg " +
      (tono === "ok"
        ? "bg-carta border-linea text-tinta"
        : "bg-carta border-coral text-coral");
    caja.textContent = texto;
    $("#avisos").appendChild(caja);
    setTimeout(() => caja.remove(), 3200);
  }

  async function cargar() {
    try {
      const r = await fetch(API);
      if (!r.ok) throw new Error("respuesta " + r.status);
      const datos = await r.json();
      productos = datos.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        price: p.price,
        description: p.description,
        image: p.image,
      }));
    } catch (e) {
      console.log(productos);
      avisar(
        "No se pudo conectar con la API. Se muestra el catálogo local.",
        "error",
      );
    }
    $("#cargando").hidden = true;
    pintarCategorias();
    pintarProductos();
    $("#conteoPortada").textContent = productos.length + " prendas disponibles";
  }

  function pintarCategorias() {
    const cats = ["todas", ...new Set(productos.map((p) => p.category))];
    $("#categorias").innerHTML = cats
      .map(
        (c) => `
      <li><button type="button" data-cat="${c}"
        class="px-4 py-1.5 rounded-full border capitalize whitespace-nowrap transition-colors
        ${c === categoria ? "bg-tinta text-papel border-tinta" : "bg-carta border-linea hover:border-tinta"}"
        aria-pressed="${c === categoria}">${c}</button></li>`,
      )
      .join("");
  }

  function filtrar() {
    const q = busqueda.trim().toLowerCase();
    return productos.filter((p) => {
      const okCat = categoria === "todas" || p.category === categoria;
      const okBus =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return okCat && okBus;
    });
  }

  function pintarProductos() {
    const items = filtrar();
    $("#resumen").textContent =
      items.length === 1 ? "1 prenda" : items.length + " prendas";
    $("#vacio").hidden = items.length !== 0;
    console;
    grilla.innerHTML = items
      .map(
        (p) => `
      <article class="ficha bg-carta border border-linea rounded-sm overflow-hidden flex flex-col">
        <button type="button" data-id="${p.id}" class="text-left flex flex-col h-full">
          <span class="block bg-papel p-5">
            <img src="${p.image}" alt="${p.title}" loading="lazy" class="w-full h-48 object-contain mix-blend-multiply dark:mix-blend-normal">
          </span>
          <span class="p-5 flex flex-col gap-2 flex-1">
            <span class="text-xs text-tinte font-semibold capitalize">${p.category}</span>
            <span class="display font-bold leading-snug line-clamp-2">${p.title}</span>
            <span class="display text-xl font-extrabold mt-auto pt-2">${precio(p.price)}</span>
            <span class="text-xs text-tenue">Ver ficha de la prenda</span>
          </span>
        </button>
      </article>`,
      )
      .join("");
  }

  function abrirModal(id) {
    const p = productos.find((x) => x.id === id);
    if (!p) return;
    ultimoFoco = document.activeElement;
    $("#modalImg").src = p.image;
    $("#modalImg").alt = p.title;
    $("#modalCat").textContent = p.category;
    $("#modalTitulo").textContent = p.title;
    $("#modalPrecio").textContent = precio(p.price);
    $("#modalDesc").textContent = p.description;
    $("#agregarModal").dataset.id = p.id;
    $("#modal").classList.remove("oculto");
    $("#velo").classList.remove("oculto");
    document.body.style.overflow = "hidden";
    $("#cerrarModal").focus();
  }
  function cerrarModal() {
    $("#modal").classList.add("oculto");
    $("#velo").classList.add("oculto");
    if (!estaAbiertoCarrito()) document.body.style.overflow = "";
    if (ultimoFoco) ultimoFoco.focus();
  }

  function agregar(id) {
    const p = productos.find((x) => x.id === id);
    if (!p) return;
    const enCarrito = carrito.find((x) => x.id === id);
    if (enCarrito) enCarrito.cantidad++;
    else
      carrito.push({
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.image,
        cantidad: 1,
      });
    guardarCarrito();
    pintarCarrito();
    avisar(`"${p.title}" se agregó al carrito`);
  }

  function cambiarCantidad(id, delta) {
    const item = carrito.find((x) => x.id === id);
    if (!item) return;
    item.cantidad = Math.max(1, item.cantidad + delta);
    guardarCarrito();
    pintarCarrito();
  }

  function eliminar(id) {
    carrito = carrito.filter((x) => x.id !== id);
    guardarCarrito();
    pintarCarrito();
    avisar("Prenda eliminada del carrito");
  }

  function pintarCarrito() {
    const unidades = carrito.reduce((s, i) => s + i.cantidad, 0);
    const total = carrito.reduce((s, i) => s + i.cantidad * i.price, 0);
    const vacio = carrito.length === 0;

    const badge = $("#badge");
    badge.hidden = unidades === 0;
    badge.textContent = unidades;
    if (unidades > 0) {
      badge.classList.remove("pop");
      void badge.offsetWidth;
      badge.classList.add("pop");
    }
    $("#btnCarrito").setAttribute(
      "aria-label",
      `Abrir carrito, ${unidades} ${unidades === 1 ? "prenda" : "prendas"}`,
    );

    $("#total").textContent = precio(total);
    $("#carritoVacio").hidden = !vacio;
    lista.hidden = vacio;
    $("#finalizar").disabled = vacio;
    $("#vaciar").disabled = vacio;

    lista.innerHTML = carrito
      .map(
        (i) => `
      <li class="flex gap-3 pb-4 border-b border-linea last:border-0">
        <img src="${i.image}" alt="" class="w-20 h-24 object-contain bg-papel rounded-sm p-1 shrink-0">
        <div class="flex-1 min-w-0">
          <p class="display font-bold text-sm leading-snug line-clamp-2">${i.title}</p>
          <p class="text-xs text-tenue mt-0.5">${precio(i.price)} por unidad</p>
          <div class="flex items-center justify-between gap-2 mt-3">
            <div class="flex items-center border border-linea rounded-full">
              <button type="button" data-menos="${i.id}" ${i.cantidad <= 1 ? "disabled" : ""}
                class="w-8 h-8 grid place-items-center rounded-full disabled:opacity-30 disabled:pointer-events-none hover:text-tinte"
                aria-label="Quitar una unidad de ${i.title}">−</button>
              <span class="w-8 text-center text-sm font-semibold" aria-label="Cantidad">${i.cantidad}</span>
              <button type="button" data-mas="${i.id}"
                class="w-8 h-8 grid place-items-center rounded-full hover:text-tinte"
                aria-label="Sumar una unidad de ${i.title}">+</button>
            </div>
            <span class="display font-extrabold">${precio(i.price * i.cantidad)}</span>
            <button type="button" data-borrar="${i.id}" class="text-coral hover:underline text-xs font-semibold"
              aria-label="Eliminar ${i.title} del carrito">Eliminar</button>
          </div>
        </div>
      </li>`,
      )
      .join("");
  }

  const estaAbiertoCarrito = () => !$("#sidebar").classList.contains("fuera");

  function abrirCarrito() {
    ultimoFoco = document.activeElement;
    $("#sidebar").classList.remove("fuera");
    $("#sidebar").setAttribute("aria-hidden", "false");
    $("#veloCarrito").classList.remove("oculto");
    $("#btnCarrito").setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    $("#cerrarCarrito").focus();
  }
  function cerrarCarrito() {
    $("#sidebar").classList.add("fuera");
    $("#sidebar").setAttribute("aria-hidden", "true");
    $("#veloCarrito").classList.add("oculto");
    $("#btnCarrito").setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    $("#btnCarrito").focus();
  }

  grilla.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-id]");
    if (btn) abrirModal(Number(btn.dataset.id));
  });

  $("#agregarModal").addEventListener("click", (e) => {
    agregar(Number(e.currentTarget.dataset.id));
    cerrarModal();
  });

  $("#cerrarModal").addEventListener("click", cerrarModal);
  $("#velo").addEventListener("click", cerrarModal);
  $("#btnCarrito").addEventListener("click", abrirCarrito);
  $("#cerrarCarrito").addEventListener("click", cerrarCarrito);
  $("#veloCarrito").addEventListener("click", cerrarCarrito);

  lista.addEventListener("click", (e) => {
    const menos = e.target.closest("[data-menos]");
    const mas = e.target.closest("[data-mas]");
    const borrar = e.target.closest("[data-borrar]");
    if (menos) cambiarCantidad(Number(menos.dataset.menos), -1);
    if (mas) cambiarCantidad(Number(mas.dataset.mas), 1);
    if (borrar) eliminar(Number(borrar.dataset.borrar));
  });

  $("#finalizar").addEventListener("click", () => {
    if (carrito.length === 0) return;
    const unidades = carrito.reduce((s, i) => s + i.cantidad, 0);
    carrito = [];
    borrarAlmacenamiento();
    pintarCarrito();
    cerrarCarrito();
    avisar(
      `Compra confirmada: ${unidades} ${unidades === 1 ? "prenda" : "prendas"}. Te llega el detalle por correo.`,
    );
  });

  $("#vaciar").addEventListener("click", () => {
    if (carrito.length === 0) return;
    carrito = [];
    borrarAlmacenamiento();
    pintarCarrito();
    avisar("El carrito quedó vacío");
  });

  $("#categorias").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-cat]");
    if (!btn) return;
    categoria = btn.dataset.cat;
    pintarCategorias();
    pintarProductos();
  });

  $("#buscador").addEventListener("input", (e) => {
    busqueda = e.target.value;
    pintarProductos();
  });

  $("#limpiarFiltros").addEventListener("click", () => {
    busqueda = "";
    categoria = "todas";
    $("#buscador").value = "";
    pintarCategorias();
    pintarProductos();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!$("#modal").classList.contains("oculto")) cerrarModal();
    else if (estaAbiertoCarrito()) cerrarCarrito();
  });

  carrito = leerCarrito();
  pintarCarrito();
  cargar();
})();
