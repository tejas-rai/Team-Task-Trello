import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeams, addUserToTeam } from "../features/teams/teamsSlice";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { Input, Select } from "../components/FormControls";

export default function TeamsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();  // ← here!
  const { teams, status, error } = useSelector((state) => state.teams);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTeams());
    }
  }, [status, dispatch]);

  const { register, handleSubmit, reset } = useForm();
  const onAdd = ({ userId, teamId }) =>
    dispatch(addUserToTeam({ teamId, userId })).unwrap().then(() => reset());

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Teams</h1>
        {user.role === "admin" && (
          <Button onClick={() => navigate("/teams/create")}>New Team</Button>
        )}
      </div>
  
      {teams.map((team) => (
        <Card key={team._id}>
          <h2 className="text-xl font-medium">{team.name}</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            {team.members.map((m) => (
              <li key={m._id}>{m.name} ({m.email})</li>
            ))}
          </ul>
  
          {user.role === "admin" && (
            <form onSubmit={handleSubmit(onAdd)} className="mt-4 flex space-x-2">
              <Select {...register("userId", { required: true })}>
                <option value="">Select user…</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </Select>
              <Button type="submit">Add</Button>
            </form>
          )}
        </Card>
      ))}
    </div>
  );
}
