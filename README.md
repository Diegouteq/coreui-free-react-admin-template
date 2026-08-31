<img width="1240" height="634" alt="Captura de pantalla 2026-08-30 193502" src="https://github.com/user-attachments/assets/7787ba2c-13db-40c4-9049-171dbb9276a9" />UTEQ Smart Parking — CRUD de Vehículos, Puestos e Historial

Consola administrativa para el caso de estudio **UTEQ Smart Parking**, construida
sobre la plantilla [CoreUI Free React Admin Template](https://coreui.io/product/free-react-admin-template/)
y conectada a una base de datos [Supabase](https://supabase.com/) (PostgreSQL).

Permite listar, buscar, paginar, crear, editar y eliminar vehículos con sus
propietarios, puestos de parqueo e historial de estacionamiento.

## Tabla de contenido

* [¿Qué se hizo en esta práctica?](#qué-se-hizo-en-esta-práctica)
* [Capturas](#capturas)
* [Tecnologías](#tecnologías)
* [Estructura del proyecto](#estructura-del-proyecto)
* [Configuración de la base de datos](#configuración-de-la-base-de-datos)
* [Configuración local](#configuración-local)
* [Scripts disponibles](#scripts-disponibles)
* [Funcionalidad por módulo](#funcionalidad-por-módulo)
* [Créditos](#créditos)

## ¿Qué se hizo en esta práctica?

Se partió de la plantilla base de CoreUI (React + Vite) y se construyó un CRUD
completo sobre tres tablas de Supabase:

* **Vehículos** (`vehiculos`): vehículo + propietario en un mismo formulario.
* **Puestos** (`puestos`): distribución física de los puestos de parqueo.
* **Historial** (`registros_estacionamiento`): registros de entrada/salida,
  vinculando un vehículo con un puesto.

Para cada módulo se implementó:

* Listado con búsqueda y paginación en el cliente.
* Formulario modal para **agregar** y **editar**, con validaciones antes de
  enviar los datos a Supabase (formato de placa, cédula, rangos numéricos,
  campos obligatorios, coherencia entre estado y fechas en Historial, etc.).
* Inclusión de la **foto del propietario** dentro del registro del vehículo,
  además de la foto del vehículo y la información del titular.
* **Eliminar** con modal de confirmación.
* Mensajes de éxito y error, indicadores de carga (`CSpinner`) y botones
  deshabilitados mientras se guarda, edita o elimina.
* Interfaz 100% con componentes de CoreUI, responsiva.

Además, se removieron del menú lateral y de las rutas todas las secciones de
demostración de la plantilla original (Dashboard, UI Elements, Forms, Icons,
Widgets, Authentication, Error pages, Docs) que no aplican a este caso de
estudio, y se reemplazó el logo por el del proyecto (UTEQ Smart Parking).

## Capturas

<img width="1240" height="634" alt="Captura de pantalla 2026-08-30 193502" src="https://github.com/user-attachments/assets/4a5433d3-bb79-4c29-b696-85a1e1d0f00c" />" 
<img width="1246" height="459" alt="Captura de pantalla 2026-08-30 193514" src="https://github.com/user-attachments/assets/86aaaddc-b53c-446b-b2a3-f6ed86dd5fdd" />" 
<img width="1241" height="525" alt="Captura de pantalla 2026-08-30 193527" src="https://github.com/user-attachments/assets/4981eb45-9519-4d44-822e-daff5c258e77" />" 

## Tecnologías

* [React 19](https://react.dev/) + [Vite](https://vite.dev/)
* [CoreUI React](https://coreui.io/react/)
* [Supabase](https://supabase.com/) (PostgreSQL + Row Level Security)
* [@supabase/supabase-js](https://github.com/supabase/supabase-js)

## Estructura del proyecto

```text
coreui-free-react-admin-template/
├── .env.example
├── package.json
└── src/
    ├── assets/
    │   └── brand/
    │       ├── logoUteq.jsx           # Logo completo de la barra lateral
    │       └── logoUteqSygnet.jsx     # Logo compacto (modo colapsado)
    ├── components/
    │   └── ConfirmarEliminarModal.jsx # Modal de confirmación reutilizable
    ├── hooks/
    │   ├── useVehiculos.js            # CRUD de vehiculos
    │   ├── usePuestos.js              # CRUD de puestos
    │   └── useRegistros.js            # CRUD de registros_estacionamiento
    ├── lib/
    │   ├── supabase.js                # Cliente de Supabase
    │   └── validadores.js             # Reglas de validación por formulario
    ├── views/
    │   └── parqueadero/
    │       ├── vehiculos/
    │       │   ├── ListaVehiculos.jsx
    │       │   └── VehiculoFormModal.jsx
    │       ├── puestos/
    │       │   ├── ListaPuestos.jsx
    │       │   └── PuestoFormModal.jsx
    │       └── historial/
    │           ├── ListaHistorial.jsx
    │           └── RegistroFormModal.jsx
    ├── _nav.jsx                       # Menú lateral (Vehículos, Puestos, Historial)
    └── routes.js                      # Rutas de la aplicación
```

## Configuración de la base de datos

1. Crea un proyecto en [supabase.com](https://supabase.com/).
2. En **SQL Editor**, ejecuta el script que crea las tablas base
   (`vehiculos`, `puestos`, `registros_estacionamiento`) con sus datos de
   ejemplo.
3. Ejecuta también `supabase/crud_permisos.sql` (incluido en este repositorio),
   que otorga los permisos `INSERT`/`UPDATE`/`DELETE` y las políticas RLS
   necesarias para que el CRUD funcione.

> ⚠️ Las políticas quedan abiertas (`using(true)`) porque esta práctica no
> implementa autenticación. En un entorno real, protege el CRUD con
> [Supabase Auth](https://supabase.com/docs/guides/auth) y políticas RLS por
> usuario/rol.

## Configuración local

```bash
# 1. Clonar el repositorio
git clone https://github.com/Diegouteq/coreui-free-react-admin-template.git
cd coreui-free-react-admin-template

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Completa VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY
# con los valores de tu proyecto (Project Settings → API en Supabase)

# 4. Levantar el proyecto
npm start
```

La aplicación queda disponible en `http://localhost:3000`.

## Scripts disponibles

| Comando         | Descripción                                  |
|-----------------|-----------------------------------------------|
| `npm start`     | Levanta el servidor de desarrollo (Vite)       |
| `npm run build` | Genera el build de producción en `/build`      |
| `npm run serve` | Sirve el build de producción localmente        |
| `npm run lint`  | Corre ESLint sobre el código fuente            |

## Funcionalidad por módulo

### Vehículos (`/parqueadero/vehiculos`)
Placa, marca, modelo, año, color, tipo, foto del vehículo, foto del propietario,
 y datos del propietario (cédula, nombre, correo institucional, estado de
 autorización).

### Puestos (`/parqueadero/puestos`)
Código, columna (A-D), número, sensor asociado (RTDB/Firebase), estado
(disponible, ocupado, reservado, fuera de servicio) y distancia medida.

### Historial (`/parqueadero/historial`)
Código de registro, vehículo y puesto asociados (mediante selects), placa
detectada, fechas de entrada/salida, duración, y estado (activo, finalizado,
anulado).

## Créditos

Basado en [CoreUI Free React Admin Template](https://github.com/coreui/coreui-free-react-admin-template)
(licencia MIT). CRUD, integración con Supabase y adaptación al caso de
estudio UTEQ Smart Parking desarrollados como práctica académica.

**Autor:** Lucas Diego — UTEQ
