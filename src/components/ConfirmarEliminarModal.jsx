import React from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'

const ConfirmarEliminarModal = ({
  visible,
  titulo,
  descripcion,
  eliminando,
  onConfirmar,
  onCancelar,
}) => (
  <CModal visible={visible} onClose={onCancelar} alignment="center">
    <CModalHeader closeButton={!eliminando}>
      <CModalTitle>{titulo}</CModalTitle>
    </CModalHeader>
    <CModalBody>{descripcion}</CModalBody>
    <CModalFooter>
      <CButton color="secondary" variant="outline" onClick={onCancelar} disabled={eliminando}>
        Cancelar
      </CButton>
      <CButton color="danger" onClick={onConfirmar} disabled={eliminando}>
        {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
      </CButton>
    </CModalFooter>
  </CModal>
)

ConfirmarEliminarModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  titulo: PropTypes.string.isRequired,
  descripcion: PropTypes.node.isRequired,
  eliminando: PropTypes.bool,
  onConfirmar: PropTypes.func.isRequired,
  onCancelar: PropTypes.func.isRequired,
}

export default ConfirmarEliminarModal
