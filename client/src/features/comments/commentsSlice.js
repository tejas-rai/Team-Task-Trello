import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch all comments for a given task
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (taskId, thunkAPI) => {
    const resp = await api.get(`/comments/${taskId}`);
    return resp.data.comments;
  }
);

// Add a new comment
export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ taskId, text }, thunkAPI) => {
    const resp = await api.post("/comments", { taskId, text });
    return resp.data.comment;
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    status: "idle",    // for fetch
    error: null,
    addStatus: "idle", // for addComment
    addError: null,
  },
  reducers: {
    resetComments(state) {
      state.comments = [];
      state.status = "idle";
      state.error = null;
      state.addStatus = "idle";
      state.addError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchComments
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // addComment
      .addCase(addComment.pending, (state) => {
        state.addStatus = "loading";
        state.addError = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.addStatus = "succeeded";
        // append new comment to end
        state.comments.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.addStatus = "failed";
        state.addError = action.error.message;
      });
  },
});

export const { resetComments } = commentsSlice.actions;
export default commentsSlice.reducer;
