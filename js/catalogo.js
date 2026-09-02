const esAdmin = document.body.classList.contains("admin");

function renderizarCatalogo(lista = obtenerProductos()) {
    const contenedor = document.querySelector("#catalogo");
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = `<p class="catalogo-vacio">No se encontraron productos.</p>`;
        return;
    }

    lista.forEach(producto => {
        const estado = estadoStock(producto.stock);
        const sinStock = producto.stock <= 0;

        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta");

        tarjeta.innerHTML = `
            <div class="tarjeta__imagen">
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="tarjeta__cuerpo">
                <h3 class="tarjeta__nombre">${producto.nombre}</h3>
                <span class="stock ${estado.clase}">
                    <span class="stock__punto"></span>${estado.texto} (${producto.stock})
                </span>
                <details class="tarjeta__detalles">
                    <summary>Ver detalles</summary>
                    <p>${producto.detalles}</p>
                </details>
            </div>
            <div class="tarjeta__pie">
                <span class="etiqueta-precio">$${formatearPrecio(producto.precio)}</span>
            </div>
            ${esAdmin ? `
            <div class="tarjeta__admin-acciones">
                <button data-id="${producto.id}" class="btn-secundario btn-editar-producto">Editar</button>
                <button data-id="${producto.id}" class="btn-eliminar btn-baja-producto">Dar de baja</button>
            </div>
            ` : `
            <button data-id="${producto.id}" class="btn-agregar-carrito" ${sinStock ? "disabled" : ""}>
                ${sinStock ? "Sin stock" : "Agregar al carrito"}
            </button>
            `}
        `;

        contenedor.appendChild(tarjeta);
    });
}

document.addEventListener("DOMContentLoaded", () => renderizarCatalogo());

window.addEventListener("storage", (evento) => {
    if (evento.key === "productos") {
        renderizarCatalogo();
    }
});

document.querySelector("#catalogo").addEventListener("click", (evento) => {
    if (evento.target.classList.contains("btn-agregar-carrito")) {
        const id = Number(evento.target.dataset.id);
        const producto = obtenerProductos().find(p => p.id === id);
        agregarAlCarrito(producto);
        renderizarCatalogo();
    }

    if (evento.target.classList.contains("btn-baja-producto")) {
        const id = Number(evento.target.dataset.id);
        const productos = obtenerProductos();
        const producto = productos.find(p => p.id === id);

        if (producto && confirm(`¿Dar de baja "${producto.nombre}" del catálogo? Esta acción no se puede deshacer.`)) {
            const actualizados = productos.filter(p => p.id !== id);
            guardarProductos(actualizados);
            renderizarCatalogo(actualizados);
        }
    }

    if (evento.target.classList.contains("btn-editar-producto")) {
        const id = Number(evento.target.dataset.id);
        const productos = obtenerProductos();
        const producto = productos.find(p => p.id === id);
        if (!producto) return;

        const nuevoPrecio = prompt(`Nuevo precio para "${producto.nombre}":`, producto.precio);
        if (nuevoPrecio === null) return;

        const nuevoStock = prompt(`Nuevo stock para "${producto.nombre}":`, producto.stock);
        if (nuevoStock === null) return;

        const precioNum = Number(nuevoPrecio);
        const stockNum = Number(nuevoStock);

        if (Number.isNaN(precioNum) || precioNum < 0 || Number.isNaN(stockNum) || stockNum < 0) {
            alert("Precio y stock deben ser números válidos (0 o mayores).");
            return;
        }

        producto.precio = precioNum;
        producto.stock = stockNum;
        guardarProductos(productos);
        renderizarCatalogo(productos);
    }
});

const formAgregarProducto = document.querySelector("#form-agregar-producto");
if (formAgregarProducto) {
    const btnAbrirForm = document.querySelector("#btn-agregar-producto");
    const btnCancelarForm = document.querySelector("#btn-cancelar-producto");

    btnAbrirForm.addEventListener("click", () => {
        formAgregarProducto.hidden = false;
        btnAbrirForm.hidden = true;
    });

    btnCancelarForm.addEventListener("click", () => {
        formAgregarProducto.reset();
        formAgregarProducto.hidden = true;
        btnAbrirForm.hidden = false;
    });

    formAgregarProducto.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const nombre = document.querySelector("#nuevo-nombre").value.trim();
        const precio = Number(document.querySelector("#nuevo-precio").value);
        const stock = Number(document.querySelector("#nuevo-stock").value);
        const imagen = document.querySelector("#nuevo-imagen").value.trim() || "img/descarga.png";
        const detalles = document.querySelector("#nuevo-detalles").value.trim() || "Sin descripción.";

        if (nombre === "" || Number.isNaN(precio) || precio < 0 || Number.isNaN(stock) || stock < 0) {
            alert("Completa nombre, precio y stock con valores válidos.");
            return;
        }

        const productos = obtenerProductos();
        const nuevoProducto = {
            id: siguienteIdProducto(productos),
            nombre, precio, stock, imagen, detalles,
        };

        productos.push(nuevoProducto);
        guardarProductos(productos);
        renderizarCatalogo(productos);

        formAgregarProducto.reset();
        formAgregarProducto.hidden = true;
        btnAbrirForm.hidden = false;
    });
}

const buscadorInput = document.querySelector("#buscador-input");

buscadorInput.addEventListener("input", () => {
    const texto = buscadorInput.value.trim().toLowerCase();

    const resultado = obtenerProductos().filter(producto =>
        producto.nombre.toLowerCase().includes(texto)
    );

    renderizarCatalogo(resultado);
});
