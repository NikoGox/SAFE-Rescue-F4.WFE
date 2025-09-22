/* Variables, para ocupar en validación de formulario */
const rut = document.getElementById("rut");
const nombre = document.getElementById("nombre");
const correo = document.getElementById("correo");
const direccion = document.getElementById("direccion");
const telefono = document.getElementById("telefono");
const nombre_usu = document.getElementById("nombre_usu");
const contrasena = document.getElementById("contrasena");
const confirmar_contrasena = document.getElementById("confirmar_contrasena");

/* Constantes, para ocupar en la validacion del formulario */
const form = document.getElementById("form");
const listInputs = document.querySelectorAll(".form-input");

/* Al formulario completo agregamos un evento, con esto evitamos el envio y reseteo del formulario */
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validar()) {
            // Solo enviar si la validación es exitosa
            enviar();
        }
    });
}

/* Función validar */
function validar() {
    /* Cada vez que presione enviar borrar y volver a revisar los mensajes de error */
    listInputs.forEach((element) => {
        if (element.lastElementChild && element.lastElementChild.classList.contains('error-message')) {
            element.lastElementChild.innerHTML = "";
        }
    });

    let todoOk = true; // Variable que nos dirá si todo está correcto

    /* if que valida el rango de caracteres en el campo rut */
    if (!rut.value || rut.value.trim() === "" || rut.value.length > 11 || rut.value.length < 9) {
        mostrarMensajeError("rut", "Rut debe contener 9 a 11 caracteres");
        todoOk = false;
    }

    /* if que valida el rango de caracteres en el campo nombre */
    if (!nombre.value || nombre.value.trim() === "" || nombre.value.length < 2 || nombre.value.length > 50) {
        mostrarMensajeError("nombre", "Nombre debe contener 2 a 50 caracteres");
        todoOk = false;
    }

    /* validar formato correo */
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!correo.value || correo.value.trim() === "" || !emailRegex.test(correo.value.trim())) {
        mostrarMensajeError("correo", "Correo debe tener un formato válido (usuario@dominio.com)");
        todoOk = false;
    }

    /* validar largo correo */
    if (correo.value.length > 100) {
        mostrarMensajeError("correo", "Correo NO debe ser mayor a 100 caracteres");
        todoOk = false;
    }

    /* validar largo usuario y que no sea vacio */
    if (!nombre_usu.value || nombre_usu.value.trim() === "" || nombre_usu.value.length < 4 || nombre_usu.value.length > 20) {
        mostrarMensajeError("nombre_usu", "Usuario debe contener 4 a 20 caracteres");
        todoOk = false;
    }

    /* validar largo direccion y que no sea vacio */
    if (!direccion.value || direccion.value.trim() === "" || direccion.value.length < 10 || direccion.value.length > 100) {
        mostrarMensajeError("direccion", "Dirección debe contener 10 a 100 caracteres");
        todoOk = false;
    }

    /* validar largo telefono y que no sea vacio */
    if (!telefono.value || telefono.value.trim() === "" || telefono.value.length < 9 || telefono.value.length > 10) {
        mostrarMensajeError("telefono", "Teléfono debe contener 9 a 10 caracteres");
        todoOk = false;
    }

    /* validar largo contraseña y que no sea vacio */
    if (!contrasena.value || contrasena.value.trim() === "" || contrasena.value.length < 8 || contrasena.value.length > 15) {
        mostrarMensajeError("contrasena", "Contraseña debe contener 8 a 15 caracteres");
        todoOk = false;
    }

    /* validar que las contraseñas coincidan */
    if (confirmar_contrasena && contrasena.value !== confirmar_contrasena.value) {
        mostrarMensajeError("confirmar_contrasena", "Las contraseñas no coinciden");
        todoOk = false;
    }

    // Si todo está ok
    if (todoOk) {
        alert("¡Todos los campos están correctos!");
        return true;
    }

    return false;
}

/* funcion que muestra el mensaje de error en las validaciones */
function mostrarMensajeError(claseInput, mensaje) {
    const elemento = document.querySelector(`.${claseInput}`);
    if (elemento && elemento.lastElementChild) {
        // Crear elemento de error si no existe
        if (!elemento.lastElementChild.classList.contains('error-message')) {
            const errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.style.color = 'red';
            errorElement.style.fontSize = '0.8rem';
            elemento.appendChild(errorElement);
        }
        elemento.lastElementChild.innerHTML = mensaje;
    }
}

// Función para enviar los datos al resultado
function enviar() {
    const nombreVal = document.getElementById("nombre").value;
    const rutVal = document.getElementById("rut").value;
    const correoVal = document.getElementById("correo").value;
    const direccionVal = document.getElementById("direccion").value;
    const telefonoVal = document.getElementById("telefono").value;
    const nombre_usuVal = document.getElementById("nombre_usu").value;

    // Guardar usuario en localStorage
    const usuario = {
        nombre: nombreVal,
        rut: rutVal,
        correo: correoVal,
        direccion: direccionVal,
        telefono: telefonoVal,
        nombre_usu: nombre_usuVal
    };

    localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));

    // Redirigir a la página principal
    window.location.href = "../home/index.html";
}

