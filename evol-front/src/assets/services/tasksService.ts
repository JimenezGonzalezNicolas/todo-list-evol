import axios from "axios";
import { Task } from "../interfaces/task";

export interface GetTasksResponse {
    tasks: Task[];
    total: number;
}

const API_URL = "http://localhost:4000/tasks";

export const getTasks = async (
    limit = 10,
    offset = 0,
    completed?: boolean,
    fromDate?: string,
    toDate?: string,
    orderField: string = "createdAt",
    orderDirection: "asc" | "desc" = "asc"
): Promise<GetTasksResponse> => {
    const params: any = { limit, offset };
    if (completed !== undefined) params.completed = completed;
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    // Construir el parámetro order correctamente
    if (orderField) {
        params.order = `${orderField}:${orderDirection}`;
    }

    try {
        const response = await axios.get<GetTasksResponse>(API_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error al obtener tareas:", error);
        throw error;
    }
};

export const getTaskById = async (id: number): Promise<Task> => {
    const response = await axios.get<Task>(`${API_URL}/${id}`);
    return response.data;
};

export const createTask = async (task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> => {
    const response = await axios.post<Task>(API_URL, task);
    return response.data;
};

export const updateTask = async (id: number, task: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>): Promise<Task> => {
    const response = await axios.put<Task>(`${API_URL}/${id}`, task);
    return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};

export const getTags = async (): Promise<string[]> => {
    const response = await axios.get<string[]>(`${API_URL}/tags`);
    return response.data;
};
