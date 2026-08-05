// import { useCallback, useState } from "react";

// export function useImageUpload() {
//   const [isUploading, setIsUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [error, setError] = useState(null);

//   const upload = useCallback(async (file) => {
//     if (!file) {
//       throw new Error("No image selected.");
//     }

//     const allowedTypes = [
//       "image/jpeg",
//       "image/png",
//       "image/webp",
//       "image/gif",
//     ];

//     if (!allowedTypes.includes(file.type)) {
//       throw new Error("Unsupported image type.");
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       throw new Error("Image must be under 5MB.");
//     }

//     setIsUploading(true);
//     setProgress(0);
//     setError(null);

//     try {
//       const token = localStorage.getItem("token");

//       const formData = new FormData();
//       formData.append("image", file);

//       const asset = await new Promise((resolve, reject) => {
//         const xhr = new XMLHttpRequest();

//         xhr.open("POST", "/api/news/image");

//         if (token) {
//           xhr.setRequestHeader(
//             "Authorization",
//             `Bearer ${token}`
//           );
//         }

//         xhr.upload.onprogress = (event) => {
//           if (event.lengthComputable) {
//             setProgress(
//               Math.round(
//                 (event.loaded / event.total) * 100
//               )
//             );
//           }
//         };

//         xhr.onload = () => {
//           if (xhr.status >= 200 && xhr.status < 300) {
//             try {
//               const res = JSON.parse(xhr.responseText);

//               resolve({
//                 id: res.mediaId,
//                 mediaId: res.mediaId,
//                 public_id: res.cloudinaryPublicId,
//                 url: res.url,
//                 secureUrl: res.secureUrl,
//                 name: file.name,
//                 type: file.type,
//                 size: file.size,
//                 local: false,
//               });
//             } catch {
//               reject(new Error("Invalid server response"));
//             }
//           } else {
//             try {
//               const err = JSON.parse(xhr.responseText);
//               reject(new Error(err.message));
//             } catch {
//               reject(new Error("Upload failed"));
//             }
//           }
//         };

//         xhr.onerror = () => {
//           reject(new Error("Network Error"));
//         };

//         xhr.send(formData);
//       });

//       console.log("Uploaded Asset:", asset);

//       return asset;
//     } catch (err) {
//       setError(err);
//       throw err;
//     } finally {
//       setIsUploading(false);
//       setProgress(100);

//       setTimeout(() => {
//         setProgress(0);
//       }, 500);
//     }
//   }, []);

//   return {
//     // upload
//     isUploading,
//     progress,
//     error,
//   };
// }

// export default useImageUpload;