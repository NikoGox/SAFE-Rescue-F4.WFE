
/*Variables, para ocupar en validación de formulario*/
var rut = document.getElementById("rut");
var nombre = document.getElementById("nombre");
var correo = document.getElementById("correo");
var nombre_usu = document.getElementById("nombre_usu");

/*constantes, para ocupar en la validacion del fromulario*/
const form = document.getElementById("form");
const listInputs = document.querySelectorAll(".form-input");


/* al formulario completo agregamos un evento, con esto evitamos el envio y reseteo del formulario*/
form.addEventListener("submit", (e) => {
    e.preventDefault();


})

/*funcion validar*/
function validar() {

    /*Cada vez que presiene enviar borrare y vuelvo revisar los mensaje de error*/
    listInputs.forEach((Element) => {
        Element.lastElementChild.innerHTML = "";

    });

    let todoOk = true; // Variable que nos dirá si todo está correcto

    /* if que valida el rango de caracteres en el campo rut */
    if (rut.value.length > 11 || rut.value.length < 9 || rut.value.trim() == "") {

        mostrarMensajeError("rut", "Rut debe contener 9 a 11 caracteres");
        todoOk = false;
    }
    /* if que valida el rango de caracteres en el campo nombre */
    if (nombre.value.length < 2 || nombre.value.length > 50 || nombre.value.trim() == "") {

        mostrarMensajeError("nombre", "Nombre debe contener 3 a 20 caracteres");
        todoOk = false;
    }
    /* validar formato correo */
    if (correo.value.trim() === "" || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(correo.value.trim())) {
        mostrarMensajeError("correo", "Correo debe tener un formato válido (usuario@dominio.com)");
        todoOk = false;
    }
    /* validar largo correo */
    if (correo.value.length > 100) {

        mostrarMensajeError("correo", "Correo NO debe ser mayor a 100 caracteres");
        todoOk = false;
    }

    /* validar largo usuario y que no sea vacio */
    if (nombre_usu.value.length < 4 || nombre_usu.value.length > 20 || nombre_usu.value.trim() == "") {

        mostrarMensajeError("nombre_usu", "Usario debe contener 4 a 20 caracteres");
        todoOk = false;
    }

    // Si todo está ok
    if (todoOk) {
        alert("¡Todos los campos están correctos!");
        form.reset(); // Limpia todos los campos del formulario
    }


}

/* funcion que muestra el mensaje de error en las validaciones */
function mostrarMensajeError(ClaseInput, mensaje) {

    let elemeto = document.querySelector(`.${ClaseInput}`);
    elemeto.lastElementChild.innerHTML = mensaje;

}

