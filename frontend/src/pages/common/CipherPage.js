import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { API_URL, words } from "../../constants/constants";
import logo from "../../assets/images/logos/logo-no-background-invert.png";
import backgroundImage from "../../assets/images/background.jpg";
import Loader from "../../components/Loader";
import { useRequireAuth } from "../../lib/useRequireAuth";
import { setSessionCookie } from "../../lib/session";
import { useAuth } from "../../components/auth/AuthContext";
import ChatComponent from "../../components/ChatComponent";

const CipherPage = ({ role }) => {
  const location = useLocation();
  const { email } = location.state || {};
  const [ceasarQuestion, setCeasarQuestion] = useState("");
  const [ceasarAnswer, setCeasarAnswer] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const { initializeAuth } = useAuth();
  const [roleState] = useState(role || location.state?.role);
  useRequireAuth(["email"], roleState);

  useEffect(() => {
    setCeasarQuestion(words[Math.floor(Math.random() * 100)]);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);
    try {
      const response = await axios.post(
        `${API_URL}/auth/cipher`,
        {
          email,
          ceasarQuestion,
          ceasarAnswer,
          role: roleState
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data.status === "success") {
        setLoader(false);
        toast.success("Verification successful! You will be redirected to the dashboard.");
        await setSessionCookie(response.data.user.token);
        console.log(`role: ${role}`);
        await initializeAuth();
        setTimeout(() => {
          console.log(`inside timeout role: ${role}`);
          console.log(role === "AGENT" ? "/agent/dashboard" : "/rooms");
          navigate(role === "AGENT" ? "/agent/dashboard" : "/rooms");
        }, 3000);
      } else {
        toast.error("Verification failed: " + response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Verification failed ");
      console.error("Verification failed: ", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <div
        className="flex min-h-screen flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <img
                alt="Your Company"
                src={logo}
                className="mx-auto h-24 w-auto"
              />
              <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Welcome Back
              </h2>
              <p className="mt-1 text-center text-sm text-gray-600">
                Complete the Cipher verification
              </p>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <label
                  htmlFor="ceasarQuestion"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {ceasarQuestion}
                </label>
                <div className="mt-2">
                  <input
                    id="ceasarAnswer"
                    name="ceasarAnswer"
                    type="ceasarAnswer"
                    required
                    value={ceasarAnswer}
                    onChange={(e) => setCeasarAnswer(e.target.value)}
                    className="block w-full rounded-md border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
      <ChatComponent />
      {loader && <Loader />}
    </>
  );
};

export default CipherPage;
