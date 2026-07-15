import { Link } from "react-router-dom";
import { topHeadlines } from "./data";
import Logo from "./Logo";

const TopHeader = () => {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-5">

        <div className="grid grid-cols-12 gap-8 items-center">

          {/* Logo */}
          <div className="col-span-12 lg:col-span-4">
            <div className="block">
                   <Logo />
              </div>
          </div>

          {/* Top Headlines */}
          <div className="col-span-12 lg:col-span-8">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {topHeadlines.map((news) => (
                <Link
                  key={news.id}
                  to={news.slug}
                  className="group flex gap-3"
                >
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-28 h-20 rounded-md object-cover shrink-0"
                  />

                  <div>
                    <h3 className="text-[15px] font-medium leading-6 text-gray-800 group-hover:text-red-700 transition-colors duration-300">
                      {news.title}
                    </h3>
                  </div>
                </Link>
              ))}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default TopHeader;