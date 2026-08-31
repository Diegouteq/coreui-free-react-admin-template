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

import { useVehiculos } from '../../../hooks/useVehiculos'
import VehiculoFormModal from './VehiculoFormModal'
import ConfirmarEliminarModal from '../../../components/ConfirmarEliminarModal'

const ListaVehiculos = () => {
  const {
    vehiculos,
    cargando,
    error,
    recargar,
    crearVehiculo,
    actualizarVehiculo,
    eliminarVehiculo,
  } = useVehiculos()

  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(1)
  const vehiculosPorPagina = 10

  const [modalVisible, setModalVisible] = useState(false)
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const [modalEliminarVisible, setModalEliminarVisible] = useState(false)
  const [vehiculoAEliminar, setVehiculoAEliminar] = useState(null)
  const [eliminando, setEliminando] = useState(false)

  const [mensajeExito, setMensajeExito] = useState('')

  useEffect(() => {
    setPagina(1)
  }, [busqueda])

  useEffect(() => {
    if (!mensajeExito) return undefined
    const temporizador = setTimeout(() => setMensajeExito(''), 4000)
    return () => clearTimeout(temporizador)
  }, [mensajeExito])

  const vehiculosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    if (!texto) return vehiculos

    return vehiculos.filter((vehiculo) =>
      [
        vehiculo.placa,
        vehiculo.marca,
        vehiculo.modelo,
        vehiculo.color,
        vehiculo.propietario_nombre,
        vehiculo.correo_institucional,
      ].some((valor) => valor?.toLowerCase().includes(texto)),
    )
  }, [vehiculos, busqueda])

  const totalPaginas = Math.max(1, Math.ceil(vehiculosFiltrados.length / vehiculosPorPagina))
  const paginaActual = Math.min(pagina, totalPaginas)

  const vehiculosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * vehiculosPorPagina
    return vehiculosFiltrados.slice(inicio, inicio + vehiculosPorPagina)
  }, [vehiculosFiltrados, paginaActual])

  const abrirAgregar = () => {
    setVehiculoSeleccionado(null)
    setModalVisible(true)
  }

  const abrirEditar = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo)
    setModalVisible(true)
  }

  const manejarGuardar = async (form, id) => {
    setGuardando(true)
    const payload = {
      placa: form.placa,
      marca: form.marca,
      modelo: form.modelo,
      anio: Number(form.anio),
      color: form.color,
      tipo: form.tipo,
      foto_url: form.foto_url,
      foto_fuente_url: form.foto_fuente_url,
      foto_propietario_url: form.foto_propietario_url,
      cedula_propietario: form.cedula_propietario,
      propietario_nombre: form.propietario_nombre,
      correo_institucional: form.correo_institucional,
      autorizado: form.autorizado,
    }

    const resultado = id
      ? await actualizarVehiculo(id, payload)
      : await crearVehiculo(payload)

    setGuardando(false)
    if (!resultado.error) {
      setModalVisible(false)
      setMensajeExito(id ? 'Vehículo actualizado correctamente.' : 'Vehículo creado correctamente.')
    }
    return resultado
  }

  const abrirEliminar = (vehiculo) => {
    setVehiculoAEliminar(vehiculo)
    setModalEliminarVisible(true)
  }

  const confirmarEliminar = async () => {
    if (!vehiculoAEliminar) return
    setEliminando(true)
    const { error: errorEliminar } = await eliminarVehiculo(vehiculoAEliminar.id)
    setEliminando(false)

    if (!errorEliminar) {
      setModalEliminarVisible(false)
      setVehiculoAEliminar(null)
      setMensajeExito('Vehículo eliminado correctamente.')
    }
  }

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <strong>Vehículos y propietarios</strong>
          <div className="small text-body-secondary">Vehículos autorizados en UTEQ Smart Parking</div>
        </div>

        <div className="d-flex gap-2">
          <CButton color="success" variant="outline" onClick={recargar} disabled={cargando}>
            Actualizar
          </CButton>
          <CButton color="success" onClick={abrirAgregar}>
            <CIcon icon={cilPlus} className="me-1" />
            Agregar vehículo
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
            placeholder="Buscar placa, vehículo o propietario..."
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            style={{ maxWidth: '420px' }}
          />
          <span className="text-body-secondary">{vehiculosFiltrados.length} vehículos</span>
        </div>

        {cargando && (
          <div className="text-center py-5">
            <CSpinner color="success" />
            <p className="mt-3">Cargando vehículos...</p>
          </div>
        )}

        {!cargando && error && (
          <CAlert color="danger">No se pudieron cargar los vehículos: {error}</CAlert>
        )}

        {!cargando && !error && (
          <>
            <CTable align="middle" bordered hover responsive striped>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell>Foto</CTableHeaderCell>
                  <CTableHeaderCell>Placa</CTableHeaderCell>
                  <CTableHeaderCell>Vehículo</CTableHeaderCell>
                  <CTableHeaderCell>Año / color</CTableHeaderCell>
                  <CTableHeaderCell>Foto del propietario</CTableHeaderCell>
                  <CTableHeaderCell>Propietario</CTableHeaderCell>
                  <CTableHeaderCell>Cédula</CTableHeaderCell>
                  <CTableHeaderCell>Correo</CTableHeaderCell>
                  <CTableHeaderCell>Estado</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {vehiculosPaginados.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={10} className="text-center py-4">
                      No se encontraron vehículos.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  vehiculosPaginados.map((vehiculo) => (
                    <CTableRow key={vehiculo.id}>
                      <CTableDataCell>
                        <img
                          src={vehiculo.foto_url}
                          alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                          width="90"
                          height="60"
                          style={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="dark" className="fs-6">{vehiculo.placa}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <strong>{vehiculo.marca}</strong>
                        <div className="small text-body-secondary">{vehiculo.modelo}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        {vehiculo.anio}
                        <div className="small text-body-secondary">{vehiculo.color}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <img
                          src={vehiculo.foto_propietario_url}
                          alt={vehiculo.propietario_nombre}
                          width="48"
                          height="48"
                          style={{ objectFit: 'cover', borderRadius: '50%' }}
                        />
                      </CTableDataCell>
                      <CTableDataCell>{vehiculo.propietario_nombre}</CTableDataCell>
                      <CTableDataCell>{vehiculo.cedula_enmascarada}</CTableDataCell>
                      <CTableDataCell>
                        <a href={`mailto:${vehiculo.correo_institucional}`}>
                          {vehiculo.correo_institucional}
                        </a>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={vehiculo.autorizado ? 'success' : 'danger'}>
                          {vehiculo.autorizado ? 'Autorizado' : 'No autorizado'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex gap-2">
                          <CButton size="sm" color="info" variant="outline" onClick={() => abrirEditar(vehiculo)}>
                            <CIcon icon={cilPencil} />
                          </CButton>
                          <CButton size="sm" color="danger" variant="outline" onClick={() => abrirEliminar(vehiculo)}>
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
              <small className="text-body-secondary">
                Página {paginaActual} de {totalPaginas}
              </small>
              <div className="d-flex gap-2">
                <CButton
                  color="secondary"
                  variant="outline"
                  disabled={paginaActual === 1}
                  onClick={() => setPagina((valor) => Math.max(1, valor - 1))}
                >
                  Anterior
                </CButton>
                <CButton
                  color="success"
                  variant="outline"
                  disabled={paginaActual === totalPaginas}
                  onClick={() => setPagina((valor) => Math.min(totalPaginas, valor + 1))}
                >
                  Siguiente
                </CButton>
              </div>
            </div>
          </>
        )}
      </CCardBody>

      <VehiculoFormModal
        visible={modalVisible}
        vehiculo={vehiculoSeleccionado}
        guardando={guardando}
        onGuardar={manejarGuardar}
        onCerrar={() => setModalVisible(false)}
      />

      <ConfirmarEliminarModal
        visible={modalEliminarVisible}
        titulo="Eliminar vehículo"
        descripcion={
          <>
            ¿Confirma que desea eliminar el vehículo{' '}
            <strong>{vehiculoAEliminar?.placa}</strong> de{' '}
            <strong>{vehiculoAEliminar?.propietario_nombre}</strong>? Esta acción no se puede deshacer.
          </>
        }
        eliminando={eliminando}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setModalEliminarVisible(false)}
      />
    </CCard>
  )
}

export default ListaVehiculos
