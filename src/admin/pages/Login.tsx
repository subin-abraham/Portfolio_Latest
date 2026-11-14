import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <div className="admin-shell">
      <div aria-hidden className="admin-glow" />
      <div className="admin-panel anim-fade-up">
        <p className="admin-eyebrow">Admin</p>
        <h1 className="admin-title">Sign in</h1>
        <p className="admin-lede">
          Secure access to the portfolio control panel.
        </p>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
