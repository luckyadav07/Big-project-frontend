import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { registerUser } from "../../services/authService.js";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import { getPasswordStrength } from "../../utils/validators.js";

function RegisterForm() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { role: "jobseeker" } });
  const password = watch("password", "");
  const strength = getPasswordStrength(password);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      const res = await registerUser({ name: data.name, email: data.email, password: data.password, role: data.role });
      login(res.data.user, res.data.token);
      navigate(data.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-danger/20 border border-danger/50 px-4 py-3 text-sm text-red-200">{error}</div>
      )}
      <Input
        label="Full Name"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register("name", { required: "Name is required", minLength: { value: 2, message: "Min 2 characters" } })}
      />
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
      <div>
        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Min 8 characters" },
          })}
        />
        {password && (
          <div className="mt-2">
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className={`h-full transition-all ${strength.color}`} style={{ width: `${(strength.score / 4) * 100}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{strength.label}</p>
          </div>
        )}
      </div>
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Repeat password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword", {
          required: "Please confirm password",
          validate: (v) => v === password || "Passwords do not match",
        })}
      />
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Account Role</label>
        <select
          {...register("role", { required: "Please select an account role" })}
          className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="jobseeker">Job Seeker</option>
          <option value="admin">Job Admin</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Skills (optional)</label>
        <div className="flex gap-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            placeholder="Add a skill..."
            className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <Button type="button" variant="outline" size="sm" onClick={addSkill}>Add</Button>
        </div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {skills.map((s) => (
              <span key={s} className="rounded-md bg-accent/20 px-2 py-0.5 text-xs text-accent">{s}</span>
            ))}
          </div>
        )}
      </div>
      <label className="flex items-start gap-2 text-sm text-gray-400">
        <input type="checkbox" required className="mt-1 rounded border-white/20" />
        I agree to the <Link to="#" className="text-accent hover:underline">Terms of Service</Link>
      </label>
      <Button type="submit" className="w-full" loading={loading}>Create Account</Button>
    </form>
  );
}

export default RegisterForm;
