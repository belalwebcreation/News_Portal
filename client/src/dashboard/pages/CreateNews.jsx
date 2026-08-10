import React, { useState, useEffect } from "react";
import Editor from "../components/editor/Editor";

const CreateNews = () => {

  // ==========================================
  // Form State
  // ==========================================

  const [newsData, setNewsData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    category: "",
    subCategory: "",
    tags: "",
    reporter: "",
    source: "",
    status: "Draft",
    breaking: false,
    featured: false,
    trending: false,
    publishDate: "",
    metaTitle: "",
    metaDescription: "",
    metaKeyword: "",
  });

  // ==========================================
  // Rich Text Content
  // ==========================================

  const [content, setContent] = useState("");

  // ==========================================
  // Image Upload
  // ==========================================

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [gallery, setGallery] = useState([]);

  // ==========================================
  // Loading
  // ==========================================

  const [loading, setLoading] = useState(false);

  // ==========================================
  // Validation
  // ==========================================

  const [errors, setErrors] = useState({});

  // ==========================================
  // Auto Slug Generator
  // ==========================================

  useEffect(() => {

    const slug = newsData.title

      .toLowerCase()

      .replace(/[^a-z0-9 ]/g, "")

      .replace(/\s+/g, "-");

    setNewsData((prev)=>({

      ...prev,

      slug

    }));

  },[newsData.title]);

  // ==========================================
  // Input Change
  // ==========================================

  const handleChange = (e)=>{

      const {name,value,type,checked}=e.target;

      setNewsData({

        ...newsData,

        [name]:type==="checkbox"?checked:value

      });

  };

  // ==========================================
  // Thumbnail Upload
  // ==========================================

  const handleThumbnail=(e)=>{

      const file=e.target.files[0];

      if(!file) return;

      setThumbnail(file);

      setThumbnailPreview(URL.createObjectURL(file));

  };

  // ==========================================
  // Gallery Upload
  // ==========================================

  const handleGallery=(e)=>{

      setGallery([...e.target.files]);

  };

  // ==========================================
  // Submit
  // ==========================================

  const handleSubmit=(e)=>{

      e.preventDefault();

      setLoading(true);

      /*
      ===========================================
      BACKEND NOTE
      ===========================================

      এখানে FormData তৈরি হবে।

      const formData=new FormData();

      formData.append("title",newsData.title)

      formData.append("slug",newsData.slug)

      formData.append("content",content)

      formData.append("thumbnail",thumbnail)

      gallery.forEach(image=>{

          formData.append("gallery",image);

      });

      তারপর axios/fetch দিয়ে

      POST

      /api/news/create

      Authorization Token Header পাঠাতে হবে

      সফল হলে

      toast.success()

      navigate("/dashboard/admin/news")

      ===========================================
      */

      setTimeout(()=>{

          setLoading(false);

      },1500);

  };

  return (

      <div className="w-full min-h-screen">

          {/* Page Header */}

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                  <div>

                      <h1 className="text-3xl font-bold text-slate-800 dark:text-white">

                          Create News

                      </h1>

                      <p className="text-slate-500 dark:text-slate-400 mt-2">

                          Publish professional news article.

                      </p>

                  </div>

                  <button

                  onClick={handleSubmit}

                  disabled={loading}

                  className="bg-amber-900 hover:bg-black transition text-white px-8 py-3 rounded-xl font-semibold"

                  >

                      {loading ? "Publishing..." : "Publish News"}

                  </button>

              </div>

          </div>

          {/* Form */}

          <form className="mt-8">

              {/* ================= part 2 Basic Information ================= */}

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">

                  <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                      Basic Information
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                      {/* News Title */}

                      <div className="lg:col-span-2">

                          <label className="font-semibold text-slate-700 dark:text-slate-300">
                              News Title
                          </label>

                          <input
                              type="text"
                              name="title"
                              value={newsData.title}
                              onChange={handleChange}
                              placeholder="Enter news title..."
                              className="mt-2 w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900/40 dark:text-white dark:placeholder-slate-500 rounded-xl px-4 py-3 outline-none focus:border-amber-900 dark:focus:border-amber-500"
                          />

                      </div>

                      {/* Slug */}

                      <div>

                          <label className="font-semibold text-slate-700 dark:text-slate-300">
                              News Slug
                          </label>

                          <input
                              type="text"
                              value={newsData.slug}
                              readOnly
                              className="mt-2 w-full bg-gray-100 dark:bg-slate-700 dark:text-slate-300 border dark:border-slate-600 rounded-xl px-4 py-3"
                          />

                      </div>

                      {/* Category */}

                      <div>

                          <label className="font-semibold text-slate-700 dark:text-slate-300">
                              Category
                          </label>

                          <select
                              name="category"
                              value={newsData.category}
                              onChange={handleChange}
                              className="mt-2 w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900/40 dark:text-white rounded-xl px-4 py-3"
                          >

                              <option value="">Select Category</option>

                              <option value="National">National</option>

                              <option value="International">International</option>

                              <option value="Politics">Politics</option>

                              <option value="Sports">Sports</option>

                              <option value="Technology">Technology</option>

                              <option value="Education">Education</option>

                              <option value="Entertainment">Entertainment</option>

                          </select>

                          {/* Backend Note */}
                          {/*
                              Backend:
                              GET /api/category
                              এখান থেকে category fetch হবে।
                          */}

                      </div>

                      {/* Sub Category */}

                      <div>

                          <label className="font-semibold text-slate-700 dark:text-slate-300">
                              Sub Category
                          </label>

                          <input
                              type="text"
                              name="subCategory"
                              value={newsData.subCategory}
                              onChange={handleChange}
                              placeholder="Sub Category..."
                              className="mt-2 w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900/40 dark:text-white dark:placeholder-slate-500 rounded-xl px-4 py-3"
                          />

                      </div>

                      {/* Reporter */}

                      <div>

                          <label className="font-semibold text-slate-700 dark:text-slate-300">
                              Reporter Name
                          </label>

                          <input
                              type="text"
                              name="reporter"
                              value={newsData.reporter}
                              onChange={handleChange}
                              placeholder="Reporter Name..."
                              className="mt-2 w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900/40 dark:text-white dark:placeholder-slate-500 rounded-xl px-4 py-3"
                          />

                          {/* Backend */}
                          {/*
                              Login user থেকে
                              Reporter Auto Fill করা যাবে।
                          */}

                      </div>

                      {/* Source */}

                      <div>

                          <label className="font-semibold text-slate-700 dark:text-slate-300">
                              News Source
                          </label>

                          <input
                              type="text"
                              name="source"
                              value={newsData.source}
                              onChange={handleChange}
                              placeholder="BBC, Prothom Alo..."
                              className="mt-2 w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900/40 dark:text-white dark:placeholder-slate-500 rounded-xl px-4 py-3"
                          />

                      </div>

                      {/* Short Description */}

                      <div className="lg:col-span-2">

                          <label className="font-semibold text-slate-700 dark:text-slate-300">
                              Short Description
                          </label>

                          <textarea
                              rows={5}
                              name="shortDescription"
                              value={newsData.shortDescription}
                              onChange={handleChange}
                              placeholder="Write short description..."
                              className="mt-2 w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900/40 dark:text-white dark:placeholder-slate-500 rounded-xl px-4 py-3 resize-none"
                          />

                      </div>

                  </div>

              </div>

              {/* ================= Media Upload ================= */}

<div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">

    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
        Media & Attachments
    </h2>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Thumbnail Upload */}

        <div>

            <label className="font-semibold text-slate-700 dark:text-slate-300">
                Featured Thumbnail
            </label>

            <div className="mt-3 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl p-6 hover:border-amber-900 dark:hover:border-amber-500 transition">

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnail}
                    className="w-full dark:text-slate-300"
                />

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                    Recommended Size : 1200 × 700 px
                </p>

                {thumbnailPreview && (

                    <div className="mt-5">

                        <img
                            src={thumbnailPreview}
                            alt=""
                            className="w-full h-60 object-cover rounded-xl border dark:border-slate-700"
                        />

                    </div>

                )}

            </div>

            {/*
            ==========================
            BACKEND NOTE
            ==========================

            এখানে Cloudinary /
            ImageKit /
            AWS S3
            Image Upload হবে।

            formData.append("thumbnail",thumbnail)

            ==========================
            */}

        </div>

        {/* Gallery Upload */}

        <div>

            <label className="font-semibold text-slate-700 dark:text-slate-300">
                Gallery Images
            </label>

            <div className="mt-3 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl p-6 hover:border-amber-900 dark:hover:border-amber-500 transition">

                <input

                    type="file"

                    multiple

                    accept="image/*"

                    onChange={handleGallery}

                    className="w-full dark:text-slate-300"

                />

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">

                    Upload Multiple Images

                </p>

                {gallery.length > 0 && (

                    <div className="mt-4">

                        <p className="font-semibold text-green-700 dark:text-green-400">

                            {gallery.length} Image Selected

                        </p>

                    </div>

                )}

            </div>

            {/*
            Backend

            gallery.forEach(image=>{

                formData.append("gallery",image)

            })

            */}

        </div>

    </div>

