import { useNavigate } from "react-router-dom";
import { LogOut} from "lucide-react";
import { authApi } from "../api";

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LogoutModal = ({ isOpen, onClose }: LogoutModalProps) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authApi.logout();
        onClose();
        navigate("/auth", { replace: true });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            {/* Modal */}
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm relative animate-in fade-in zoom-in duration-200">

                {/* Content */}
                <div className="p-6 text-center">
                    {/* Icon */}
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <LogOut size={24} className="text-red-600" />
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                        Logout Confirmation
                    </h2>

                    {/* Message */}
                    <p className="text-sm text-gray-600 mb-6">
                        Are you sure you want to logout?
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
