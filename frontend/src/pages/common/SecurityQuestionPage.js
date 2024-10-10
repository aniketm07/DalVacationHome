import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { API_URL } from "../../constants/constants";
import logo from "../../assets/images/logos/logo-no-background-invert.png";
import backgroundImage from "../../assets/images/background.jpg";
import Loader from "../../components/Loader";
import { useRequireAuth } from "../../lib/useRequireAuth";
import ChatComponent from "../../components/ChatComponent";

const SecurityQuestionPage = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { question, email } = location.state || {};
  const [answer, setAnswer] = useState("");
  const [loader, setLoader] = useState(false);
  const [roleState] = useState(role || location.state?.role);

  useRequireAuth(["question", "email"], role);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);
    try {
      const response = await axios.post(
        `${API_URL}/auth/security`,
        {
          email,
          securityAnswer: answer,
          role: roleState
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data.status === "success") {
        navigate(role === "AGENT" ? "/agent/cipher" : "/cipher", { state: { email, role } });
      } else {
        toast.error("Verification failed: " + response.data.message);
      }
    } catch (error) {
      toast.error("Verification failed: " + error.message);
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
                alt="DALVacationHome Logo"
                src={logo}
                className="mx-auto h-24 w-auto"
              />
              <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Welcome Back
              </h2>
              <p className="mt-1 text-center text-sm text-gray-600">
                Complete the security question
              </p>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <label
                  htmlFor="answer"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {question}
                </label>
                <div className="mt-2">
                  <input
                    id="answer"
                    name="answer"
                    type="answer"
                    required
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="block w-full rounded-md border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Continue
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

export default SecurityQuestionPage;