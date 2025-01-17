import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateTask, getTaskById } from "../assets/services/tasksService";

interface UpdateTaskProps {
    taskId: number;
    onClose: () => void;
    onUpdate: () => void; 
}

const UpdateTask: React.FC<UpdateTaskProps> = ({ taskId, onClose, onUpdate }) => {
    const [tags, setTags] = useState<string[]>([]);
    const [taskData, setTaskData] = useState<any>(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const task = await getTaskById(taskId);
                setTaskData(task);
                setTags(task.tags || []);
            } catch (error) {
                console.error("Error al obtener la tarea:", error);
            }
        };

        fetchTask();
    }, [taskId]);

    // Validación con Yup
    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .max(50, "El título no debe exceder los 50 caracteres")
            .required("El título es obligatorio"),
        description: Yup.string()
            .max(200, "La descripción no debe exceder los 200 caracteres")
            .required("La descripción es obligatoria"),
        dueDate: Yup.date().required("Debe ingresar una fecha válida"),
    });

    // Agregar etiquetas
    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
            e.preventDefault();
            const newTag = e.currentTarget.value.trim();
            if (!tags.includes(newTag)) {
                setTags((prevTags) => [...prevTags, newTag]);
            }
            e.currentTarget.value = "";
        }
    };

    // Eliminar etiquetas
    const handleRemoveTag = (tagToRemove: string) => {
        setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
    };

    // Manejar el envío del formulario
    const handleSubmit = async (values: any) => {
        try {
            const updatedTask = {
                ...values,
                tags,
            };
            await updateTask(taskId, updatedTask);
            onUpdate(); 
            onClose(); 
        } catch (error) {
            console.error("Error al actualizar tarea:", error);
        }
    };

    if (!taskData) {
        return <div className="text-center p-4">Cargando datos...</div>;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-gray-700 text-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Actualizar Tarea</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-500 font-bold text-lg"
                    >
                        &times;
                    </button>
                </div>

                <Formik
                    initialValues={{
                        title: taskData.title,
                        description: taskData.description,
                        dueDate: taskData.dueDate.slice(0, 10),
                        completed: taskData.completed,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, values, setFieldValue }) => (
                        <Form className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block font-medium">
                                    Título
                                </label>
                                <Field
                                    type="text"
                                    name="title"
                                    id="title"
                                    className="p-2 border rounded w-full text-black"
                                />
                                <ErrorMessage
                                    name="title"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block font-medium">
                                    Descripción
                                </label>
                                <Field
                                    as="textarea"
                                    name="description"
                                    id="description"
                                    rows={3}
                                    className="p-2 border rounded w-full text-black"
                                />
                                <ErrorMessage
                                    name="description"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="tags" className="block font-medium">
                                    Etiquetas
                                </label>
                                <input
                                    type="text"
                                    id="tags"
                                    placeholder="Escribe y presiona Enter"
                                    className="p-2 border rounded w-full text-black"
                                    onKeyDown={handleAddTag}
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {tags.map((tag, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-full"
                                        >
                                            <span>{tag}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="ml-2 text-white font-bold"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="dueDate" className="block font-medium">
                                    Fecha Límite
                                </label>
                                <Field
                                    type="date"
                                    name="dueDate"
                                    id="dueDate"
                                    className="p-2 border rounded w-full text-black"
                                />
                                <ErrorMessage
                                    name="dueDate"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="completed" className="block font-medium">
                                    Estado
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="completed"
                                        checked={values.completed}
                                        onChange={() => setFieldValue("completed", !values.completed)}
                                        className="toggle-checkbox hidden"
                                    />
                                    <span
                                        className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                                            values.completed ? "bg-green-500" : ""
                                        }`}
                                    >
                                        <span
                                            className={`bg-white w-4 h-4 rounded-full shadow-md transform ${
                                                values.completed ? "translate-x-5" : ""
                                            }`}
                                        ></span>
                                    </span>
                                    {values.completed ? "Completada" : "Pendiente"}
                                </label>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    {isSubmitting ? "Actualizando..." : "Actualizar"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default UpdateTask;
