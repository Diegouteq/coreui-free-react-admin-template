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
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { COLUMNAS_PUESTO, ESTADOS_PUESTO, validarPuesto } from '../../../lib/validadores'

const VACIO = {
  codigo: '',
  columna: 'A',
  numero: 1,
  sensor_id_rtdb: '',
  ruta_firebase: '',
  estado: 'DISPONIBLE',
  distancia_cm: '',
}

const PuestoFormModal = ({ visible, puesto, guardando, onGuardar, onCerrar }) => {
  const [form, setForm] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')

  const esEdicion = Boolean(puesto?.id)

  useEffect(() => {
    if (visible) {
      setForm(puesto ? { ...VACIO, ...puesto } : VACIO)
      setErrores({})
      setErrorGeneral('')
    }
  }, [visible, puesto])

  const actualizarCampo = (campo) => (evento) => {
    setForm((anterior) => ({ ...anterior, [campo]: evento.target.value }))
  }

  const manejarEnvio = async (evento) => {
    evento.preventDefault()
    const erroresValidacion = validarPuesto(form)
    setErrores(erroresValidacion)
    if (Object.keys(erroresValidacion).length > 0) return

    setErrorGeneral('')
    const { error } = await onGuardar(form, puesto?.id)
    if (error) setErrorGeneral(error)
  }

  return (
    <CModal visible={visible} onClose={onCerrar} alignment="center" backdrop="static">
      <CForm onSubmit={manejarEnvio} noValidate>
        <CModalHeader closeButton={!guardando}>
          <CModalTitle>{esEdicion ? 'Editar puesto' : 'Agregar puesto'}</CModalTitle>
        </CModalHeader>

        <CModalBody>
          {errorGeneral && <CAlert color="danger">{errorGeneral}</CAlert>}

          <CRow className="g-3">
            <CCol md={6}>
              <CFormLabel>Código</CFormLabel>
              <CFormInput
                value={form.codigo}
                onChange={actualizarCampo('codigo')}
                placeholder="A01"
                invalid={Boolean(errores.codigo)}
                disabled={guardando}
              />
              <CFormFeedback invalid>{errores.codigo}</CFormFeedback>
            </CCol>

            <CCol md={3}>
              <CFormLabel>Columna</CFormLabel>
              <CFormSelect
                value={form.columna}
                onChange={actualizarCampo('columna')}
                invalid={Boolean(errores.columna)}
                disabled={guardando}
              >
                {COLUMNAS_PUESTO.map((columna) => (
                  <option key={columna} value={columna}>{columna}</option>
                ))}
              </CFormSelect>
              <CFormFeedback invalid>{errores.columna}</CFormFeedback>
            </CCol>

            <CCol md={3}>
              <CFormLabel>Número</CFormLabel>
              <CFormInput
                type="number"
                min={1}
                max={20}
                value={form.numero}
                onChange={actualizarCampo('numero')}
                invalid={Boolean(errores.numero)}
                disabled={guardando}
              />
              <CFormFeedback invalid>{errores.numero}</CFormFeedback>
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

            <CCol md={6}>
              <CFormLabel>Ruta Firebase</CFormLabel>
              <CFormInput
                value={form.ruta_firebase}
                onChange={actualizarCampo('ruta_firebase')}
                invalid={Boolean(errores.ruta_firebase)}
                disabled={guardando}
              />
              <CFormFeedback invalid>{errores.ruta_firebase}</CFormFeedback>
            </CCol>

            <CCol md={6}>
              <CFormLabel>Estado</CFormLabel>
              <CFormSelect
                value={form.estado}
                onChange={actualizarCampo('estado')}
                invalid={Boolean(errores.estado)}
                disabled={guardando}
              >
                {ESTADOS_PUESTO.map((estado) => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </CFormSelect>
              <CFormFeedback invalid>{errores.estado}</CFormFeedback>
            </CCol>

            <CCol md={6}>
              <CFormLabel>Distancia (cm)</CFormLabel>
              <CFormInput
                type="number"
                step="0.01"
                value={form.distancia_cm ?? ''}
                onChange={actualizarCampo('distancia_cm')}
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

PuestoFormModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  puesto: PropTypes.object,
  guardando: PropTypes.bool,
  onGuardar: PropTypes.func.isRequired,
  onCerrar: PropTypes.func.isRequired,
}

export default PuestoFormModal
