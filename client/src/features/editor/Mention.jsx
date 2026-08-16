import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  forwardRef,
} from "react";

import {
  Users,
  PenSquare,
  User,
  Crown,
} from "lucide-react";

// ============================================================
// ROLE CONFIG
// ============================================================

const roleConfig = {
  admin: {
    label: "Admin",
    icon: Crown,
    className:
      "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-yellow-300 border border-yellow-400/40",
  },

  superadmin: {
    label: "Super Admin",
    icon: Crown,
    className:
      "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 border border-red-400/40",
  },

  writer: {
    label: "Writer",
    icon: PenSquare,
    className:
      "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  },

  reader: {
    label: "Member",
    icon: User,
    className:
      "bg-slate-600/30 text-slate-300 border border-slate-500/30",
  },
};

// ============================================================
// MENTION LIST
// ============================================================

export const MentionList = forwardRef(
  (
    {
      items = [],
      command,
    },
    ref
  ) => {
    const [selectedIndex, setSelectedIndex] =
      useState(0);

    // ========================================================
    // RESET SELECTION WHEN ITEMS CHANGE
    // ========================================================

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    // ========================================================
    // SELECT USER
    // ========================================================

    const selectItem = useCallback(
      (index) => {
        const user = items[index];

        if (!user) {
          return;
        }

        console.log(
          "🟢 MENTION USER SELECTED:",
          user
        );

        command({
          id:
            user._id ||
            user.id,

          label:
            user.username ||
            user.name ||
            "user",

          name:
            user.name ||
            "",

          username:
            user.username ||
            "",

          avatar:
            user.avatar ||
            null,

          role:
            user.role ||
            "reader",
        });
      },
      [
        command,
        items,
      ]
    );

    // ========================================================
    // KEYBOARD NAVIGATION
    // ========================================================

    useImperativeHandle(
      ref,
      () => ({
        onKeyDown({
          event,
        }) {
          // No users
          if (!items.length) {
            return false;
          }

          // ----------------------------------------------
          // Arrow Up
          // ----------------------------------------------

          if (
            event.key ===
            "ArrowUp"
          ) {
            event.preventDefault();

            setSelectedIndex(
              (prev) =>
                prev <= 0
                  ? items.length - 1
                  : prev - 1
            );

            return true;
          }

          // ----------------------------------------------
          // Arrow Down
          // ----------------------------------------------

          if (
            event.key ===
            "ArrowDown"
          ) {
            event.preventDefault();

            setSelectedIndex(
              (prev) =>
                prev >=
                items.length - 1
                  ? 0
                  : prev + 1
            );

            return true;
          }

          // ----------------------------------------------
          // Enter
          // ----------------------------------------------

          if (
            event.key ===
            "Enter"
          ) {
            event.preventDefault();

            selectItem(
              selectedIndex
            );

            return true;
          }

          // ----------------------------------------------
          // Tab
          // ----------------------------------------------

          if (
            event.key ===
            "Tab"
          ) {
            event.preventDefault();

            selectItem(
              selectedIndex
            );

            return true;
          }

          return false;
        },
      }),
      [
        items,
        selectedIndex,
        selectItem,
      ]
    );

    // ========================================================
    // EMPTY STATE
    // ========================================================

    if (!items.length) {
      return (
        <div
          className="
            w-72
            rounded-xl
            border border-slate-700
            bg-slate-900/95
            p-3
            text-xs
            text-slate-400
            shadow-2xl
            backdrop-blur-xl
          "
        >
          <div className="flex items-center gap-2">
            <Users
              size={15}
              className="text-slate-500"
            />

            <span>
              কোনো ইউজার পাওয়া যায়নি...
            </span>
          </div>
        </div>
      );
    }

    // ========================================================
    // UI
    // ========================================================

    return (
      <div
        className="
          w-80
          max-h-80
          overflow-hidden
          rounded-xl
          border border-slate-700/80
          bg-slate-950/95
          text-slate-100
          shadow-2xl
          backdrop-blur-xl
        "
        role="listbox"
        aria-label="Mention users"
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            flex
            items-center
            gap-2
            border-b
            border-slate-700/80
            px-3
            py-2.5
          "
        >
          <div
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-lg
              bg-indigo-500/15
              text-indigo-300
            "
          >
            <Users size={15} />
          </div>

          <div className="min-w-0">
            <div className="text-sm font-semibold text-white">
              Mention User
            </div>

            <div className="text-[10px] text-slate-500">
              Select a teammate
            </div>
          </div>

          <span
            className="
              ml-auto
              rounded-full
              bg-slate-800
              px-2
              py-0.5
              text-[10px]
              font-medium
              text-slate-400
            "
          >
            {items.length}
          </span>
        </div>

        {/* ==================================================
            USERS
        ================================================== */}

        <div
          className="
            max-h-64
            overflow-y-auto
            p-1.5
          "
        >
          {items.map(
            (
              user,
              index
            ) => {
              const selected =
                index ===
                selectedIndex;

              const role =
                roleConfig[
                  user.role
                ] ||
                roleConfig.reader;

              const Icon =
                role.icon;

              const avatarUrl =
                typeof user.avatar ===
                "string"
                  ? user.avatar
                  : user.avatar?.url ||
                    user.avatar?.secure_url ||
                    null;

              const displayName =
                user.name ||
                user.username ||
                "Unknown user";

              const username =
                user.username ||
                "";

              return (
                <button
                  key={
                    user._id ||
                    user.id ||
                    index
                  }
                  type="button"
                  role="option"
                  aria-selected={
                    selected
                  }
                  onMouseDown={(
                    event
                  ) => {
                    /*
                     * VERY IMPORTANT:
                     *
                     * TipTap suggestion popup
                     * active থাকা অবস্থায় mousedown
                     * editor-এর selection change করতে
                     * পারে।
                     *
                     * তাই এখানে preventDefault।
                     */
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onClick={(
                    event
                  ) => {
                    event.preventDefault();
                    event.stopPropagation();

                    selectItem(
                      index
                    );
                  }}
                  onMouseEnter={() => {
                    setSelectedIndex(
                      index
                    );
                  }}
                  className={`
                    group
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-2.5
                    py-2
                    text-left
                    transition-all
                    duration-150
                    ${
                      selected
                        ? "bg-indigo-600/90 text-white shadow-md"
                        : "text-slate-300 hover:bg-slate-800/90"
                    }
                  `}
                >
                  {/* ========================================
                      AVATAR
                  ======================================== */}

                  <div
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-full
                      border
                      ${
                        selected
                          ? "border-indigo-300/60 bg-indigo-500/30"
                          : "border-slate-700 bg-slate-800"
                      }
                    `}
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                        draggable={false}
                      />
                    ) : (
                      <span
                        className="
                          text-xs
                          font-bold
                          uppercase
                          text-slate-300
                        "
                      >
                        {displayName
                          ?.charAt(
                            0
                          ) || "U"}
                      </span>
                    )}
                  </div>

                  {/* ========================================
                      USER INFO
                  ======================================== */}

                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >
                    <div
                      className="
                        truncate
                        text-sm
                        font-semibold
                      "
                    >
                      {displayName}
                    </div>

                    <div
                      className="
                        mt-0.5
                        flex
                        items-center
                        justify-between
                        gap-2
                      "
                    >
                      <span
                        className={`
                          truncate
                          text-xs
                          ${
                            selected
                              ? "text-indigo-100/80"
                              : "text-slate-500"
                          }
                        `}
                      >
                        @{username}
                      </span>

                      {/* ROLE */}

                      <span
                        className={`
                          flex
                          shrink-0
                          items-center
                          gap-1
                          rounded-full
                          border
                          px-1.5
                          py-0.5
                          text-[9px]
                          font-semibold
                          ${role.className}
                        `}
                      >
                        <Icon
                          size={9}
                        />

                        {role.label}
                      </span>
                    </div>
                  </div>

                  {/* ========================================
                      SELECT INDICATOR
                  ======================================== */}

                  {selected && (
                    <span
                      className="
                        shrink-0
                        text-xs
                        text-white/80
                      "
                    >
                      ↵
                    </span>
                  )}
                </button>
              );
            }
          )}
        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div
          className="
            flex
            items-center
            justify-end
            gap-2
            border-t
            border-slate-800
            px-3
            py-2
            text-[10px]
            text-slate-600
          "
        >
          <span>
            ↑ ↓ Navigate
          </span>

          <span>
            Enter Select
          </span>

          <span>
            Esc Close
          </span>
        </div>
      </div>
    );
  }
);

MentionList.displayName =
  "MentionList";

export default MentionList;