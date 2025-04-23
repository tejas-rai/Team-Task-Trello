import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeams } from "../features/teams/teamsSlice";
import { createTask } from "../features/tasks/tasksSlice";
import { useNavigate } from "react-router-dom";

export default function CreateTaskPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teams, status: teamsStatus } = useSelector((s) => s.teams);

  // Load teams if we haven’t yet
  useEffect(() => {
    if (teamsStatus === "idle") {
      dispatch(fetchTeams());
    }
  }, [teamsStatus, dispatch]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      priority: "Medium",
      team: teams.length ? teams[0]._id : "",
      assignedTo: "",
    },
  });

  // Watch the selected team to update members dropdown
  const selectedTeamId = watch("team");
  const selectedTeam = teams.find((t) => t._id === selectedTeamId);
  const memberOptions = selectedTeam?.members || [];

  const onSubmit = async (data) => {
    try {
      // dispatch createTask
      await dispatch(createTask({
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        priority: data.priority,
        team: data.team,
        assignedTo: data.assignedTo,
      })).unwrap();
      navigate("/tasks");
    } catch {
      // error is in tasks.error
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-semibold mb-6">Create New Task</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            {...register("description")}
            className="w-full border rounded px-3 py-2"
            rows={3}
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block mb-1 font-medium">Due Date</label>
          <input
            type="date"
            {...register("dueDate", { required: "Due date is required" })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.dueDate && (
            <p className="text-red-600 text-sm mt-1">{errors.dueDate.message}</p>
          )}
        </div>

        {/* Priority */}
        <div>
          <label className="block mb-1 font-medium">Priority</label>
          <select
            {...register("priority")}
            className="w-full border rounded px-3 py-2"
          >
            {["Low", "Medium", "High"].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Team */}
        <div>
          <label className="block mb-1 font-medium">Team</label>
          <select
            {...register("team", { required: true })}
            className="w-full border rounded px-3 py-2"
          >
            {teams.map((t) => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Assigned To */}
        <div>
          <label className="block mb-1 font-medium">Assign To</label>
          <select
            {...register("assignedTo", { required: "Select a member" })}
            className="w-full border rounded px-3 py-2"
            disabled={!memberOptions.length}
          >
            <option value="">-- select member --</option>
            {memberOptions.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} ({m.email})
              </option>
            ))}
          </select>
          {errors.assignedTo && (
            <p className="text-red-600 text-sm mt-1">{errors.assignedTo.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Creating…" : "Create Task"}
        </button>
      </form>
    </div>
  );
}
