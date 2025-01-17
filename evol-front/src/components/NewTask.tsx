import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createTask } from "../assets/services/tasksService";
import { useNavigate } from "react-router-dom";
import SuccessModal from "./SuccessModal";

const CreateTask: React.FC = () => {
    const navigate = useNavigate();

    const [tags, setTags] = useState<string[]>([]);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

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

    // Eliminar una etiqueta
    const handleRemoveTag = (tagToRemove: string) => {
        setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
    };

    // Envío del formulario
    const handleSubmit = async (values: any, { resetForm }: any) => {
        try {
            const taskData = {
                ...values,
                tags,
            };
            await createTask(taskData);
            setIsSuccessModalOpen(true); 
            resetForm(); 
            setTags([]);
        } catch (error) {
            console.error("Error al crear tarea:", error);
        }
    };

    // Limpiar el formulario y las etiquetas
    const handleReset = (resetForm: any) => {
        resetForm(); 
        setTags([]); 
    };

    const handleSuccessModalClose = () => {
        setIsSuccessModalOpen(false);
        navigate("/");
    };

    return (
        <div className="flex flex-col justify-center items-center p-4 bg-gray-700 text-white h-screen">
            <h2 className="text-xl font-bold mb-4">Crear Nueva Tarea</h2>

            <Formik
                initialValues={{
                    title: "",
                    description: "",
                    dueDate: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, resetForm }) => (
                    <Form className="space-y-4 w-full lg:w-1/2 animate-slide-up">
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

                        <div className="flex flex-wrap">
                            <div className="w-4/12 flex justify-center px-1">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:opacity-80"
                                >
                                    {isSubmitting ? "Creando..." : "Crear Tarea"}
                                </button>
                            </div>
                            <div className="w-4/12 flex justify-center px-1">
                                <button
                                    type="button"
                                    onClick={() => handleReset(resetForm)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded w-full hover:opacity-80"
                                >
                                    Limpiar
                                </button>
                            </div>
                            <div className="w-4/12 flex justify-center px-1">
                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="bg-red-600 text-white px-4 py-2 rounded w-full hover:opacity-80"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>

            {isSuccessModalOpen && (
                <SuccessModal
                    message="¡Tarea creada con éxito!"
                    onConfirm={handleSuccessModalClose}
                />
            )}
        </div>
    );
};

export default CreateTask;
