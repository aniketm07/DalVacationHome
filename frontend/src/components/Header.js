import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import logoWhite from "../assets/images/logos/logo-no-background-color.png";
import { checkAlreadyLoggedIn, removeSession } from "../lib/session";
import { useAuth } from "../components/auth/AuthContext";

function Header({ color }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { userRole } = useAuth(); // Fetching user role

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await checkAlreadyLoggedIn();
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus();
  }, []);

  const handleLogout = () => {
    removeSession();
    setIsLoggedIn(false);
    navigate("/");
  };

  const navigation = [
    { name: "Rooms", route: "/rooms" },
    { name: "Agent Login", route: "/agent/login" },
    { name: "Guest Login", route: "/login" },
  ];

  const dashboardRoute = userRole === "AGENT" ? "/agent/dashboard" : "/rooms";
  const extraLinks = [
    {
      name: userRole === "GUEST" ? "Rooms" : "Dashboard",
      route: dashboardRoute,
    },
    { name: "Chat", route: "/chat" },
    ...(userRole === "GUEST"
      ? [{ name: "My Bookings", route: "/mybookings" }]
      : []),
  ];

  const textColorClass = color ? `text-[${color}]` : "text-white";

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center">
            <img
              className="h-8 w-auto"
              src={logoWhite}
              alt="DALVacationHome Logo"
            />
            <span className={`font-bold ml-2 ${textColorClass}`}>
              DALVacationHome
            </span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {isLoggedIn ? (
            <>
              {extraLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.route}
                  className={`text-sm font-semibold leading-6 ${textColorClass} cursor-pointer`}
                >
                  {item.name}
                </Link>
              ))}
              <p
                onClick={handleLogout}
                className={`text-sm font-semibold leading-6 ${textColorClass} cursor-pointer`}
              >
                Logout
              </p>
            </>
          ) : (
            navigation.map((item) => (
              <Link
                key={item.name}
                to={item.route}
                className={`text-sm font-semibold leading-6 ${textColorClass} cursor-pointer`}
              >
                {item.name}
              </Link>
            ))
          )}
        </div>
      </nav>
      <Dialog
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {isLoggedIn ? (
                  <>
                    {extraLinks.map((item) => (
                      <Link
                        key={item.name}
                        to={item.route}
                        className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 hover:cursor-pointer`}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <p
                      onClick={handleLogout}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 hover:cursor-pointer"
                    >
                      Logout
                    </p>
                  </>
                ) : (
                  navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.route}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 hover:cursor-pointer"
                    >
                      {item.name}
                    </Link>
                  ))
                )}
              </div>
              {!isLoggedIn && (
                <div className="py-6">
                  <Link
                    to="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </Link>
                </div>
              )}
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}

export default Header;
