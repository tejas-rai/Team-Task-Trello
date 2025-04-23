import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import teamsReducer from "../features/teams/teamsSlice";
import tasksReducer from "../features/tasks/tasksSlice";
import commentsReducer from "../features/comments/commentsSlice";
// later we’ll add teamsReducer, tasksReducer, commentsReducer…

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teams: teamsReducer,
    tasks: tasksReducer,
    comments: commentsReducer,
  },
});
