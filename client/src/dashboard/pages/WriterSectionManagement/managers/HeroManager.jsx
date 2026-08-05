import { memo, useCallback, useMemo } from "react";
import { Image as ImageIcon } from "lucide-react";

import { HERO_CONFIG } from "../constants/section";
import { I18N } from "../constants/heroManagerText";
import AccordionSection from "../components/AccordionSection";
import EmptyState from "../components/EmptyState";
import RightColumnItem from "../components/RightColumnItem";
import NewsCard from "../components/NewsCard";
import NewsModal from "../modals/NewsModal";
import BannerModal from "../modals/BannerModal";
import ConfirmModal from "../modals/ConfirmModal";

import { useSectionManager } from "../hooks/useSectionManager";
import { useWriterSectionManager } from "../hooks/useWriterSectionManager";
import { ManagerErrorBanner, ManagerPageLoader } from "../components/ManagerFeedback";

const MAX_RIGHT_ITEMS = HERO_CONFIG?.maxRightItems ?? 4;
const { emptyState, slots, badges } = I18N;

const HeroManager = memo(() => {
  const rawManager = useSectionManager("hero");
  const { layout, pool: newsPool, loading, error, modal, confirmModal, formData, actions } = useWriterSectionManager(rawManager, "hero");
  const rightLayout = useMemo(() => layout.right ?? [], [layout.right]);
  const leftNews = useMemo(() => (layout.left ? newsPool[layout.left] ?? null : null), [layout.left, newsPool]);
  const centerNews = useMemo(() => (layout.center ? newsPool[layout.center] ?? null : null), [layout.center, newsPool]);
  const rightNewsList = useMemo(() => rightLayout.map((id) => newsPool[id]).filter(Boolean), [rightLayout, newsPool]);

  const editSlot = useCallback((slot, id) => actions.openModal?.("edit", slot, id), [actions]);
  const addSlot = useCallback((slot) => actions.openModal?.("add", slot), [actions]);
  const deleteItem = useCallback((id) => actions.deleteItem?.(id), [actions]);
  const toggleItem = useCallback((id) => actions.toggleVisibility?.(id), [actions]);
  const moveItem = useCallback((fromId, toId) => actions.reorder?.("right", fromId, toId), [actions]);

  if (loading.initial) return <ManagerPageLoader message="হিরো সেকশন লোড হচ্ছে..." />;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-3 sm:p-4">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">{I18N.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{I18N.subtitle}</p>
        </div>
        <button type="button" onClick={() => actions.openModal?.("banner")} disabled={loading.mutating} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-950 disabled:opacity-50">
          <ImageIcon className="h-4 w-4" aria-hidden="true" /> {I18N.editBannerBtn}
        </button>
      </header>

      <ManagerErrorBanner message={error} />

      <div className="space-y-4">
        <AccordionSection title={slots.left} badge={badges.single}>
          {leftNews ? (
            <NewsCard news={leftNews} onEdit={() => editSlot("left", layout.left)} onDelete={() => deleteItem(layout.left)} onToggleVisibility={() => toggleItem(layout.left)} isLoading={loading.mutating} />
          ) : (
            <EmptyState title={emptyState.left.title} description={emptyState.left.description} buttonLabel={emptyState.left.buttonLabel} onAction={() => addSlot("left")} />
          )}
        </AccordionSection>

        <AccordionSection title={slots.center} badge={badges.featured}>
          {centerNews ? (
            <NewsCard news={centerNews} onEdit={() => editSlot("center", layout.center)} onDelete={() => deleteItem(layout.center)} onToggleVisibility={() => toggleItem(layout.center)} isLoading={loading.mutating} />
          ) : (
            <EmptyState title={emptyState.center.title} description={emptyState.center.description} buttonLabel={emptyState.center.buttonLabel} onAction={() => addSlot("center")} />
          )}
        </AccordionSection>

        <AccordionSection title={slots.right(rightNewsList.length, MAX_RIGHT_ITEMS)} badge={badges.list}>
          <div className="mb-4 flex justify-end">
            <button type="button" onClick={() => addSlot("right")} disabled={loading.mutating || rightNewsList.length >= MAX_RIGHT_ITEMS} className="rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
              {I18N.addNewsToListBtn}
            </button>
          </div>
          {rightNewsList.length > 0 ? (
            <div className="space-y-3">
              {rightNewsList.map((news, index) => (
                <RightColumnItem
                  key={news.id}
                  news={news}
                  index={index}
                  totalCount={rightNewsList.length}
                  onEdit={(id) => editSlot("right", id)}
                  onDelete={deleteItem}
                  onToggle={toggleItem}
                  onMoveUp={index > 0 ? () => moveItem(rightLayout[index], rightLayout[index - 1]) : null}
                  onMoveDown={index < rightNewsList.length - 1 ? () => moveItem(rightLayout[index], rightLayout[index + 1]) : null}
                />
              ))}
            </div>
          ) : (
            <EmptyState title={emptyState.right.title} description={emptyState.right.description} buttonLabel={emptyState.right.buttonLabel} onAction={() => addSlot("right")} />
          )}
        </AccordionSection>
      </div>

      {modal.isOpen && (modal.type === "add" || modal.type === "edit") && (
        <NewsModal
          isOpen
          type={modal.type}
          formData={formData}
          setFormData={actions.setFormData}
          onClose={actions.closeModal}
          onSubmit={actions.submit}
          onImageUpload={actions.uploadImage}
          isLoading={loading.add || loading.update}
          isUploading={loading.upload}
          errors={error}
        />
      )}

      {modal.isOpen && modal.type === "banner" && (
        <BannerModal isOpen bannerData={layout.banner} onClose={actions.closeModal} onSave={actions.updateBanner} onImageUpload={actions.uploadImage} isLoading={loading.update} isUploading={loading.upload} />
      )}

      {confirmModal.isOpen && (
        <ConfirmModal isOpen message={confirmModal.message} onConfirm={confirmModal.onConfirm} onCancel={actions.closeConfirmModal} />
      )}
    </div>
  );
});

HeroManager.displayName = "HeroManager";

export default HeroManager;
