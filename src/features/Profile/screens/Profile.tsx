import { useState, useEffect } from "react";
import { Plus, Loader2, User } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { profileApi } from "../api";
import { uploadToCloudinary } from "@/utils/cloudinaryUpload";

/* ---------------- TYPES ---------------- */

type Gender = "male" | "female";

type ProfileData = {
  gender: Gender;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string; // Will store in YYYY-MM-DD format
  address: string;
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
  dob: "2004-01-01",
  address: "",
  location: "Mumbai, INDIA",
  postalCode: "400 088",
  avatar: "",
};

/* ---------------- COMPONENT ---------------- */

const Profile = () => {
  const [savedProfile, setSavedProfile] =
    useState<ProfileData>(DEFAULT_PROFILE);

  const [formProfile, setFormProfile] =
    useState<ProfileData>(DEFAULT_PROFILE);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(true);

  /* -------- FETCH PROFILE DATA -------- */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get user data from localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setError('Please login to view profile');
          setIsLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        const userId = user.user_id;

        // Fetch profile from API
        const response = await profileApi.getProfile(userId);

        if (response.success && response.data) {
          const apiProfile = response.data;

          // Map API response to component state
          const nameParts = apiProfile.name.split(' ');
          const mappedProfile: ProfileData = {
            gender: (apiProfile.gender?.toLowerCase() || 'male') as Gender,
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: apiProfile.email || '',
            phone: apiProfile.phone || '',
            dob: apiProfile.date_of_birth || '', // API now returns YYYY-MM-DD string
            address: apiProfile.address || '',
            location: apiProfile.location || '',
            postalCode: apiProfile.postal_code?.toString() || '',
            avatar: apiProfile.profile_picture_url || '',
          };

          setSavedProfile(mappedProfile);
          setFormProfile(mappedProfile);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* -------- INPUT HANDLER -------- */

  const handleChange = (
    key: keyof ProfileData,
    value: string | Gender
  ) => {
    setFormProfile((prev) => ({ ...prev, [key]: value }));
  };

  /* -------- IMAGE PREVIEW -------- */

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;

    try {
      setIsImageUploading(true);

      const uploadedUrl = await uploadToCloudinary(
        file,
        "user",
        "profile_image",
        profileApi.getPresignedUrl
      );

      setFormProfile((prev) => {
        if (prev.avatar !== uploadedUrl) setIsImgLoading(true);
        return { ...prev, avatar: uploadedUrl };
      });

      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Failed to upload image");
    } finally {
      setIsImageUploading(false);
    }
  };

  /* -------- ACTIONS -------- */

  const handleSave = async () => {
    // Validation
    if (!formProfile.firstName.trim()) {
      toast.error('First name is required');
      return;
    }
    if (!formProfile.email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!formProfile.phone.trim()) {
      toast.error('Phone number is required');
      return;
    }
    if (!formProfile.address.trim()) {
      toast.error('Address is required');
      return;
    }
    if (!formProfile.location.trim()) {
      toast.error('Location is required');
      return;
    }
    if (!formProfile.postalCode.trim()) {
      toast.error('Postal code is required');
      return;
    }

    // Validate date format (YYYY-MM-DD)
    if (formProfile.dob) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formProfile.dob)) {
        toast.error('Date of birth must be in YYYY-MM-DD format');
        return;
      }
    }

    const payload = {
      name: `${formProfile.firstName} ${formProfile.lastName}`.trim(),
      email: formProfile.email,
      phone: formProfile.phone,
      gender: formProfile.gender,
      address: formProfile.address,
      location: formProfile.location,
      postal_code: formProfile.postalCode,
      date_of_birth: formProfile.dob,
      profile_picture_url: formProfile.avatar,
    };

    try {
      // Get user from local storage to get ID
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error("User not found");

      const user = JSON.parse(userStr);
      const userId = user.user_id;

      await profileApi.updateProfile(userId, payload);

      const updatedProfile: ProfileData = {
        ...formProfile
      };

      // update both
      setSavedProfile(updatedProfile);
      setFormProfile(updatedProfile);

      // Update local state
      // Dispatch event to update Navbar
      window.dispatchEvent(new Event('user_updated'));

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Failed to update profile", err);
      toast.error("Failed to update profile");
    }
  };

  // const handleDiscard = () => {
  //   if (savedProfile.avatar !== formProfile.avatar) {
  //     setIsImgLoading(true);
  //   }
  //   setFormProfile(savedProfile);
  //   toast("Changes discarded", { icon: "↩️" });
  // };

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

      {/* LOADING STATE */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* ERROR STATE */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* CONTENT */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT PROFILE CARD */}
          <div className="bg-white border rounded-xl p-6 flex flex-col items-center">
            <div className="relative w-40 h-40">
              {isImageUploading ? (
                <div className="w-full h-full rounded-full border flex items-center justify-center bg-gray-50">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="relative w-full h-full rounded-full overflow-hidden border bg-gray-100">
                  {/* Default Base Layer (Always there) */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <User size={64} />
                  </div>

                  {/* Profile Image Layer (Fades in over the base) */}
                  {formProfile.avatar && (
                    <img
                      key={formProfile.avatar}
                      src={formProfile.avatar}
                      alt="profile"
                      onLoad={() => setIsImgLoading(false)}
                      onError={() => {
                        setIsImgLoading(false);
                        setFormProfile((prev) => ({ ...prev, avatar: "" }));
                      }}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isImgLoading ? 'opacity-0' : 'opacity-100'}`}
                    />
                  )}
                </div>
              )}

              <label className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-white border shadow flex items-center justify-center cursor-pointer hover:bg-gray-100">
                <Plus size={16} />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    handleImageUpload(e.target.files?.[0] || null);
                    e.target.value = ""; // Clear for re-selection
                  }}
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
              <Input label="First Name" value={formProfile.firstName} onChange={(v) => handleChange("firstName", v)} required />
              <Input label="Last Name" value={formProfile.lastName} onChange={(v) => handleChange("lastName", v)} />
              <Input label="E-mail" value={formProfile.email} onChange={(v) => handleChange("email", v)} type="email" full required />
              <Input label="Phone Number" value={formProfile.phone} onChange={(v) => handleChange("phone", v)} required />
              <Input label="Date of Birth" value={formProfile.dob} onChange={(v) => handleChange("dob", v)} type="date" placeholder="YYYY-MM-DD" required />
              <Input label="Address" value={formProfile.address} onChange={(v) => handleChange("address", v)} full required />
              <Input label="Location" value={formProfile.location} onChange={(v) => handleChange("location", v)} required />
              <Input label="Postal Code" value={formProfile.postalCode} onChange={(v) => handleChange("postalCode", v)} required />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
              {/* <button
                onClick={handleDiscard}
                className="px-6 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
              >
                Discard Changes
              </button> */}

              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg bg-black text-white hover:opacity-90"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
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
  type?: string;
  placeholder?: string;
  required?: boolean;
};

const Input = ({ label, value, onChange, full, type = "text", placeholder, required }: InputProps) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label className="block text-sm text-gray-500 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="
        w-full border border-gray-300 rounded-lg
        px-4 py-2 text-sm
        focus:outline-none focus:ring-2 focus:ring-blue-600
      "
    />
  </div>
);
