import React, { useEffect, useState } from "react";
import { getTasks, getTags, deleteTask } from "../assets/services/tasksService";
import Pen from '../assets/images/svg/pen-solid.svg'
import Thrash from '../assets/images/svg/trash-solid.svg'
import { useNavigate } from "react-router-dom";
import UpdateTask from "./UpdateTask";
import ConfirmDelete from "./ConfirmDelete";

interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    tags: string[];
    dueDate: string;
}

const TasksList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCompleted, setFilterCompleted] = useState<"all" | "completed" | "pending">("all");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTag, setSelectedTag] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

    // Cantidad de tarjetas por página
    const ITEMS_PER_PAGE = 9;
    const navigate = useNavigate();

    // Traer el listado de tareas
    const fetchFilteredTasks = async () => {
        setIsLoading(true);
        try {
            const completedFilter = filterCompleted === "all" ? undefined : filterCompleted === "completed";
            const offset = (currentPage - 1) * ITEMS_PER_PAGE;
            const response = await getTasks(
                ITEMS_PER_PAGE,
                offset,
                completedFilter,
                fromDate,
                toDate,
                "createdAt",
                sortOrder
            );
            console.log("Respuesta de getTasks:", response);
            setTasks(response.tasks || []);
        } catch (error) {
            console.error("Error al cargar tareas:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Traer tareas filtradas por criterios de búsqueda
    useEffect(() => {
        fetchFilteredTasks();
    }, [filterCompleted, sortOrder, currentPage, fromDate, toDate]);

    useEffect(() => {
        // Traer las etiquetas
        const fetchTags = async () => {
            try {
                const tagsData = await getTags();
                console.log("Etiquetas recibidas:", tagsData);
                setTags(tagsData || []);
            } catch (error) {
                console.error("Error al obtener etiquetas:", error);
                setTags([]);
            }
        };

        fetchTags();
    }, []);

    // Búsqueda por título o etiquetas
    const filteredTasks = tasks.filter((task) => {
        const matchesTitle = task.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = selectedTag ? task.tags.includes(selectedTag) : true;
        return matchesTitle && matchesTag;
    });

    // Abrir modal de edición
    const handleEditClick = (taskId: number) => {
        setSelectedTaskId(taskId);
        setIsModalOpen(true);
    };

    // Cerrar modal edición
    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedTaskId(null);
    };

    // Actualizar la lista posterior a cambios
    const handleTaskUpdate = () => {
        fetchFilteredTasks();
    };

    // Abre modal de confirmación
    const handleDeleteClick = (id: number) => {
        setTaskToDelete(id); 
        setIsDeleteModalOpen(true);
    };

    // Elimina desde el modal
    const handleConfirmDelete = async () => {
        if (taskToDelete === null) return;

        try {
            await deleteTask(taskToDelete);
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
            fetchFilteredTasks();
            alert("Tarea eliminada con éxito");
        } catch (error) {
            console.error("Error al eliminar tarea:", error);
        }
    };

    // Cancela eliminación y cierra el modal
    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setTaskToDelete(null); 
    };


    return (
        <div className="w-full h-screen p-4 bg-gray-700 text-white">
            <div className="flex justify-center lg:justify-start w-full my-4">
                <button
                    onClick={() => navigate("/new-task")}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Nueva Tarea
                </button>
            </div>
            <div className="flex flex-wrap justify-between items-center mb-4 text-black">
                <div className="flex flex-col gap-1 w-full lg:w-1/4">
                    <span className="text-white font-bold">Nombre de la tarea</span>
                    <input
                        type="text"
                        placeholder="Buscar por nombre"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border rounded bg-gray-300"
                    />
                </div>
                <div className="flex flex-col gap-1 w-full mx-1 lg:w-1/4">
                    <span className="text-white font-bold">Estado</span>
                    <select
                        value={filterCompleted}
                        onChange={(e) => setFilterCompleted(e.target.value as "all" | "completed" | "pending")}
                        className="p-2 border rounded bg-gray-300"
                    >
                        <option value="all">Todas</option>
                        <option value="completed">Completadas</option>
                        <option value="pending">Pendientes</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1 w-full lg:w-1/4">
                    <span className="text-white font-bold">Orden</span>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                        className="p-2 border rounded bg-gray-300"
                    >
                        <option value="asc">Ascendente</option>
                        <option value="desc">Descendente</option>
                    </select>
                </div>

            </div>
            <div className="flex flex-wrap justify-between items-center mb-4 text-black">
                <div className="flex flex-col gap-1 w-full lg:w-1/4">
                    <span className="text-white font-bold">Etiquetas</span>
                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className="p-2 border rounded bg-gray-300"
                    >
                        <option value="">Todas las etiquetas</option>
                        {Array.isArray(tags) && tags.map((tag) => (
                            <option key={tag} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1 w-full lg:w-1/4">
                    <span className="text-white font-bold">Fecha desde</span>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="p-2 border rounded bg-gray-300"
                    />
                </div>
                <div className="flex flex-col gap-1 w-full lg:w-1/4">
                    <span className="text-white font-bold">Fecha hasta</span>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="p-2 border rounded bg-gray-300"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="text-center">Cargando tareas...</div>
            ) : filteredTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up">
                    {filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className="p-4 rounded transition bg-gray-300"
                        >
                            <h3 className="text-lg font-bold text-gray-500">{task.title}</h3>
                            <p>{task.description}</p>
                            <p className="text-sm text-gray-600">
                                Fecha límite: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                            <div className="flex flex-wrap justify-center lg:justify-between">
                                <div className="flex justify-start w-full lg:w-1/2 mt-2">
                                    <span
                                        className={`inline-block px-2 py-1 rounded text-white ${task.completed ? "bg-green-500" : "bg-red-500"}`}
                                    >
                                        {task.completed ? "Completada" : "Pendiente"}
                                    </span>
                                </div>

                                <div className="flex justify-end items-center w-full lg:w-1/2 mt-2 gap-1">
                                    <div className="w-1/8 p-1">
                                        <img
                                            src={Pen}
                                            alt="Editar"
                                            className="w-4 h-4 cursor-pointer evol-icon hover:opacity-80"
                                            onClick={() => handleEditClick(task.id)}
                                        />
                                    </div>
                                    <div className="w-1/8 p-1">
                                        <img
                                            src={Thrash}
                                            className="w-4 h-4 cursor-pointer evol-icon hover:opacity-80"
                                            alt="Eliminar"
                                            onClick={() => handleDeleteClick(task.id)} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-white">No se encontraron tareas.</div>
            )}

            <div className="flex justify-center mt-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    Anterior
                </button>
                <span className="px-4 py-2">{currentPage}</span>
                <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-4 py-2 border rounded"
                >
                    Siguiente
                </button>
            </div>

            {isModalOpen && selectedTaskId !== null && (
                <UpdateTask
                    taskId={selectedTaskId}
                    onClose={handleModalClose}
                    onUpdate={handleTaskUpdate}
                />
            )}

            {isDeleteModalOpen && (
                <ConfirmDelete
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    message="¿Estás seguro de que deseas eliminar esta tarea?"
                />
            )}
        </div>
    );
};

export default TasksList;