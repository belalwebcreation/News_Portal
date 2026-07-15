import { NavLink } from "react-router-dom";
import { categories } from "./data";

import SearchBox from "./SearchBox";
import EPaperButton from "./EPaperButton";
import LanguageSwitcher from "./LanguageSwitcher";
import LoginButton from "./LoginButton";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-y border-gray-200 shadow-sm">

      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between h-16">

          {/* Left */}

          <div className="hidden lg:flex items-center">

            {categories.map((category) => (

              <NavLink
                key={category.id}
                to={category.slug}
                className={({ isActive }) =>
                  `relative px-4 h-16 flex items-center text-[15px] font-medium transition-all duration-300
                  ${
                    isActive
                      ? "text-red-700"
                      : "text-gray-800 hover:text-red-700"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {category.name}

                    <span
                      className={`
                      absolute
                      bottom-0
                      left-0
                      h-[3px]
                      bg-red-700
                      transition-all
                      duration-300
                      ${
                        isActive
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }
                    `}
                    ></span>
                  </>
                )}
              </NavLink>

            ))}

          </div>

          {/* Right */}

          <div className="flex items-center gap-3 ml-auto">

            <SearchBox />

            <EPaperButton />

            <LanguageSwitcher />

            <LoginButton />

            <MobileMenu />

          </div>

        </div>

      </div>

    </nav>
  );
};

export default Navbar;