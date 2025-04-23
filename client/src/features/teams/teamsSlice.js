import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch all teams
export const fetchTeams = createAsyncThunk(
  "teams/fetchTeams",
  async (_, thunkAPI) => {
    const resp = await api.get("/teams");
    return resp.data.teams;
  }
);

// Create a new team
export const createTeam = createAsyncThunk(
  "teams/createTeam",
  async (name, thunkAPI) => {
    const resp = await api.post("/teams", { name });
    return resp.data.team;
  }
);

// Add a user to a team
export const addUserToTeam = createAsyncThunk(
  "teams/addUserToTeam",
  async ({ teamId, userId }, thunkAPI) => {
    const resp = await api.post(`/teams/${teamId}/users`, { userId });
    return resp.data.team;
  }
);

const teamsSlice = createSlice({
  name: "teams",
  initialState: {
    teams: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchTeams
      .addCase(fetchTeams.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // createTeam
      .addCase(createTeam.fulfilled, (state, action) => {
        state.teams.unshift(action.payload);
      })
      // addUserToTeam
      .addCase(addUserToTeam.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.teams.findIndex((t) => t._id === updated._id);
        if (idx !== -1) state.teams[idx] = updated;
      });
  },
});

export default teamsSlice.reducer;
