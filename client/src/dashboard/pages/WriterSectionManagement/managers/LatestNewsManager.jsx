// import { memo, useCallback, useMemo } from "react";

// import { I18N } from "../constants/latestNewsText";
// import AccordionSection from "../components/AccordionSection";
// import EmptyState from "../components/EmptyState";
// import NewsCard from "../components/NewsCard";
// import NewsModal from "../modals/NewsModal";
// import ConfirmModal from "../modals/ConfirmModal";

// import { useSectionManager } from "../hooks/useSectionManager";
// import { useWriterSectionManager } from "../hooks/useWriterSectionManager";
// import { ManagerErrorBanner, ManagerPageLoader } from "../components/ManagerFeedback";

// const LIMITS = {
//   left: { imageNews: 2, textNews: 5 },
//   center: { cardNews: 4, textNews: 6 },
//   right: 8,
// };

// const getNewsList = (ids, pool) => (ids ?? []).map((id) => pool[id]).filter(Boolean);

// const NewsItemWrapper = memo(({ news, index, totalCount, slotPath, previousId, nextId, isLoading, onEdit, onDelete, onToggle, onMove }) => {
//   return (
//     <NewsCard
//       news={news}
//       index={index}
//       totalCount={totalCount}
//       onEdit={() => onEdit(slotPath, news.id)}
//       onDelete={() => onDelete(news.id)}
//       onToggleVisibility={() => onToggle(news.id)}
//       onMoveUp={previousId ? () => onMove(slotPath, news.id, previousId) : null}
//       onMoveDown={nextId ? () => onMove(slotPath, news.id, nextId) : null}
//       isLoading={isLoading}
//     />
//   );
// });

// NewsItemWrapper.displayName = "NewsItemWrapper";

// const SingleSlot = memo(({ title, news, slotPath, empty, isLoading, onAdd, onEdit, onDelete, onToggle }) => (
//   <AccordionSection title={title} defaultOpen>
//     {news ? (
//       <NewsItemWrapper news={news} index={0} totalCount={1} slotPath={slotPath} isLoading={isLoading} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
//     ) : (
//       <EmptyState title={empty.title} description={empty.description} buttonLabel={I18N.buttons.addNews} onAction={() => onAdd(slotPath)} />
//     )}
//   </AccordionSection>
// ));

// SingleSlot.displayName = "SingleSlot";

// const ListSlot = memo(({ title, list, limit, slotPath, empty, defaultOpen = false, isLoading, onAdd, onEdit, onDelete, onToggle, onMove }) => (
//   <AccordionSection title={title(list.length, limit)} defaultOpen={defaultOpen}>
//     <div className="mb-3 flex justify-end">
//       <button type="button" onClick={() => onAdd(slotPath)} disabled={isLoading || list.length >= limit} className="rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
//         {I18N.buttons.addNews}
//       </button>
//     </div>
//     {list.length > 0 ? (
//       <div className="space-y-3">
//         {list.map((news, index) => (
//           <NewsItemWrapper
//             key={news.id}
//             news={news}
//             index={index}
//             totalCount={list.length}
//             slotPath={slotPath}
//             previousId={list[index - 1]?.id}
//             nextId={list[index + 1]?.id}
//             isLoading={isLoading}
//             onEdit={onEdit}
//             onDelete={onDelete}
//             onToggle={onToggle}
//             onMove={onMove}
//           />
//         ))}
//       </div>
//     ) : (
//       <EmptyState title={empty.title} description={empty.description} buttonLabel={I18N.buttons.addNews} onAction={() => onAdd(slotPath)} />
//     )}
//   </AccordionSection>
// ));

// ListSlot.displayName = "ListSlot";

// const ZoneHeading = ({ children }) => (
//   <div className="rounded-xl border border-slate-200 bg-slate-100 p-3">
//     <h2 className="text-sm font-bold text-slate-700">{children}</h2>
//   </div>
// );

// const LatestNewsManager = memo(() => {
//   const rawManager = useSectionManager("latestNews");
//   const { layout, pool: newsPool, loading, error, modal, confirmModal, formData, actions } = useWriterSectionManager(rawManager, "latestNews");

//   const leftLayout = layout.left ?? {};
//   const centerLayout = layout.center ?? {};
//   const leftFeatured = useMemo(() => (leftLayout.featured ? newsPool[leftLayout.featured] ?? null : null), [leftLayout.featured, newsPool]);
//   const leftImageNews = useMemo(() => getNewsList(leftLayout.imageNews, newsPool), [leftLayout.imageNews, newsPool]);
//   const leftTextNews = useMemo(() => getNewsList(leftLayout.textNews, newsPool), [leftLayout.textNews, newsPool]);
//   const centerFeatured = useMemo(() => (centerLayout.featured ? newsPool[centerLayout.featured] ?? null : null), [centerLayout.featured, newsPool]);
//   const centerCardNews = useMemo(() => getNewsList(centerLayout.cardNews, newsPool), [centerLayout.cardNews, newsPool]);
//   const centerTextNews = useMemo(() => getNewsList(centerLayout.textNews, newsPool), [centerLayout.textNews, newsPool]);
//   const rightNews = useMemo(() => getNewsList(layout.right, newsPool), [layout.right, newsPool]);

