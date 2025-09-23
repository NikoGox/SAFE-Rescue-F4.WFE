// Validaciones de formulario y lógica de sesión de usuario

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const form = document.getElementById("form");
    const loginForm = document.getElementById('loginForm');
    const logoutButton = document.getElementById('logoutButton');

    // Configurar el formulario de registro si existe
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (validateForm()) {
                sendData();
            }
        });
    }

    // Configurar el formulario de inicio de sesión si existe
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }

    // Configurar el botón de cerrar sesión si existe
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Verificar el estado del usuario al cargar la página
    checkUserStatus();

    // Ejecutar función específica para la página de perfil
    if (window.location.pathname.includes('perfil.html')) {
        displayProfileData();
    }

    // --- Lógica de validación en tiempo real ---
    setupRealtimeValidation();
});

// También verificar el estado al regresar a la página (por caché)
window.addEventListener('pageshow', () => {
    checkUserStatus();
});

// --- Lógica de Validación del Formulario de Registro ---

const formFields = {
    rut: {
        element: document.getElementById("rut"),
        message: "Rut debe contener 9 a 11 caracteres y ser válido."
    },
    nombre: {
        element: document.getElementById("nombre"),
        min: 2,
        max: 50,
        message: "Nombre debe contener 2 a 50 caracteres."
    },
    correo: {
        element: document.getElementById("correo"),
        message: "Correo debe tener un formato válido (usuario@dominio.com)."
    },
    direccion: {
        element: document.getElementById("direccion"),
        min: 10,
        max: 100,
        message: "Dirección debe contener 10 a 100 caracteres."
    },
    telefono: {
        element: document.getElementById("telefono"),
        min: 9,
        max: 10,
        message: "Teléfono debe contener 9 a 10 caracteres."
    },
    nombre_usu: {
        element: document.getElementById("nombre_usu"),
        min: 4,
        max: 20,
        message: "Usuario debe contener 4 a 20 caracteres."
    },
    contrasena: {
        element: document.getElementById("contrasena"),
        min: 8,
        max: 15,
        message: "Contraseña debe contener 8 a 15 caracteres."
    },
    confirmar_contrasena: {
        element: document.getElementById("confirmar_contrasena"),
        message: "Las contraseñas no coinciden."
    },
    terminos: {
        element: document.getElementById("terminos"),
        message: "Debes aceptar los términos y condiciones."
    }
};

/**
 * Valida todos los campos del formulario de registro.
 * @returns {boolean} - true si el formulario es válido, de lo contrario false.
 */
function validateForm() {
    clearErrorMessages();

    let isFormValid = true;

    // Validación de campos de texto
    for (const key in formFields) {
        const field = formFields[key];
        // Saltamos los campos que tienen una validación especial
        if (["correo", "confirmar_contrasena", "terminos"].includes(key)) {
            continue;
        }

        if (!field.element || !field.element.value.trim() || field.element.value.length < field.min || field.element.value.length > field.max) {
            showError(key, field.message);
            isFormValid = false;
        }
    }

    // Validación de correo electrónico
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formFields.correo.element.value || !emailRegex.test(formFields.correo.element.value) || formFields.correo.element.value.length > 100) {
        showError("correo", "Correo debe tener un formato válido (ej. usuario@dominio.com) y no exceder los 100 caracteres.");
        isFormValid = false;
    }

    // Validación de contraseñas
    if (formFields.contrasena.element.value !== formFields.confirmar_contrasena.element.value) {
        showError("confirmar_contrasena", "Las contraseñas no coinciden.");
        isFormValid = false;
    }

    // Validación de checkbox
    if (!formFields.terminos.element.checked) {
        showError("terminos", "Debes aceptar los términos y condiciones del servicio.");
        isFormValid = false;
    }

    // Implementación de validación de RUT de ejemplo (simplificada)
    // Para una validación robusta, se necesita un algoritmo más complejo (Módulo 11).
    const rutValue = formFields.rut.element.value.replace(/[\.-]/g, '');
    if (!/^\d{7,8}[0-9kK]$/.test(rutValue)) {
        showError("rut", "Formato de RUT inválido. Ej: 12.345.678-9");
        isFormValid = false;
    }

    return isFormValid;
}

/**
 * Muestra un mensaje de error para un campo específico.
 * @param {string} fieldId - El ID del campo con el error.
 * @param {string} message - El mensaje de error a mostrar.
 */
function showError(fieldId, message) {
    const fieldElement = document.getElementById(fieldId);
    if (!fieldElement) return console.error(`Campo con ID ${fieldId} no encontrado.`);

    // Obtener el contenedor del campo
    const container = fieldElement.closest('.form-group-registro') || fieldElement.closest('.checkbox-container');
    if (!container) return console.error(`Contenedor para campo ${fieldId} no encontrado.`);

    // Buscar el elemento de mensaje de error
    const errorElement = container.querySelector('.mensajeError');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = "block";
        errorElement.style.color = "red";
    }

    // Aplicar estilo de error al campo, si es un input
    if (fieldElement.tagName === 'INPUT') {
        fieldElement.style.borderColor = "red";
    }
}

/**
 * Muestra un mensaje de error en el formulario de inicio de sesión.
 * @param {string} message - El mensaje de error a mostrar.
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
 */
function setupRealtimeValidation() {
    const fieldsToValidate = ['rut', 'nombre', 'correo', 'direccion', 'telefono', 'nombre_usu', 'contrasena', 'confirmar_contrasena'];

    fieldsToValidate.forEach(fieldId => {
        const field = formFields[fieldId].element;
        if (field) {
            if (fieldId === 'confirmar_contrasena' || fieldId === 'contrasena') {
                field.addEventListener('input', () => {
                    validateSingleField(fieldId);
                    validateSingleField('contrasena'); // Validar ambas contraseñas al escribir en cualquiera
                });
            } else {
                field.addEventListener('blur', () => validateSingleField(fieldId));
            }
        }
    });
}

