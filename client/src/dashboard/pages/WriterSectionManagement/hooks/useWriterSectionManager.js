// import { useMemo } from "react";

// const EMPTY_OBJECT = Object.freeze({});
// const EMPTY_CONFIRMATION = Object.freeze({
//   isOpen: false,
//   message: "",
//   onConfirm: undefined,
// });

// const getErrorMessage = (value) => {
//   if (!value) return null;
//   if (typeof value === "string") return value;
//   if (value instanceof Error) return value.message;
//   if (Array.isArray(value)) return value.map(getErrorMessage).find(Boolean) ?? null;

//   if (typeof value === "object") {
//     return Object.values(value).map(getErrorMessage).find(Boolean) ?? null;
//   }

//   return String(value);
// };

// const normalizeLoading = (source) => {
//   // VideoManager previously used a boolean, while the news managers used an
//   // object. Supporting both makes the migration non-breaking.
//   if (typeof source === "boolean") {
//     return {
//       initial: source,
//       add: false,
//       update: false,
//       delete: false,
//       upload: false,
//       layout: false,
//       any: source,
//       mutating: source,
//     };
//   }

//   const loading = source ?? EMPTY_OBJECT;
//   const initial = Boolean(loading.initial ?? loading.fetch ?? loading.load ?? false);
//   const add = Boolean(loading.add ?? loading.create ?? false);
//   const update = Boolean(loading.update ?? loading.save ?? false);
//   const remove = Boolean(loading.delete ?? loading.remove ?? false);
//   const upload = Boolean(loading.upload ?? false);
//   const layout = Boolean(loading.layout ?? loading.reorder ?? false);

//   return {
//     initial,
//     add,
//     update,
//     delete: remove,
//     upload,
//     layout,
//     any: initial || add || update || remove || upload || layout,
//     mutating: add || update || remove || layout,
//   };
// };

// /**
//  * Adapts the legacy section hook into one stable view-model for every manager.
//  *
//  * UI components should consume only this return value. That prevents small
//  * differences such as `videoPool` versus `newsPool`, `mode` versus `type`, and
//  * string versus object errors from leaking into each manager.
//  */
// export const useWriterSectionManager = (source, section) => {
//   return useMemo(() => {
//     const manager = source ?? EMPTY_OBJECT;
//     const rawModal = manager.modal ?? EMPTY_OBJECT;
//     const pool = manager.newsPool ?? manager.videoPool ?? EMPTY_OBJECT;
//     const loading = normalizeLoading(manager.loading);

//     return {
//       section,
//       layout: manager.layout ?? EMPTY_OBJECT,
//       pool,
//       loading,
//       error: getErrorMessage(manager.errors),
//       errors: manager.errors ?? null,
//       modal: {
//         isOpen: Boolean(rawModal.isOpen),
//         // `VideoManager` used `mode`; the news managers used `type`.
//         type: rawModal.type ?? rawModal.mode ?? "",
//         slotPath: rawModal.slotPath ?? rawModal.slot ?? null,
//         editingId: rawModal.editingId ?? null,
//       },
//       confirmModal: manager.confirmModal ?? EMPTY_CONFIRMATION,
//       formData: manager.formData ?? EMPTY_OBJECT,
//       actions: {
//         setFormData: manager.setFormData,
//         openModal: manager.openModal,
//         closeModal: manager.closeModal,
//         closeConfirmModal: manager.closeConfirmModal,
//         submit: manager.handleSubmit,
//         // The hook may expose either name during the migration.
//         deleteItem: manager.deleteNews ?? manager.deleteVideo,
//         toggleVisibility: manager.toggleNewsVisibility,
//         updateLayout: manager.updateLayout,
//         updateBanner: manager.updateBanner,
//         reorder: manager.reorderNews,
//         uploadImage: manager.handleImageUpload,
//       },
//     };
//   }, [section, source]);
// };
