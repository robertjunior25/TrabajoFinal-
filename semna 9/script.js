let reservas = [];
let editIndex = null;

// Validación para que el campo solo acepte números en el código de matrícula
document.getElementById("inputCodigo").addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, ""); // Solo permite números
});

// Establecer la fecha mínima del input tipo date como la fecha actual
document.addEventListener("DOMContentLoaded", () => {
  const hoy = new Date();
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
  const fechaMin = hoy.toISOString().split("T")[0];
  document.getElementById("inputFecha").setAttribute("min", fechaMin);
});

// Event listener para el formulario de reservas
document.getElementById("formReserva").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("inputNombre").value.trim();
  const codigo = document.getElementById("inputCodigo").value.trim();
  const actividad = document.getElementById("selectActividad").value;
  const fecha = document.getElementById("inputFecha").value;

  // Validación de campos vacíos
  if (!nombre || !codigo || !actividad || !fecha) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  // Validación del código de matrícula (debe ser numérico y de 8 dígitos)
  if (!/^\d{8}$/.test(codigo)) {
    alert("El código debe tener exactamente 8 dígitos numéricos.");
    return;
  }

  // Validación de la fecha (no puede ser en el pasado)
  const hoy = new Date();
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
  const fechaActual = hoy.toISOString().split("T")[0];

  if (fecha < fechaActual) {
    alert("La fecha no puede ser en el pasado.");
    return;
  }

  // Verificación de duplicados en las reservas
  const duplicado = reservas.some((r, i) => r.codigo === codigo && i !== editIndex);
  if (duplicado) {
    alert("Ya existe una reserva con ese código.");
    return;
  }

  const nuevaReserva = { nombre, codigo, actividad, fecha };

  // Agregar o actualizar la reserva según si se está editando o creando
  if (editIndex === null) {
    reservas.push(nuevaReserva);
  } else {
    reservas[editIndex] = nuevaReserva;
    editIndex = null;
    document.getElementById("btnEnviar").textContent = "Guardar";
    document.getElementById("btnLimpiar").style.display = "inline-block";
    document.getElementById("btnCancelar").style.display = "none";
  }

  // Resetear el formulario y renderizar la tabla
  this.reset();
  renderizarTabla();
  actualizarContador();
});

// Función para renderizar las reservas en la tabla
function renderizarTabla() {
  const tbody = document.querySelector("#cuerpoTabla");
  tbody.innerHTML = "";

  reservas.forEach((r, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.nombre}</td>
      <td>${r.codigo}</td>
      <td>${r.actividad}</td>
      <td>${r.fecha}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editarReserva(${index})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarReserva(${index})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Función para editar una reserva
function editarReserva(index) {
  const r = reservas[index];
  document.getElementById("inputNombre").value = r.nombre;
  document.getElementById("inputCodigo").value = r.codigo;
  document.getElementById("selectActividad").value = r.actividad;
  document.getElementById("inputFecha").value = r.fecha;

  // Cambiar el estado de edición
  editIndex = index;
  document.getElementById("btnEnviar").textContent = "Actualizar";
  document.getElementById("btnLimpiar").style.display = "none";
  document.getElementById("btnCancelar").style.display = "inline-block";
}

// Función para eliminar una reserva
function eliminarReserva(index) {
  if (confirm("¿Estás seguro de eliminar esta reserva?")) {
    reservas.splice(index, 1);
    renderizarTabla();
    actualizarContador();
  }
}

// Función para actualizar el contador de reservas
function actualizarContador() {
  document.getElementById("contadorReservas").textContent = reservas.length;
}

// Función para limpiar el formulario sin editar
document.getElementById("btnLimpiar").addEventListener("click", function () {
  document.getElementById("formReserva").reset();
  document.getElementById("btnCancelar").style.display = "none";
  document.getElementById("btnEnviar").textContent = "Guardar";
});

// Función para cancelar la edición de una reserva
document.getElementById("btnCancelar").addEventListener("click", function () {
  editIndex = null;
  document.getElementById("formReserva").reset();
  document.getElementById("btnEnviar").textContent = "Guardar";
  document.getElementById("btnLimpiar").style.display = "inline-block";
  document.getElementById("btnCancelar").style.display = "none";
});