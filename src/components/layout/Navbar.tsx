import { useState, useEffect, useCallback } from "react";
import { Menu, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "@/app/providers";
import { profileApi } from "@/features/Profile/api/profile.api";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { open } = useSidebar();
  const [avatar, setAvatar] = useState(""); // Default
  const [isImgLoading, setIsImgLoading] = useState(false);

  const updateAvatar = useCallback(async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;

    try {
      const user = JSON.parse(userStr);
      if (!user.user_id) return;

      try {
        const res = await profileApi.getProfile(user.user_id);
        if (res.success && res.data) {
          const newUrl = res.data.profile_picture_url || "";

          setAvatar((currentAvatar) => {
            if (newUrl !== currentAvatar) {
              if (newUrl) setIsImgLoading(true);
              return newUrl;
            }
            setIsImgLoading(false);
            return currentAvatar;
          });
        } else {
          setIsImgLoading(false);
        }
      } catch (apiErr) {
        console.error("Failed to fetch profile for navbar", apiErr);
        setIsImgLoading(false);
      }
    } catch (e) {
      console.error("Failed to parse user from local storage", e);
    }
  }, []);

  useEffect(() => {
    updateAvatar();
    window.addEventListener("user_updated", updateAvatar);
    return () => window.removeEventListener("user_updated", updateAvatar);
  }, [updateAvatar]);


  return (
    <header className="h-16 bg-white border-b flex items-center px-4 sm:px-6">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {/* MOBILE MENU */}
        <button
          onClick={open}
          className="xl:hidden p-2 rounded hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>

        {/* BRAND (hidden on mobile) */}
        <div className="hidden items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            F
          </div>
          <span className="text-lg font-semibold text-gray-800">
            Fitistan-IMS
          </span>
        </div>
      </div>

      {/* CENTER (SEARCH) */}
      {/* <div className="flex-1 hidden md:flex justify-start">
        <div className="relative w-full max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search..."
            className="
              w-full pl-10 pr-4 py-2
              border rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-600
            "
          />
        </div>
      </div> */}

      {/* RIGHT */}
      <div className="flex items-center gap-3 ml-auto">
        {/* <button
          onClick={() => navigate("/notifications")}
          className="relative p-2 rounded-full hover:bg-gray-100"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button> */}

        <div
          onClick={() => navigate("/profile")}
          className="relative w-8 h-8 rounded-full cursor-pointer overflow-hidden border bg-gray-100"
        >
          {/* Default Base Layer (Always there) */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
            <User size={18} />
          </div>

          {/* Profile Image Layer (Fades in over the base) */}
          {avatar && (
            <img
              key={avatar}
              src={avatar}
              alt="profile"
              onLoad={() => setIsImgLoading(false)}
              onError={() => {
                setIsImgLoading(false);
                setAvatar("");
              }}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isImgLoading ? 'opacity-0' : 'opacity-100'}`}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
