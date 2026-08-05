import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const dbURI =
      process.env.NODE_ENV === "production"
        ? process.env.DB_PRODUCTION_URL
        : process.env.DB_LOCAL_URL;

    if (!dbURI) {
      throw new Error("Database URI is missing.");
    }

    await mongoose.connect(dbURI);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1);
  }
};

export default dbConnect;