import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  fetchComments,
  addComment,
  resetComments
} from "../features/comments/commentsSlice";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function CommentsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = useQuery();
  const taskId = query.get("taskId");

  const {
    comments,
    status,
    error,
    addStatus,
    addError
  } = useSelector((state) => state.comments);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Fetch comments when the page loads or when taskId changes
  useEffect(() => {
    if (!taskId) {
      navigate("/tasks");
      return;
    }
    dispatch(fetchComments(taskId));
    // cleanup when unmounting
    return () => {
      dispatch(resetComments());
    };
  }, [taskId, dispatch, navigate]);

  // Handle new comment
  const onSubmit = async ({ text }) => {
    if (!text.trim()) return;
    await dispatch(addComment({ taskId, text })).unwrap();
    reset(); // clear input
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Tasks
      </button>

      <h1 className="text-2xl font-semibold mb-4">Comments</h1>

      {/* Show loader / error for fetching */}
      {status === "loading" && <p>Loading comments…</p>}
      {status === "failed" && <p className="text-red-600">{error}</p>}

      {/* Comments List */}
      <ul className="space-y-3 mb-6">
        {comments.map((c) => (
          <li key={c._id} className="border rounded-lg p-4 bg-gray-50">
            <p className="text-gray-800">{c.text}</p>
            <div className="mt-2 text-sm text-gray-500">
              — {c.author.name},{" "}
              {new Date(c.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div>
          <textarea
            {...register("text", { required: "Comment cannot be empty" })}
            rows={3}
            placeholder="Write your comment…"
            className="w-full border rounded px-3 py-2"
          />
          {errors.text && (
            <p className="text-red-600 text-sm mt-1">
              {errors.text.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={addStatus === "loading"}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
        >
          {addStatus === "loading" ? "Posting…" : "Post Comment"}
        </button>
        {addStatus === "failed" && (
          <p className="text-red-600 text-sm">{addError}</p>
        )}
      </form>
    </div>
  );
}
