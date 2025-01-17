import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTasks, createTask, updateTask, deleteTask } from "../../assets/services/tasksService";
import { Task } from "../../assets/interfaces/task";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (_, { rejectWithValue }) => {
    try {
        const response = await getTasks();
        return response.tasks;
    } catch (error) {
        return rejectWithValue("Error al obtener tareas");
    }
});

export const addTask = createAsyncThunk("tasks/addTask", async (task: Omit<Task, "id">, { rejectWithValue }) => {
    try {
        const response = await createTask(task);
        return response;
    } catch (error) {
        return rejectWithValue("Error al agregar la tarea");
    }
});

export const updateTaskThunk = createAsyncThunk(
    "tasks/updateTask",
    async ({ id, task }: { id: number; task: Partial<Task> }, { rejectWithValue }) => {
        try {
            await updateTask(id, task);
            return { id, task };
        } catch (error) {
            return rejectWithValue("Error al actualizar la tarea");
        }
    }
);

export const deleteTaskThunk = createAsyncThunk("tasks/deleteTask", async (id: number, { rejectWithValue }) => {
    try {
        await deleteTask(id);
        return id;
    } catch (error) {
        return rejectWithValue("Error al eliminar la tarea");
    }
});
