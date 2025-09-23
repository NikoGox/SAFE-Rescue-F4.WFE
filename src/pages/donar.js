document.addEventListener('DOMContentLoaded', () => {
    // Objeto para manejar las diferentes secciones (pantallas)
    const pantallas = {
        monto: document.getElementById('card-monto-donacion'),
        formulario: document.getElementById('card-monto-formulario'),
        confirmacion: document.getElementById('card-confirmar-donacion'),
        redirigiendo: document.getElementById('card-redirigiendo-donacion')
    };

    // --- Elementos del Formulario y Botones ---
    const formularioDonacion = document.getElementById('formulario-donacion');
    const inputNombre = document.getElementById('nombre');
    const inputApellido = document.getElementById('apellido');
    const inputEmail = document.getElementById('email');
    const inputTelefono = document.getElementById('telefono');
    const telefonoError = document.getElementById('telefono-error');

    // --- Lógica de Homenaje ---
    const checkboxHomenaje = document.getElementById('checkbox-homenaje');
    const detallesHomenaje = document.getElementById('detalles-homenaje');
    const tipoHomenaje = document.getElementById('tipo-homenaje');
    const detalleHomenaje = document.getElementById('detalle-homenaje');

    // --- Botones de Navegación ---
    const botonesMonto = document.querySelectorAll('.monto-btn:not(#otro-monto-btn)');
    const botonOtroMonto = document.getElementById('otro-monto-btn');
    const botonConfirmarPago = document.getElementById('boton-confirmar-pago');
    const botonVolver = document.getElementById('boton-volver');

    // --- Elementos de Visualización de Datos ---
    const montoMostrado = document.getElementById('monto-mostrado');
    const montoFormulario = document.getElementById('monto-formulario');
    const confirmarNombre = document.getElementById('confirmar-nombre');
    const confirmarEmail = document.getElementById('confirmar-email');
    const confirmarMonto = document.getElementById('confirmar-monto');
    const confirmarHomenajeContenedor = document.getElementById('confirmar-homenaje-contenedor');
    const confirmarHomenaje = document.getElementById('confirmar-homenaje');
    const confirmarTelefonoContenedor = document.getElementById('confirmar-telefono-contenedor');
    const confirmarTelefono = document.getElementById('confirmar-telefono');
    const nombreAgradecimiento = document.getElementById('nombre-agradecimiento');

    // --- Variables de Estado ---
    let montoSeleccionado = 0;
    let datosUsuario = {};

    /**
     * Muestra una pantalla específica y oculta las demás.
     * @param {string} nombrePantalla - Clave de la pantalla a mostrar.
     */
    function mostrarPantalla(nombrePantalla) {
        Object.values(pantallas).forEach(pantalla => pantalla.style.display = 'none');
        if (pantallas[nombrePantalla]) {
            pantallas[nombrePantalla].style.display = 'block';
        }
    }

    /**
     * Formatea un número como moneda chilena.
     * @param {number} monto - El monto a formatear.
     * @returns {string} - El monto formateado.
     */
    function formatearMoneda(monto) {
        return `$${new Intl.NumberFormat('es-CL').format(monto)}`;
    }

    /**
     * Establece el monto de la donación y avanza a la pantalla del formulario.
     * @param {number} monto - El monto seleccionado.
     */
    function seleccionarMonto(monto) {
        montoSeleccionado = monto;
        const montoFormateado = formatearMoneda(monto);
        montoMostrado.textContent = montoFormateado;
        montoFormulario.textContent = montoFormateado;
        mostrarPantalla('formulario');
    }

    // --- MANEJO DE EVENTOS ---

    montoFormulario.addEventListener('click', () => {
        formularioDonacion.classList.remove('was-validated');
        inputTelefono.classList.remove('is-invalid', 'is-valid');
        telefonoError.textContent = '';
        // Asegurar que cualquier mensaje de validez personalizado se limpie
        inputTelefono.setCustomValidity('');
        mostrarPantalla('monto');
    });

    botonesMonto.forEach(boton => {
        boton.addEventListener('click', () => {
            seleccionarMonto(parseInt(boton.dataset.amount, 10));
        });
    });

    botonOtroMonto.addEventListener('click', () => {
        const montoIngresado = prompt("Por favor, ingresa el monto que deseas donar:", "25000");
        if (montoIngresado) {
            const monto = parseInt(montoIngresado.trim(), 10);
            if (!isNaN(monto) && monto > 0) {
                seleccionarMonto(monto);
            } else {
                alert("Por favor, ingresa un número válido y mayor a cero.");
            }
        }
    });

    inputTelefono.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
        if (valor.length > 9) valor = valor.slice(0, 9);

        let formateado = '';
        if (valor.length > 0) formateado += valor.substring(0, 1);
        if (valor.length > 1) formateado += ' ' + valor.substring(1, 5);
        if (valor.length > 5) formateado += ' ' + valor.substring(5, 9);
        e.target.value = formateado;
    });

    checkboxHomenaje.addEventListener('change', () => {
        detallesHomenaje.style.display = checkboxHomenaje.checked ? 'block' : 'none';
    });

    formularioDonacion.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Limpiar estados previos
        inputTelefono.classList.remove('is-invalid', 'is-valid');
        telefonoError.textContent = '';
        // Limpiar cualquier customValidity previo
        inputTelefono.setCustomValidity('');
        const telefonoCrudo = inputTelefono.value.replace(/\s/g, '');
        let telefonoEsValido = true;

        // Si el usuario ingresó algún dígito, validarlo a 9 dígitos; si no ingresó nada,
        // no obligamos el teléfono (comportamiento previo)
        if (telefonoCrudo.length > 0) {
            if (telefonoCrudo.length === 9) {
                inputTelefono.classList.add('is-valid');
                inputTelefono.setCustomValidity('');
            } else {
                telefonoEsValido = false;
                inputTelefono.classList.add('is-invalid');
                telefonoError.textContent = 'El número de teléfono debe tener 9 dígitos.';
                // Establecer un mensaje de validez personalizado para que checkValidity() falle
                inputTelefono.setCustomValidity('El número de teléfono debe tener 9 dígitos.');
            }
        }

        // Ahora checkValidity reflejará también el estado del teléfono
        let formularioEsValido = formularioDonacion.checkValidity();
        formularioDonacion.classList.add('was-validated');

        if (!formularioEsValido || !telefonoEsValido) {
            return;
        }

        datosUsuario = {
            nombre: inputNombre.value.trim(),
            apellido: inputApellido.value.trim(),
            email: inputEmail.value.trim(),
            telefono: telefonoCrudo.length === 9 ? inputTelefono.value : null
        };

        confirmarNombre.textContent = `${datosUsuario.nombre} ${datosUsuario.apellido}`;
        confirmarEmail.textContent = datosUsuario.email;
        confirmarMonto.textContent = formatearMoneda(montoSeleccionado);

        if (datosUsuario.telefono) {
            confirmarTelefonoContenedor.style.display = 'block';
            confirmarTelefono.textContent = datosUsuario.telefono;
        } else {
            confirmarTelefonoContenedor.style.display = 'none';
        }

        if (checkboxHomenaje.checked && detalleHomenaje.value.trim()) {
            confirmarHomenaje.textContent = `${tipoHomenaje.value} ${detalleHomenaje.value.trim()}`;
            confirmarHomenajeContenedor.style.display = 'block';
        } else {
            confirmarHomenajeContenedor.style.display = 'none';
        }

        mostrarPantalla('confirmacion');
    });

    botonVolver.addEventListener('click', () => {
        formularioDonacion.classList.remove('was-validated');
        inputTelefono.classList.remove('is-invalid', 'is-valid');
        mostrarPantalla('formulario');
    });

    botonConfirmarPago.addEventListener('click', () => {
        nombreAgradecimiento.textContent = datosUsuario.nombre;
        mostrarPantalla('redirigiendo');
        
        setTimeout(() => {
            alert("¡Donación procesada con éxito! (Simulación). Muchas gracias por tu apoyo.");
            window.location.reload();
        }, 4000);
    });

    mostrarPantalla('monto');
});

