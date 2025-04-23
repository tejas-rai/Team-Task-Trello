// client/src/pages/TeamsPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeams, addUserToTeam } from "../features/teams/teamsSlice";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { Input } from "../components/FormControls";

// A small component for the add-user form, one per team:
function TeamAddUserForm({ teamId, onAdd }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { userId: "" },
    mode: "onSubmit", // only validate on submit
  });

  const submitHandler = (data) => {
    onAdd({ teamId, userId: data.userId });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="mt-4 flex flex-col space-y-2">
      <input type="hidden" {...register("teamId")} value={teamId} />

      <div>
        <Input
          {...register("userId", {
            required: "User ID is required",
            pattern: {
              value: /^[0-9a-fA-F]{24}$/,
              message: 'ID should be like "64a6f29b4b234c1e4d5a6789"',
            },
          })}
          placeholder="Enter User ID"
        />
        {errors.userId && (
          <p className="text-red-600 text-sm mt-1">{errors.userId.message}</p>
        )}
      </div>

      <Button type="submit">Add</Button>
    </form>
  );
}

export default function TeamsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { teams = [], status: teamsStatus, error: teamsError } = useSelector(
    (s) => s.teams
  );
  const { user } = useSelector((s) => s.auth);

  // load teams
  useEffect(() => {
    if (teamsStatus === "idle") {
      dispatch(fetchTeams());
    }
  }, [teamsStatus, dispatch]);

  const handleAdd = ({ teamId, userId }) => {
    return dispatch(addUserToTeam({ teamId, userId })).unwrap();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Teams</h1>
        {user.role === "admin" && (
          <Button onClick={() => navigate("/teams/create")}>New Team</Button>
        )}
      </div>

      {/* Loading / error */}
      {teamsStatus === "loading" && <p>Loading teams…</p>}
      {teamsStatus === "failed" && <p className="text-red-600">{teamsError}</p>}

      {/* Teams */}
      <div className="space-y-4">
        {teams.map((team) => (
          <Card key={team._id}>
            <h2 className="text-xl font-medium">{team.name}</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700">
              {(team.members || []).map((m) => (
                <li key={m._id}>
                  {m.name} ({m.email})
                </li>
              ))}
            </ul>

            {/* only show this form to admins */}
            {user.role === "admin" && (
              <TeamAddUserForm teamId={team._id} onAdd={handleAdd} />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
