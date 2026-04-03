import React, { useState } from "react";
import authService from "../appwrite/auth";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

const EyeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: "Very weak", color: "#ef4444" };
  if (score === 2) return { score, label: "Weak", color: "#f97316" };
  if (score === 3) return { score, label: "Fair", color: "#eab308" };
  if (score === 4) return { score, label: "Strong", color: "#22c55e" };
  return { score, label: "Very strong", color: "#16a34a" };
}

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const passwordValue = watch("password", "");
  const strength = getPasswordStrength(passwordValue);

  const create = async (data) => {
    setError("");
    try {
      const userData = await authService.createAccount(data);
      if (userData) {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) dispatch(login(currentUser));
        navigate("/");
      }
    } catch (err) {
      const msg = err.message || "";
      if (
        msg.toLowerCase().includes("already exists") ||
        msg.toLowerCase().includes("already been used")
      ) {
        setError(
          "An account with this email already exists. Try signing in instead.",
        );
      } else if (msg.toLowerCase().includes("password")) {
        setError(
          "Password is too weak or too common. Use at least 8 characters with a mix of letters and numbers.",
        );
      } else {
        setError(msg);
      }
    }
  };

  const inputBase = {
    width: "100%",
    padding: "12px 16px",
    background: "var(--paper-warm)",
    borderRadius: "8px",
    fontFamily: "var(--font-body)",
    fontSize: "0.95rem",
    color: "var(--ink)",
    outline: "none",
    transition: "border-color 0.2s ease, background 0.2s ease",
    boxSizing: "border-box",
  };

  const inputStyle = (hasError) => ({
    ...inputBase,
    border: `1px solid ${hasError ? "#fca5a5" : "var(--border)"}`,
    background: hasError ? "#fff5f5" : "var(--paper-warm)",
  });

  const fieldError = (msg) => (
    <p
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.78rem",
        color: "#dc2626",
        marginTop: "6px",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <span>⚠</span> {msg}
    </p>
  );

  const labelStyle = (hasError) => ({
    display: "block",
    fontFamily: "var(--font-mono)",
    fontSize: "0.7rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: hasError ? "#dc2626" : "var(--ink-muted)",
    marginBottom: "8px",
  });

  return (
    <div
      style={{
        minHeight: "92vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        overflow: "hidden",
      }}
    >
      {/* ── Left — form ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 64px",
          background: "var(--paper)",
        }}
      >
        <div
          style={{ width: "100%", maxWidth: "400px" }}
          className="animate-fade-up"
        >
          <div style={{ marginBottom: "36px" }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2.2rem",
                fontWeight: 700,
                color: "var(--ink)",
                letterSpacing: "-0.03em",
                marginBottom: "10px",
              }}
            >
              Join Inkwell.
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                color: "var(--ink-muted)",
              }}
            >
              Already writing?{" "}
              <Link
                to="/login"
                style={{
                  color: "var(--accent)",
                  textDecoration: "none",
                  borderBottom: "1px solid var(--accent)",
                  paddingBottom: "1px",
                }}
              >
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "12px 16px",
                borderRadius: "8px",
                fontSize: "0.875rem",
                marginBottom: "24px",
                fontFamily: "var(--font-body)",
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
              }}
            >
              <span style={{ flexShrink: 0 }}>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(create)}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                marginBottom: "28px",
              }}
            >
              {/* Full name */}
              <div>
                <label style={labelStyle(errors.name)}>Full name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  style={inputStyle(errors.name)}
                  onFocus={(e) => {
                    if (!errors.name) {
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.background = "#fff";
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.name) {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.background = "var(--paper-warm)";
                    }
                  }}
                  {...register("name", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                />
                {errors.name && fieldError(errors.name.message)}
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle(errors.email)}>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  style={inputStyle(errors.email)}
                  onFocus={(e) => {
                    if (!errors.email) {
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.background = "#fff";
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.email) {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.background = "var(--paper-warm)";
                    }
                  }}
                  {...register("email", {
                    required: "Email is required",
                    validate: {
                      matchPattern: (v) =>
                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                        "Please enter a valid email address",
                    },
                  })}
                />
                {errors.email && fieldError(errors.email.message)}
              </div>

              {/* Password with eye toggle */}
              <div>
                <label style={labelStyle(errors.password)}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    style={{
                      ...inputStyle(errors.password),
                      paddingRight: "44px",
                    }}
                    onFocus={(e) => {
                      if (!errors.password) {
                        e.currentTarget.style.borderColor = "var(--accent)";
                        e.currentTarget.style.background = "#fff";
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.password) {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.background = "var(--paper-warm)";
                      }
                    }}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                  />
                  {/* ✅ Eye toggle button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--ink-muted)",
                      padding: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--ink)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--ink-muted)")
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>

                {/* Password strength */}
                {passwordValue.length > 0 && (
                  <div style={{ marginTop: "10px" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "4px",
                        marginBottom: "6px",
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: "3px",
                            borderRadius: "2px",
                            background:
                              i <= strength.score
                                ? strength.color
                                : "var(--border)",
                            transition: "background 0.3s ease",
                          }}
                        />
                      ))}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.68rem",
                          color: strength.color,
                        }}
                      >
                        {strength.label}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.65rem",
                          color: "var(--ink-faint)",
                        }}
                      >
                        {passwordValue.length}/8 min
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: "8px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "3px",
                      }}
                    >
                      {[
                        {
                          rule: passwordValue.length >= 8,
                          text: "At least 8 characters",
                        },
                        {
                          rule: /[A-Z]/.test(passwordValue),
                          text: "One uppercase letter",
                        },
                        {
                          rule: /[0-9]/.test(passwordValue),
                          text: "One number",
                        },
                      ].map(({ rule, text }) => (
                        <div
                          key={text}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.7rem",
                              color: rule ? "#22c55e" : "var(--ink-faint)",
                              transition: "color 0.2s ease",
                            }}
                          >
                            {rule ? "✓" : "○"}
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.65rem",
                              color: rule ? "#22c55e" : "var(--ink-faint)",
                              transition: "color 0.2s ease",
                            }}
                          >
                            {text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {errors.password && fieldError(errors.password.message)}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "13px 24px",
                background: isSubmitting ? "var(--ink-muted)" : "var(--ink)",
                color: "var(--paper)",
                border: "none",
                borderRadius: "100px",
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                fontWeight: 500,
                letterSpacing: "0.02em",
                transition: "all 0.25s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting)
                  e.currentTarget.style.background = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting)
                  e.currentTarget.style.background = "var(--ink)";
              }}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
              {!isSubmitting && <span>→</span>}
            </button>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.78rem",
                color: "var(--ink-faint)",
                textAlign: "center",
                marginTop: "16px",
              }}
            >
              By signing up you agree to our terms of service.
            </p>
          </form>
        </div>
      </div>

      {/* ── Right — decorative panel (filled) ── */}
      <div
        style={{
          background: "var(--ink-soft)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(circle at 70% 30%, rgba(200,81,42,0.15) 0%, transparent 50%),
                            radial-gradient(circle at 20% 80%, rgba(184,149,58,0.08) 0%, transparent 40%)`,
          }}
        />

        {/* Top — back link */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "var(--paper)",
                letterSpacing: "-0.02em",
              }}
            >
              ← Inkwell
            </div>
          </Link>
        </div>

        {/* Middle — big quote */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <blockquote
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
              fontWeight: 700,
              color: "var(--paper)",
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
              marginBottom: "20px",
            }}
          >
            "There is no greater agony than bearing an untold story inside you."
          </blockquote>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(245,242,235,0.35)",
            }}
          >
            — Maya Angelou
          </p>
        </div>

        {/* Bottom — why inkwell list */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "20px",
            }}
          >
            Why Inkwell?
          </div>
          {[
            { icon: "✦", text: "Write with a rich, distraction-free editor" },
            { icon: "✦", text: "Publish instantly to your audience" },
            { icon: "✦", text: "Beautiful typography by default" },
            { icon: "✦", text: "Your words. Your platform." },
          ].map((item) => (
            <div
              key={item.text}
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "flex-start",
                marginBottom: "14px",
              }}
            >
              <span
                style={{
                  color: "var(--accent)",
                  fontSize: "0.75rem",
                  marginTop: "3px",
                }}
              >
                {item.icon}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  color: "rgba(245,242,235,0.65)",
                  lineHeight: 1.5,
                }}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Decorative circle */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "250px",
            height: "250px",
            border: "1px solid rgba(255,255,255,0.04)",
            borderRadius: "50%",
            transform: "translate(-40%, -40%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "180px",
            height: "180px",
            border: "1px solid rgba(255,255,255,0.04)",
            borderRadius: "50%",
            transform: "translate(30%, 30%)",
          }}
        />
      </div>
    </div>
  );
}

export default Signup;
