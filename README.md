# Todo-List-Evol
Prueba técnica "Desarrollador Full Stack EVOL"

## Descripción
Esta es una aplicación fullstack para la gestión de tareas (To-Do List) desarrollada como parte de una prueba técnica. Incluye funcionalidades completas de CRUD para tareas, filtros, etiquetas y ordenamiento, con diseño modular y responsivo.

---

## Tecnologías Utilizadas

### Frontend
- **React** (con Vite)
- **Redux Toolkit** (gestión de estado global)
- **React Router** (navegación)
- **Tailwind CSS** (estilos)
- **Formik** + **Yup** (validación de formularios)
- **React Testing Library** (pruebas unitarias)

### Backend
- **NestJS** (estructura modular)
- **PostgreSQL** (base de datos)
- **Sequelize ORM** (interacción con la base de datos)
- **Class Validator** (validación de DTOs)
- **Jest** (pruebas)

### DevOps
- **Docker** + **Docker Compose** (entorno local)

---

## Instalación y Configuración

### Requisitos Previos
- **Docker** y **Docker Compose**
- **Node.js** (v18+) y npm (si decides ejecutarlo sin Docker).

### Clonar el Repositorio
```bash
git clone https://github.com/[USUARIO]/todo-list-evol.git
cd todo-list-evol
Variables de Entorno
Frontend (./evol-frontend/.env)

REACT_APP_BACKEND_URL=http://localhost:4000
Backend (./evol-backend/.env)
DB_USER=postgres
DB_PASSWORD=TuContraseña
DB_NAME=todo_db
DB_HOST=postgres
DB_PORT=5432

### Comandos para Levantar el Proyecto

### Iniciar con Docker
docker-compose up --build
Acceder a los Servicios
Frontend: http://localhost:3000
Backend: http://localhost:4000

Apagar los Servicios
docker-compose down --volumes

Base de Datos
Migraciones y Seeders
Si necesitas aplicar manualmente migraciones y seeders, ejecuta:
# Dentro del contenedor backend
docker exec -it todo-backend sh

# Ejecutar migraciones
npx sequelize-cli db:migrate

# Ejecutar seeders
npx sequelize-cli db:seed:all
Ejemplo de Uso de la API
Crear Tarea
curl -X POST http://localhost:4000/api/tasks \
-H "Content-Type: application/json" \
-d '{
  "title": "Nueva tarea",
  "description": "Descripción de la tarea",
  "completed": false,
  "tags": ["importante", "prioridad"],
  "dueDate": "2025-01-20"
}'

Obtener Tareas
curl -X GET "http://localhost:4000/api/tasks?completed=false&order=dueDate:asc"

Pruebas

Frontend
Ejecuta:
cd evol-frontend
npm test

Backend
Ejecuta:
cd evol-backend
npm run test
Estado del Proyecto
✅ CRUD completo de tareas
✅ Filtros por estado, etiquetas y ordenamiento
✅ Sistema de etiquetas con generación dinámica
✅ Docker Compose funcional

Reinicio del Proyecto
Si necesitas reiniciar desde cero:

docker-compose down --volumes
docker-compose up --build

¡Gracias por la oportunidad! 😊
