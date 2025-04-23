// client/src/pages/LoginPage.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { Input } from "../components/FormControls";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, status, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user) {
      navigate("/teams", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = (data) => {
    dispatch(login(data))
      .unwrap()
      .then(() => navigate("/teams"))
      .catch(() => {});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 p-6">
      <Card className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <span className="text-4xl">📝</span>
          <h1 className="ml-3 text-3xl font-bold text-primary">QuickTasks</h1>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-8">Sign In</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block mb-2 font-medium">Email</label>
            <Input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block mb-2 font-medium">Password</label>
            <Input
              type="password"
              {...register("password", { required: "Password is required" })}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3 font-medium"
          >
            {status === "loading" ? "Signing in…" : "Sign In"}
          </Button>

          {/* Server error */}
          {status === "failed" && (
            <p className="text-center text-red-600 text-sm mt-4">{error}</p>
          )}
        </form>
      </Card>
    </div>
  );
}
