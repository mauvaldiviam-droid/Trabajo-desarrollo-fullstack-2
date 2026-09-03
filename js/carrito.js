
function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function obtenerCarrito() {
    const datos = localStorage.getItem("carrito");
    return datos ? JSON.parse(datos) : [];
}

function agregarAlCarrito(producto) {
    const productos = obtenerProductos();
    const productoActual = productos.find(p => p.id === producto.id);

    if (!productoActual || productoActual.stock <= 0) {
        alert(`"${producto.nombre}" no tiene stock disponible en este momento.`);
        return;
    }

    ajustarStock(producto.id, -1);

    const carrito = obtenerCarrito();
    const existente = carrito.find(item => item.id === producto.id);

    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    guardarCarrito(carrito);
    actualizarContadorCarrito();
}

function quitarDelCarrito(producto) {
    const carrito = obtenerCarrito();
    const existente = carrito.find(item => item.id === producto.id);

    if (!existente) return;

    existente.cantidad -= 1;
    ajustarStock(producto.id, 1);

    let actualizado;

    if (existente.cantidad <= 0) {
        actualizado = carrito.filter(item => item.id !== producto.id);
    } else {
        actualizado = carrito;
    }

    guardarCarrito(actualizado);
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const contador = document.querySelector("#contador-carrito");
    if (!contador) return;

    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

    contador.textContent = totalItems;
}

function eliminarDelCarrito(id) {
    const carrito = obtenerCarrito();
    const item = carrito.find(i => i.id === id);

    if (item) {
        ajustarStock(id, item.cantidad);
    }

    const actualizado = carrito.filter(item => item.id !== id);
    guardarCarrito(actualizado);
    renderizarListaCarrito();
    actualizarContadorCarrito();
}

function calcularTotal(carrito) {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

function renderizarListaCarrito() {
    const contenedor = document.querySelector("#lista-carrito");
    if (!contenedor) return;

    const carrito = obtenerCarrito();
    contenedor.innerHTML = "";

    if (carrito.length === 0) {
        contenedor.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío.</p>`;
    }

    carrito.forEach(item => {
        const fila = document.createElement("div");
        fila.classList.add("carrito-item");

        fila.innerHTML = `
            <div class="carrito-item__imagen">
                <img src="${item.imagen}" alt="${item.nombre}">
            </div>
            <div class="carrito-item__info">
                <span>${item.nombre}</span>
                <button class="btn-restar" data-id="${item.id}">−</button>
                <span>${item.cantidad}</span>
                <button class="btn-sumar" data-id="${item.id}">+</button>
            </div>
            <span class="etiqueta-precio">$${(item.precio * item.cantidad).toLocaleString("es-CL")}</span>
            <button class="btn-eliminar" data-id="${item.id}">Quitar</button>
        `;

        contenedor.appendChild(fila);
    });

    const totalEl = document.querySelector("#carrito-total");
    if (totalEl) {
        totalEl.textContent = `$${calcularTotal(carrito).toLocaleString("es-CL")}`;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorCarrito();
    renderizarListaCarrito();

    const listaEl = document.querySelector("#lista-carrito");
    if (listaEl) {
        listaEl.addEventListener("click", (evento) => {
        const id = Number(evento.target.dataset.id);

        if (evento.target.classList.contains("btn-eliminar")) {
            eliminarDelCarrito(id);
        }

        if (evento.target.classList.contains("btn-sumar")) {
            const item = obtenerCarrito().find(p => p.id === id);
            if (item) agregarAlCarrito(item);
            renderizarListaCarrito();
        }

        if (evento.target.classList.contains("btn-restar")) {
            const item = obtenerCarrito().find(p => p.id === id);
            if (item) quitarDelCarrito(item);
            renderizarListaCarrito();
        }
        });
    }

    const btnVaciar = document.querySelector("#btn-vaciar");
    if (btnVaciar) {
        btnVaciar.addEventListener("click", () => {
            const carrito = obtenerCarrito();
            carrito.forEach(item => ajustarStock(item.id, item.cantidad));

            guardarCarrito([]);
            renderizarListaCarrito();
            actualizarContadorCarrito();
        });
    }

    const btnComprar = document.querySelector("#btn-comprar");
    if (btnComprar) {
        btnComprar.addEventListener("click", () => {
            alert("¡Compra simulada con éxito!");
            guardarCarrito([]);
            renderizarListaCarrito();
            actualizarContadorCarrito();
        });
    }
});
