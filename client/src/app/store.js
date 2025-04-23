import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
// later we’ll add teamsReducer, tasksReducer, commentsReducer…

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // teams: teamsReducer,
    // tasks: tasksReducer,
    // comments: commentsReducer,
  },
});
