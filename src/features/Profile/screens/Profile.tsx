import { useState } from "react";
import { Camera, Mail, User } from "lucide-react";

const Profile: React.FC = () => {
  const [profile, setProfile] = useState({
    name: "Shubham More",
    email: "user@example.com",
    role: "Admin"
  });

  return (
    <div className="max-w-3xl space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-gray-500">
          Manage your personal information and profile picture.
        </p>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row gap-6">

        {/* PROFILE IMAGE */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <img
              src="https://i.pravatar.cc/120"
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border"
            />

            {/* CHANGE PHOTO (UI ONLY) */}
            <button
              className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700"
              title="Change photo"
            >
              <Camera size={16} />
            </button>
          </div>

          <span className="text-xs text-gray-500">
            JPG, PNG up to 2MB
          </span>
        </div>

        {/* PROFILE DETAILS */}
        <div className="flex-1 space-y-4">

          <div>
            <label className="text-sm text-gray-600 flex items-center gap-2">
              <User size={14} />
              Full Name
            </label>
            <input
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
              className="mt-1 w-full px-3 py-2 border rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 flex items-center gap-2">
              <Mail size={14} />
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="mt-1 w-full px-3 py-2 border rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Role
            </label>
            <input
              value={profile.role}
              disabled
              className="mt-1 w-full px-3 py-2 border rounded-lg text-sm bg-gray-100 cursor-not-allowed"
            />
          </div>

        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100">
          Cancel
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
          Save Changes
        </button>
      </div>

    </div>
  );
};

export default Profile;
