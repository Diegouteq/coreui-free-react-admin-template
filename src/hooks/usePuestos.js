import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const COLUMNAS = `
  id, codigo, columna, numero, sensor_id_rtdb, ruta_firebase,
  estado, distancia_cm, ultima_actualizacion, created_at
`

export const usePuestos = () => {
  const [puestos, setPuestos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargarPuestos = useCallback(async () => {
    setCargando(true)
    setError('')

    const { data, error: errorSupabase } = await supabase
      .from('puestos')
      .select(COLUMNAS)
      .order('columna', { ascending: true })
      .order('numero', { ascending: true })

    if (errorSupabase) {
      setPuestos([])
      setError(errorSupabase.message)
    } else {
      setPuestos(data ?? [])
    }

    setCargando(false)
  }, [])

  useEffect(() => {
    cargarPuestos()
  }, [cargarPuestos])

  const crearPuesto = useCallback(
    async (payload) => {
      const { error: errorSupabase } = await supabase.from('puestos').insert(payload)
      if (!errorSupabase) await cargarPuestos()
      return { error: errorSupabase?.message ?? null }
    },
    [cargarPuestos],
  )

  const actualizarPuesto = useCallback(
    async (id, payload) => {
      const { error: errorSupabase } = await supabase.from('puestos').update(payload).eq('id', id)

      if (!errorSupabase) await cargarPuestos()
      return { error: errorSupabase?.message ?? null }
    },
    [cargarPuestos],
  )

  const eliminarPuesto = useCallback(
    async (id) => {
      const { error: errorSupabase } = await supabase.from('puestos').delete().eq('id', id)

      if (!errorSupabase) await cargarPuestos()
      return { error: errorSupabase?.message ?? null }
    },
    [cargarPuestos],
  )

  return {
    puestos,
    cargando,
    error,
    recargar: cargarPuestos,
    crearPuesto,
    actualizarPuesto,
    eliminarPuesto,
  }
}
