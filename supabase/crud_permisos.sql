-- Ejecutar DESPUES de supabase_parqueadero_uteq.sql
-- Habilita INSERT/UPDATE/DELETE (CRUD completo) sobre vehiculos, puestos
-- y registros_estacionamiento para los roles anon/authenticated.
-- Uso academico: politicas abiertas (using(true)), sin autenticacion.

begin;

-- ----------------------------------------------------------------
-- 1. VEHICULOS: ampliar columnas visibles y habilitar escritura
-- ----------------------------------------------------------------
grant select (
  id, placa, marca, modelo, anio, color, tipo,
  foto_url, foto_fuente_url, foto_propietario_url,
  cedula_propietario, cedula_enmascarada,
  propietario_nombre, correo_institucional, autorizado, created_at
) on public.vehiculos to anon, authenticated;

grant insert (
  placa, marca, modelo, anio, color, tipo,
  foto_url, foto_fuente_url, foto_propietario_url,
  cedula_propietario, propietario_nombre,
  correo_institucional, autorizado
) on public.vehiculos to anon, authenticated;

grant update (
  placa, marca, modelo, anio, color, tipo,
  foto_url, foto_fuente_url, foto_propietario_url,
  cedula_propietario, propietario_nombre,
  correo_institucional, autorizado
) on public.vehiculos to anon, authenticated;

grant delete on public.vehiculos to anon, authenticated;

drop policy if exists "Lectura publica de vehiculos autorizados" on public.vehiculos;
drop policy if exists "CRUD publico de vehiculos (practica)" on public.vehiculos;

create policy "CRUD publico de vehiculos (practica)"
on public.vehiculos
for all
to anon, authenticated
using (true)
with check (true);

-- ----------------------------------------------------------------
-- 2. PUESTOS: habilitar CRUD completo
-- ----------------------------------------------------------------
grant select, insert, update, delete on public.puestos to anon, authenticated;

drop policy if exists "CRUD publico de puestos (practica)" on public.puestos;

create policy "CRUD publico de puestos (practica)"
on public.puestos
for all
to anon, authenticated
using (true)
with check (true);

-- ----------------------------------------------------------------
-- 3. REGISTROS_ESTACIONAMIENTO (Historial): habilitar CRUD completo
-- ----------------------------------------------------------------
grant select, insert, update, delete
  on public.registros_estacionamiento to anon, authenticated;

drop policy if exists "CRUD publico de registros (practica)"
  on public.registros_estacionamiento;

create policy "CRUD publico de registros (practica)"
on public.registros_estacionamiento
for all
to anon, authenticated
using (true)
with check (true);

commit;
