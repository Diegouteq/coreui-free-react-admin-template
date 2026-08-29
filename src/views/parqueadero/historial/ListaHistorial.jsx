import React, { useEffect, useMemo, useState } from 'react'
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilPlus, cilTrash } from '@coreui/icons'

import { useRegistros } from '../../../hooks/useRegistros'
import RegistroFormModal from './RegistroFormModal'
import ConfirmarEliminarModal from '../../../components/ConfirmarEliminarModal'

const COLOR_ESTADO = {
  ACTIVO: 'success',
  FINALIZADO: 'secondary',
  ANULADO: 'danger',
}

const formatearFecha = (isoTexto) =>
  isoTexto ? new Date(isoTexto).toLocaleString('es-EC') : '—'

// Convierte "YYYY-MM-DDTHH:mm" (input) a ISO completo, o null si está vacío.
const aISO = (valorInput) => (valorInput ? new Date(valorInput).toISOString() : null)

const ListaHistorial = () => {
  const {
    registros,
    cargando,
    error,
    recargar,
    crearRegistro,
    actualizarRegistro,
    eliminarRegistro,
  } = useRegistros()

  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(1)
  const porPagina = 10

  const [modalVisible, setModalVisible] = useState(false)
  const [seleccionado, setSeleccionado] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const [modalEliminarVisible, setModalEliminarVisible] = useState(false)
  const [aEliminar, setAEliminar] = useState(null)
  const [eliminando, setEliminando] = useState(false)

  const [mensajeExito, setMensajeExito] = useState('')

  useEffect(() => setPagina(1), [busqueda])
  useEffect(() => {
    if (!mensajeExito) return undefined
    const t = setTimeout(() => setMensajeExito(''), 4000)
    return () => clearTimeout(t)
  }, [mensajeExito])

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    if (!texto) return registros
    return registros.filter((r) =>
      [
        r.codigo_registro,
        r.placa_detectada,
        r.estado,
        r.vehiculos?.propietario_nombre,
        r.puestos?.codigo,
      ].some((v) => v?.toLowerCase().includes(texto)),
    )
  }, [registros, busqueda])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina))
  const paginaActual = Math.min(pagina, totalPaginas)
  const paginados = useMemo(() => {
    const inicio = (paginaActual - 1) * porPagina
    return filtrados.slice(inicio, inicio + porPagina)
  }, [filtrados, paginaActual])

  const manejarGuardar = async (form, id) => {
    setGuardando(true)
    const payload = {
      codigo_registro: form.codigo_registro,
      vehiculo_id: Number(form.vehiculo_id),
      puesto_id: Number(form.puesto_id),
      placa_detectada: form.placa_detectada.trim().toUpperCase(),
      sensor_id_rtdb: form.sensor_id_rtdb,
      fecha_entrada: aISO(form.fecha_entrada),
      fecha_salida: aISO(form.fecha_salida),
      duracion_minutos: form.duracion_minutos === '' ? null : Number(form.duracion_minutos),
      distancia_cm_entrada:
        form.distancia_cm_entrada === '' ? null : Number(form.distancia_cm_entrada),
      estado: form.estado,
      observacion: form.observacion || null,
    }
    const resultado = id ? await actualizarRegistro(id, payload) : await crearRegistro(payload)
    setGuardando(false)
    if (!resultado.error) {
      setModalVisible(false)
      setMensajeExito(id ? 'Registro actualizado correctamente.' : 'Registro creado correctamente.')
    }
    return resultado
  }

  const confirmarEliminar = async () => {
    if (!aEliminar) return
    setEliminando(true)
    const { error: errorEliminar } = await eliminarRegistro(aEliminar.id)
    setEliminando(false)
    if (!errorEliminar) {
      setModalEliminarVisible(false)
      setAEliminar(null)
      setMensajeExito('Registro eliminado correctamente.')
    }
  }

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <strong>Historial</strong>
          <div className="small text-body-secondary">Registros de uso de UTEQ Smart Parking</div>
        </div>
        <div className="d-flex gap-2">
          <CButton color="success" variant="outline" onClick={recargar} disabled={cargando}>
            Actualizar
          </CButton>
          <CButton
            color="success"
            onClick={() => {
              setSeleccionado(null)
              setModalVisible(true)
            }}
          >
            <CIcon icon={cilPlus} className="me-1" />
            Agregar registro
          </CButton>
        </div>
      </CCardHeader>

      <CCardBody>
        {mensajeExito && (
          <CAlert color="success" dismissible onClose={() => setMensajeExito('')}>
            {mensajeExito}
          </CAlert>
        )}

        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-3">
          <CFormInput
            type="search"
            placeholder="Buscar código, placa, propietario o puesto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ maxWidth: '420px' }}
          />
          <span className="text-body-secondary">{filtrados.length} registros</span>
        </div>

        {cargando && (
          <div className="text-center py-5">
            <CSpinner color="success" />
            <p className="mt-3">Cargando historial...</p>
          </div>
        )}

        {!cargando && error && <CAlert color="danger">No se pudo cargar el historial: {error}</CAlert>}

        {!cargando && !error && (
          <>
            <CTable align="middle" bordered hover responsive striped>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell>Código</CTableHeaderCell>
                  <CTableHeaderCell>Vehículo</CTableHeaderCell>
                  <CTableHeaderCell>Puesto</CTableHeaderCell>
                  <CTableHeaderCell>Entrada</CTableHeaderCell>
                  <CTableHeaderCell>Salida</CTableHeaderCell>
                  <CTableHeaderCell>Estado</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {paginados.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={7} className="text-center py-4">
                      No se encontraron registros.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  paginados.map((registro) => (
                    <CTableRow key={registro.id}>
                      <CTableDataCell>
                        <CBadge color="dark" className="fs-6">{registro.codigo_registro}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {registro.vehiculos?.placa}
                        <div className="small text-body-secondary">
                          {registro.vehiculos?.propietario_nombre}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>{registro.puestos?.codigo}</CTableDataCell>
                      <CTableDataCell>{formatearFecha(registro.fecha_entrada)}</CTableDataCell>
                      <CTableDataCell>{formatearFecha(registro.fecha_salida)}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={COLOR_ESTADO[registro.estado] ?? 'secondary'}>
                          {registro.estado}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex gap-2">
                          <CButton
                            size="sm"
                            color="info"
                            variant="outline"
                            onClick={() => {
                              setSeleccionado(registro)
                              setModalVisible(true)
                            }}
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>
                          <CButton
                            size="sm"
                            color="danger"
                            variant="outline"
                            onClick={() => {
                              setAEliminar(registro)
                              setModalEliminarVisible(true)
                            }}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>

            <div className="d-flex justify-content-between align-items-center">
              <small className="text-body-secondary">Página {paginaActual} de {totalPaginas}</small>
              <div className="d-flex gap-2">
                <CButton
                  color="secondary"
                  variant="outline"
                  disabled={paginaActual === 1}
                  onClick={() => setPagina((v) => Math.max(1, v - 1))}
                >
                  Anterior
                </CButton>
                <CButton
                  color="success"
                  variant="outline"
                  disabled={paginaActual === totalPaginas}
                  onClick={() => setPagina((v) => Math.min(totalPaginas, v + 1))}
                >
                  Siguiente
                </CButton>
              </div>
            </div>
          </>
        )}
      </CCardBody>

      <RegistroFormModal
        visible={modalVisible}
        registro={seleccionado}
        guardando={guardando}
        onGuardar={manejarGuardar}
        onCerrar={() => setModalVisible(false)}
      />

      <ConfirmarEliminarModal
        visible={modalEliminarVisible}
        titulo="Eliminar registro"
        descripcion={
          <>¿Confirma que desea eliminar el registro <strong>{aEliminar?.codigo_registro}</strong>?</>
        }
        eliminando={eliminando}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setModalEliminarVisible(false)}
      />
    </CCard>
  )
}

export default ListaHistorial
