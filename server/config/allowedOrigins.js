// server.js এবং socket/index.js — দুই জায়গাতেই এক্সাক্টলি একই
// allowed-origin list দরকার (REST CORS আর Socket.io CORS)। আলাদা
// দুই জায়গায় copy-paste করলে ভবিষ্যতে একটা আপডেট হবে, আরেকটা ভুলে
// বাদ পড়ে যাবে — তাই একটাই shared source।

const allowedOrigins = [
  "http://localhost:5173",
  "https://www.royalbangla.com",
  "https://royalbangla.com",
  process.env.CLIENT_URL,
].filter(Boolean);

export default allowedOrigins;