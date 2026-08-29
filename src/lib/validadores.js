export const PLACA_REGEX = /^[A-Z]{3}-[0-9]{4}$/
export const CEDULA_REGEX = /^[0-9]{10}$/

export const TIPOS_VEHICULO = ['AUTOMOVIL', 'CAMIONETA', 'SUV', 'MOTOCICLETA']
export const COLUMNAS_PUESTO = ['A', 'B', 'C', 'D']
export const ESTADOS_PUESTO = ['DISPONIBLE', 'OCUPADO', 'RESERVADO', 'FUERA_SERVICIO']
export const ESTADOS_REGISTRO = ['ACTIVO', 'FINALIZADO', 'ANULADO']

export const validarVehiculo = (form) => {
  const errores = {}

  if (!PLACA_REGEX.test(form.placa?.trim().toUpperCase() ?? '')) {
    errores.placa = 'Formato esperado: AAA-9999'
  }
  if (!form.marca?.trim()) errores.marca = 'La marca es obligatoria'
  if (!form.modelo?.trim()) errores.modelo = 'El modelo es obligatorio'

  const anio = Number(form.anio)
  if (!Number.isInteger(anio) || anio < 1990 || anio > 2035) {
    errores.anio = 'El año debe estar entre 1990 y 2035'
  }
  if (!form.color?.trim()) errores.color = 'El color es obligatorio'
  if (!TIPOS_VEHICULO.includes(form.tipo)) {
    errores.tipo = 'Seleccione un tipo válido'
  }
  if (!CEDULA_REGEX.test(form.cedula_propietario?.trim() ?? '')) {
    errores.cedula_propietario = 'La cédula debe tener 10 dígitos'
  }
  if (!form.propietario_nombre?.trim()) {
    errores.propietario_nombre = 'El nombre del propietario es obligatorio'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo_institucional ?? '')) {
    errores.correo_institucional = 'Ingrese un correo válido'
  }
  if (!form.foto_url?.trim()) errores.foto_url = 'La foto del vehículo es obligatoria'
  if (!form.foto_propietario_url?.trim()) {
    errores.foto_propietario_url = 'La foto del propietario es obligatoria'
  }

  return errores
}

export const validarPuesto = (form) => {
  const errores = {}

  if (!form.codigo?.trim()) errores.codigo = 'El código es obligatorio'
  if (!COLUMNAS_PUESTO.includes(form.columna)) {
    errores.columna = 'Seleccione A, B, C o D'
  }

  const numero = Number(form.numero)
  if (!Number.isInteger(numero) || numero < 1 || numero > 20) {
    errores.numero = 'El número debe estar entre 1 y 20'
  }
  if (!form.sensor_id_rtdb?.trim()) {
    errores.sensor_id_rtdb = 'El ID del sensor es obligatorio'
  }
  if (!form.ruta_firebase?.trim()) {
    errores.ruta_firebase = 'La ruta de Firebase es obligatoria'
  }
  if (!ESTADOS_PUESTO.includes(form.estado)) {
    errores.estado = 'Seleccione un estado válido'
  }

  return errores
}

export const validarRegistro = (form) => {
  const errores = {}

  if (!form.codigo_registro?.trim()) {
    errores.codigo_registro = 'El código de registro es obligatorio'
  }
  if (!form.vehiculo_id) errores.vehiculo_id = 'Seleccione un vehículo'
  if (!form.puesto_id) errores.puesto_id = 'Seleccione un puesto'
  if (!form.placa_detectada?.trim()) {
    errores.placa_detectada = 'La placa detectada es obligatoria'
  }
  if (!form.sensor_id_rtdb?.trim()) {
    errores.sensor_id_rtdb = 'El ID del sensor es obligatorio'
  }
  if (!form.fecha_entrada) {
    errores.fecha_entrada = 'La fecha de entrada es obligatoria'
  }
  if (!ESTADOS_REGISTRO.includes(form.estado)) {
    errores.estado = 'Seleccione un estado válido'
  }

  const esActivo = form.estado === 'ACTIVO'
  if (esActivo && form.fecha_salida) {
    errores.fecha_salida = 'Un registro ACTIVO no debe tener fecha de salida'
  }
  if (!esActivo && !form.fecha_salida) {
    errores.fecha_salida = 'Obligatoria cuando el estado no es ACTIVO'
  }
  if (
    form.fecha_salida &&
    form.fecha_entrada &&
    new Date(form.fecha_salida) < new Date(form.fecha_entrada)
  ) {
    errores.fecha_salida = 'Debe ser posterior o igual a la fecha de entrada'
  }

  return errores
}
