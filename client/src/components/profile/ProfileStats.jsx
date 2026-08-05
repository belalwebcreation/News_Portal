import {
  Newspaper,
  Eye,
  Bookmark,
  MessageCircle,
  Heart,
  Share2,
  TrendingUp,
  Clock3,
} from "lucide-react";

const StatCard = ({
  icon: Icon,
  title,
  value,
  color = "text-primary",
}) => (
  <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
    <div className="card-body p-5">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-base-content/60">
            {title}
          </p>

          <h3 className="text-3xl font-bold mt-2">
            {value}
          </h3>
        </div>

        <div
          className={`w-14 h-14 rounded-full bg-base-200 flex items-center justify-center ${color}`}
        >
          <Icon size={26} />
        </div>

      </div>

    </div>
  </div>
);

const ProfileStats = ({ profile }) => {
  const stats = profile?.stats || {};

  const statItems = [
    {
      title: "Published News",
      value: stats.totalNews ?? 0,
      icon: Newspaper,
      color: "text-primary",
    },
    {
      title: "Total Views",
      value: stats.totalViews ?? 0,
      icon: Eye,
      color: "text-info",
    },
    {
      title: "Saved News",
      value: stats.savedNews ?? 0,
      icon: Bookmark,
      color: "text-warning",
    },
    {
      title: "Comments",
      value: stats.comments ?? 0,
      icon: MessageCircle,
      color: "text-success",
    },
    {
      title: "Likes",
      value: stats.likes ?? 0,
      icon: Heart,
      color: "text-error",
    },
    {
      title: "Shares",
      value: stats.shares ?? 0,
      icon: Share2,
      color: "text-secondary",
    },
    {
      title: "Profile Visits",
      value: stats.profileViews ?? 0,
      icon: TrendingUp,
      color: "text-accent",
    },
    {
      title: "Reading Time",
      value: `${stats.readingHours ?? 0}h`,
      icon: Clock3,
      color: "text-primary",
    },
  ];

  return (
    <section className="space-y-5">

      <div>

        <h2 className="text-2xl font-bold">
          Statistics
        </h2>

        <p className="text-base-content/60 mt-1">
          Your activity summary across the news portal.
        </p>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {statItems.map((item) => (
          <StatCard
            key={item.title}
            {...item}
          />
        ))}

      </div>

    </section>
  );
};

export default ProfileStats;