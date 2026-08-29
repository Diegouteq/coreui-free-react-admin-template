import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const COLUMNAS = `
  id, codigo_registro, vehiculo_id, puesto_id, placa_detectada,
  sensor_id_rtdb, fecha_entrada, fecha_salida, duracion_minutos,
  distancia_cm_entrada, estado, observacion, created_at,
  vehiculos ( placa, marca, modelo, propietario_nombre ),
  puestos ( codigo, columna, numero )
`

export const useRegistros = () => {
  const [registros, setRegistros] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargarRegistros = useCallback(async () => {
    setCargando(true)
    setError('')

    const { data, error: errorSupabase } = await supabase
      .from('registros_estacionamiento')
      .select(COLUMNAS)
      .order('fecha_entrada', { ascending: false })

    if (errorSupabase) {
      setRegistros([])
      setError(errorSupabase.message)
    } else {
      setRegistros(data ?? [])
    }

    setCargando(false)
  }, [])

  useEffect(() => {
    cargarRegistros()
  }, [cargarRegistros])

  const crearRegistro = useCallback(
    async (payload) => {
      const { error: errorSupabase } = await supabase
        .from('registros_estacionamiento')
        .insert(payload)

      if (!errorSupabase) await cargarRegistros()
      return { error: errorSupabase?.message ?? null }
    },
    [cargarRegistros],
  )

  const actualizarRegistro = useCallback(
    async (id, payload) => {
      const { error: errorSupabase } = await supabase
        .from('registros_estacionamiento')
        .update(payload)
        .eq('id', id)

      if (!errorSupabase) await cargarRegistros()
      return { error: errorSupabase?.message ?? null }
    },
    [cargarRegistros],
  )

  const eliminarRegistro = useCallback(
    async (id) => {
      const { error: errorSupabase } = await supabase
        .from('registros_estacionamiento')
        .delete()
        .eq('id', id)

      if (!errorSupabase) await cargarRegistros()
      return { error: errorSupabase?.message ?? null }
    },
    [cargarRegistros],
  )

  return {
    registros,
    cargando,
    error,
    recargar: cargarRegistros,
    crearRegistro,
    actualizarRegistro,
    eliminarRegistro,
  }
}
