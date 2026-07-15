import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../config/Config";

const SiteSettings = () => {
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    siteName: "",
    shortName: "",
    tagline: "",
    email: "",
    phone: "",
    address: "",
    facebook: "",
    youtube: "",
    instagram: "",
    twitter: "",
    copyright: "",
  });

  // =============================
  // Load Site Settings
  // =============================
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(
        `${baseUrl}/api/site-settings`
      );

      setFormData(data.settings);

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Handle Input
  // =============================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =============================
  // Save
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put(
        `${baseUrl}/api/site-settings`,
        formData
      );

      alert(data.message);

    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <h2 className="text-center mt-20 text-xl">
        Loading...
      </h2>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">

      <h1 className="text-3xl font-black mb-8">
        Site Settings
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >

        {/* Website Name */}

        <div>
          <label className="font-semibold">
            Website Name
          </label>

          <input
            type="text"
            name="siteName"
            value={formData.siteName}
            onChange={handleChange}
            className="w-full mt-2 border rounded-xl p-3"
          />
        </div>

        {/* Short Name */}

        <div>
          <label className="font-semibold">
            Short Name
          </label>

          <input
            type="text"
            name="shortName"
            value={formData.shortName}
            onChange={handleChange}
            className="w-full mt-2 border rounded-xl p-3"
          />
        </div>

        {/* Tagline */}

        <div className="md:col-span-2">
          <label className="font-semibold">
            Tagline
          </label>

          <input
            type="text"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            className="w-full mt-2 border rounded-xl p-3"
          />
        </div>

        {/* Email */}

        <div>
          <label className="font-semibold">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-2 border rounded-xl p-3"
          />
        </div>

        {/* Phone */}

        <div>
          <label className="font-semibold">
            Phone
          </label>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full mt-2 border rounded-xl p-3"
          />
        </div>

        {/* Address */}

        <div className="md:col-span-2">
          <label className="font-semibold">
            Address
          </label>

          <textarea
            rows="3"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full mt-2 border rounded-xl p-3"
          />
        </div>

        {/* Facebook */}

        <div>
          <label className="font-semibold">
            Facebook
          </label>

          <input
            type="text"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
            className="w-full mt-2 border rounded-xl p-3"
          />
        </div>

        {/* Youtube */}

        <div>
          <label className="font-semibold">
            YouTube
          </label>

          <input
            type="text"
            name="youtube"
            value={formData.youtube}
            onChange={handleChange}
            className="w-full mt-2 border rounded-xl p-3"
          />
        </div>

        {/* Instagram */}

        <div>
          <label className="font-semibold">
            Instagram
          </label>

          <input
            type="text"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            className="w-full mt-2 border rounded-xl p-3"
          />
        </div>

        {/* Twitter */}

        <div>
          <label className="font-semibold">
            Twitter
          </label>

          <input
            type="text"
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
            className="w-full mt-2 border rounded-xl p-3"
          />
        </div>

        {/* Copyright */}

        <div className="md:col-span-2">
          <label className="font-semibold">
            Copyright
          </label>

          <input
            type="text"
            name="copyright"
            value={formData.copyright}
            onChange={handleChange}
            className="w-full mt-2 border rounded-xl p-3"
          />
        </div>

        <div className="md:col-span-2">

          <button
            className="
            bg-amber-700
            hover:bg-amber-800
            text-white
            px-8
            py-3
            rounded-xl
            font-bold
          "
          >
            Save Settings
          </button>

        </div>

      </form>

    </div>
  );
};

export default SiteSettings;