</div>


{/* ================= Extra Information ================= */}

<div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">

    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">

        Additional Information

    </h2>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Video URL */}

        <div>

            <label className="font-semibold dark:text-slate-300">

                Featured Video URL

            </label>

            <input

                type="text"

                placeholder="https://youtube.com/..."

                className="mt-2 w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900/40 dark:text-white dark:placeholder-slate-500 rounded-xl px-4 py-3"

            />

            {/*
            Backend

            formData.append("video",videoUrl)

            */}

        </div>

        {/* Tags */}

        <div>

            <label className="font-semibold dark:text-slate-300">

                Tags

            </label>

            <input

                type="text"

                name="tags"

                value={newsData.tags}

                onChange={handleChange}

                placeholder="Politics, Bangladesh, Economy"

                className="mt-2 w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900/40 dark:text-white dark:placeholder-slate-500 rounded-xl px-4 py-3"

            />

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">

                Separate tags using comma (,)

            </p>

        </div>

        {/* Reading Time */}

        <div>

            <label className="font-semibold dark:text-slate-300">

                Reading Time

            </label>

            <input

                type="number"

                placeholder="5"

                className="mt-2 w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900/40 dark:text-white dark:placeholder-slate-500 rounded-xl px-4 py-3"

            />

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">

                Example : 5 Minutes

            </p>

        </div>

        {/* Source Link */}

        <div>

            <label className="font-semibold dark:text-slate-300">

                Source URL

            </label>

            <input

                type="url"

                placeholder="https://example.com"

                className="mt-2 w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900/40 dark:text-white dark:placeholder-slate-500 rounded-xl px-4 py-3"

            />

        </div>

    </div>

