import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";
import { authApi } from "../api";

interface Props {
  switchToSignup: () => void;
}

const Login: React.FC<Props> = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await authApi.login({ email, password });

      if (response.success) {
        // Token is already stored in localStorage by the API service
        navigate("/inventory");
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow p-8">

      {/* LOGO */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          F
        </div>
        <h1 className="text-2xl font-semibold mt-3">Welcome Back</h1>
        <p className="text-gray-500 text-sm">Login to your FitInventory account</p>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none disabled:bg-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none disabled:bg-gray-100"
            />
          </div>
        </div>
{/* 
        <div className="text-right">
          <button type="button" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </button>
        </div> */}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>
      {/* SWITCH */}
      {/* <p className="text-center text-sm text-gray-600 mt-4">
        Don’t have an account?{" "}
        <button onClick={switchToSignup} className="text-blue-600 font-medium">
          Sign up
        </button>
      </p> */}
    </div>
  );
};

export default Login;
