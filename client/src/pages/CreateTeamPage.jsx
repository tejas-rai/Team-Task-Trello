import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createTeam } from "../features/teams/teamsSlice";
import { useNavigate } from "react-router-dom";

export default function CreateTeamPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.teams);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = ({ name }) => {
    dispatch(createTeam(name))
      .unwrap()
      .then(() => navigate("/teams"))
      .catch(() => {});
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-lg mt-10">
      <h2 className="text-xl font-semibold mb-4">Create New Team</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Team Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 disabled:opacity-50"
        >
          {status === "loading" ? "Creating…" : "Create Team"}
        </button>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
}
