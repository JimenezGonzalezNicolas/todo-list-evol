import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
    getTasks,
    deleteTask,
    getTags,
} from '../../assets/services/tasksService';
import { Task } from '../../assets/interfaces/task';

// Definir el estado inicial
interface TasksState {
    tasks: Task[];
    tags: string[];
    isLoading: boolean;
    error: string | null;
    total: number;
}

const initialState: TasksState = {
    tasks: [],
    tags: [],
    isLoading: false,
    error: null,
    total: 0,
};

// Thunks para llamadas asincrónicas
export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (
        {
            limit = 10,
            offset = 0,
            completed,
            fromDate,
            toDate,
            orderField = 'createdAt',
            orderDirection = 'asc',
        }: {
            limit?: number;
            offset?: number;
            completed?: boolean;
            fromDate?: string;
            toDate?: string;
            orderField?: string;
            orderDirection?: 'asc' | 'desc';
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await getTasks(
                limit,
                offset,
                completed,
                fromDate,
                toDate,
                orderField,
                orderDirection
            );
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchTags = createAsyncThunk(
    'tasks/fetchTags',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getTags();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeTask = createAsyncThunk(
    'tasks/removeTask',
    async (taskId: number, { rejectWithValue }) => {
        try {
            await deleteTask(taskId);
            return taskId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Crear el slice
const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Tasks
            .addCase(fetchTasks.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<{ tasks: Task[]; total: number }>) => {
                state.isLoading = false;
                state.tasks = action.payload.tasks;
                state.total = action.payload.total;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Fetch Tags
            .addCase(fetchTags.fulfilled, (state, action: PayloadAction<string[]>) => {
                state.tags = action.payload;
            })

            // Delete Task
            .addCase(removeTask.fulfilled, (state, action: PayloadAction<number>) => {
                state.tasks = state.tasks.filter((task) => task.id !== action.payload);
            });
    },
});

export default tasksSlice.reducer;
