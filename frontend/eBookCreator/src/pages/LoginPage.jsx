import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, BookOpen, LogIn } from "lucide-react";
import toast from "react-hot-toast";

import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utlis/axiosInstance";
import { API_PATHS } from "../utlis/apiPaths";

import Login from "../assets/login.png";   

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, formData);
      const { token, _id, name, email } = response.data;
      login({ _id, name, email }, token);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      localStorage.clear();
      toast.error(error.response?.data?.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-pink-50 text-gray-900">

  {/* LEFT PANEL */}
  <div className="hidden lg:flex flex-col items-center justify-center w-1/2 p-10 bg-pink-100 relative overflow-hidden border-r border-pink-200">

    <div
      className="absolute inset-0 bg-cover bg-center opacity-80"
      style={{ backgroundImage: `url(${Login})` }}
    />
  </div>

  {/* RIGHT PANEL */}
  <div className="flex items-center justify-center w-full lg:w-1/2 p-6">
    <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-lg border border-pink-100">

      <div className="flex flex-col items-center mb-8">
        <BookOpen className="w-10 h-10 text-pink-600 mb-3" />
        <h2 className="text-3xl font-bold text-gray-900">Log in to your Account</h2>
        <p className="text-gray-600 text-sm">We’re happy to see you again.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          type="email"
          name="email"
          placeholder="Email"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          required
        />

        <InputField
          type="password"
          name="password"
          placeholder="Password"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-pink-200/50 transition"
        >
          {isLoading ? (
            <>
              <LogIn className="w-4 h-4 mr-2 animate-spin" /> Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>

      <p className="text-sm text-center text-gray-600 mt-8">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-pink-600 font-semibold hover:text-pink-700">
          Sign Up
        </Link>
      </p>

    </div>
  </div>
</div>

  );
};

export default LoginPage;
