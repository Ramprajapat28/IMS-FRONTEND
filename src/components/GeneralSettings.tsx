import { useState } from "react";
import { User, Globe, Palette, Building } from "lucide-react";

const GeneralSettings: React.FC = () => {
  const [form, setForm] = useState({
    name: "Shubham More",
    email: "shubham@example.com",
    company: "FitInventory",
    language: "English",
    timezone: "IST",
    theme: "Light"
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">General Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account and application preferences.
        </p>
      </div>

      {/* PROFILE SECTION */}
      <section className="border rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-2">
          <User className="text-blue-600" />
          <h2 className="font-medium">Profile Information</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
            />
          </div>
        </div>
      </section>

      {/* COMPANY SECTION */}
      <section className="border rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Building className="text-blue-600" />
          <h2 className="font-medium">Company / Workspace</h2>
        </div>

        <div>
          <label className="text-sm text-gray-600">Company Name</label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
          />
        </div>
      </section>

      {/* PREFERENCES */}
      <section className="border rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="text-blue-600" />
          <h2 className="font-medium">Preferences</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm text-gray-600">Language</label>
            <select
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>French</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Timezone</label>
            <select
              name="timezone"
              value={form.timezone}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
            >
              <option>IST</option>
              <option>UTC</option>
              <option>PST</option>
            </select>
          </div>
        </div>
      </section>

      {/* THEME */}
      <section className="border rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="text-blue-600" />
          <h2 className="font-medium">Appearance</h2>
        </div>

        <div className="flex gap-4">
          {["Light", "Dark"].map((theme) => (
            <button
              key={theme}
              onClick={() => setForm({ ...form, theme })}
              className={`px-4 py-2 rounded-lg border text-sm
                ${
                  form.theme === theme
                    ? "bg-blue-600 text-white border-blue-600"
                    : "hover:bg-gray-100"
                }
              `}
            >
              {theme}
            </button>
          ))}
        </div>
      </section>

      {/* SAVE */}
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
          Save Changes
        </button>
      </div>

    </div>
  );
};

export default GeneralSettings;
