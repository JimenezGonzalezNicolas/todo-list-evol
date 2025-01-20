<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

<h1 align="center">Todo List API</h1>

<p align="center">
  Una aplicación de backend para la gestión de tareas utilizando <a href="https://nestjs.com/" target="_blank">NestJS</a>, <a href="https://www.postgresql.org/" target="_blank">PostgreSQL</a> y <a href="https://sequelize.org/" target="_blank">Sequelize</a>.
</p>

---

## Descripción

Esta API permite gestionar tareas agregando características adicionales como filtros, ordenamiento o etiquetas. Fue realizada como proceso de prueba técnica para demostrar habilidades de desarrollo full stack utilizando buenas prácticas.

---

## Características

- CRUD completo de tareas:
  - Crear, Leer, Actualizar y Eliminar tareas.
- Filtros por estado (`completed`) y rango de fechas (`fromDate`, `toDate`).
- Ordenamiento dinámico por campos (`createdAt`, `dueDate`).
- Sistema de etiquetas con endpoint para obtener etiquetas únicas.
- Documentación generada automáticamente con Swagger.
- Tests unitarios e integración con cobertura mínima del 50%.
- Contenedor Docker para fácil despliegue local.

---

## Requisitos

- **Node.js** >= 18.x
- **PostgreSQL** >= 15.x
- **Docker** y **Docker Compose** (opcional para entorno local)

---

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-repositorio/todo-list-api.git
   cd evol-backend
2. Instalar las dependencias:
    ```bash 
    npm install
3. Configurar variables de entorno:
    ```bash 
    Dentro del archivo .env en la raíz del proyecto y actualiza siguientes variables en base a la disponibilidad propia en el sistema (Por ejemplo):
    ```bash 
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=todo_db
    DB_USER=todo_user
    DB_PASSWORD=todo_password
