function iniciarSesion(usuario) {
    localStorage.setItem("usuarioActual", JSON.stringify(usuario));
    window.location.href = "index_admin.html";
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
    const datos = localStorage.getItem("admin");
    if (datos) return JSON.parse(datos);

    const inicial = [{ usuario: "Admin", contrasena: "1234" }];
    localStorage.setItem("admin", JSON.stringify(inicial));
    return inicial;
}

function validarLogin() {
    const usuarioInput = document.querySelector("#usuario-input").value.trim();
    const contrasenaInput = document.querySelector("#contrasena-input").value.trim();

    const admin = obtenerUsuarios();
    const encontrado = admin.find(
        u => u.usuario === usuarioInput && u.contrasena === contrasenaInput
    );

    if (encontrado) {
        iniciarSesion(encontrado);
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.querySelector("#btn-login-admin");
    if (btnLogin) btnLogin.addEventListener("click", validarLogin);
});
