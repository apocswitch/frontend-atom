# 🚀 Task Manager - Frontend (Angular 17)

Este es el frontend del proyecto **Task Manager**, desarrollado con **Angular 17** y **Angular Material**. Forma parte del challenge técnico de Atom para una posición de alto nivel profesional.

> 🚀 El proyecto consume una API REST construida con Node.js, Express y desplegada en Firebase Functions.

---

## 🛠 Tecnologías Utilizadas

| Categoría             | Herramienta                        |
|----------------------|-----------------------------------|
| Framework Frontend  | Angular 17                         |
| Componentes UI      | Angular Material                   |
| State Management    | Signals                            |
| Formularios         | Reactive Forms                     |
| CSS                 | SCSS + Flexbox/Grid                |
| Iconografía         | Material Icons                     |
| Comunicación HTTP   | HttpClient                         |
| Testing             | Karma, Jasmine                     |
| CI/CD               | GitHub Actions                     |

---

## 📁 Estructura del Proyecto

```bash
src/
├── app/
│   ├── features/
│   │   ├── auth/               # Autenticación de usuarios
│   │   └── tasks/              # Lógica y vistas de tareas
│   ├── shared/                 # Componentes reutilizables (header, pipes, etc.)
│   ├── data/                   # Modelos e interfaces
│   ├── interceptors/          # Interceptores HTTP para JWT
│   ├── app.config.ts          # Config global (routing, providers)
│   └── app.routes.ts          # Rutas principales
├── assets/                    # Logo e imágenes
├── environments/              # Variables de entorno
└── main.ts                    # Bootstrap del proyecto
```

---

## ✅ Funcionalidades

- Login por correo electrónico
- Validación de formularios con mensajes amigables
- Vista de tareas por usuario
- Crear, editar, eliminar tareas
- Marcar tareas como completadas
- Filtrar y paginar tareas
- Manejo de estado reactivo con Signals
- Control de sesión con tokens JWT + Refresh Token
- UX profesional y responsiva

---

## 🧪 Pruebas

```bash
npm test
```

Ejecuta pruebas unitarias con Karma y Jasmine.

---

## 🌐 Variables de Entorno

Configura el archivo:

```bash
environments/environment.ts
```

```ts
export const environment = {
  production: false,
  apiUrl: "https://us-central1-task-manager-atom.cloudfunctions.net/api"
};
```

---

## 📦 Instalación y Desarrollo

```bash
git clone https://github.com/apocswitch/frontend-atom.git
cd frontend-atom
npm install
npm run start
```

La app se ejecuta por defecto en `http://localhost:4200`

---

## 🚀 Build y Deploy

```bash
npm run build
```

Para desplegar en Firebase Hosting o Vercel, configurar el adaptador correspondiente.

---

## 🔐 Seguridad

- Interceptor JWT para agregar el token en las peticiones.
- Refresco automático de token si el accessToken expira.
- Logout automático si falla el refresh.

---

## 📃 CI/CD con GitHub Actions

Se incluye `frontend.yml` en `.github/workflows` que realiza:

- Instalación de dependencias
- Lint y build del proyecto
- Despliegue a Firebase Hosting o Vercel (ajustable)

---

## 🏷 Badges

![Angular](https://img.shields.io/badge/angular-17-red)
![CI/CD](https://github.com/apocswitch/frontend-atom/actions/workflows/frontend.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 👨‍💻 Autor

**Elvis J. Hernández J**  
📧 ejhernandezj@gmail.com  

Este proyecto fue desarrollado como parte de un challenge técnico para una posición profesional avanzada en desarrollo frontend con Angular.

---

## ✅ To-Do / Futuras Mejoras

- Middleware de Auth con roles
- Animaciones para tareas eliminadas
- Temas (dark/light)
- Mejorar accesibilidad (WCAG)
- Pruebas de integración y e2e
