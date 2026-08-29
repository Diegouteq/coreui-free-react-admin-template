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
  CFormSwitch,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { TIPOS_VEHICULO, validarVehiculo } from '../../../lib/validadores'

const VACIO = {
  placa: '',
  marca: '',
  modelo: '',
  anio: new Date().getFullYear(),
  color: '',
  tipo: 'AUTOMOVIL',
  foto_url: '',
  foto_fuente_url: '',
  foto_propietario_url: '',
  cedula_propietario: '',
  propietario_nombre: '',
  correo_institucional: '',
  autorizado: true,
}

const VehiculoFormModal = ({ visible, vehiculo, guardando, onGuardar, onCerrar }) => {
  const [form, setForm] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')

  const esEdicion = Boolean(vehiculo?.id)

  useEffect(() => {
    if (visible) {
      setForm(vehiculo ? { ...VACIO, ...vehiculo } : VACIO)
      setErrores({})
      setErrorGeneral('')
    }
  }, [visible, vehiculo])

  const actualizarCampo = (campo) => (evento) => {
    const valor =
      evento.target.type === 'checkbox' ? evento.target.checked : evento.target.value
    setForm((anterior) => ({ ...anterior, [campo]: valor }))
  }

  const manejarEnvio = async (evento) => {
    evento.preventDefault()
    const erroresValidacion = validarVehiculo(form)
    setErrores(erroresValidacion)
    if (Object.keys(erroresValidacion).length > 0) return

    setErrorGeneral('')
    const { error } = await onGuardar(form, vehiculo?.id)
    if (error) setErrorGeneral(error)
  }

  return (
    <CModal visible={visible} onClose={onCerrar} alignment="center" size="lg" backdrop="static">
      <CForm onSubmit={manejarEnvio} noValidate>
        <CModalHeader closeButton={!guardando}>
          <CModalTitle>{esEdicion ? 'Editar vehículo' : 'Agregar vehículo'}</CModalTitle>
        </CModalHeader>

        <CModalBody>
          {errorGeneral && <CAlert color="danger">{errorGeneral}</CAlert>}

          <CRow className="g-3">
            <CCol md={4}>
              <CFormLabel>Placa</CFormLabel>
              <CFormInput
                value={form.placa}
                onChange={actualizarCampo('placa')}
                placeholder="AAA-9999"
                invalid={Boolean(errores.placa)}
                disabled={guardando}
              />
              <CFormFeedback invalid>{errores.placa}</CFormFeedback>
            </CCol>

            <CCol md={4}>
              <CFormLabel>Marca</CFormLabel>
              <CFormInput
                value={form.marca}
                onChange={actualizarCampo('marca')}
                invalid={Boolean(errores.marca)}
                disabled={guardando}
              />
              <CFormFeedback invalid>{errores.marca}</CFormFeedback>
            </CCol>

            <CCol md={4}>
              <CFormLabel>Modelo</CFormLabel>
              <CFormInput
                value={form.modelo}
                onChange={actualizarCampo('modelo')}
                invalid={Boolean(errores.modelo)}
                disabled={guardando}
              />
              <CFormFeedback invalid>{errores.modelo}</CFormFeedback>
            </CCol>

            <CCol md={3}>
              <CFormLabel>Año</CFormLabel>
              <CFormInput
                type="number"
                min={1990}
                max={2035}
                value={form.anio}
                onChange={actualizarCampo('anio')}
                invalid={Boolean(errores.anio)}
                disabled={guardando}
              />
              <CFormFeedback invalid>{errores.anio}</CFormFeedback>
            </CCol>

            <CCol md={3}>
              <CFormLabel>Color</CFormLabel>
              <CFormInput
                value={form.color}
                onChange={actualizarCampo('color')}
                invalid={Boolean(errores.color)}
                disabled={guardando}
              />
              <CFormFeedback invalid>{errores.color}</CFormFeedback>
            </CCol>

            <CCol md={3}>
              <CFormLabel>Tipo</CFormLabel>
              <CFormSelect
                value={form.tipo}
                onChange={actualizarCampo('tipo')}
                invalid={Boolean(errores.tipo)}
                disabled={guardando}
              >
                {TIPOS_VEHICULO.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </CFormSelect>
              <CFormFeedback invalid>{errores.tipo}</CFormFeedback>
            </CCol>

            <CCol md={3} className="d-flex align-items-end">
              <CFormSwitch
                label="Autorizado"
                checked={form.autorizado}
                onChange={actualizarCampo('autorizado')}
                disabled={guardando}
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel>URL foto del vehículo</CFormLabel>
              <CFormInput
                value={form.foto_url}
                onChange={actualizarCampo('foto_url')}
                invalid={Boolean(errores.foto_url)}
                disabled={guardando}
              />
              <CFormFeedback invalid>{errores.foto_url}</CFormFeedback>
            </CCol>

            <CCol md={6}>
              <CFormLabel>URL fuente de la foto</CFormLabel>
              <CFormInput
                value={form.foto_fuente_url}
                onChange={actualizarCampo('foto_fuente_url')}
                disabled={guardando}
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel>URL foto del propietario</CFormLabel>
              <CFormInput
                value={form.foto_propietario_url}
                onChange={actualizarCampo('foto_propietario_url')}
                invalid={Boolean(errores.foto_propietario_url)}
                disabled={guardando}
              />
              <CFormFeedback invalid>{errores.foto_propietario_url}</CFormFeedback>
            </CCol>

            <CCol md={6}>
              <CFormLabel>Cédula del propietario</CFormLabel>
              <CFormInput
                value={form.cedula_propietario}
                onChange={actualizarCampo('cedula_propietario')}
                maxLength={10}
                invalid={Boolean(errores.cedula_propietario)}
                disabled={guardando}
              />
              <CFormFeedback invalid>{errores.cedula_propietario}</CFormFeedback>
            </CCol>

            <CCol md={6}>
              <CFormLabel>Nombre del propietario</CFormLabel>
              <CFormInput
                value={form.propietario_nombre}
                onChange={actualizarCampo('propietario_nombre')}
                invalid={Boolean(errores.propietario_nombre)}
                disabled={guardando}
              />
              <CFormFeedback invalid>{errores.propietario_nombre}</CFormFeedback>
            </CCol>

            <CCol md={6}>
              <CFormLabel>Correo institucional</CFormLabel>
              <CFormInput
                type="email"
                value={form.correo_institucional}
                onChange={actualizarCampo('correo_institucional')}
                invalid={Boolean(errores.correo_institucional)}
                disabled={guardando}
              />
              <CFormFeedback invalid>{errores.correo_institucional}</CFormFeedback>
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

VehiculoFormModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  vehiculo: PropTypes.object,
  guardando: PropTypes.bool,
  onGuardar: PropTypes.func.isRequired,
  onCerrar: PropTypes.func.isRequired,
}

export default VehiculoFormModal
