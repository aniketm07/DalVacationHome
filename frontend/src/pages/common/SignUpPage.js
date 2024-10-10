import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { API_URL, options } from "../../constants/constants";
import logo from "../../assets/images/logos/logo-no-background-invert.png";
import backgroundImage from "../../assets/images/background.jpg";
import vacationImage from "../../assets/images/vacation.png";
import agentVacationImage from "../../assets/images/agent-vacation.png";
import { checkAlreadyLoggedIn, getRole } from "../../lib/session";
import ChatComponent from "../../components/ChatComponent";

const SignUpPage = ({ role }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [ceasarCipherKey, setCeasarCipherKey] = useState("");
  const [roleState] = useState(role || getRole());
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/auth/registeration`,
        {
          email,
          password,
          securityQuestion,
          securityAnswer,
          firstName,
          lastName,
          role: roleState,
          ceasarCipherKey,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Sign up successful! Welcome to our platform! You will be redirected to the login page.");
        console.log(`roleState: ${roleState}`)
        setTimeout(() => {
          console.log(`inside roleState: ${roleState}`)
          navigate(roleState === "GUEST" ? "/login" : "/agent/login" , { state: { role: roleState } });
        }, 4000);

      } else {
        toast.error(`Sign up failed! ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      // toast.error(`Sign up failed! ${error.response.data.message}`);
    }
  };
  useEffect(() => {
    if(checkAlreadyLoggedIn()) {
      if(role === "AGENT") {
        navigate("/agent/dashboard");
      }
      navigate("/rooms");
    }
  }, [navigate, roleState, role]);

  const getRoleSpecificText = () => {
    if (roleState === "AGENT") {
      return "Join DALVacationHome as an agent and gain access to a vast network of vacation properties to manage and promote. Enhance your career with exclusive tools, resources, and opportunities to connect with clients looking for their next dream getaway.";
    } else if (roleState === "GUEST") {
      return "Join DALVacationHome today and unlock access to the finest vacation homes at your fingertips. Signing up is quick and easy. Start your journey to unforgettable stays, exclusive member deals, and personalized recommendations tailored just for you. Create an account now to begin exploring your next dream getaway!";
    } else {
      return "";
    }
  };

  return (
    <>
      <div
        className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-5xl">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="flex flex-col md:flex-row">
              <div className="flex flex-col justify-center md:w-1/2 p-4 md:p-8">
                <img alt="Vacation" src={roleState === "AGENT" ? agentVacationImage : vacationImage} className="mx-auto scale-90 md:scale-100" />
                <p className="mt-4 text-center text-base leading-relaxed text-gray-700">
                  {getRoleSpecificText()}
                </p>
              </div>
              <div className="md:w-1/2 p-4 md:p-8">
                <img alt="DalVacationHome Logo" src={logo} className="h-24 w-24 mx-auto" />
                <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                  Create an Account
                </h2>
                <p className="mt-1 text-center text-sm text-gray-600">
                  Sign up to get started
                </p>
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        First Name
                      </label>
                      <div className="mt-2">
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="block w-full rounded-md border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Last Name
                      </label>
                      <div className="mt-2">
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="block w-full rounded-md border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full rounded-md border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Password
                      </label>
                      <div className="mt-2">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          required
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="block w-full rounded-md border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Confirm Password
                      </label>
                      <div className="mt-2">
                        <input
                          id="confirm-password"
                          name="confirm-password"
                          type="password"
                          required
                          autoComplete="current-password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="block w-full rounded-md border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="security-question"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Security Question
                    </label>
                    <div className="mt-2">
                      <select
                        id="security-question"
                        name="security-question"
                        required
                        value={securityQuestion}
                        onChange={(e) => setSecurityQuestion(e.target.value)}
                        className="block w-full rounded-md border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6"
                      >
                        <option value="">Select a security question</option>
                        {options.map((option) => (
                          <option key={option.id} value={option.question}>
                            {option.question}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="security-answer"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Security Answer
                    </label>
                    <div className="mt-2">
                      <input
                        id="security-answer"
                        name="security-answer"
                        type="text"
                        required
                        value={securityAnswer}
                        onChange={(e) => setSecurityAnswer(e.target.value)}
                        className="block w-full rounded-md border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="caesar-cipher-key"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Caesar Cipher Key
                    </label>
                    <div className="mt-2">
                      <input
                        id="caesar-cipher-key"
                        name="caesar-cipher-key"
                        type="number"
                        required
                        value={ceasarCipherKey}
                        onChange={(e) => setCeasarCipherKey(e.target.value)}
                        className="block w-full rounded-md border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
                <p className="mt-10 text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link
                    to={{
                      pathname: role==="GUEST" ? "/login" : "/agent/login",
                      state: { role: roleState },
                    }}
                    className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <ChatComponent />
    </>
  );
};

export default SignUpPage;