// Validaciones de formulario y lógica de sesión de usuario

document.addEventListener('DOMContentLoaded', () => {
    // Definimos las páginas que usan la lógica de inicio de sesión
    const loginPages = ['index.html', 'incidentes.html', 'contactanos.html', 'donar.html','contactanos.html'];

    // --- LÓGICA COMPARTIDA POR LAS PÁGINAS CON MENÚ DE INICIO DE SESIÓN ---
    if (loginPages.some(page => window.location.pathname.includes(page))) {
        // Referencias a elementos del DOM de la barra de navegación
        const loginForm = document.getElementById('loginForm');
        const logoutButton = document.getElementById('logoutButton');
        const forgotPasswordLink = document.getElementById('forgotPassword');

        // Lógica para abrir el dropdown si se viene de otra página (solo aplica a index.html)
        if (window.location.pathname.includes('index.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            const action = urlParams.get('action');

            if (action === 'openLogin') {
                const loginDropdownToggle = document.getElementById('btnIniciarSesion');
                if (loginDropdownToggle) {
                    const bsDropdown = new bootstrap.Dropdown(loginDropdownToggle);
                    bsDropdown.show();
                }
            }
        }

        // Event listeners para los elementos de inicio de sesión
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                handleLogin();
            });
        }
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                forgotPassword();
            });
        }


    }

    // --- LÓGICA ESPECÍFICA PARA LA PÁGINA DE PERFIL (perfil.html) ---
    else if (window.location.pathname.includes('perfil.html')) {

        // Mostramos los datos de perfil al cargar la página
        displayProfileData();

        // Referencias a los botones
        const btnEditar = document.getElementById('btnEditar');
        const btnGuardar = document.getElementById('btnGuardar');
        const btnCancelar = document.getElementById('btnCancelar');

        // Referencias a los pares de <span> e <input>
        const lblNombre = document.getElementById('lblNombre');
        const inputNombre = document.getElementById('inputNombre');
        const lblRut = document.getElementById('lblRut');
        const inputRut = document.getElementById('inputRut');
        const lblCorreo = document.getElementById('lblCorreo');
        const inputCorreo = document.getElementById('inputCorreo');
        const lblDireccion = document.getElementById('lblDireccion');
        const inputDireccion = document.getElementById('inputDireccion');
        const lblTelefono = document.getElementById('lblTelefono');
        const inputTelefono = document.getElementById('inputTelefono');

        // Event Listener para el botón de EDITAR
        btnEditar.addEventListener('click', () => {
            // Asignamos los valores actuales de los labels a los inputs para que se puedan editar
            inputNombre.value = lblNombre.textContent;
            inputRut.value = lblRut.textContent;
            inputCorreo.value = lblCorreo.textContent;
            inputDireccion.value = lblDireccion.textContent;
            inputTelefono.value = lblTelefono.textContent;

            // Ocultamos los labels y mostramos los inputs
            lblNombre.style.display = 'none';
            inputNombre.style.display = 'block';
            lblRut.style.display = 'none';
            inputRut.style.display = 'block';
            lblCorreo.style.display = 'none';
            inputCorreo.style.display = 'block';
            lblDireccion.style.display = 'none';
            inputDireccion.style.display = 'block';
            lblTelefono.style.display = 'none';
            inputTelefono.style.display = 'block';

            // Ocultamos el botón Editar y mostramos Guardar y Cancelar
            btnEditar.style.display = 'none';
            btnGuardar.style.display = 'inline-block';
            btnCancelar.style.display = 'inline-block';
        });

        // Event Listener para el botón de GUARDAR
        btnGuardar.addEventListener('click', () => {
            // Obtenemos los datos actuales del usuario y los actualizamos con los nuevos valores
            const user = JSON.parse(localStorage.getItem('usuarioLogueado'));
            user.nombre = inputNombre.value;
            user.rut = inputRut.value;
            user.correo = inputCorreo.value;
            user.direccion = inputDireccion.value;
            user.telefono = inputTelefono.value;

            // Actualizamos los datos del usuario en localStorage
            localStorage.setItem('usuarioLogueado', JSON.stringify(user));

            // Actualizamos el texto de los labels con los nuevos valores
            lblNombre.textContent = user.nombre;
            lblRut.textContent = user.rut;
            lblCorreo.textContent = user.correo;
            lblDireccion.textContent = user.direccion;
            lblTelefono.textContent = user.telefono;

            // Ocultamos los inputs y mostramos los labels
            lblNombre.style.display = 'block';
            inputNombre.style.display = 'none';
            lblRut.style.display = 'block';
            inputRut.style.display = 'none';
            lblCorreo.style.display = 'block';
            inputCorreo.style.display = 'none';
            lblDireccion.style.display = 'block';
            inputDireccion.style.display = 'none';
            lblTelefono.style.display = 'block';
            inputTelefono.style.display = 'none';

            // Ocultamos Guardar/Cancelar y mostramos el botón Editar
            btnEditar.style.display = 'inline-block';
            btnGuardar.style.display = 'none';
            btnCancelar.style.display = 'none';

            alert('Perfil actualizado con éxito.');
        });

        // Event Listener para el botón de CANCELAR
        btnCancelar.addEventListener('click', () => {
            // Ocultamos los inputs y mostramos los labels, ya que no se guardaron los cambios
            lblNombre.style.display = 'block';
            inputNombre.style.display = 'none';
            lblRut.style.display = 'block';
            inputRut.style.display = 'none';
            lblCorreo.style.display = 'block';
            inputCorreo.style.display = 'none';
            lblDireccion.style.display = 'block';
            inputDireccion.style.display = 'none';
            lblTelefono.style.display = 'block';
            inputTelefono.style.display = 'none';

            // Ocultamos Guardar/Cancelar y mostramos el botón Editar
            btnEditar.style.display = 'inline-block';
            btnGuardar.style.display = 'none';
            btnCancelar.style.display = 'none';
        });

        // Event listener para el botón de cerrar sesión dentro del menú de perfil
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
    }

    // --- LÓGICA ESPECÍFICA PARA LA PÁGINA DE REGISTRO (registrarse.html) ---
    else if (window.location.pathname.includes('registrarse.html')) {
        const form = document.getElementById("form");

        // Las constantes del formulario DEBEN estar aquí, ya que solo existen en esta página
        const formFields = {
            rut: { element: document.getElementById("rut"), message: "Rut debe contener 9 a 11 caracteres y ser válido." },
            nombre: { element: document.getElementById("nombre"), min: 2, max: 50, message: "Nombre debe contener 2 a 50 caracteres." },
            correo: { element: document.getElementById("correo"), message: "Correo debe tener un formato válido (usuario@dominio.com)." },
            direccion: { element: document.getElementById("direccion"), min: 10, max: 100, message: "Dirección debe contener 10 a 100 caracteres." },
            telefono: { element: document.getElementById("telefono"), min: 9, max: 10, message: "Teléfono debe contener 9 a 10 caracteres." },
            nombre_usu: { element: document.getElementById("nombre_usu"), min: 4, max: 20, message: "Usuario debe contener 4 a 20 caracteres." },
            contrasena: { element: document.getElementById("contrasena"), min: 8, max: 15, message: "Contraseña debe contener 8 a 15 caracteres." },
            confirmar_contrasena: { element: document.getElementById("confirmar_contrasena"), message: "Las contraseñas no coinciden." },
            terminos: { element: document.getElementById("terminos"), message: "Debes aceptar los términos y condiciones." }
        };

        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                // Pasamos formFields a la función para que pueda acceder a los elementos
                if (validateForm(formFields)) {
                    sendData(formFields);
                }
            });
        }
        // Pasamos formFields a la función para configurar la validación en tiempo real
        setupRealtimeValidation(formFields);
    }

    // --- LÓGICA ESPECÍFICA PARA LA PÁGINA DE PERFIL (perfil.html) ---
    else if (window.location.pathname.includes('perfil.html')) {
        displayProfileData();
    }

    // --- LÓGICA QUE SE EJECUTA EN TODAS LAS PÁGINAS ---
    // checkUserStatus debe ejecutarse siempre para actualizar la navegación
    checkUserStatus();
});

