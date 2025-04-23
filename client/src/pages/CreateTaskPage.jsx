import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeams } from "../features/teams/teamsSlice";
import { createTask } from "../features/tasks/tasksSlice";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { Input, Select } from "../components/FormControls";

export default function CreateTaskPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teams, status: teamsStatus } = useSelector((s) => s.teams);

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

  const selectedTeamId = watch("team");
  const selectedTeam = teams.find((t) => t._id === selectedTeamId);
  const memberOptions = selectedTeam?.members || [];

  const onSubmit = async (data) => {
    try {
      await dispatch(
        createTask({
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          priority: data.priority,
          team: data.team,
          assignedTo: data.assignedTo,
        })
      ).unwrap();
      navigate("/tasks");
    } catch {
      // error handled via tasks.error
    }
  };

  return (
    <Card className="max-w-xl mx-auto mt-10 p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Create New Task</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <Input
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            {...register("description")}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block mb-1 font-medium">Due Date</label>
          <Input
            type="date"
            {...register("dueDate", { required: "Due date is required" })}
          />
          {errors.dueDate && (
            <p className="text-red-600 text-sm mt-1">
              {errors.dueDate.message}
            </p>
          )}
        </div>

        {/* Priority */}
        <div>
          <label className="block mb-1 font-medium">Priority</label>
          <Select {...register("priority")}>
            {["Low", "Medium", "High"].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </div>

        {/* Team */}
        <div>
          <label className="block mb-1 font-medium">Team</label>
          <Select {...register("team", { required: true })}>
            {teams.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Assigned To */}
        <div>
          <label className="block mb-1 font-medium">Assign To</label>
          <Select
            {...register("assignedTo", { required: "Select a member" })}
            disabled={!memberOptions.length}
          >
            <option value="">Select member…</option>
            {memberOptions.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} ({m.email})
              </option>
            ))}
          </Select>
          {errors.assignedTo && (
            <p className="text-red-600 text-sm mt-1">
              {errors.assignedTo.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating…" : "Create Task"}
        </Button>
      </form>
    </Card>
  );
}
