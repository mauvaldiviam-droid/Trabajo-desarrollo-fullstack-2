const PRODUCTOS_INICIALES = [
    {
        id: 1, nombre: "Brocha", precio: 5990, stock: 12,
        imagen: "img/images.jpg",
        detalles: "Brocha de cerdas sintéticas de 2 pulgadas. Ideal para pintura al agua y esmalte, mango de madera ergonómico y virola resistente a la corrosión."
    },
    {
        id: 2, nombre: "Tarro de pintura", precio: 45990, stock: 5,
        imagen: "img/images (1).jpg",
        detalles: "Pintura látex interior/exterior, tarro de 1 galón. Alto poder cubritivo, secado al tacto en 4 horas y bajo olor."
    },
    {
        id: 3, nombre: "Bolsa de clavos", precio: 6990, stock: 30,
        imagen: "img/images (2).jpg",
        detalles: "Bolsa de 1 kg de clavos de acero galvanizado de 2 pulgadas, resistentes a la corrosión, ideales para estructuras de madera."
    },
];

function obtenerProductos() {
    const datos = localStorage.getItem("productos");
    if (datos) return JSON.parse(datos);

    guardarProductos(PRODUCTOS_INICIALES);
    return PRODUCTOS_INICIALES;
}

function guardarProductos(productos) {
    localStorage.setItem("productos", JSON.stringify(productos));
}

function siguienteIdProducto(productos) {
    return productos.reduce((max, p) => Math.max(max, p.id), 0) + 1;
}

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

function ajustarStock(idProducto, delta) {
    const productos = obtenerProductos();
    const producto = productos.find(p => p.id === idProducto);
    if (!producto) return null;

    producto.stock = Math.max(0, producto.stock + delta);
    guardarProductos(productos);
    return producto.stock;
}
