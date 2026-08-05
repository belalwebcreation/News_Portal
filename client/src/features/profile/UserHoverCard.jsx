import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import { userService } from "../../features/users/userService";
import ProfileAvatar from "../../components/profile/ProfileAvatar";

const UserHoverCard = ({ userId, username, targetRef, isHovered }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isHovered && targetRef?.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
  }, [isHovered, targetRef]);

  useEffect(() => {
    if (isHovered && !userData && userId) {
      let isMounted = true;
      setLoading(true);

      const fetchTargetUser = async () => {
        try {
          const res = await userService.getUserProfile(userId); // 👈 fixed
          if (isMounted) setUserData(res); // 👈 fixed
        } catch (err) {
          console.error("UserHoverCard Fetch Error:", err);
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      fetchTargetUser();
      return () => {
        isMounted = false;
      };
    }
  }, [isHovered, userData, userId]);

  if (!isHovered) return null;

  const cardContent = (
    <div
      style={{
        position: "absolute",
        top: `${coords.top}px`,
        left: `${coords.left}px`,
      }}
      className="z-[9999] w-72 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl transition-all duration-200 pointer-events-auto animate-in fade-in zoom-in-95"
    >
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-700 border-t-transparent" />
        </div>
      ) : userData ? (
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <ProfileAvatar
              src={userData.avatar?.url}
              alt={userData.name}
              size="sm"
              verified={userData.isVerified}
              position={userData.avatar?.position}
            />
            <Link
              to={`/profile/${userData.username}`}
              className="rounded-lg bg-amber-700/10 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-700/20 transition-colors"
            >
              View Profile
            </Link>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 leading-tight">{userData.name}</h4>
            <p className="text-xs text-gray-500 mt-0.5">@{userData.username}</p>
          </div>

          {userData.bio && (
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {userData.bio}
            </p>
          )}

          <div className="flex items-center gap-4 pt-2.5 border-t border-gray-100 text-xs text-gray-500">
            <div>
              <span className="font-bold text-gray-800">
                {userData.stats?.postsCount ?? 0}
              </span>{" "}
              Articles
            </div>
            <div>
              <span className="font-bold text-gray-800">
                {userData.stats?.viewsCount ?? 0}
              </span>{" "}
              Views
            </div>
          </div>
        </div>
      ) : (
        <div className="text-xs text-gray-400 text-center py-2">
          User info unavailable
        </div>
      )}
    </div>
  );

  return ReactDOM.createPortal(cardContent, document.body);
};

export default UserHoverCard;