</div>


            {/* ================= News Content ================= */}

<div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">

    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">

        News Content

    </h2>

    <div>

        <label className="font-semibold text-slate-700 dark:text-slate-300">

            Full News Description

        </label>

        <textarea

            rows={18}

            value={content}

            onChange={(e)=>setContent(e.target.value)}

            placeholder="Write your complete news..."

            className="mt-3 w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900/40 dark:text-white dark:placeholder-slate-500 rounded-xl p-5 resize-none outline-none focus:border-amber-900 dark:focus:border-amber-500"

        />

                <Editor

              value={content}

              onChange={setContent}/>

        {/*
        ==========================================

        Backend

        formData.append("content",content)

        MongoDB Schema

        content:String

        ==========================================

        */}

    </div>

</div>


{/* ================= SEO ================= */}

<div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">

    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">

        SEO Optimization

    </h2>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Meta Title */}

        <div className="lg:col-span-2">

            <label className="font-semibold dark:text-slate-300">

                Meta Title

            </label>

            <input

                type="text"

                name="metaTitle"

                value={newsData.metaTitle}

                onChange={handleChange}

                placeholder="SEO Meta Title"

                className="mt-2 w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900/40 dark:text-white dark:placeholder-slate-500 rounded-xl px-4 py-3"

            />

        </div>

        {/* Meta Description */}

        <div className="lg:col-span-2">

            <label className="font-semibold dark:text-slate-300">

                Meta Description

            </label>

            <textarea

                rows={5}

                name="metaDescription"

                value={newsData.metaDescription}

                onChange={handleChange}

                placeholder="SEO Description..."

                className="mt-2 w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900/40 dark:text-white dark:placeholder-slate-500 rounded-xl px-4 py-3 resize-none"

            />

        </div>

        {/* Meta Keywords */}

        <div className="lg:col-span-2">

            <label className="font-semibold dark:text-slate-300">

                Meta Keywords

            </label>

            <input

                type="text"

                name="metaKeyword"

                value={newsData.metaKeyword}

                onChange={handleChange}

                placeholder="Bangladesh, Politics, Sports..."

                className="mt-2 w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900/40 dark:text-white dark:placeholder-slate-500 rounded-xl px-4 py-3"

            />

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">

                Separate keywords using comma (,)

            </p>

        </div>

    </div>

    {/*
    =========================================

    Backend

    metaTitle

    metaDescription

    metaKeyword

    MongoDB Schema

    =========================================

    */}

</div>
        {/* ================= Publish Settings ================= */}

