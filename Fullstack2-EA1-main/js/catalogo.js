const productos = [
    { id: 1, nombre: "Brocha", precio: 5990, stock: 12,
         imagen: "img/images.jpg" , detalles : "1"},
    { id: 2, nombre: "Tarro de pintura", precio: 45990, stock: 5, 
        imagen: "img/images (1).jpg", detalles: "2" },
    { id: 3, nombre: "Bolsa de clavos", precio: 6990, stock: 30, 
        imagen: "img/images (2).jpg",detalles: "3" },
];

function estadoStock(stock) {
    if (stock <= 0) {
        return { texto: "Agotado", clase: "stock--agotado" };
    }
    if (stock < 10) {
        return { texto: "Pocas unidades", clase: "stock--bajo" };
    }
    return { texto: "En stock", clase: "stock--ok" };
}

function formatearPrecio(precio) {
    return precio.toLocaleString("es-CL");
}

function renderizarCatalogo(lista = productos) {
    const contenedor = document.querySelector("#catalogo");
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = `<p class="catalogo-vacio">No se encontraron productos.</p>`;
        return;
    }

    lista.forEach(producto => {
        const estado = estadoStock(producto.stock);

        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta");

        tarjeta.innerHTML = `
            <div class="tarjeta__imagen">
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="tarjeta__cuerpo">
                <h3 class="tarjeta__nombre">${producto.nombre}</h3>
                <span class="stock ${estado.clase}">
                    <span class="stock__punto"></span>${estado.texto}
                </span>
                <details class="tarjeta__detalles">
                    <summary>Ver detalles</summary>
                    <p>${producto.detalles}</p>
                </details>
            </div>
            <div class="tarjeta__pie">
                <span class="etiqueta-precio">$${formatearPrecio(producto.precio)}</span>
            </div>
            <button data-id="${producto.id}" class="btn-agregar-carrito">
                Agregar al carrito
            </button>
        `;

        contenedor.appendChild(tarjeta);
    });
}

document.addEventListener("DOMContentLoaded", () => renderizarCatalogo());

document.querySelector("#catalogo").addEventListener("click", (evento) => {
    if (evento.target.classList.contains("btn-agregar-carrito")) {
        const id = Number(evento.target.dataset.id);
        const producto = productos.find(p => p.id === id);
        agregarAlCarrito(producto);
    }
});

const buscadorInput = document.querySelector("#buscador-input");

buscadorInput.addEventListener("input", () => {
    const texto = buscadorInput.value.trim().toLowerCase();

    const resultado = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(texto)
    );

    renderizarCatalogo(resultado);
});
