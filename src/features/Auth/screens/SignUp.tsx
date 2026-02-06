import { useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

interface Props {
  switchToLogin: () => void;
}

const Signup: React.FC<Props> = ({ switchToLogin }) => {
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // TEMPORARY NAVIGATION
    navigate("/inventory");
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow p-8">

      {/* LOGO */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          F
        </div>
        <h1 className="text-2xl font-semibold mt-3">Create Account</h1>
        <p className="text-gray-500 text-sm">Start managing your inventory</p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSignup} className="space-y-4">

        <div>
          <label className="text-sm text-gray-600">Full Name</label>
          <div className="relative">
            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              required
              placeholder="John Doe"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
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
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Confirm Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              required
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </form>

      {/* SWITCH */}
      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <button onClick={switchToLogin} className="text-blue-600 font-medium">
          Login
        </button>
      </p>

      {/* COPYRIGHT */}
      <p className="text-xs text-gray-400 text-center mt-6">
        © 2025 FitInventory. All rights reserved.
      </p>
    </div>
  );
};

export default Signup;
