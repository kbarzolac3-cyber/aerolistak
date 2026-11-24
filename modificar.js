
function cancelarEdicion() {
  estado.enEdicion = null;
  estado.seleccionado = null;
  $("#form-modificar").hidden = true;
  $("#form-modificar").reset();
  $("#modificar-asiento").textContent = "—";
  pintarAsientos();
}

async function cargarParaModificar(evento) {
  evento.preventDefault();

  const numero = $("#modificar-numero").value;
  const r = await API.buscarNumero(numero);

  if (!r.ok) {
    cancelarEdicion();
    mostrarProblema(r);
    return;
  }

  const pasajero = r.datos;
  estado.enEdicion = pasajero;
  estado.seleccionado = null;
  estado.encontrado = null;

  const formulario = $("#form-modificar");

  formulario.elements.namedItem("nombre").value = pasajero.nombre;
  formulario.elements.namedItem("cedula").value = pasajero.cedula;
  formulario.elements.namedItem("edad").value = pasajero.edad;

  $("#modificar-asiento").textContent = pasajero.asiento;
  formulario.hidden = false;

  pintarAsientos();
  avisar("Reserva #" + pasajero.numero + " cargada");
}

async function guardarModificacion(evento) {
  evento.preventDefault();

  if (!estado.enEdicion) {
    avisar("Primero carga una reserva", "aviso");
    return;
  }

  const formulario = evento.target;
  const pasajero = estado.enEdicion;
  const asiento = estado.seleccionado || pasajero.asiento;

  const datos = {
    nombre: formulario.elements.namedItem("nombre").value.trim(),
    cedula: pasajero.cedula,
    edad: formulario.elements.namedItem("edad").value,
    asiento: asiento
  };

  const r = await API.modificar(pasajero.numero, datos);

  if (!r.ok) {
    mostrarProblema(r);
    return;
  }

  avisar(r.mensaje, "ok");
  cancelarEdicion();
  await refrescar();
  animarAsiento(asiento, "recien");
}

$("#form-cargar").addEventListener("submit", cargarParaModificar);
$("#form-modificar").addEventListener("submit", guardarModificacion);
$("#btn-cancelar-edicion").addEventListener("click", cancelarEdicion);
