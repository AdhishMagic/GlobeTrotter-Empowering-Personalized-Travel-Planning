import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import Input from "components/ui/Input";
import Button from "components/ui/Button";
import { Checkbox } from "components/ui/Checkbox";
import Icon from "components/AppIcon";

export default function LoginForm({ redirectTo = "/dashboard" }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const mockCredentials = {
    email: "traveler@globetrotter.com",
    password: "Travel2026!"
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (authError) {
      setAuthError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      if (formData.email === mockCredentials.email && formData.password === mockCredentials.password) {
        const userData = {
          id: "user_001",
          email: formData.email,
          firstName: "Alex",
          lastName: "Morgan",
          phone: "+1 (555) 123-4567",
          country: "United States",
          joinedDate: "2025-06-15",
          avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_130f98b20-1763296361147.png",
          avatarAlt: "Professional headshot of young man with short brown hair wearing casual blue shirt"
        };

        const token = "mock_jwt_token_" + Date.now();
        login(userData, token);
        navigate(redirectTo, { replace: true });
      } else {
        setAuthError(
          `Invalid credentials. Please use:\nEmail: ${mockCredentials.email}\nPassword: ${mockCredentials.password}`
        );
      }
      setIsLoading(false);
    }, 1200);
  };

  const handleForgotPassword = () => {
    alert(
      "Password reset functionality would be implemented here.\nFor demo purposes, use the provided credentials."
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4 md:space-y-5 lg:space-y-6">
      {authError && (
        <div className="p-3 md:p-4 rounded-lg bg-error/10 border border-error/20 flex items-start gap-3">
          <Icon name="AlertCircle" size={20} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-error font-body whitespace-pre-line">{authError}</p>
        </div>
      )}

      <Input
        type="email"
        name="email"
        label="Email Address"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
        disabled={isLoading}
        className="w-full"
      />

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          disabled={isLoading}
          className="w-full"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-base"
          aria-label={showPassword ? "Hide password" : "Show password"}
          disabled={isLoading}
        >
          <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
        </button>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <Checkbox name="rememberMe" label="Remember me" checked={formData.rememberMe} onChange={handleChange} disabled={isLoading} />

        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm md:text-base text-primary hover:text-primary/80 font-body font-medium transition-base"
          disabled={isLoading}
        >
          Forgot Password?
        </button>
      </div>

      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
        className="mt-6"
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}
