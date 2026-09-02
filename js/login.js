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

function enviarCodigoRecuperacion() {
    const usuarioInput = document.querySelector("#usuario-input").value.trim();

    if (usuarioInput === "") {
        alert("Ingresa tu nombre de usuario.");
        return;
    }

    const usuarios = obtenerUsuarios();
    const encontrado = usuarios.find(u => u.usuario === usuarioInput);

    if (!encontrado) {
        alert("Ese usuario no existe.");
        return;
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem("codigoRecuperacion", JSON.stringify({ usuario: usuarioInput, codigo }));

    alert(`[Simulación de correo]\n\nHemos enviado un código de verificación al correo asociado a "${usuarioInput}".\n\nTu código es: ${codigo}`);

    document.querySelector("#paso-usuario").hidden = true;
    document.querySelector("#paso-codigo").hidden = false;
    document.querySelector("#mensaje-correo").textContent =
        `Ingresa el código que enviamos al correo de "${usuarioInput}" junto con tu nueva contraseña.`;
}

function restablecerContrasena() {
    const codigoInput = document.querySelector("#codigo-input").value.trim();
    const nuevaContrasena = document.querySelector("#contrasena-input").value.trim();

    const datosCodigo = sessionStorage.getItem("codigoRecuperacion");
    if (!datosCodigo) {
        alert("Primero solicita un código de verificación.");
        return;
    }

    const { usuario, codigo } = JSON.parse(datosCodigo);

    if (codigoInput === "") {
        alert("Ingresa el código que enviamos a tu correo.");
        return;
    }

    if (codigoInput !== codigo) {
        alert("El código ingresado no es correcto.");
        return;
    }

    if (nuevaContrasena === "") {
        alert("Ingresa tu nueva contraseña.");
        return;
    }

    const usuarios = obtenerUsuarios();
    const encontrado = usuarios.find(u => u.usuario === usuario);

    if (!encontrado) {
        alert("Ese usuario ya no existe.");
        return;
    }

    encontrado.contrasena = nuevaContrasena;
    guardarUsuarios(usuarios);
    sessionStorage.removeItem("codigoRecuperacion");

    alert("Contraseña actualizada. Ya puedes iniciar sesión.");
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.querySelector("#btn-login");
    if (btnLogin) btnLogin.addEventListener("click", validarLogin);

    const btnEnviarCodigo = document.querySelector("#btn-enviar-codigo");
    if (btnEnviarCodigo) btnEnviarCodigo.addEventListener("click", enviarCodigoRecuperacion);

    const btnRestablecer = document.querySelector("#btn-restablecer");
    if (btnRestablecer) btnRestablecer.addEventListener("click", restablecerContrasena);

    const btnCrear = document.querySelector("#btn-crear");
    if (btnCrear) btnCrear.addEventListener("click", crearUsuario);
});
