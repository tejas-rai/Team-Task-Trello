// client/src/pages/LoginPage.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // grab auth state
  const { user, status, error } = useSelector((state) => state.auth);

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // if already logged in, redirect to teams
  useEffect(() => {
    if (user) {
      navigate("/teams", { replace: true });
    }
  }, [user, navigate]);

  // onSubmit handler
  const onSubmit = (data) => {
    dispatch(login(data))
      .unwrap()
      .then(() => {
        navigate("/teams");
      })
      .catch(() => {
        // login rejected – error is in `error`
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Sign In</h2>

        {/* Email Field */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {status === "loading" ? "Signing in…" : "Sign In"}
        </button>

        {/* Server error */}
        {status === "failed" && (
          <p className="text-center text-red-600 text-sm mt-2">{error}</p>
        )}
      </form>
    </div>
  );
}