// También verificar el estado al regresar a la página (por caché)
window.addEventListener('pageshow', () => {
    checkUserStatus();
});

// --- Lógica de Validación del Formulario de Registro ---

/**
 * Valida todos los campos del formulario de registro.
 * Ahora recibe formFields como argumento para ser modular.
 */
function validateForm(formFields) {
    clearErrorMessages();

    let isFormValid = true;

    for (const key in formFields) {
        const field = formFields[key];
        if (["correo", "confirmar_contrasena", "terminos"].includes(key)) {
            continue;
        }

        if (!field.element || !field.element.value.trim() || field.element.value.length < field.min || field.element.value.length > field.max) {
            showError(key, field.message);
            isFormValid = false;
        }
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formFields.correo.element.value || !emailRegex.test(formFields.correo.element.value) || formFields.correo.element.value.length > 100) {
        showError("correo", "Correo debe tener un formato válido (ej. usuario@dominio.com) y no exceder los 100 caracteres.");
        isFormValid = false;
    }

    if (formFields.contrasena.element.value !== formFields.confirmar_contrasena.element.value) {
        showError("confirmar_contrasena", "Las contraseñas no coinciden.");
        isFormValid = false;
    }

    if (!formFields.terminos.element.checked) {
        showError("terminos", "Debes aceptar los términos y condiciones del servicio.");
        isFormValid = false;
    }

    const rutValue = formFields.rut.element.value.replace(/[\.-]/g, '');
    if (!/^\d{7,8}[0-9kK]$/.test(rutValue)) {
        showError("rut", "Formato de RUT inválido. Ej: 12.345.678-9");
        isFormValid = false;
    }

    return isFormValid;
}

