import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { loginUser } from "../../services/authService.js";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import useUIStore from "../../store/uiStore.js";
import { getErrorMessage } from "../../utils/errorHandler.js";

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const showToast = useUIStore((s) => s.showToast);
  const onSubmit = async (data) => {
  setLoading(true);

  try {
    const res = await loginUser(data);
    console.log("LOGIN RESPONSE:", res);
    console.log("USER:", res.user);
    console.log("ROLE:", res.user.role);

    login(res.user, res.token);
    console.log("Before navigate");

    if (res.user.role === "admin") {
      console.log("Going to ADMIN");
      navigate("/admin");
    } else {
      console.log("Going to USER");
      navigate("/dashboard");
    }

console.log("After navigate");

    showToast({
        message: `Welcome back, ${res.user.name}!`,
        type: "success",
    });

    
  } catch (err) {
    showToast({
      message: getErrorMessage(err),
      type: "error",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        placeholder="your@email.com"
        error={errors.email?.message}
        {...register("email", {
          required: "Email is required",
          pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
        })}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password", {
          required: "Password is required",
          minLength: { value: 6, message: "Min 6 characters" },
        })}
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-400">
          <input type="checkbox" className="rounded border-white/20" /> Remember me
        </label>
        <Link to="/forgot-password" className="text-sm text-accent hover:underline">Forgot password?</Link>
      </div>
      <Button type="submit" className="w-full" loading={loading}>Sign In</Button>
    </form>
  );
}

export default LoginForm;
