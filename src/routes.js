/**
 * Application Routes Configuration
 *
 * Defines all protected routes in the application using React lazy loading
 * for code splitting and performance optimization.
 *
 * Each route object contains:
 * - path: URL path for the route
 * - name: Human-readable name for breadcrumbs
 * - element: Lazy-loaded React component
 * - exact: (optional) Requires exact path match
 *
 * @module routes
 */

import React from 'react'

// Parqueadero (UTEQ Smart Parking)
const ListaVehiculos = React.lazy(() => import('./views/parqueadero/vehiculos/ListaVehiculos'))
const ListaPuestos = React.lazy(() => import('./views/parqueadero/puestos/ListaPuestos'))
const ListaHistorial = React.lazy(() => import('./views/parqueadero/historial/ListaHistorial'))

/**
 * Array of route configuration objects
 *
 * @type {Array<Object>}
 * @property {string} path - URL path pattern
 * @property {string} name - Display name for breadcrumbs and navigation
 * @property {React.LazyExoticComponent} element - Lazy-loaded component
 * @property {boolean} [exact] - Whether to match path exactly
 *
 * @example
 * // Route renders when URL matches '/dashboard'
 * { path: '/dashboard', name: 'Dashboard', element: Dashboard }
 */
export const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/parqueadero/vehiculos', name: 'Vehículos', element: ListaVehiculos },
  { path: '/parqueadero/puestos', name: 'Puestos', element: ListaPuestos },
  { path: '/parqueadero/historial', name: 'Historial', element: ListaHistorial },
]

export default routes