/**
 * Muestra un mensaje de error para un campo específico.
 */
function showError(fieldId, message) {
    const fieldElement = document.getElementById(fieldId);
    if (!fieldElement) return console.error(`Campo con ID ${fieldId} no encontrado.`);

    const container = fieldElement.closest('.form-group-registro') || fieldElement.closest('.checkbox-container');
    if (!container) return console.error(`Contenedor para campo ${fieldId} no encontrado.`);

    const errorElement = container.querySelector('.mensajeError');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = "block";
        errorElement.style.color = "red";
    }

    if (fieldElement.tagName === 'INPUT') {
        fieldElement.style.borderColor = "red";
    }
}

/**
 * Muestra un mensaje de error en el formulario de inicio de sesión.
 */
function showLoginError(message) {
    const errorElement = document.getElementById('loginErrorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.style.color = 'red';
        errorElement.style.marginBottom = '1rem';
    }
}

/**
 * Limpia todos los mensajes y estilos de error del formulario.
 */
function clearErrorMessages() {
    const errorElements = document.querySelectorAll('.mensajeError');
    errorElements.forEach(el => {
        el.textContent = "";
        el.style.display = "none";
    });

    const formInputs = document.querySelectorAll('.form-control-registro');
    formInputs.forEach(input => {
        input.style.borderColor = "";
    });
}

/**
 * Configura los event listeners para la validación en tiempo real.
 * Ahora recibe formFields como argumento.
 */
function setupRealtimeValidation(formFields) {
    const fieldsToValidate = ['rut', 'nombre', 'correo', 'direccion', 'telefono', 'nombre_usu', 'contrasena', 'confirmar_contrasena'];

    fieldsToValidate.forEach(fieldId => {
        const field = formFields[fieldId].element;
        if (field) {
            if (fieldId === 'confirmar_contrasena' || fieldId === 'contrasena') {
                field.addEventListener('input', () => {
                    validateSingleField(fieldId, formFields);
                    validateSingleField('contrasena', formFields);
                });
            } else {
                field.addEventListener('blur', () => validateSingleField(fieldId, formFields));
            }
        }
    });
}

/**
 * Valida un solo campo y muestra el mensaje de error si falla.
 * Ahora recibe formFields como argumento.
 */
function validateSingleField(fieldId, formFields) {
    clearErrorMessages();
    validateForm(formFields);
}

// --- Lógica de Sesión de Usuario ---

/**
 * Simula el envío de datos de registro y guarda la información del usuario en localStorage.
 * Ahora recibe formFields como argumento.
 */
function sendData(formFields) {
    const user = {
        rut: formFields.rut.element.value,
        nombre: formFields.nombre.element.value,
        correo: formFields.correo.element.value,
        direccion: formFields.direccion.element.value,
        telefono: formFields.telefono.element.value,
        nombre_usu: formFields.nombre_usu.element.value,
        contrasena: formFields.contrasena.element.value
    };

    const usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];

    const correoExiste = usuarios.some(u => u.correo === user.correo);
    if (correoExiste) {
        alert("El correo electrónico ya está registrado. Por favor, usa otro.");
        return;
    }

    usuarios.push(user);
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));
    localStorage.setItem('usuarioLogueado', JSON.stringify(user));

    alert("¡Registro exitoso! Se ha iniciado sesión automáticamente.");
    window.location.href = "../home/index.html";
}

