
import backgroundImage from "../../assets/images/landing-background.png";
import { useNavigate } from "react-router-dom";
import ChatComponent from "../../components/ChatComponent";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {features} from "../../constants/landing_constants";

export default function Landing() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };
  return (
    <div>
      <Header />

      <main className="mb-32 sm:mb-56">
        {/* Hero section */}
        <div className="relative min-h-screen isolate overflow-hidden bg-gray-900 pb-16 pt-14 sm:pb-20">
          <img
            src={backgroundImage}
            alt=""
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl mt-12 py-20">
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                  DalVacationHome
                </h1>
                <h3 className="text-xl mt-2 tracking-tight text-white">
                  Your Dream Vacation Starts Here
                </h3>
                <p className="mt-6 text-md leading-8 text-gray-300">
                  Discover your ideal getaway with DALVacationHome, where luxury
                  meets convenience. Our platform offers a seamless experience
                  for booking the perfect vacation home, whether you're planning
                  a weekend retreat or an extended stay. Explore a wide range of
                  beautiful properties, check real-time availability, and make
                  reservations with ease.
                </p>

                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <p
                    onClick={handleGetStarted}
                    className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 hover:cursor-pointer"
                  >
                    Get started
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>

        {/* Feature section */}
        <div id="#features" className="mt-32 sm:mt-56">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">
                Your Perfect Getaway Awaits
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Looking for a Vacation Home?
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Sign up today and discover the comfort and convenience of
                booking your ideal vacation home with DALVacationHome!
              </p>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-7xl px-6 lg:px-8">
            <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-9">
                  <dt className="inline font-semibold text-gray-900">
                    {feature.name}
                  </dt>{" "}
                  <dd className="inline">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
      
      <ChatComponent />
    </div>
  );
}