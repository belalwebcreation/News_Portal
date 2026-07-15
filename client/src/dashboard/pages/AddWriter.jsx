import { useState } from "react";

const AddWriter = () => {
  const [preview, setPreview] = useState(null);

  const imagePreview = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="mt-3">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Add Writer
        </h1>

        <p className="text-gray-500 mt-1">
          Create a new writer account for your News Portal.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">

        <form>

          <div className="grid lg:grid-cols-2 gap-6">

            {/* Name */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter writer name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-600"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Email Address
              </label>

              <input
                type="email"
                placeholder="writer@email.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-600"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Phone Number
              </label>

              <input
                type="text"
                placeholder="+8801XXXXXXXXX"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-600"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Role
              </label>

              <select className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-600">

                <option>Writer</option>
                <option>Editor</option>

              </select>
            </div>

            {/* News Category */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                News Category
              </label>

              <select
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-600"
              >
                <option value="">Select Category</option>
                <option value="campus">Campus News</option>
                <option value="national">National</option>
                <option value="international">International</option>
                <option value="politics">Politics</option>
                <option value="sports">Sports</option>
                <option value="business">Business</option>
                <option value="technology">Technology</option>
                <option value="education">Education</option>
                <option value="health">Health</option>
                <option value="entertainment">Entertainment</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="opinion">Opinion</option>
                <option value="crime">Crime</option>
                <option value="weather">Weather</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                placeholder="********"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-600"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="********"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-600"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Gender
              </label>

              <select className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-600">

                <option>Male</option>
                <option>Female</option>
                <option>Other</option>

              </select>
            </div>

    

          </div>

          {/* Address */}

          <div className="mt-6">

            <label className="block mb-2 text-sm font-medium">
              Address
            </label>

            <input
              type="text"
              placeholder="Enter address"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-600"
            />

          </div>

           {/* Status */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Status
              </label>

              <select className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-600">

                <option>Active</option>
                <option>Inactive</option>

              </select>
            </div>

          {/* Bio */}

          <div className="mt-6">

            <label className="block mb-2 text-sm font-medium">
              Short Bio
            </label>

            <textarea
              rows="5"
              placeholder="Write something about this writer..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none resize-none focus:border-amber-600"
            />

          </div>

          {/* Image */}

          <div className="mt-6">

            <label className="block mb-2 text-sm font-medium">
              Profile Image
            </label>

            <input
              type="file"
              onChange={imagePreview}
              className="w-full rounded-lg border border-gray-300 p-3"
            />

            {preview && (

              <img
                src={preview}
                alt=""
                className="size-32 rounded-xl object-cover mt-5 border"
              />

            )}

          </div>

          {/* Buttons */}

          <div className="flex gap-4 mt-8">

            <button
              className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 rounded-lg font-medium transition"
            >
              Add Writer
            </button>

            <button
              type="reset"
              className="border border-gray-300 px-8 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Reset
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddWriter;