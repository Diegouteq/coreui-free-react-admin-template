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

import { usePuestos } from '../../../hooks/usePuestos'
import PuestoFormModal from './PuestoFormModal'
import ConfirmarEliminarModal from '../../../components/ConfirmarEliminarModal'

const COLOR_ESTADO = {
  DISPONIBLE: 'success',
  OCUPADO: 'danger',
  RESERVADO: 'warning',
  FUERA_SERVICIO: 'secondary',
}

const ListaPuestos = () => {
  const { puestos, cargando, error, recargar, crearPuesto, actualizarPuesto, eliminarPuesto } =
    usePuestos()

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
    if (!texto) return puestos
    return puestos.filter((p) =>
      [p.codigo, p.columna, p.estado, p.sensor_id_rtdb].some((v) =>
        v?.toLowerCase().includes(texto),
      ),
    )
  }, [puestos, busqueda])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina))
  const paginaActual = Math.min(pagina, totalPaginas)
  const paginados = useMemo(() => {
    const inicio = (paginaActual - 1) * porPagina
    return filtrados.slice(inicio, inicio + porPagina)
  }, [filtrados, paginaActual])

  const manejarGuardar = async (form, id) => {
    setGuardando(true)
    const payload = {
      codigo: form.codigo,
      columna: form.columna,
      numero: Number(form.numero),
      sensor_id_rtdb: form.sensor_id_rtdb,
      ruta_firebase: form.ruta_firebase,
      estado: form.estado,
      distancia_cm: form.distancia_cm === '' ? null : Number(form.distancia_cm),
    }
    const resultado = id ? await actualizarPuesto(id, payload) : await crearPuesto(payload)
    setGuardando(false)
    if (!resultado.error) {
      setModalVisible(false)
      setMensajeExito(id ? 'Puesto actualizado correctamente.' : 'Puesto creado correctamente.')
    }
    return resultado
  }

  const confirmarEliminar = async () => {
    if (!aEliminar) return
    setEliminando(true)
    const { error: errorEliminar } = await eliminarPuesto(aEliminar.id)
    setEliminando(false)
    if (!errorEliminar) {
      setModalEliminarVisible(false)
      setAEliminar(null)
      setMensajeExito('Puesto eliminado correctamente.')
    }
  }

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <strong>Puestos</strong>
          <div className="small text-body-secondary">Distribución de puestos de UTEQ Smart Parking</div>
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
            Agregar puesto
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
            placeholder="Buscar código, columna, estado o sensor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ maxWidth: '420px' }}
          />
          <span className="text-body-secondary">{filtrados.length} puestos</span>
        </div>

        {cargando && (
          <div className="text-center py-5">
            <CSpinner color="success" />
            <p className="mt-3">Cargando puestos...</p>
          </div>
        )}

        {!cargando && error && <CAlert color="danger">No se pudieron cargar los puestos: {error}</CAlert>}

        {!cargando && !error && (
          <>
            <CTable align="middle" bordered hover responsive striped>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell>Código</CTableHeaderCell>
                  <CTableHeaderCell>Columna</CTableHeaderCell>
                  <CTableHeaderCell>Número</CTableHeaderCell>
                  <CTableHeaderCell>Sensor RTDB</CTableHeaderCell>
                  <CTableHeaderCell>Estado</CTableHeaderCell>
                  <CTableHeaderCell>Distancia (cm)</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {paginados.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={7} className="text-center py-4">
                      No se encontraron puestos.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  paginados.map((puesto) => (
                    <CTableRow key={puesto.id}>
                      <CTableDataCell><CBadge color="dark" className="fs-6">{puesto.codigo}</CBadge></CTableDataCell>
                      <CTableDataCell>{puesto.columna}</CTableDataCell>
                      <CTableDataCell>{puesto.numero}</CTableDataCell>
                      <CTableDataCell>{puesto.sensor_id_rtdb}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={COLOR_ESTADO[puesto.estado] ?? 'secondary'}>{puesto.estado}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{puesto.distancia_cm ?? '—'}</CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex gap-2">
                          <CButton
                            size="sm"
                            color="info"
                            variant="outline"
                            onClick={() => {
                              setSeleccionado(puesto)
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
                              setAEliminar(puesto)
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

      <PuestoFormModal
        visible={modalVisible}
        puesto={seleccionado}
        guardando={guardando}
        onGuardar={manejarGuardar}
        onCerrar={() => setModalVisible(false)}
      />

      <ConfirmarEliminarModal
        visible={modalEliminarVisible}
        titulo="Eliminar puesto"
        descripcion={<>¿Confirma que desea eliminar el puesto <strong>{aEliminar?.codigo}</strong>?</>}
        eliminando={eliminando}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setModalEliminarVisible(false)}
      />
    </CCard>
  )
}

export default ListaPuestos