// Función que se ejecuta en perfil.html para mostrar los datos
function mostrarDatosPerfil() {
    // Obtener datos de localStorage en lugar de parámetros URL
    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));

    if (!usuario) {
        // Si no hay usuario, redirigir al login
        window.location.href = "../registrarse/registrarse.html";
        return;
    }

    if (!usuario) {
        // Si no hay usuario, redirigir al login
        window.location.href = "../home/index.html";
        return;
    }


    // Verificamos que existan los elementos
    const lblNombre = document.getElementById("lblNombre");
    const lblRut = document.getElementById("lblRut");
    const lblCorreo = document.getElementById("lblCorreo");
    const lblDireccion = document.getElementById("lblDireccion");
    const lblTelefono = document.getElementById("lblTelefono");
    const lblNombre_usu = document.getElementById("lblNombre_usu");
    const imgPerfil = document.getElementById("imgPerfil");

    // Si alguno de esos elementos no existe, salir
    if (!lblNombre || !lblRut || !lblCorreo || !lblDireccion ||
        !lblTelefono || !lblNombre_usu || !imgPerfil) return;

    // Asignamos valores a los labels DESDE localStorage
    lblNombre.textContent = usuario.nombre || "";
    lblRut.textContent = usuario.rut || "";
    lblCorreo.textContent = usuario.correo || "";
    lblDireccion.textContent = usuario.direccion || "";
    lblTelefono.textContent = usuario.telefono || "";
    lblNombre_usu.textContent = usuario.nombre_usu || "";

    // Asignar imagen de perfil
    if (usuario.nombre_usu === "Rubén") {
        imgPerfil.src = "../img/zapatilla.png";
    } else if (usuario.nombre_usu === "Mauricio") {
        imgPerfil.src = "../assets/mauricio.jpg";
    } else if (usuario.nombre_usu === "Juan") {
        imgPerfil.src = "../img/pelota.jpg";
    } else {
        imgPerfil.src = "../assets/perfil-default.png";
    }
}

// Función para verificar si hay un usuario logueado y actualizar la navegación
function verificarEstadoUsuario() {
    // Obtener datos del usuario desde localStorage
    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));

    // Referencias a los elementos del DOM - con verificaciones mejoradas
    const btnIniciarSesion = document.getElementById('btnIniciarSesion');
    const btnUsuario = document.getElementById('btnUsuario');
    const lblNombreUsuario = document.getElementById('lblNombre_usu_nav');
    const imgPerfilNav = document.getElementById('imgPerfilNav');
    const loginForm = document.getElementById('loginForm');
    const userMenuOptions = document.getElementById('userMenuOptions');
    const registerOption = document.querySelector('a[href="../registrarse/registrarse.html"]');

    // Verificar si los elementos existen antes de intentar manipularlos
    if (btnIniciarSesion && btnUsuario) {
        if (usuario) {
            // Si hay usuario logueado, mostrar botón de usuario
            btnIniciarSesion.style.display = 'none';
            btnUsuario.style.display = 'flex';

            // Actualizar datos del usuario si existen los elementos
            if (lblNombreUsuario) {
                lblNombreUsuario.textContent = usuario.nombre_usu || usuario.nombre;
            }

            // Establecer imagen de perfil si existe el elemento
            if (imgPerfilNav) {
                if (usuario.nombre_usu === "Rubén") {
                    imgPerfilNav.src = "../img/zapatilla.png";
                } else if (usuario.nombre_usu === "Mauricio") {
                    imgPerfilNav.src = "../assets/mauricio.jpg";
                } else if (usuario.nombre_usu === "Ezequiel") {
                    imgPerfilNav.src = "../img/pelota.jpg";
                } else {
                    imgPerfilNav.src = "../assets/perfil-default.png";
                }
            }

            // Ocultar/mostrar elementos adicionales si existen
            if (loginForm) loginForm.style.display = 'none';
            if (userMenuOptions) userMenuOptions.style.display = 'block';
            if (registerOption) registerOption.style.display = 'none';
        } else {
            // Si no hay usuario, mostrar botón de iniciar sesión
            btnIniciarSesion.style.display = 'block';
            btnUsuario.style.display = 'none';

            // Mostrar/ocultar elementos adicionales si existen
            if (loginForm) loginForm.style.display = 'block';
            if (userMenuOptions) userMenuOptions.style.display = 'none';
            if (registerOption) registerOption.style.display = 'block';
        }
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    // Eliminar datos de localStorage
    localStorage.removeItem('usuarioLogueado');

    // Actualizar la navegación
    verificarEstadoUsuario();

    // Redirigir a la página principal
    window.location.href = "../home/index.html";
}

// Evento para el formulario de login
function configurarLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Simulamos un login exitoso con datos de prueba
            const usuarioEjemplo = {
                nombre: "Mauricio Tapia",
                nombre_usu: "Mauricio",
                correo: document.getElementById('loginEmail').value
            };

            localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioEjemplo));
            verificarEstadoUsuario();

            // Cerrar el dropdown
            const dropdown = document.querySelector('.dropdown-menu');
            if (dropdown) {
                const bsDropdown = bootstrap.Dropdown.getInstance(dropdown);
                if (bsDropdown) {
                    bsDropdown.hide();
                }
            }
        });
    }

    // Manejar clic en cerrar sesión
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function (e) {
            e.preventDefault();
            cerrarSesion();
        });
    }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    // Verificar estado del usuario en todas las páginas
    verificarEstadoUsuario();

    // Configurar login si existe el formulario (solo en páginas con login)
    if (document.getElementById('loginForm')) {
        configurarLogin();
    }

    // Ejecutar función específica para perfil.html
    if (window.location.pathname.includes('perfil.html')) {
        mostrarDatosPerfil();
    }
});

// También verificar el estado al cambiar entre páginas (opcional)
window.addEventListener('pageshow', function () {
    verificarEstadoUsuario();
});