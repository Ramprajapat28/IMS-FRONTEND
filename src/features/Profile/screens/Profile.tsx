import { useState } from "react";
import { Plus } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

/* ---------------- TYPES ---------------- */

type Gender = "male" | "female";

type ProfileData = {
  gender: Gender;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  location: string;
  postalCode: string;
  avatar: string;
};

/* ---------------- SAMPLE DEFAULT DATA ---------------- */

const DEFAULT_PROFILE: ProfileData = {
  gender: "male",
  firstName: "Admin",
  lastName: "User",
  email: "abc@gmail.com",
  phone: "+91 00990 99009",
  dob: "1 Jan, 2004",
  location: "Mumbai, INDIA",
  postalCode: "400 088",
  avatar: "https://i.pravatar.cc/300?img=12",
};

/* ---------------- COMPONENT ---------------- */

const Profile = () => {
  const [savedProfile, setSavedProfile] =
    useState<ProfileData>(DEFAULT_PROFILE);

  const [formProfile, setFormProfile] =
    useState<ProfileData>(DEFAULT_PROFILE);

  /* -------- INPUT HANDLER -------- */

  const handleChange = (
    key: keyof ProfileData,
    value: string | Gender
  ) => {
    setFormProfile((prev) => ({ ...prev, [key]: value }));
  };

  /* -------- IMAGE PREVIEW -------- */

  const handleImageUpload = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormProfile((prev) => ({
        ...prev,
        avatar: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  /* -------- ACTIONS -------- */

  const handleSave = () => {
    setSavedProfile(formProfile);
    toast.success("Profile updated successfully");
  };

  const handleDiscard = () => {
    setFormProfile(savedProfile);
    toast("Changes discarded", { icon: "↩️" });
  };

  return (
    <div className="w-full">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        <p className="text-gray-500 text-sm">
          Customize your personal information
        </p>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT PROFILE CARD */}
        <div className="bg-white border rounded-xl p-6 flex flex-col items-center">
          <div className="relative">
            <img
              src={formProfile.avatar}
              alt="profile"
              className="w-40 h-40 rounded-full object-cover border"
            />

            <label className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-white border shadow flex items-center justify-center cursor-pointer hover:bg-gray-100">
              <Plus size={16} />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  handleImageUpload(e.target.files?.[0] || null)
                }
              />
            </label>
          </div>

          <h3 className="mt-6 font-semibold text-gray-800">
            {savedProfile.firstName} {savedProfile.lastName}
          </h3>
          <p className="text-sm text-gray-500">
            Admin E-mail {savedProfile.email}
          </p>
        </div>

        {/* RIGHT FORM CARD */}
        <div className="lg:col-span-2 bg-white border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Personal Information
          </h2>

          {/* GENDER */}
          <div className="flex items-center gap-6 mb-6">
            {(["male", "female"] as Gender[]).map((g) => (
              <label key={g} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={formProfile.gender === g}
                  onChange={() => handleChange("gender", g)}
                  className="accent-blue-600"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {g}
                </span>
              </label>
            ))}
          </div>

          {/* FORM GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" value={formProfile.firstName} onChange={(v) => handleChange("firstName", v)} />
            <Input label="Last Name" value={formProfile.lastName} onChange={(v) => handleChange("lastName", v)} />
            <Input label="E-mail" value={formProfile.email} onChange={(v) => handleChange("email", v)} full />
            <Input label="Phone Number" value={formProfile.phone} onChange={(v) => handleChange("phone", v)} />
            <Input label="Date of Birth" value={formProfile.dob} onChange={(v) => handleChange("dob", v)} />
            <Input label="Location" value={formProfile.location} onChange={(v) => handleChange("location", v)} />
            <Input label="Postal Code" value={formProfile.postalCode} onChange={(v) => handleChange("postalCode", v)} />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
            <button
              onClick={handleDiscard}
              className="px-6 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
            >
              Discard Changes
            </button>

            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-lg bg-black text-white hover:opacity-90"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

/* ---------------- INPUT COMPONENT ---------------- */

type InputProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  full?: boolean;
};

const Input = ({ label, value, onChange, full }: InputProps) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label className="block text-sm text-gray-500 mb-1">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full border border-gray-300 rounded-lg
        px-4 py-2 text-sm
        focus:outline-none focus:ring-2 focus:ring-blue-600
      "
    />
  </div>
);
