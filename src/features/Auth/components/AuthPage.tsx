import { useState } from "react";
import Login from "../screens/Login";
import Signup from "../screens/SignUp";

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {mode === "login" ? (
        <Login switchToSignup={() => setMode("signup")} />
      ) : (
        <Signup switchToLogin={() => setMode("login")} />
      )}
    </div>
  );
};

export default AuthPage;
