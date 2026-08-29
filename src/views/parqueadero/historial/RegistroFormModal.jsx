import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CAlert,
  CButton,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { useVehiculos } from '../../../hooks/useVehiculos'
import { usePuestos } from '../../../hooks/usePuestos'
import { ESTADOS_REGISTRO, validarRegistro } from '../../../lib/validadores'

const VACIO = {
  codigo_registro: '',
  vehiculo_id: '',
  puesto_id: '',
  placa_detectada: '',
  sensor_id_rtdb: '',
  fecha_entrada: '',
  fecha_salida: '',
  duracion_minutos: '',
  distancia_cm_entrada: '',
  estado: 'ACTIVO',
  observacion: '',
}

// Supabase devuelve timestamptz en ISO; los <input type="datetime-local">
// necesitan "YYYY-MM-DDTHH:mm".
const aInputLocal = (isoTexto) => (isoTexto ? isoTexto.slice(0, 16) : '')

const RegistroFormModal = ({ visible, registro, guardando, onGuardar, onCerrar }) => {
  const { vehiculos } = useVehiculos()
  const { puestos } = usePuestos()

  const [form, setForm] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')

  const esEdicion = Boolean(registro?.id)

  useEffect(() => {
    if (visible) {
      setForm(
        registro
          ? {
              ...VACIO,
              ...registro,
              fecha_entrada: aInputLocal(registro.fecha_entrada),
              fecha_salida: aInputLocal(registro.fecha_salida),
              duracion_minutos: registro.duracion_minutos ?? '',
              distancia_cm_entrada: registro.distancia_cm_entrada ?? '',
              observacion: registro.observacion ?? '',
            }
          : VACIO,
      )
      setErrores({})
      setErrorGeneral('')
    }
  }, [visible, registro])

  const actualizarCampo = (campo) => (evento) => {
    setForm((anterior) => ({ ...anterior, [campo]: evento.target.value }))
  }

  const manejarEnvio = async (evento) => {
    evento.preventDefault()
    const erroresValidacion = validarRegistro(form)
    setErrores(erroresValidacion)
    if (Object.keys(erroresValidacion).length > 0) return

    setErrorGeneral('')
    const { error } = await onGuardar(form, registro?.id)
    if (error) setErrorGeneral(error)
  }

  return (
    <CModal visible={visible} onClose={onCerrar} alignment="center" size="lg" backdrop="static">
      <CForm onSubmit={manejarEnvio} noValidate>
        <CModalHeader closeButton={!guardando}>
          <CModalTitle>{esEdicion ? 'Editar registro' : 'Agregar registro'}</CModalTitle>
        </CModalHeader>

        <CModalBody>
          {errorGeneral && <CAlert color="danger">{errorGeneral}</CAlert>}

          <CRow className="g-3">
            <CCol md={4}>
              <CFormLabel>Código de registro</CFormLabel>
              <CFormInput
                value={form.codigo_registro}
                onChange={actualizarCampo('codigo_registro')}
                placeholder="REG-039"
                invalid={Boolean(errores.codigo_registro)}
                disabled={guardando}
              />
              <CFormFeedback invalid>{errores.codigo_registro}</CFormFeedback>
            </CCol>

            <CCol md={4}>
              <CFormLabel>Vehículo</CFormLabel>
              <CFormSelect
                value={form.vehiculo_id}
                onChange={actualizarCampo('vehiculo_id')}
                invalid={Boolean(errores.vehiculo_id)}
                disabled={guardando}
              >
                <option value="">Seleccione...</option>
                {vehiculos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.placa} — {v.propietario_nombre}
                  </option>
                ))}
              </CFormSelect>
              <CFormFeedback invalid>{errores.vehiculo_id}</CFormFeedback>
            </CCol>

            <CCol md={4}>
              <CFormLabel>Puesto</CFormLabel>
              <CFormSelect
                value={form.puesto_id}
                onChange={actualizarCampo('puesto_id')}
                invalid={Boolean(errores.puesto_id)}
                disabled={guardando}
              >
                <option value="">Seleccione...</option>
                {puestos.map((p) => (
                  <option key={p.id} value={p.id}>{p.codigo}</option>
                ))}
              </CFormSelect>
              <CFormFeedback invalid>{errores.puesto_id}</CFormFeedback>
            </CCol>

            <CCol md={6}>
              <CFormLabel>Placa detectada</CFormLabel>
              <CFormInput
                value={form.placa_detectada}
                onChange={actualizarCampo('placa_detectada')}
                invalid={Boolean(errores.placa_detectada)}
                disabled={guardando}
              />
              <CFormFeedback invalid>{errores.placa_detectada}</CFormFeedback>
            </CCol>

            <CCol md={6}>
              <CFormLabel>ID del sensor (RTDB)</CFormLabel>
              <CFormInput
                value={form.sensor_id_rtdb}
                onChange={actualizarCampo('sensor_id_rtdb')}
                invalid={Boolean(errores.sensor_id_rtdb)}
                disabled={guardando}
              />
              <CFormFeedback invalid>{errores.sensor_id_rtdb}</CFormFeedback>
            </CCol>

            <CCol md={4}>
              <CFormLabel>Fecha de entrada</CFormLabel>
              <CFormInput
                type="datetime-local"
                value={form.fecha_entrada}
                onChange={actualizarCampo('fecha_entrada')}
                invalid={Boolean(errores.fecha_entrada)}
                disabled={guardando}
              />
              <CFormFeedback invalid>{errores.fecha_entrada}</CFormFeedback>
            </CCol>

            <CCol md={4}>
              <CFormLabel>Fecha de salida</CFormLabel>
              <CFormInput
                type="datetime-local"
                value={form.fecha_salida}
                onChange={actualizarCampo('fecha_salida')}
                invalid={Boolean(errores.fecha_salida)}
                disabled={guardando || form.estado === 'ACTIVO'}
              />
              <CFormFeedback invalid>{errores.fecha_salida}</CFormFeedback>
            </CCol>

            <CCol md={4}>
              <CFormLabel>Estado</CFormLabel>
              <CFormSelect
                value={form.estado}
                onChange={actualizarCampo('estado')}
                invalid={Boolean(errores.estado)}
                disabled={guardando}
              >
                {ESTADOS_REGISTRO.map((estado) => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </CFormSelect>
              <CFormFeedback invalid>{errores.estado}</CFormFeedback>
            </CCol>

            <CCol md={4}>
              <CFormLabel>Duración (min)</CFormLabel>
              <CFormInput
                type="number"
                min={0}
                value={form.duracion_minutos}
                onChange={actualizarCampo('duracion_minutos')}
                disabled={guardando}
              />
            </CCol>

            <CCol md={4}>
              <CFormLabel>Distancia de entrada (cm)</CFormLabel>
              <CFormInput
                type="number"
                step="0.01"
                value={form.distancia_cm_entrada}
                onChange={actualizarCampo('distancia_cm_entrada')}
                disabled={guardando}
              />
            </CCol>

            <CCol md={12}>
              <CFormLabel>Observación</CFormLabel>
              <CFormTextarea
                rows={2}
                value={form.observacion}
                onChange={actualizarCampo('observacion')}
                disabled={guardando}
              />
            </CCol>
          </CRow>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={onCerrar} disabled={guardando}>
            Cancelar
          </CButton>
          <CButton color="success" type="submit" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

RegistroFormModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  registro: PropTypes.object,
  guardando: PropTypes.bool,
  onGuardar: PropTypes.func.isRequired,
  onCerrar: PropTypes.func.isRequired,
}

export default RegistroFormModal
