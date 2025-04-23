import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeams, addUserToTeam } from "../features/teams/teamsSlice";
import { useForm } from "react-hook-form";

export default function TeamsPage() {
  const dispatch = useDispatch();
  const { teams, status, error } = useSelector((state) => state.teams);
  const { user } = useSelector((state) => state.auth);

  // load teams on mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTeams());
    }
  }, [status, dispatch]);

  const { register, handleSubmit, reset } = useForm();

  const onAdd = ({ userId, teamId }) => {
    dispatch(addUserToTeam({ teamId, userId }))
      .unwrap()
      .then(() => reset());
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Teams</h1>
{/* Admin-only “New Team” button */}
{user.role === "admin" && (
        <button
          onClick={() => navigate("/teams/create")}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          New Team
        </button>
      )}

      {status === "loading" && <p>Loading teams…</p>}
      {status === "failed" && <p className="text-red-600">{error}</p>}

      {teams.map((team) => (
        <div key={team._id} className="mb-6 p-4 border rounded-lg">
          <h2 className="text-xl font-medium">{team.name}</h2>
          <ul className="list-disc ml-6 mt-2">
            {team.members.map((m) => (
              <li key={m._id}>{m.name} ({m.email})</li>
            ))}
          </ul>

          {user.role === "admin" && (
            <form
              onSubmit={handleSubmit((vals) => onAdd({ ...vals, teamId: team._id }))}
              className="mt-3 flex space-x-2"
            >
              <input
                {...register("userId", { required: true })}
                placeholder="User ID to add"
                className="flex-1 border rounded px-2 py-1"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Add
              </button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
}