/**
 * Valida un solo campo y muestra el mensaje de error si falla.
 * @param {string} fieldId - El ID del campo a validar.
 */
function validateSingleField(fieldId) {
    clearErrorMessages(); // Limpiamos todos los errores antes de volver a validarlos todos

    // Volvemos a ejecutar la validación completa para que los mensajes de error aparezcan en todos los campos a la vez
    validateForm();
}


// --- Lógica de Sesión de Usuario ---

/**
 * Simula el envío de datos de registro y guarda la información del usuario en localStorage.
 */
function sendData() {
    const user = {
        rut: formFields.rut.element.value,
        nombre: formFields.nombre.element.value,
        correo: formFields.correo.element.value,
        direccion: formFields.direccion.element.value,
        telefono: formFields.telefono.element.value,
        nombre_usu: formFields.nombre_usu.element.value,
        contrasena: formFields.contrasena.element.value
    };

    // Obtenemos los usuarios existentes o inicializamos un arreglo vacío si no hay
    const usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];

    // Verificamos si el correo ya existe para evitar duplicados
    const correoExiste = usuarios.some(u => u.correo === user.correo);
    if (correoExiste) {
        alert("El correo electrónico ya está registrado. Por favor, usa otro.");
        return; // Detenemos la ejecución de la función
    }

    // Agregamos el nuevo usuario al arreglo
    usuarios.push(user);

    // Guardamos el arreglo completo en localStorage
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));

    // ¡NUEVO! Iniciamos la sesión del usuario inmediatamente después del registro
    localStorage.setItem('usuarioLogueado', JSON.stringify(user));

    alert("¡Registro exitoso! Se ha iniciado sesión automáticamente.");
    window.location.href = "../home/index.html";
}
/**
 * Maneja el inicio de sesión.
 */
function handleLogin() {
    document.getElementById('loginErrorMessage').style.display = 'none';

    // Obtenemos el arreglo de usuarios del localStorage
    const storedUsers = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];

    const loginEmail = document.getElementById('loginEmail').value;
    const loginPassword = document.getElementById('loginPassword').value;

    // Buscamos un usuario que coincida con las credenciales
    const foundUser = storedUsers.find(user =>
        user.correo === loginEmail && user.contrasena === loginPassword
    );

    if (foundUser) {
        // Credenciales correctas: guardar el usuario en el estado de sesión
        localStorage.setItem('usuarioLogueado', JSON.stringify(foundUser));
        checkUserStatus();

        // Cerrar el menú desplegable de Bootstrap
        const dropdownToggle = document.querySelector('[data-bs-toggle="dropdown"]');
        if (dropdownToggle) {
            const bsDropdown = new bootstrap.Dropdown(dropdownToggle);
            bsDropdown.hide();
        }
    } else {
        // Credenciales incorrectas: mostrar mensaje de error
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
    const loginDropdownContent = document.getElementById('loginDropdownContent'); // ¡NUEVO!
    const userMenuOptions = document.getElementById('userMenuOptions');

    if (user && btnIniciarSesion && btnUsuario) {
        // Usuario logueado: mostrar info de perfil
        btnIniciarSesion.style.display = 'none';
        btnUsuario.style.display = 'flex';
        if (loginDropdownContent) loginDropdownContent.style.display = 'none'; // ¡CAMBIO!
        if (userMenuOptions) userMenuOptions.style.display = 'block';

        // Actualizar nombre y foto de perfil en la navegación
        const lblNombreUsuario = document.getElementById('lblNombre_usu_nav');
        if (lblNombreUsuario) lblNombreUsuario.textContent = user.nombre_usu || user.nombre;

        updateProfileImage(user.nombre_usu, document.getElementById('imgPerfilNav'));

    } else if (btnIniciarSesion && btnUsuario) {
        // Usuario no logueado: mostrar botón de inicio de sesión
        btnIniciarSesion.style.display = 'block';
        btnUsuario.style.display = 'none';
        if (loginDropdownContent) loginDropdownContent.style.display = 'block'; // ¡CAMBIO!
        if (userMenuOptions) userMenuOptions.style.display = 'none';
    }
}



/**
 * Muestra los datos del usuario en la página de perfil.
 */
function displayProfileData() {
    const user = JSON.parse(localStorage.getItem('usuarioLogueado'));

    if (!user) {
        window.location.href = "../home/index.html"; // Redirigir si no hay usuario
        return;
    }

    const labels = {
        lblNombre: 'nombre',
        lblRut: 'rut',
        lblCorreo: 'correo',
        lblDireccion: 'direccion',
        lblTelefono: 'telefono',
        lblNombre_usu: 'nombre_usu'
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
 * @param {string} username - El nombre de usuario para determinar la imagen.
 * @param {HTMLElement} imgElement - El elemento <img> a actualizar.
 */
function updateProfileImage(username, imgElement) {
    if (!imgElement) return;

    let imagePath = "../assets/perfil-default.png"; // Imagen por defecto

    if (username === "Rubén") {
        imagePath = "../assets/ruben.jpg";
    } else if (username === "Mauricio") {
        imagePath = "../assets/mauricio.jpg";
    } else if (username === "Ezequiel") {
        imagePath = "../assets/ezequiel.jpg";
    }

    imgElement.src = imagePath;
}