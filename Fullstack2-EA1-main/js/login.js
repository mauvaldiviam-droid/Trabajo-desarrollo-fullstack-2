function iniciarSesion(usuario) {
    localStorage.setItem("usuarioActual", JSON.stringify(usuario));
    window.location.href = "index.html";
}

function crearUsuario() {
    const usuarioInput = document.querySelector("#usuario-input").value.trim();
    const contrasenaInput = document.querySelector("#contrasena-input").value.trim();

    if (usuarioInput === "" || contrasenaInput === "") {
        alert("Completa usuario y contraseña.");
        return;
    }

    const usuarios = obtenerUsuarios();

    const existe = usuarios.find(u => u.usuario === usuarioInput);
    if (existe) {
        alert("Ese usuario ya existe, elige otro.");
        return;
    }

    usuarios.push({ usuario: usuarioInput, contrasena: contrasenaInput });
    guardarUsuarios(usuarios);

    alert("Cuenta creada. Ya puedes iniciar sesión.");
    window.location.href = "login.html";
}

function obtenerUsuarioActual() {
    const datos = localStorage.getItem("usuarioActual");
    return datos ? JSON.parse(datos) : null;
}

function cerrarSesion() {
    localStorage.removeItem("usuarioActual");
    window.location.href = "login.html";
}

function obtenerUsuarios() {
    const datos = localStorage.getItem("usuarios");
    if (datos) return JSON.parse(datos);

    const inicial = [{ usuario: "Mauricio", contrasena: "1234" }];
    localStorage.setItem("usuarios", JSON.stringify(inicial));
    return inicial;
}

function validarLogin() {
    const usuarioInput = document.querySelector("#usuario-input").value.trim();
    const contrasenaInput = document.querySelector("#contrasena-input").value.trim();

    const usuarios = obtenerUsuarios();
    const encontrado = usuarios.find(
        u => u.usuario === usuarioInput && u.contrasena === contrasenaInput
    );

    if (encontrado) {
        iniciarSesion(encontrado);
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}

function guardarUsuarios(usuarios) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function restablecerContrasena() {
    const usuarioInput = document.querySelector("#usuario-input").value.trim();
    const nuevaContrasena = document.querySelector("#contrasena-input").value.trim();

    const usuarios = obtenerUsuarios();
    const encontrado = usuarios.find(u => u.usuario === usuarioInput);

    if (!encontrado) {
        alert("Ese usuario no existe.");
        return;
    }

    encontrado.contrasena = nuevaContrasena;
    guardarUsuarios(usuarios);

    alert("Contraseña actualizada. Ya puedes iniciar sesión.");
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.querySelector("#btn-login");
    if (btnLogin) btnLogin.addEventListener("click", validarLogin);

    const btnRestablecer = document.querySelector("#btn-restablecer");
    if (btnRestablecer) btnRestablecer.addEventListener("click", restablecerContrasena);

    const btnCrear = document.querySelector("#btn-crear");
    if (btnCrear) btnCrear.addEventListener("click", crearUsuario);
});
