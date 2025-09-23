document.addEventListener('DOMContentLoaded', () => {

    // 1. Obtener referencias a los campos del formulario
    const inputNombre = document.getElementById('nombre');
    const inputCorreo = document.getElementById('correo');
    const inputTelefono = document.getElementById('telefono');
    const inputDireccion = document.getElementById('direccion');

    // 2. Obtener la referencia al checkbox
    const autofillCheckbox = document.getElementById('autofillCheckbox');

    // 3. Obtener el usuario de localStorage (si existe)
    const user = JSON.parse(localStorage.getItem('usuarioLogueado'));

    // 4. Obtener la referencia al formulario
    const form = document.getElementById('contactForm');


    // 5. Lógica para el autocompletado del formulario
    autofillCheckbox.addEventListener('change', () => {
        if (user && autofillCheckbox.checked) {
            inputNombre.value = user.nombre;
            inputCorreo.value = user.correo;
            inputTelefono.value = user.telefono;
            inputDireccion.value = user.direccion;
        } else {
            inputNombre.value = '';
            inputCorreo.value = '';
            inputTelefono.value = '';
            inputDireccion.value = '';
        }
    });


    // 6. Lógica para el envío del formulario
    form.addEventListener('submit', (event) => {
        // Evitar que el formulario se envíe de forma predeterminada y recargue la página
        event.preventDefault();

        // Aquí podrías añadir tu propia validación si lo necesitas
        // Por ahora, solo mostraremos un mensaje de éxito

        alert('¡Mensaje enviado con éxito!');

        // Opcional: limpiar los campos del formulario después del envío
        form.reset();
    });
});
