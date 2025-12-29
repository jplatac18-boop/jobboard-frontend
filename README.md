Job Board Frontend

Frontend de la plataforma Job Board, una SPA construida con React, TypeScript y Tailwind CSS, que consume la API del backend jobboard-backend para gestionar ofertas de trabajo, empresas, candidatos y postulaciones.

La aplicación está pensada para usarse como proyecto de portafolio profesional, con un diseño moderno, responsive y centrado en la experiencia de usuario.

Características principales
Aplicación de una sola página (SPA) con React + TypeScript.

Estilos consistentes y responsive con Tailwind CSS.

Flujo completo para candidatos:

Registro, login y gestión de perfil.

Exploración y filtrado de ofertas.

Postulación a ofertas y visualización de estados.

Flujo para empresas:

Creación y edición de ofertas.

Listado de postulantes y actualización de estado (pendiente, aceptado, rechazado).

Integración con el backend mediante HTTP/JSON (JWT en headers).

Navegación tipo dashboard con secciones para “Mis ofertas”, “Postulaciones”, “Perfil”, etc.

Stack tecnológico
Framework: React

Lenguaje: TypeScript

Bundler / Dev server: Vite

Estilos: Tailwind CSS

Ruteo: React Router (o la librería que estés usando para navegación interna)

HTTP client: Axios o fetch (según lo que hayas configurado)

Estructura del proyecto
La estructura puede variar, pero una organización típica es:

text
jobboard-frontend/
├─ public/
├─ src/
│  ├─ components/      # Componentes reutilizables (Buttons, Cards, Inputs, Modals, etc.)
│  ├─ pages/           # Páginas principales (Home, Login, Register, Jobs, Dashboard, etc.)
│  ├─ features/        # Módulos específicos (jobs, applications, companies, auth)
│  ├─ hooks/           # Hooks personalizados (useAuth, useJobs, etc.)
│  ├─ services/        # Llamadas a la API (clientes HTTP, endpoints)
│  ├─ layouts/         # Layouts de dashboard, layout público, etc.
│  ├─ types/           # Tipos/Interfaces TypeScript compartidos
│  ├─ router/          # Configuración de rutas
│  └─ main.tsx         # Punto de entrada de la app
├─ index.html
├─ package.json
└─ tsconfig.json
Se recomienda añadir una carpeta docs/ o assets/ con capturas de pantalla y diagramas que ilustren los principales flujos de la interfaz.

Requisitos previos
Node.js (versión LTS recomendada).

npm, pnpm o yarn (elige el gestor de paquetes que uses en el proyecto).

Backend jobboard-backend corriendo en local (por defecto en http://127.0.0.1:8000/).

Configuración de entorno
En la raíz del proyecto crea un archivo .env (o .env.local según tu configuración de Vite) para apuntar al backend:

text
VITE_API_BASE_URL=http://127.0.0.1:8000/api
Si usas otro nombre de variable, ajusta esta línea a lo que espere tu cliente HTTP.

Instalación y ejecución en local
Clonar el repositorio:

bash
git clone https://github.com/tu-usuario/jobboard-frontend.git
cd jobboard-frontend
Instalar dependencias:

bash
# con npm
npm install

# o con pnpm
# pnpm install

# o con yarn
# yarn
Ejecutar en modo desarrollo:

bash
# npm
npm run dev

# pnpm
# pnpm dev

# yarn
# yarn dev
Normalmente Vite expone la aplicación en:

http://localhost:5173/ (o el puerto que indique la consola).

Asegúrate de que el backend está corriendo y que VITE_API_BASE_URL apunta a la URL correcta (http://127.0.0.1:8000/api en local).

Build para producción:

bash
# npm
npm run build

# pnpm
# pnpm build

# yarn
# yarn build
Vista previa del build (opcional):

bash
# npm
npm run preview
Integración con el backend
La app se comunica con jobboard-backend usando peticiones HTTP a los endpoints:

Autenticación:

POST /api/auth/login/

POST /api/auth/register/

POST /api/auth/refresh/

GET /api/auth/me/

Gestión de ofertas:

GET /api/jobs/

POST /api/jobs/

GET /api/jobs/{id}/, PUT/PATCH, DELETE

Postulaciones:

GET /api/applications/

POST /api/applications/

PATCH /api/applications/{id}/

El token JWT recibido en el login se almacena en el frontend (por ejemplo en localStorage o en memoria + cookies seguras) y se envía en el header Authorization: Bearer <token> en cada petición autenticada.

Diseño y experiencia de usuario
El frontend aplica las mejoras de UX y diseño definidas para la plataforma Job Board:

Sistema de diseño base con tipografía consistente y componentes reutilizables (botones, cards, inputs, selects, badges).

Formularios con validación clara (errores bajo cada campo, colores de estado, mensajes de éxito mediante toasts/banners).

Listados de ofertas y postulaciones con estados de carga (skeletons), mensajes de “no hay resultados” y filtros visibles por modalidad, nivel, ubicación y tipo de trabajo.

Navegación tipo dashboard con secciones separadas para candidatos y empresas, facilitando la gestión de ofertas y postulaciones.

Se recomienda añadir capturas de pantalla o GIFs de:

Pantalla de inicio o listado de ofertas.

Flujo de login/registro.

Dashboard de candidato (mis postulaciones).

Dashboard de empresa (mis ofertas + postulantes).

Sube las imágenes a docs/ o public/ y enlázalas en este README con descripciones breves.

Flujo de trabajo con Git
Rama principal: main siempre estable.

Ramas de feature para nuevas funcionalidades de UI, por ejemplo:

feature/job-list-ui

feature/application-dashboard

feature/responsive-layout

Commits pequeños, con mensajes claros en imperativo:

feat: add job list with filters

feat: implement candidate applications page

style: adjust spacing on dashboard

fix: handle expired token on API calls

Este historial hace que el repositorio se vea profesional y fácil de revisar para reclutadores o revisores técnicos.

Despliegue
El frontend puede desplegarse fácilmente en servicios como Vercel, Netlify o cualquier hosting estático:

Configurar la variable de entorno pública para producción (por ejemplo, en Vercel/Netlify):

text
VITE_API_BASE_URL=https://tu-dominio-backend.com/api
Ejecutar npm run build (o el comando que use la plataforma) para generar los archivos estáticos.

Servir la carpeta dist/ generada por Vite.
