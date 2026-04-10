# 🚀 Iso-27001 Frontend

Frontend desarrollado en **React + Vite** para la gestión de checklist, dashboard y administración basada en ISO 27001.

---

## 🛠️ Tecnologías

- ⚛️ React 18
- ⚡ Vite
- 🎨 Tailwind CSS v4
- 🔐 Context API (Auth / Theme)
- 📊 Recharts
- 🎬 Framer Motion

---

## 📁 Estructura del proyecto

```
src/
│
├── Pages/
│   ├── Dashboard/
│   ├── Checklist/
│   ├── Admin/
│   └── Settings/
│
├── layouts/
├── context/
├── Router.jsx
├── App.jsx
└── main.jsx
```

---

## 🚀 Instalación

```bash
npm install
npm run dev
```

---

## 🌐 Rutas principales

- `/login` → Login
- `/` → Dashboard
- `/checklist` → Checklist ISO
- `/admin` → Administración
- `/settings` → Configuración

---

## 🔐 Autenticación

Se maneja mediante `AuthContext` para proteger rutas privadas usando `ProtectedRoute`.

---

## 🎨 Estilos

Se utiliza **Tailwind CSS v4** con configuración moderna usando:

```css
@import "tailwindcss";
```

---

## 📌 Notas

- No se usa PostCSS ni configuración legacy
- Router centralizado en `Router.jsx`
- Componentes organizados por dominio

---

## 👨‍💻 Autor

Proyecto desarrollado para gestión de cumplimiento ISO 27001.

```

```
