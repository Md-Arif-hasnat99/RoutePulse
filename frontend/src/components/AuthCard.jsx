import { Link } from "react-router-dom";

function AuthCard({ mode = "login" }) {
  const isRegister = mode === "register";

  return (
    <section className="auth-card">
      <div className="auth-header">
        <h1>RoutePulse</h1>
        <p>{isRegister ? "Create an account" : "Secure Operations Access"}</p>
      </div>

      <form className="auth-form">
        {isRegister ? (
          <label>
            Full Name
            <input type="text" placeholder="John Doe" />
          </label>
        ) : null}

        <label>
          Email
          <input type="email" placeholder="operator@routepulse.logistics" />
        </label>

        <label>
          Password
          <input type="password" placeholder="••••••••" />
        </label>

        {isRegister ? (
          <label>
            Confirm Password
            <input type="password" placeholder="••••••••" />
          </label>
        ) : null}

        <button type="button" className="btn btn-dark btn-block">
          {isRegister ? "Register" : "Authenticate"}
        </button>
      </form>

      <p className="auth-footer">
        {isRegister ? "Already have an account? " : "Don\'t have an account? "}
        <Link to={isRegister ? "/login" : "/register"}>
          {isRegister ? "Login" : "Register"}
        </Link>
      </p>
    </section>
  );
}

export default AuthCard;
