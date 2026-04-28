import React from "react";
import { SignUp } from "@clerk/react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <Link to="/" className="brand-inline" style={{ marginBottom: "32px" }}>
          <span className="brand-mark" />
          <div>
            <p className="brand-title">RoutePulse</p>
            <p className="brand-subtitle">Back to home</p>
          </div>
        </Link>
        
        <h1 className="hero-title" style={{ fontSize: "36px", marginBottom: "16px" }}>
          Get started
        </h1>
        <p className="muted" style={{ fontSize: "17px", maxWidth: "400px", marginBottom: "40px" }}>
          Create your account to start managing shipments with real-time risk intelligence.
        </p>

        <div className="auth-highlight">
          <p className="label">Current Scale</p>
          <p className="value" style={{ color: "var(--primary)" }}>+1.2M Shipments Tracked</p>
        </div>
      </div>

      <div className="clerk-shell">
        <SignUp
          routing="path"
          path="/register"
          signInUrl="/login"
          signUpUrl="/register"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: "#ff7a45",
              colorText: "#f4f7ff",
              colorTextSecondary: "#a5b0c7",
              colorBackground: "#1b2231",
              colorInputBackground: "rgba(255, 255, 255, 0.08)",
              colorInputText: "#f4f7ff",
              borderRadius: "12px",
            },
            elements: {
              card: "cl-card",
              headerTitle: "cl-title",
              headerSubtitle: "cl-subtitle",
              socialButtonsBlockButton: "cl-button",
              formButtonPrimary: "btn btn-primary cl-button",
              formFieldInput: "input cl-input",
              formFieldLabel: "cl-label",
              footerActionLink: "cl-link",
              identityPreviewText: "cl-title",
              identityPreviewEditButtonIcon: "cl-link",
            },
          }}
        />
      </div>
    </div>
  );
}
