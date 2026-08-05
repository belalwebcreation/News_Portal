import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { publicProfileService } from "../services/publicProfileService"; // path মিলিয়ে নিন
import ProfileHeader from "../components/profile/ProfileHeader"; // path মিলিয়ে নিন
import ProfileInfo from "../components/profile/ProfileInfo"; // path মিলিয়ে নিন

const PublicProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await publicProfileService.getByUsername(username);
        if (!cancelled) setProfile(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "প্রোফাইল পাওয়া যায়নি।");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2 text-center px-4">
        <h2 className="text-xl font-semibold text-base-content">এই ইউজার খুঁজে পাওয়া যায়নি</h2>
        <p className="text-base-content/60 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      <ProfileHeader profile={profile} isOwnProfile={false} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileInfo profile={profile} />
      </div>
    </div>
  );
};

export default PublicProfilePage;