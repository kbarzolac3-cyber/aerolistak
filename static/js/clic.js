// ================================================================
//  AeroLista ✈ · clic.js — qué pasa al hacer clic en un asiento
//  Versión 2: elegir asientos para reservar (y para modificar).
// ================================================================

async function clicEnAsiento(codigo) {
  const pasajero = estado.porAsiento[codigo];       // ¿hay alguien sentado?

  // a) Asiento ROJO: decimos quién está ahí (en el paso 22 abriremos su pase de abordar)
  if (pasajero) {
    avisar(`El asiento ${codigo} es de ${pasajero.nombre} (reserva #${pasajero.numero})`, "aviso");
    return;
  }

  // b) Asiento VERDE mientras se modifica una reserva (paso 20): será su asiento nuevo
  if (estado.enEdicion) {
    estado.seleccionado = codigo;
    $("#modificar-asiento").textContent = codigo;
    pintarAsientos();
    return;
  }

  // c) Asiento VERDE: lo elegimos para una reserva nueva (otro clic lo suelta)
  if (estado.pestana !== "reservar") cambiarPestana("reservar");
  estado.seleccionado = estado.seleccionado === codigo ? null : codigo;   // interruptor
  estado.encontrado = null;
  actualizarAsientoElegido();                       // (reservar.js)
  pintarAsientos();                                 // 🟡 (semaforo.js)
  // Pone el cursor en el campo Nombre para escribir de una vez
  if (estado.seleccionado) $('#form-reservar [name="nombre"]').focus({ preventScroll: true });
}
