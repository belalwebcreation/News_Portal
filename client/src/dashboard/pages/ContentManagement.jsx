import { Component, useCallback, useState } from "react";

import CMSSection from "../components/contentManagement/CMSSection";
import CMSModal from "../components/contentManagement/CMSModal";
import managerComponents from "../components/contentManagement/managers/managerComponents";

import { useSiteSettings } from "../../context/SiteSettingsContext";

class ManagerErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Manager crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <p className="font-semibold text-red-600">
            Something went wrong loading this section.
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Close this window and try again.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

const ContentManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { settings, refreshSettings } = useSiteSettings();

  const handleManage = useCallback((item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const ManagerComponent = selectedItem
    ? managerComponents[selectedItem.manager]
    : null;

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black">
          Content Management
        </h1>

        <p className="mt-2 text-slate-500">
          Manage every dynamic section.
        </p>
      </div>

      {/* CMS Sections */}
      <CMSSection onManage={handleManage} />

      {/* Manager Modal */}
      <CMSModal
        open={isModalOpen}
        onClose={closeModal}
        title={selectedItem?.title}
      >
        {selectedItem && ManagerComponent ? (
          <ManagerErrorBoundary
            key={selectedItem.id ?? selectedItem.manager}
          >
            <ManagerComponent
              {...selectedItem}
              item={selectedItem}
              onClose={closeModal}
              settings={settings}
              refreshSettings={refreshSettings}
            />
          </ManagerErrorBoundary>
        ) : (
          <div className="p-6 text-center text-slate-500">
            No manager configured for this section.
          </div>
        )}
      </CMSModal>
    </div>
  );
};

export default ContentManagement;