import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUser,
  FiLock,
  FiArrowRight,
  FiCompass,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await login(form);

      const first =
        data?.user?.modules?.[0]?.path ||
        "/dashboard";

      navigate(first);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="glass-card w-full max-w-md rounded-3xl p-8"
      >
        <div className="text-center">
          <FiCompass className="mx-auto mb-4 text-4xl text-indigo-500" />

          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text)" }}
          >
            Welcome Back
          </h1>

          <p
            className="mt-2 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            Sign in to your Lost & Found account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >
          <div>
            <label
              className="mb-2 block text-sm font-medium"
              style={{
                color: "var(--text-muted)",
              }}
            >
              Username
            </label>

            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-10 py-3 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium"
              style={{
                color: "var(--text-muted)",
              }}
            >
              Password
            </label>

            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-10 py-3 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl bg-red-100 px-3 py-2 text-sm text-red-600"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            {loading
              ? "Signing In..."
              : "Sign In"}

            {!loading && <FiArrowRight />}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}