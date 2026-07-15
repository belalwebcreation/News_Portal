import { useState } from "react";
import {
  UploadCloud,
  Eye,
  EyeOff,
  Save,
  ImageIcon,
} from "lucide-react";

const TopHeaderManager = () => {
  const [headlines, setHeadlines] = useState([
    {
      id: 1,
      title: "রাজশাহী কলেজে নতুন শিক্ষাবর্ষের ওরিয়েন্টেশন অনুষ্ঠিত",
      image: "https://picsum.photos/120/80?1",
      slug: "/news/1",
      visible: true,
    },
    {
      id: 2,
      title:
        "ডিগ্রি পরীক্ষার সময়সূচি প্রকাশ করেছে জাতীয় বিশ্ববিদ্যালয়",
      image: "https://picsum.photos/120/80?2",
      slug: "/news/2",
      visible: true,
    },
    {
      id: 3,
      title:
        "রাজশাহী কলেজ আন্তঃবিভাগ ক্রিকেট প্রতিযোগিতা শুরু",
      image: "https://picsum.photos/120/80?3",
      slug: "/news/3",
      visible: true,
    },
  ]);

  // ==========================
  // Change Text
  // ==========================

  const handleChange = (index, field, value) => {
    const updated = [...headlines];

    updated[index][field] = value;

    setHeadlines(updated);
  };

  // ==========================
  // Change Image
  // ==========================

  const handleImage = (e, index) => {
    const file = e.target.files[0];

    if (!file) return;

    const updated = [...headlines];

    updated[index].image =
      URL.createObjectURL(file);

    setHeadlines(updated);
  };

  // ==========================
  // Toggle Visibility
  // ==========================

  const toggleVisibility = (index) => {
    const updated = [...headlines];

    updated[index].visible =
      !updated[index].visible;

    setHeadlines(updated);
  };

  // ==========================
  // Save
  // ==========================

  const handleSave = () => {
    console.log(headlines);

    alert("Top Header Updated Successfully");
  };

  return (
    <div className="space-y-8">

      <div>

        <h2 className="text-3xl font-black text-slate-800">
          Top Header
        </h2>

        <p className="mt-2 text-slate-500">
          Manage top header news cards.
        </p>

      </div>

            {/* ============================= */}
      {/* Headline 1 */}
      {/* ============================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6">

        <h3 className="text-xl font-bold mb-6">
          Headline 1
        </h3>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Left */}

          <div>

            <div className="rounded-xl border-2 border-dashed border-slate-300 h-60 flex items-center justify-center overflow-hidden">

              {headlines[0].image ? (

                <img
                  src={headlines[0].image}
                  alt=""
                  className="w-full h-full object-cover"
                />

              ) : (

                <ImageIcon
                  size={70}
                  className="text-slate-400"
                />

              )}

            </div>

            <label
              className="
                mt-5
                h-12
                rounded-xl
                bg-amber-700
                hover:bg-amber-800
                text-white
                flex
                items-center
                justify-center
                gap-2
                cursor-pointer
              "
            >

              <UploadCloud size={18} />

              Change Image

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImage(e, 0)
                }
              />

            </label>

          </div>

          {/* Right */}

          <div className="space-y-6">

            <div>

              <label className="font-semibold">
                Title
              </label>

              <input
                value={headlines[0].title}
                onChange={(e) =>
                  handleChange(
                    0,
                    "title",
                    e.target.value
                  )
                }
                className="
                  mt-2
                  w-full
                  rounded-xl
                  border
                  p-3
                "
              />

            </div>

            <div>

              <label className="font-semibold">
                Link
              </label>

              <input
                value={headlines[0].slug}
                onChange={(e) =>
                  handleChange(
                    0,
                    "slug",
                    e.target.value
                  )
                }
                className="
                  mt-2
                  w-full
                  rounded-xl
                  border
                  p-3
                "
              />

            </div>

            <button
              onClick={() =>
                toggleVisibility(0)
              }
              className={`
                h-12
                px-6
                rounded-xl
                text-white
                flex
                items-center
                gap-2

                ${
                  headlines[0].visible
                    ? "bg-green-600"
                    : "bg-red-600"
                }
              `}
            >

              {headlines[0].visible ? (

                <>
                  <Eye size={18} />
                  Visible
                </>

              ) : (

                <>
                  <EyeOff size={18} />
                  Hidden
                </>

              )}

            </button>

          </div>

        </div>

      </div>

      {/* ============================= */}
      {/* Headline 2 */}
      {/* ============================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6">

        <h3 className="text-xl font-bold mb-6">
          Headline 2
        </h3>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Left */}

          <div>

            <div className="rounded-xl border-2 border-dashed border-slate-300 h-60 flex items-center justify-center overflow-hidden">

              {headlines[1].image ? (

                <img
                  src={headlines[1].image}
                  alt=""
                  className="w-full h-full object-cover"
                />

              ) : (

                <ImageIcon
                  size={70}
                  className="text-slate-400"
                />

              )}

            </div>

            <label
              className="
                mt-5
                h-12
                rounded-xl
                bg-amber-700
                hover:bg-amber-800
                text-white
                flex
                items-center
                justify-center
                gap-2
                cursor-pointer
              "
            >

              <UploadCloud size={18} />

              Change Image

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImage(e, 1)
                }
              />

            </label>

          </div>

          {/* Right */}

          <div className="space-y-6">

            <div>

              <label className="font-semibold">
                Title
              </label>

              <input
                value={headlines[1].title}
                onChange={(e) =>
                  handleChange(
                    1,
                    "title",
                    e.target.value
                  )
                }
                className="
                  mt-2
                  w-full
                  rounded-xl
                  border
                  p-3
                "
              />

            </div>

            <div>

              <label className="font-semibold">
                Link
              </label>

              <input
                value={headlines[1].slug}
                onChange={(e) =>
                  handleChange(
                    1,
                    "slug",
                    e.target.value
                  )
                }
                className="
                  mt-2
                  w-full
                  rounded-xl
                  border
                  p-3
                "
              />

            </div>

            <button
              onClick={() =>
                toggleVisibility(1)
              }
              className={`
                h-12
                px-6
                rounded-xl
                text-white
                flex
                items-center
                gap-2

                ${
                  headlines[1].visible
                    ? "bg-green-600"
                    : "bg-red-600"
                }
              `}
            >

              {headlines[1].visible ? (

                <>
                  <Eye size={18} />
                  Visible
                </>

              ) : (

                <>
                  <EyeOff size={18} />
                  Hidden
                </>

              )}

            </button>

          </div>

        </div>

      </div>
            {/* ============================= */}
      {/* Headline 3 */}
      {/* ============================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6">

        <h3 className="text-xl font-bold mb-6">
          Headline 3
        </h3>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Left */}

          <div>

            <div className="rounded-xl border-2 border-dashed border-slate-300 h-60 flex items-center justify-center overflow-hidden">

              {headlines[2].image ? (

                <img
                  src={headlines[2].image}
                  alt=""
                  className="w-full h-full object-cover"
                />

              ) : (

                <ImageIcon
                  size={70}
                  className="text-slate-400"
                />

              )}

            </div>

            <label
              className="
                mt-5
                h-12
                rounded-xl
                bg-amber-700
                hover:bg-amber-800
                text-white
                flex
                items-center
                justify-center
                gap-2
                cursor-pointer
              "
            >

              <UploadCloud size={18} />

              Change Image

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImage(e, 2)
                }
              />

            </label>

          </div>

          {/* Right */}

          <div className="space-y-6">

            <div>

              <label className="font-semibold">
                Title
              </label>

              <input
                value={headlines[2].title}
                onChange={(e) =>
                  handleChange(
                    2,
                    "title",
                    e.target.value
                  )
                }
                className="
                  mt-2
                  w-full
                  rounded-xl
                  border
                  p-3
                "
              />

            </div>

            <div>

              <label className="font-semibold">
                Link
              </label>

              <input
                value={headlines[2].slug}
                onChange={(e) =>
                  handleChange(
                    2,
                    "slug",
                    e.target.value
                  )
                }
                className="
                  mt-2
                  w-full
                  rounded-xl
                  border
                  p-3
                "
              />

            </div>

            <button
              onClick={() =>
                toggleVisibility(2)
              }
              className={`
                h-12
                px-6
                rounded-xl
                text-white
                flex
                items-center
                gap-2

                ${
                  headlines[2].visible
                    ? "bg-green-600"
                    : "bg-red-600"
                }
              `}
            >

              {headlines[2].visible ? (

                <>
                  <Eye size={18} />
                  Visible
                </>

              ) : (

                <>
                  <EyeOff size={18} />
                  Hidden
                </>

              )}

            </button>

          </div>

        </div>

      </div>

      {/* ============================= */}
      {/* Footer */}
      {/* ============================= */}

      <div className="flex justify-end">

        <button
          onClick={handleSave}
          className="
            h-12
            px-8
            rounded-xl
            bg-amber-700
            hover:bg-amber-800
            text-white
            font-semibold
            flex
            items-center
            gap-2
            transition
          "
        >

          <Save size={18} />

          Save Changes

        </button>

      </div>

    </div>
  );
};

export default TopHeaderManager;