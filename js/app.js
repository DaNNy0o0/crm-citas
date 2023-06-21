// ==============VARIABLES Y SELECTORES=============
// =================================================

// Selector del formulario
const formulario = document.querySelector("#nueva-cita");

// Selectores individuales de los inputs del formulario
const mascotaInput = document.querySelector("#mascota");
const propietarioInput = document.querySelector("#propietario");
const telefonoInput = document.querySelector("#telefono");
const fechaInput = document.querySelector("#fecha");
const horaInput = document.querySelector("#hora");
const sintomasInput = document.querySelector("#sintomas");

// Modo edicion
let editando;

// Selector donde se van a ubicar las citas
const contenedorCitas = document.querySelector("#citas");

// Objeto con la información de la cita
const citaObj = {
  mascota: "",
  propietario: "",
  telefono: "",
  fecha: "",
  hora: "",
  sintomas: "",
};

// =======================CLASES====================
// =================================================

class Citas {
  constructor() {
    this.citas = JSON.parse(localStorage.getItem('Citas')) || [];
  }

  agregarCita(cita) {
    this.citas = [...this.citas, cita];
    sincronizarCitasLS(this.citas)
  }

  eliminarCita(id) {
    this.citas = this.citas.filter((cita) => cita.id !== id);
    sincronizarCitasLS(this.citas)

  }

  editarCita(citaActualizada){
    this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    sincronizarCitasLS(this.citas)

  }
}
const administrarCitas = new Citas();

class UI {
  imprimirAlerta(mensaje, tipo) {
    // Crear el div
    const divMensaje = document.createElement("DIV");
    divMensaje.classList.add("text-center", "alert", "d-block", "col-12");

    // Agregamos clases segun el tipo que sea la alerta
    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    // Añadimos el mensaje a la alerta
    divMensaje.textContent = mensaje;

    // Insertamos en el HTML
    document
      .querySelector("#contenido")
      .insertBefore(divMensaje, document.querySelector(".agregar-cita"));

    // Retiramos alerta despues de 5 segundos
    setTimeout(() => {
      divMensaje.remove();
    }, 5000);
  }

  imprimirCitas({ citas }) {
    this.limpiarHTML();

    citas.forEach((cita) => {
      const { mascota, propietario, telefono, fecha, hora, sintomas, id } =
        cita;

      const divCita = document.createElement("DIV");
      divCita.classList.add("cita", "p-3");
      divCita.dataset.id = id;

      // Scripting de los elementos de la cita
      const mascotaParrafo = document.createElement("h2");
      mascotaParrafo.classList.add("card-title", "font-weight-bolder");
      mascotaParrafo.textContent = mascota;

      const propietarioParrafo = document.createElement("p");
      propietarioParrafo.innerHTML = `
       <span class='font-weight-bolder'>Propietario: </span> ${propietario}
      `;
      const telefonoParrafo = document.createElement("p");
      telefonoParrafo.innerHTML = `
       <span class='font-weight-bolder'>Telefono: </span> ${telefono}
      `;

      const fechaParrafo = document.createElement("p");
      fechaParrafo.innerHTML = `
       <span class='font-weight-bolder'>Fecha: </span> ${fecha}
      `;

      const horaParrafo = document.createElement("p");
      horaParrafo.innerHTML = `
       <span class='font-weight-bolder'>Hora: </span> ${hora}
      `;

      const sintomasParrafo = document.createElement("p");
      sintomasParrafo.innerHTML = `
       <span class='font-weight-bolder'>Sintomas: </span> ${sintomas}
      `;

      // Boton para eliminar una cita
      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add("btn", "btn-danger", "mr-2");
      btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
    `;

      btnEliminar.onclick = () => eliminarCita(id);

      // Boton para editar una cita
      const btnEditar = document.createElement("button");
      btnEditar.classList.add("btn", "btn-info");
      btnEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
    `;

      btnEditar.onclick = () => editarCita(cita);

      // Agregar los elementos al divCita
      divCita.appendChild(mascotaParrafo);
      divCita.appendChild(propietarioParrafo);
      divCita.appendChild(telefonoParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(horaParrafo);
      divCita.appendChild(sintomasParrafo);
      divCita.appendChild(btnEliminar);
      divCita.appendChild(btnEditar);

      // Agregar el divCita al HTML
      contenedorCitas.appendChild(divCita);
    });
  }

  limpiarHTML() {
    while (contenedorCitas.firstChild) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }
  }
}
const ui = new UI();