/**
 * Maneja el inicio de sesión.
 */
function handleLogin() {
    document.getElementById('loginErrorMessage').style.display = 'none';

    const storedUsers = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
    const loginEmail = document.getElementById('loginEmail').value;
    const loginPassword = document.getElementById('loginPassword').value;

    const foundUser = storedUsers.find(user => user.correo === loginEmail && user.contrasena === loginPassword);

    if (foundUser) {
        localStorage.setItem('usuarioLogueado', JSON.stringify(foundUser));
        checkUserStatus();

        const dropdownToggle = document.querySelector('[data-bs-toggle="dropdown"]');
        if (dropdownToggle) {
            const bsDropdown = new bootstrap.Dropdown(dropdownToggle);
            bsDropdown.hide();
        }
    } else {
        showLoginError('Correo o contraseña incorrectos.');
    }
}

/**
 * Cierra la sesión del usuario.
 */
function logout() {
    localStorage.removeItem('usuarioLogueado');
    checkUserStatus();
    window.location.href = "../home/index.html";
}

/**
 * Verifica si hay un usuario logueado y actualiza la interfaz de navegación.
 */
function checkUserStatus() {
    const user = JSON.parse(localStorage.getItem('usuarioLogueado'));

    const btnIniciarSesion = document.getElementById('btnIniciarSesion');
    const btnUsuario = document.getElementById('btnUsuario');
    const loginDropdownContent = document.getElementById('loginDropdownContent');
    const userMenuOptions = document.getElementById('userMenuOptions');

    if (user && btnIniciarSesion && btnUsuario) {
        btnIniciarSesion.style.display = 'none';
        btnUsuario.style.display = 'flex';
        if (loginDropdownContent) loginDropdownContent.style.display = 'none';
        if (userMenuOptions) userMenuOptions.style.display = 'block';

        const lblNombreUsuario = document.getElementById('lblNombre_usu_nav');
        if (lblNombreUsuario) lblNombreUsuario.textContent = user.nombre_usu || user.nombre;

        updateProfileImage(user.nombre_usu, document.getElementById('imgPerfilNav'));

    } else if (btnIniciarSesion && btnUsuario) {
        btnIniciarSesion.style.display = 'block';
        btnUsuario.style.display = 'none';
        if (loginDropdownContent) loginDropdownContent.style.display = 'block';
        if (userMenuOptions) userMenuOptions.style.display = 'none';
    }
}

/** Función cambio de contraseña */
function forgotPassword() {
    const email = prompt("Por favor, ingresa tu correo electrónico para restablecer tu contraseña.");
    if (!email) {
        return;
    }
    let storedUsers = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
    const foundUser = storedUsers.find(user => user.correo === email);
    if (foundUser) {
        const newPassword = prompt("Usuario encontrado. Por favor, ingresa tu nueva contraseña:");
        if (newPassword) {
            const userIndex = storedUsers.findIndex(user => user.correo === email);
            storedUsers[userIndex].contrasena = newPassword;
            localStorage.setItem('usuariosRegistrados', JSON.stringify(storedUsers));
            alert("¡Contraseña actualizada con éxito!");
        }
    } else {
        alert("El correo electrónico no está registrado.");
    }
}

/**
 * Muestra los datos del usuario en la página de perfil.
 */
function displayProfileData() {
    const user = JSON.parse(localStorage.getItem('usuarioLogueado'));
    if (!user) {
        window.location.href = "../home/index.html";
        return;
    }
    const labels = {
        lblNombre: 'nombre', lblRut: 'rut', lblCorreo: 'correo',
        lblDireccion: 'direccion', lblTelefono: 'telefono', lblNombre_usu: 'nombre_usu'
    };
    for (const id in labels) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = user[labels[id]] || '';
        }
    }
    updateProfileImage(user.nombre_usu, document.getElementById("imgPerfil"));
}

/**
 * Actualiza la imagen de perfil según el nombre de usuario.
 */
function updateProfileImage(username, imgElement) {
    if (!imgElement) return;
    let imagePath = "../assets/perfil-default.png";
    if (username === "Rubén") {
        imagePath = "../assets/ruben.jpg";
    } else if (username === "Mauricio") {
        imagePath = "../assets/mauricio.jpg";
    } else if (username === "Ezequiel") {
        imagePath = "../assets/ezequiel.jpg";
    }
    imgElement.src = imagePath;
}