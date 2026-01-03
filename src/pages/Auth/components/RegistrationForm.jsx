import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import Input from "components/ui/Input";
import Button from "components/ui/Button";
import { Checkbox } from "components/ui/Checkbox";
import Select from "components/ui/Select";
import Icon from "components/AppIcon";

export default function RegistrationForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToPrivacy: false
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: "", color: "" });

  const countries = [
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "ca", label: "Canada" },
    { value: "au", label: "Australia" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" },
    { value: "in", label: "India" },
    { value: "jp", label: "Japan" },
    { value: "br", label: "Brazil" },
    { value: "mx", label: "Mexico" },
    { value: "es", label: "Spain" },
    { value: "it", label: "Italy" },
    { value: "nl", label: "Netherlands" },
    { value: "se", label: "Sweden" },
    { value: "no", label: "Norway" }
  ];

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const strengthMap = {
      0: { label: "", color: "" },
      1: { label: "Very Weak", color: "bg-error" },
      2: { label: "Weak", color: "bg-warning" },
      3: { label: "Fair", color: "bg-warning" },
      4: { label: "Strong", color: "bg-success" },
      5: { label: "Very Strong", color: "bg-success" }
    };

    return { score, ...strengthMap[score] };
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone) => {
    const okChars = /^[\d\s\-\+\(\)]+$/.test(phone);
    const digits = phone.replace(/\D/g, "");
    return okChars && digits.length >= 10;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    if (field === "password") {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);

      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else if (formData.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }

    if (field === "confirmPassword") {
      if (value !== formData.password) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email address";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!validatePhone(formData.phone)) newErrors.phone = "Please enter a valid phone number (minimum 10 digits)";

    if (!formData.country) newErrors.country = "Please select your country";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters long";
    else if (passwordStrength.score < 3) newErrors.password = "Please choose a stronger password";

    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the Terms of Service";
    if (!formData.agreeToPrivacy) newErrors.agreeToPrivacy = "You must agree to the Privacy Policy";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const token = "mock_jwt_token_" + Date.now();
      const userData = {
        id: "user_" + Date.now(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        createdAt: new Date().toISOString()
      };

      login(userData, token);
      navigate("/dashboard", { replace: true });
    } catch {
      setErrors({ submit: "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const strengthPct = Math.min(100, Math.round((passwordStrength.score / 5) * 100));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 lg:space-y-6">
      {errors.submit && (
        <div className="p-3 md:p-4 rounded-lg bg-error/10 border border-error/20 flex items-start gap-3">
          <Icon name="AlertCircle" size={20} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-error font-body">{errors.submit}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
        <Input
          label="First Name"
          type="text"
          placeholder="Enter your first name"
          value={formData.firstName}
          onChange={(e) => handleInputChange("firstName", e.target.value)}
          error={errors.firstName}
          required
          disabled={isLoading}
        />

        <Input
          label="Last Name"
          type="text"
          placeholder="Enter your last name"
          value={formData.lastName}
          onChange={(e) => handleInputChange("lastName", e.target.value)}
          error={errors.lastName}
          required
          disabled={isLoading}
        />
      </div>

      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email address"
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        error={errors.email}
        description="We'll send a verification email to this address"
        required
        disabled={isLoading}
      />

      <Input
        label="Phone Number"
        type="tel"
        placeholder="Enter your phone number"
        value={formData.phone}
        onChange={(e) => handleInputChange("phone", e.target.value)}
        error={errors.phone}
        description="Include country code (e.g., +1 234 567 8900)"
        required
        disabled={isLoading}
      />

      <Select
        label="Country"
        placeholder="Select your country"
        options={countries}
        value={formData.country}
        onChange={(value) => handleInputChange("country", value)}
        error={errors.country}
        searchable
        required
        disabled={isLoading}
      />

      <div className="space-y-2">
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            error={errors.password}
            required
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-base"
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={isLoading}
          >
            <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
          </button>
        </div>

        {passwordStrength.label && (
          <div className="space-y-1">
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className={(passwordStrength.color || "bg-muted-foreground") + " h-full"} style={{ width: `${strengthPct}%` }} />
            </div>
            <p className="text-xs font-caption text-muted-foreground">Password strength: {passwordStrength.label}</p>
          </div>
        )}
      </div>

      <div className="relative">
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
          required
          disabled={isLoading}
        />

        <button
          type="button"
          onClick={() => setShowConfirmPassword((v) => !v)}
          className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-base"
          aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
          disabled={isLoading}
        >
          <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={20} />
        </button>
      </div>

      <div className="space-y-3">
        <Checkbox
          checked={formData.agreeToTerms}
          onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
          disabled={isLoading}
          label="I agree to the Terms of Service"
          error={errors.agreeToTerms}
          required
        />

        <Checkbox
          checked={formData.agreeToPrivacy}
          onChange={(e) => handleInputChange("agreeToPrivacy", e.target.checked)}
          disabled={isLoading}
          label="I agree to the Privacy Policy"
          error={errors.agreeToPrivacy}
          required
        />
      </div>

      <Button type="submit" variant="default" size="lg" fullWidth loading={isLoading} disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}
