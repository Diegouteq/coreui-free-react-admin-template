import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const COLUMNAS = `
  id, placa, marca, modelo, anio, color, tipo,
  foto_url, foto_fuente_url, foto_propietario_url,
  cedula_propietario, cedula_enmascarada,
  propietario_nombre, correo_institucional, autorizado, created_at
`

export const useVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargarVehiculos = useCallback(async () => {
    setCargando(true)
    setError('')

    const { data, error: errorSupabase } = await supabase
      .from('vehiculos')
      .select(COLUMNAS)
      .order('propietario_nombre', { ascending: true })

    if (errorSupabase) {
      setVehiculos([])
      setError(errorSupabase.message)
    } else {
      setVehiculos(data ?? [])
    }

    setCargando(false)
  }, [])

  useEffect(() => {
    cargarVehiculos()
  }, [cargarVehiculos])

  const crearVehiculo = useCallback(
    async (payload) => {
      const { error: errorSupabase } = await supabase
        .from('vehiculos')
        .insert({ ...payload, placa: payload.placa.trim().toUpperCase() })

      if (!errorSupabase) await cargarVehiculos()
      return { error: errorSupabase?.message ?? null }
    },
    [cargarVehiculos],
  )

  const actualizarVehiculo = useCallback(
    async (id, payload) => {
      const { error: errorSupabase } = await supabase
        .from('vehiculos')
        .update({ ...payload, placa: payload.placa.trim().toUpperCase() })
        .eq('id', id)

      if (!errorSupabase) await cargarVehiculos()
      return { error: errorSupabase?.message ?? null }
    },
    [cargarVehiculos],
  )

  const eliminarVehiculo = useCallback(
    async (id) => {
      const { error: errorSupabase } = await supabase.from('vehiculos').delete().eq('id', id)

      if (!errorSupabase) await cargarVehiculos()
      return { error: errorSupabase?.message ?? null }
    },
    [cargarVehiculos],
  )

  return {
    vehiculos,
    cargando,
    error,
    recargar: cargarVehiculos,
    crearVehiculo,
    actualizarVehiculo,
    eliminarVehiculo,
  }
}