<div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">

  <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
    Publish Settings
  </h2>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    {/* Publish Status */}

    <div>

      <label className="font-semibold text-slate-700 dark:text-slate-300">
        Publish Status
      </label>

      <select
        name="status"
        value={newsData.status}
        onChange={handleChange}
        className="mt-2 w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900/40 dark:text-white rounded-xl px-4 py-3"
      >
        <option value="Draft">Draft</option>
        <option value="Pending">Pending Review</option>
        <option value="Published">Published</option>
      </select>

      {/*
      Backend

      news.status

      Draft
      Pending
      Published

      */}
    </div>

    {/* Publish Date */}

    <div>

      <label className="font-semibold text-slate-700 dark:text-slate-300">
        Schedule Publish
      </label>

      <input
        type="datetime-local"
        name="publishDate"
        value={newsData.publishDate}
        onChange={handleChange}
        className="mt-2 w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900/40 dark:text-white rounded-xl px-4 py-3"
      />

      {/*
      Backend

      publishDate

      যদি Future Date হয়

      Cron Job দিয়ে Publish হবে

      */}
    </div>

  </div>

  {/* Switches */}

  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

    {/* Breaking */}

    <label className="flex items-center justify-between border dark:border-slate-700 rounded-xl p-5 cursor-pointer">

      <div>

        <h3 className="font-semibold dark:text-white">
          Breaking News
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Show Breaking Badge
        </p>

      </div>

      <input
        type="checkbox"
        name="breaking"
        checked={newsData.breaking}
        onChange={handleChange}
        className="w-5 h-5"
      />

    </label>

    {/* Featured */}

    <label className="flex items-center justify-between border dark:border-slate-700 rounded-xl p-5 cursor-pointer">

      <div>

        <h3 className="font-semibold dark:text-white">
          Featured News
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Show on Homepage
        </p>

      </div>

      <input
        type="checkbox"
        name="featured"
        checked={newsData.featured}
        onChange={handleChange}
        className="w-5 h-5"
      />

    </label>

    {/* Trending */}

    <label className="flex items-center justify-between border dark:border-slate-700 rounded-xl p-5 cursor-pointer">

      <div>

        <h3 className="font-semibold dark:text-white">
          Trending News
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Show Trending Section
        </p>

      </div>

      <input
        type="checkbox"
        name="trending"
        checked={newsData.trending}
        onChange={handleChange}
        className="w-5 h-5"
      />

    </label>

  </div>

</div>

{/* ================= Preview ================= */}

<div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">

  <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
    News Preview
  </h2>

  <div className="border dark:border-slate-700 rounded-2xl p-6 bg-slate-50 dark:bg-slate-900/40">

    <h1 className="text-3xl font-bold dark:text-white">

      {newsData.title || "News Title"}

    </h1>

    <p className="text-slate-500 dark:text-slate-400 mt-3">

      {newsData.shortDescription ||

        "Short Description will appear here..."}

    </p>

    <div className="mt-5 flex flex-wrap gap-3">

      {newsData.breaking && (

        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">

          Breaking

        </span>

      )}

      {newsData.featured && (

        <span className="bg-amber-700 text-white px-3 py-1 rounded-full text-sm">

          Featured

        </span>

      )}

      {newsData.trending && (

        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">

          Trending

        </span>

      )}

    </div>

    {thumbnailPreview && (

      <img
        src={thumbnailPreview}
        alt=""
        className="mt-6 rounded-xl w-full max-h-[400px] object-cover"
      />

    )}

  </div>

</div>

{/* ================= Submit Buttons ================= */}

<div className="mt-8 flex flex-wrap gap-4 justify-end">

  <button
    type="button"
    className="px-8 py-3 rounded-xl border border-gray-300 dark:border-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
  >
    Save Draft
  </button>

  <button
    type="button"
    className="px-8 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
  >
    Preview
  </button>

  <button
    type="submit"
    onClick={handleSubmit}
    disabled={loading}
    className="px-8 py-3 rounded-xl bg-amber-900 text-white hover:bg-black transition"
  >
    {loading ? "Publishing..." : "Publish News"}
  </button>

</div>

{/* =============================================

BACKEND NOTES

POST /api/news/create

Authorization:
Bearer Token

Multipart/FormData

Fields

title
slug
shortDescription
content
thumbnail
gallery
category
subCategory
tags
reporter
source
status
breaking
featured
trending
publishDate
metaTitle
metaDescription
metaKeyword

MongoDB Collection

news

============================================= */}
          </form>

      </div>

  );

};

export default CreateNews;