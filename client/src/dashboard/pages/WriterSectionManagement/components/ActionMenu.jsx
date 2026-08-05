import { useEffect, useRef, useState } from "react";
import {
  MoreVertical,
  Pencil,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  Pin,
  CalendarClock,
} from "lucide-react";

const ActionMenu = ({
  hidden = false,

  onEdit,

  onDelete,

  onToggleHide,

  onDuplicate,

  onPin,

  onSchedule,
}) => {
  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleAction = (callback) => {
    setOpen(false);

    callback?.();
  };

  const menuItems = [
    {
      label: "Edit",
      icon: Pencil,
      onClick: onEdit,
    },

    {
      label: hidden ? "Show" : "Hide",
      icon: hidden ? Eye : EyeOff,
      onClick: onToggleHide,
    },

    {
      label: "Duplicate",
      icon: Copy,
      onClick: onDuplicate,
    },

    {
      label: "Pin",
      icon: Pin,
      onClick: onPin,
    },

    {
      label: "Schedule",
      icon: CalendarClock,
      onClick: onSchedule,
    },

    {
      label: "Delete",
      icon: Trash2,
      onClick: onDelete,
      danger: true,
    },
  ];

  return (
    <div
      className="relative inline-block"
      ref={menuRef}
    >
      {/* Toggle */}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          rounded-lg
          p-2
          transition
          hover:bg-slate-100
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      >
        <MoreVertical className="h-5 w-5 text-slate-600" />
      </button>

      {/* Menu */}

      {open && (
        <div
          className="
            absolute
            right-0
            z-50
            mt-2
            w-52
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-white
            shadow-xl
          "
        >
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() =>
                  handleAction(item.onClick)
                }
                className={`
                  flex
                  w-full
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-sm
                  transition

                  ${
                    item.danger
                      ? "text-red-600 hover:bg-red-50"
                      : "text-slate-700 hover:bg-slate-50"
                  }
                `}
              >
                <Icon className="h-4 w-4" />

                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;