// ==============EVENT LISTENERS====================
// =================================================

eventListeners();

function eventListeners() {
  // Traer citas de Local Storage
  document.addEventListener('DOMContentLoaded', () => {
    ui.imprimirCitas(administrarCitas)
  })
  
  // Esuchando cambios en cada input del formulario
  mascotaInput.addEventListener("change", datosCita);
  propietarioInput.addEventListener("change", datosCita);
  telefonoInput.addEventListener("change", datosCita);
  fechaInput.addEventListener("change", datosCita);
  horaInput.addEventListener("change", datosCita);
  sintomasInput.addEventListener("change", datosCita);

  formulario.addEventListener("submit", nuevaCita);
}

// ==============FUNCIONES==========================
// =================================================

// Agrega cada valor a su campo de citaObj
function datosCita(e) {
  citaObj[e.target.name] = e.target.value;
}

// Valida y agrega una nueva cita a la clase/array de citas

function nuevaCita(e) {
  e.preventDefault();

  // Extraer información del objeta de cita
  const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

  //Validar
  if (
    mascota === "" ||
    propietario === "" ||
    telefono === "" ||
    fecha === "" ||
    hora === "" ||
    sintomas === ""
  ) {
    ui.imprimirAlerta("Todos los campos son obligatorios", "error");
    return;
  }

  if (editando) {
    ui.imprimirAlerta("Cambios realizados correctamente");

    // Pasar el objeto de la cita a edicion
    administrarCitas.editarCita({...citaObj})

    // Cambiar el texto del boton
    formulario.querySelector('button[type="submit"]').textContent = "Crear Cita";

    // Quitar modo edicion
    editando = false;
  } else {
    // Generar un id único
    citaObj.id = Date.now();

    // Creando nueva cita, pasando una copia del objeto original, pero con los valores introducidos
    administrarCitas.agregarCita({ ...citaObj });

    ui.imprimirAlerta("Cita agregada correctamente");
  }

  // Reiniciar el formulario
  formulario.reset();

  // Reiniciamos el objeto
  reiniciarObjeto();

  // Mostrar el HTML de las citas
  ui.imprimirCitas(administrarCitas);
}

// Funcion que reinicia el objeto principal de citaObj
function reiniciarObjeto() {
  citaObj.mascota = "";
  citaObj.propietario = "";
  citaObj.telefono = "";
  citaObj.fecha = "";
  citaObj.hora = "";
  citaObj.sintomas = "";
}

// Funcion para eliminar una cita
function eliminarCita(id) {
  // Eliminar cita
  administrarCitas.eliminarCita(id);

  // Muestre un mensaje
  ui.imprimirAlerta("La cita se eliminó correctamente");

  // Actualizar las citas
  ui.imprimirCitas(administrarCitas);
}

// Funcion para editar una cita
function editarCita(cita) {
  const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

  // Llenar los inputs del formulario de nuevo
  mascotaInput.value = mascota;
  propietarioInput.value = propietario;
  telefonoInput.value = telefono;
  fechaInput.value = fecha;
  horaInput.value = hora;
  sintomasInput.value = sintomas;

  // Llenar el objeto de la cita
  citaObj.mascota = mascota;
  citaObj.propietario = propietario;
  citaObj.telefono = telefono;
  citaObj.fecha = fecha;
  citaObj.hora = hora;
  citaObj.sintomas = sintomas;
  citaObj.id = id;

  // Cambiar el texto del boton
  formulario.querySelector('button[type="submit"]').textContent =
    "Guardar Cambios";

  editando = true;
}

function sincronizarCitasLS(cita) {
  localStorage.setItem('Citas', JSON.stringify(cita))
}