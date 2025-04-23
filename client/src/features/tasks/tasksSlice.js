import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// 1️⃣ Fetch all tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, thunkAPI) => {
    const resp = await api.get("/tasks");
    return resp.data.tasks;
  }
);

// 2️⃣ Create a new task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (payload, thunkAPI) => {
    // payload: { title, description, dueDate, priority, assignedTo, team }
    const resp = await api.post("/tasks", payload);
    return resp.data.task;
  }
);

// 3️⃣ Update a task’s status
export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({ taskId, status }, thunkAPI) => {
    const resp = await api.patch(`/tasks/${taskId}/status`, { status });
    return resp.data.task;
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchTasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // createTask
      .addCase(createTask.fulfilled, (state, action) => {
        // new tasks on top
        state.tasks.unshift(action.payload);
      })

      // updateTaskStatus
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.tasks.findIndex((t) => t._id === updated._id);
        if (idx !== -1) state.tasks[idx] = updated;
      });
  },
});

export default tasksSlice.reducer;
