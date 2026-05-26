# SecurePath — Documentación de Arquitectura y Requerimientos

> Documento generado a partir del análisis del código fuente del frontend (`src.zip`).  
> Fecha: Mayo 2026

---

## Tabla de contenido

1. [Resumen del proyecto](#1-resumen-del-proyecto)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Arquitectura del frontend](#3-arquitectura-del-frontend)
4. [Módulos y páginas](#4-módulos-y-páginas)
5. [Estado global — Redux](#5-estado-global--redux)
6. [Sistema de autenticación y permisos](#6-sistema-de-autenticación-y-permisos)
7. [Comunicación con el backend (API)](#7-comunicación-con-el-backend-api)
8. [Componentes y UI](#8-componentes-y-ui)
9. [Requerimientos funcionales](#9-requerimientos-funcionales)
10. [Requerimientos no funcionales](#10-requerimientos-no-funcionales)
11. [Flujos clave del sistema](#11-flujos-clave-del-sistema)
12. [Recomendación de herramienta IA para esquemas](#12-recomendación-de-herramienta-ia-para-esquemas)

---

## 1. Resumen del proyecto

**SecurePath** es una aplicación web de gestión de cumplimiento bajo el estándar **ISO 27001** (Seguridad de la Información). Permite a empresas llevar un **checklist de controles de seguridad**, gestionar usuarios por roles, y analizar documentos de evidencia usando **Inteligencia Artificial**.

### Propósito principal

- Auditar el cumplimiento de los controles de la norma ISO 27001.
- Gestionar usuarios, roles y departamentos por empresa.
- Analizar documentos PDF mediante IA para determinar nivel de cumplimiento.

---

## 2. Stack tecnológico

### Frontend

| Tecnología          | Uso                                               |
| ------------------- | ------------------------------------------------- |
| React 18            | Framework de UI, componentes funcionales          |
| Vite                | Bundler y entorno de desarrollo                   |
| React Router DOM v6 | Enrutamiento SPA                                  |
| Redux Toolkit       | Estado global (loginSlice)                        |
| Tailwind CSS        | Estilos con clases utilitarias, soporte dark mode |
| Framer Motion       | Animaciones declarativas                          |
| Lucide React        | Librería de íconos                                |
| React Hot Toast     | Notificaciones tipo toast                         |

### Backend (inferido desde servicios del frontend)

| Aspecto              | Detalle                                                               |
| -------------------- | --------------------------------------------------------------------- |
| Tipo de API          | REST sobre HTTP                                                       |
| Autenticación        | JWT Bearer Token + x-api-key header                                   |
| Base URL             | Variable de entorno `GateWay` / `iso`                                 |
| Formato de datos     | JSON                                                                  |
| Endpoints observados | `/api/catalog/roles`, `/api/admin/*`, `/api/checklist/*`, `/api/ia/*` |

---

## 3. Arquitectura del frontend

La aplicación sigue una **arquitectura modular por features (pages)**, con separación clara entre:

```
src/
├── main.jsx                  # Punto de entrada, monta React + Redux Store
├── App.jsx                   # Proveedores globales: Theme + Auth + Router
├── Router.jsx                # Definición de rutas protegidas y públicas
│
├── context/
│   ├── AuthContext.jsx       # Contexto de sesión (login, logout, user)
│   └── ThemeContext.jsx      # Contexto de tema (light/dark)
│
├── redux/
│   └── slides/loginSlice.js  # Slice de autenticación (estado global)
│
├── layouts/
│   └── MainLayout.jsx        # Layout base: Sidebar + Header + Outlet
│
├── Pages/
│   ├── Login/                # Autenticación
│   ├── Dashboard/            # Vista principal (métricas)
│   ├── Checklist/            # Gestión de controles ISO 27001
│   ├── Admin/                # Gestión de usuarios y departamentos
│   └── Settings/             # Configuración
│
├── Components/
│   ├── ui/                   # Button, Input, Badge, Toggle
│   └── ThemeToggle/          # Botón de cambio de tema
│
└── Server.js                 # Constantes de URLs del backend
```

### Flujo de carga de la aplicación

```
main.jsx → App.jsx → ThemeProvider → AuthProvider → Redux → AppRouter → MainLayout → Page
```

---

## 4. Módulos y páginas

### 4.1 Login

- Formulario de correo + contraseña.
- Llama a `authService.login()` → despacha `loginSuccess` a Redux.
- Persiste sesión en `localStorage` como JSON.
- Redirige a `/` si autenticación es exitosa.

### 4.2 Dashboard

- Vista principal post-login.
- Muestra métricas generales del cumplimiento de la empresa.
- Accesible para todos los roles autenticados.

### 4.3 Checklist — ISO 27001

El módulo más complejo del sistema. Permite gestionar los controles de seguridad.

**Componentes internos:**

| Componente               | Responsabilidad                                                           |
| ------------------------ | ------------------------------------------------------------------------- |
| `ChecklistItem`          | Ítem colapsable con estado, justificación y URL de evidencia              |
| `ControlDetailsExpanded` | Vista expandida de detalles del control                                   |
| `StatusDropdown`         | Selector de estado (no iniciado, en progreso, cumple, no cumple, parcial) |
| `HistorialModal`         | Historial de cambios del control                                          |
| `Analisi_IA_Modal`       | Análisis de documentos PDF con IA                                         |

**Estados de un control:**

- `not_started` — No iniciado
- `in_progress` — En progreso
- `completed` — Cumple
- `non_compliant` — No cumple
- `partial` — Cumple parcialmente

**Flujo del análisis con IA:**

1. El usuario selecciona un estado distinto de "No iniciado" y lo guarda.
2. Se habilita el botón "Analizar con IA".
3. El usuario carga un PDF (máx. 10MB).
4. El backend procesa el documento y retorna un análisis estructurado:
   - Estado sugerido, nivel de cumplimiento (%), riesgo de incumplimiento.
   - Resumen ejecutivo, aspectos que cumple, aspectos que faltan.
   - Tabla comparativa: norma vs. documento vs. conclusión.
   - Recomendaciones.

### 4.4 Admin

Accesible solo para roles con permiso `viewAdmin`.

**Sub-módulos:**

| Sub-módulo          | Descripción                                                          |
| ------------------- | -------------------------------------------------------------------- |
| `StatsCards`        | Métricas: total usuarios, administradores, auditores                 |
| `UserTable`         | Listado paginado de usuarios con acciones                            |
| `UserModal`         | Crear / editar usuario (nombre, correo, password, rol, departamento) |
| `DepartamentoModal` | Crear / eliminar departamentos                                       |
| `EmpresaFechasCard` | Configurar fechas de inicio y fin del ciclo de auditoría             |

**Operaciones CRUD:**

- Usuarios: Crear, Listar, Actualizar, Eliminar.
- Departamentos: Crear, Listar, Eliminar.
- Empresa: Obtener datos, Actualizar fechas.

---

## 5. Estado global — Redux

### loginSlice

```
state.login
├── user                  # Objeto del usuario autenticado
│   ├── nombre_usuario    # Nombre para mostrar
│   ├── correo_electronico
│   ├── rol_id            # ID del rol (determina permisos)
│   ├── empresa_id        # ID de la empresa asociada
│   └── roles_de_usuario.nombre_del_rol
├── isAuthenticated       # Boolean
├── loading               # Boolean (durante login)
└── error                 # String (mensaje de error)
```

**Acciones:** `loginStart` · `loginSuccess` · `loginFailure` · `logout`

---

## 6. Sistema de autenticación y permisos

### Autenticación

- Al iniciar sesión, el token y datos del usuario se guardan en `localStorage["auth"]`.
- `AuthContext` hidrata Redux desde `localStorage` al montar la app (persistencia de sesión).
- Al cerrar sesión: se limpia `localStorage` y se despacha `logout`.

### Permisos por rol

Los permisos se calculan desde `rol_id` mediante la función `getPermissions()` y el resultado determina qué opciones del sidebar son visibles para cada usuario:

```javascript
{
  viewAdmin: true/false,            // Ver sección administración
  canCreateUser: true/false,        // Crear usuarios
  canManageDepartments: true/false, // Gestionar departamentos
  canDeleteUser: true/false,        // Eliminar usuarios
}
```

Los ítems del sidebar se filtran dinámicamente según estos permisos.

---

## 7. Comunicación con el backend (API)

Las peticiones HTTP se realizan directamente en el service de cada página usando `fetch`. A continuación los endpoints identificados:

### Endpoints inferidos del código

#### Autenticación

| Método | Ruta              | Descripción   |
| ------ | ----------------- | ------------- |
| POST   | `/api/auth/login` | Autenticación |

#### Admin

| Método | Ruta                                         | Descripción                    |
| ------ | -------------------------------------------- | ------------------------------ |
| GET    | `/api/catalog/roles`                         | Listar roles del sistema       |
| GET    | `/api/admin/Lista-usuarios?empresa_id={}`    | Listar usuarios de empresa     |
| POST   | `/api/admin/Crear-usuarios`                  | Crear usuario                  |
| PUT    | `/api/admin/usuarios/:id`                    | Actualizar usuario             |
| DELETE | `/api/admin/usuarios/:id?empresa_id={}`      | Eliminar usuario               |
| GET    | `/api/admin/departamentos?empresa_id={}`     | Listar departamentos           |
| POST   | `/api/admin/departamentos`                   | Crear departamento             |
| DELETE | `/api/admin/departamentos/:id?empresa_id={}` | Eliminar departamento          |
| GET    | `/api/admin/empresa?empresa_id={}`           | Obtener datos de empresa       |
| PUT    | `/api/admin/empresa/fechas`                  | Actualizar fechas de auditoría |

#### Checklist

| Método | Ruta                           | Descripción                                       |
| ------ | ------------------------------ | ------------------------------------------------- |
| GET    | `/api/checklist/...`           | Obtener controles de empresa                      |
| PUT    | `/api/checklist/:id`           | Actualizar estado + justificación + URL evidencia |
| GET    | `/api/checklist/:id/historial` | Historial de cambios                              |
| POST   | `/api/ia/analizar`             | Análisis de PDF con IA (FormData)                 |

---

## 8. Componentes y UI

### Sistema de diseño

- **Paleta:** Indigo para acciones primarias, Slate para neutrales, Emerald para acciones secundarias, Violet para IA.
- **Dark mode:** Implementado con clases `dark:` de Tailwind, togglado via `ThemeContext` y `localStorage`.
- **Animaciones:** Framer Motion para modales (fade + scale), listas (stagger), botones (hover scale).
- **Notificaciones:** React Hot Toast, posición top-center, duración 3000ms.

### Componentes UI base

| Componente    | Ubicación                | Props principales                  |
| ------------- | ------------------------ | ---------------------------------- |
| `Button`      | `Components/ui/Button`   | variant, size, onClick, disabled   |
| `Input`       | `Components/ui/Input`    | value, onChange, placeholder, type |
| `Badge`       | `Components/ui/Badge`    | variant (success/danger/warning)   |
| `Toggle`      | `Components/ui/Toggle`   | checked, onChange                  |
| `ThemeToggle` | `Components/ThemeToggle` | (sin props, usa contexto)          |

### Layout principal

```
┌─────────────────────────────────────────────┐
│  Sidebar (w-64, fixed)  │  Header (sticky)  │
│  - Logo SecurePath      │  - Avatar usuario │
│  - NavLinks filtrados   │  - Rol del usuario│
│    por permisos         │  - Botón de tema  │
│  - Botón logout         │                   │
│─────────────────────────┤                   │
│              <Outlet /> (main content)      │
└─────────────────────────────────────────────┘
```

---

## 9. Requerimientos funcionales

### RF-01: Autenticación

- El sistema debe permitir iniciar sesión con correo electrónico y contraseña.
- La sesión debe persistir al recargar la página mediante `localStorage`.
- El sistema debe permitir cerrar sesión limpiando el estado.
- Las rutas protegidas deben redirigir al login si no hay sesión activa.

### RF-02: Gestión de tema visual

- El usuario puede alternar entre tema claro y oscuro.
- La preferencia se persiste en `localStorage`.
- El cambio debe aplicarse de forma inmediata y global.

### RF-03: Checklist ISO 27001

- El sistema debe listar todos los controles de seguridad asignados a la empresa.
- Cada control debe mostrar: ID, dominio, título, descripción, estado, prioridad.
- El usuario puede cambiar el estado de un control (pendiente → en progreso → cumple, etc.).
- El cambio de estado requiere justificación obligatoria para guardarse.
- El usuario puede adjuntar una URL de evidencia (opcional).
- El sistema debe mostrar quién fue el último en modificar el control y cuándo.
- El sistema debe mantener un historial de cambios por control.

### RF-04: Análisis con IA

- El análisis con IA solo se habilita cuando el control tiene un estado guardado distinto de "No iniciado".
- El usuario puede cargar un PDF (máximo 10MB).
- El sistema debe enviar el PDF al backend y mostrar el análisis estructurado.
- El análisis debe incluir: estado sugerido, nivel de cumplimiento (%), riesgo, resumen, aspectos que cumple/faltan, tabla comparativa y recomendaciones.
- El usuario puede realizar un nuevo análisis desde el mismo modal.

### RF-05: Administración de usuarios

- Solo usuarios con rol Administrador pueden acceder al módulo Admin.
- El administrador puede crear, editar y eliminar usuarios de su empresa.
- Al crear un usuario se deben definir: nombre, correo, contraseña, rol y departamento (opcional).
- El sistema debe mostrar estadísticas: total de usuarios, cantidad de administradores y auditores.

### RF-06: Administración de departamentos

- El administrador puede crear y eliminar departamentos de su empresa.
- Los departamentos pueden asignarse a usuarios durante la creación/edición.

### RF-07: Configuración de empresa

- El administrador puede configurar las fechas de inicio y fin del ciclo de auditoría de la empresa.

---

## 10. Requerimientos no funcionales

### RNF-01: Seguridad

- Todas las peticiones autenticadas deben enviar el token JWT en el header `Authorization: Bearer <token>`.
- Las rutas protegidas deben validarse en el cliente antes de renderizar.
- Los permisos deben calcularse desde el `rol_id` almacenado en el estado global.

### RNF-02: Usabilidad

- La interfaz debe ser completamente funcional en modo oscuro y claro.
- Los cambios de estado deben tener retroalimentación visual inmediata (toast, loading states).
- Los modales deben tener animaciones de entrada y salida fluidas.
- Los botones deben mostrar estados de carga mientras se procesan peticiones.

### RNF-03: Rendimiento

- Los datos de usuarios, roles y departamentos deben cargarse en paralelo al montar el módulo Admin.
- Los componentes del checklist deben implementar renderizado condicional (collapse/expand) para no sobrecargar el DOM.
- Las llamadas a la API deben manejar estados de carga y error de forma granular.

### RNF-04: Mantenibilidad

- La lógica de negocio de cada módulo debe estar encapsulada en su propio service hook.
- Los componentes UI base deben ser reutilizables y no acoplar lógica de negocio.
- Los permisos deben centralizarse en una función `getPermissions(rol_id)`.

### RNF-05: Compatibilidad

- La aplicación debe funcionar en los navegadores modernos principales (Chrome, Firefox, Safari, Edge).
- El diseño debe ser responsivo con soporte para vista móvil y desktop.

---

## 11. Flujos clave del sistema

### Flujo de autenticación

```
Usuario ingresa credenciales
  → POST /api/auth/login
  → Respuesta exitosa: guarda en localStorage + dispatch loginSuccess
  → Redirige a Dashboard
  ↓ (En cada carga de app)
  → AuthContext lee localStorage y rehidrata Redux automáticamente
```

### Flujo de checklist + guardado

```
Usuario abre un control (ChecklistItem expand)
  → Selecciona nuevo estado en StatusDropdown
  → Escribe justificación (obligatoria)
  → (Opcional) Agrega URL de evidencia
  → Click "Guardar"
    → PUT /api/checklist/:id { status, justificacion, url_evidencia }
    → Toast de éxito o error
    → Se habilita botón "Analizar con IA"
```

### Flujo de análisis IA

```
Usuario hace click en "Analizar con IA" (solo si estado ≠ not_started y estado guardado)
  → Abre Analisi_IA_Modal
  → Usuario carga un PDF
  → Click "Analizar"
    → POST /api/ia/analizar (FormData con PDF + itemId)
    → Loading state en modal
    → Respuesta: objeto con análisis estructurado
    → Renderiza: badge de estado, barra de cumplimiento, resumen,
      aspectos cumple/faltan, tabla comparativa, recomendaciones
```

---

## 12. Recomendación de herramienta IA para esquemas

Para generar, actualizar y explorar los diagramas de arquitectura de este proyecto, se recomienda la siguiente herramienta:

### Claude con Artifacts (esta misma herramienta)

**Por qué es la mejor opción para este proyecto:**

- Genera diagramas SVG y HTML interactivos directamente desde descripciones de código o arquitectura.
- Puede leer tu código fuente (como se hizo en este documento) y mapear la arquitectura automáticamente.
- Soporta diagramas estructurales, de flujo, ERDs (con mermaid.js) e ilustrativos.
- Los diagramas son clickeables y pueden generar más documentación al hacer clic.

**Casos de uso concretos para SecurePath:**

| Necesidad                | Prompt sugerido                                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------------------------------- |
| ERD de la base de datos  | "Genera un diagrama ERD con las entidades: Usuario, Empresa, Rol, Departamento, Control, Historial, AnálisisIA" |
| Flujo de autenticación   | "Dibuja el flujo de autenticación JWT desde login hasta la primera petición autenticada"                        |
| Arquitectura del backend | "Dibuja la arquitectura de un backend REST Node.js con estas rutas: [pega los endpoints]"                       |
| Actualizar este diagrama | "Actualiza el diagrama de arquitectura para incluir el módulo de Settings"                                      |

### Alternativas complementarias

| Herramienta             | Uso ideal                                                                           | Limitación                                     |
| ----------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------- |
| **Eraser.io**           | Diagramas colaborativos editables en equipo, soporte de IA para generar desde texto | No lee código fuente directamente              |
| **Mermaid Live Editor** | Diagramas de flujo y secuencia rápidos en texto                                     | Sin IA generativa, requiere sintaxis manual    |
| **Lucidchart**          | Diagramas empresariales formales para presentaciones                                | Sin IA de generación automática en plan básico |
| **Whimsical**           | Wireframes + diagramas de flujo, IA básica                                          | Menos potente para arquitecturas de código     |

### Recomendación final

Para el ciclo de desarrollo de SecurePath, la combinación óptima es:

1. **Claude** → para generar y actualizar la documentación técnica y diagramas de arquitectura desde el código.
2. **Eraser.io** → para colaboración en equipo y diagramas editables compartidos.
3. **Mermaid** (integrado en GitHub/Notion) → para ERDs y diagramas de secuencia en documentación versionada.

---

_Documento generado automáticamente mediante análisis estático del código fuente. Algunos endpoints y requerimientos pueden inferirse de patrones de código y pueden requerir validación con el equipo de backend._