//   const addItem = useCallback((slotPath) => actions.openModal?.("add", slotPath), [actions]);
//   const editItem = useCallback((slotPath, id) => actions.openModal?.("edit", slotPath, id), [actions]);
//   const deleteItem = useCallback((id) => actions.deleteItem?.(id), [actions]);
//   const toggleItem = useCallback((id) => actions.toggleVisibility?.(id), [actions]);
//   const moveItem = useCallback((slotPath, sourceId, targetId) => actions.reorder?.(slotPath, sourceId, targetId), [actions]);

//   if (loading.initial) return <ManagerPageLoader message="সর্বশেষ সংবাদের স্লট লোড হচ্ছে..." />;

//   return (
//     <div className="mx-auto max-w-7xl space-y-6 p-3 sm:p-4">
//       <header className="border-b border-slate-200 pb-4">
//         <h2 className="text-xl font-black text-slate-900 sm:text-2xl">{I18N.title}</h2>
//         <p className="mt-1 text-sm text-slate-500">{I18N.subtitle}</p>
//       </header>

//       <ManagerErrorBanner message={error} />

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//         <section className="space-y-4" aria-labelledby="latest-left-zone">
//           <ZoneHeading><span id="latest-left-zone">{I18N.zones.left}</span></ZoneHeading>
//           <SingleSlot title={I18N.slots.leftFeatured} news={leftFeatured} slotPath="left.featured" empty={I18N.emptyStates.leftFeatured} isLoading={loading.mutating} onAdd={addItem} onEdit={editItem} onDelete={deleteItem} onToggle={toggleItem} />
//           <ListSlot title={I18N.slots.leftImageNews} list={leftImageNews} limit={LIMITS.left.imageNews} slotPath="left.imageNews" empty={I18N.emptyStates.leftImageNews} isLoading={loading.mutating} onAdd={addItem} onEdit={editItem} onDelete={deleteItem} onToggle={toggleItem} onMove={moveItem} />
//           <ListSlot title={I18N.slots.leftTextNews} list={leftTextNews} limit={LIMITS.left.textNews} slotPath="left.textNews" empty={I18N.emptyStates.leftTextNews} isLoading={loading.mutating} onAdd={addItem} onEdit={editItem} onDelete={deleteItem} onToggle={toggleItem} onMove={moveItem} />
//         </section>

//         <section className="space-y-4" aria-labelledby="latest-center-zone">
//           <ZoneHeading><span id="latest-center-zone">{I18N.zones.center}</span></ZoneHeading>
//           <SingleSlot title={I18N.slots.centerFeatured} news={centerFeatured} slotPath="center.featured" empty={I18N.emptyStates.centerFeatured} isLoading={loading.mutating} onAdd={addItem} onEdit={editItem} onDelete={deleteItem} onToggle={toggleItem} />
//           <ListSlot title={I18N.slots.centerCardNews} list={centerCardNews} limit={LIMITS.center.cardNews} slotPath="center.cardNews" empty={I18N.emptyStates.centerCardNews} isLoading={loading.mutating} onAdd={addItem} onEdit={editItem} onDelete={deleteItem} onToggle={toggleItem} onMove={moveItem} />
//           <ListSlot title={I18N.slots.centerTextNews} list={centerTextNews} limit={LIMITS.center.textNews} slotPath="center.textNews" empty={I18N.emptyStates.centerTextNews} isLoading={loading.mutating} onAdd={addItem} onEdit={editItem} onDelete={deleteItem} onToggle={toggleItem} onMove={moveItem} />
//         </section>

//         <section className="space-y-4" aria-labelledby="latest-right-zone">
//           <ZoneHeading><span id="latest-right-zone">{I18N.zones.right}</span></ZoneHeading>
//           <ListSlot title={I18N.slots.rightNews} list={rightNews} limit={LIMITS.right} slotPath="right" empty={I18N.emptyStates.rightNews} defaultOpen isLoading={loading.mutating} onAdd={addItem} onEdit={editItem} onDelete={deleteItem} onToggle={toggleItem} onMove={moveItem} />
//         </section>
//       </div>

//       {modal.isOpen && (modal.type === "add" || modal.type === "edit") && (
//         <NewsModal
//           isOpen
//           type={modal.type}
//           formData={formData}
//           setFormData={actions.setFormData}
//           onClose={actions.closeModal}
//           onSubmit={actions.submit}
//           onImageUpload={actions.uploadImage}
//           isLoading={loading.add || loading.update}
//           isUploading={loading.upload}
//           errors={error}
//         />
//       )}

//       {confirmModal.isOpen && <ConfirmModal isOpen message={confirmModal.message} onConfirm={confirmModal.onConfirm} onCancel={actions.closeConfirmModal} />}
//     </div>
//   );
// });

// LatestNewsManager.displayName = "LatestNewsManager";

// export default LatestNewsManager;
