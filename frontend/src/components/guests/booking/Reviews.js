import React from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import Default from "../../../assets/images/Default.png";
import NeutralFace from "../../../assets/images/neutral-face.svg";
import { getSession } from "../../../lib/session";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Reviews({ reviews, setOpenModal }) {
  const isLoggedIn = getSession() !== undefined;

  function formatDate(milliseconds) {
    if (!milliseconds) return "Invalid Date";
    const date = new Date(Number(milliseconds));
    if (isNaN(date)) return "Invalid Date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  return (
    <div className="mx-auto mt-16 w-full max-w-2xl lg:col-span-4 lg:mt-0 lg:max-w-none">
      <div className="flex flex-row mb-4 justify-between items-center">
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-gray-900">Customer reviews</h3>
          <p className="text-sm text-gray-500 justify-between">
            Your reviews are important to us
          </p>
        </div>
        {isLoggedIn && (
          <button
            type="button"
            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700 transition-all ease-in-out duration-300"
            onClick={() => setOpenModal(true)}
          >
            Add review
          </button>
        )}
      </div>
      {reviews?.map((review, reviewIdx) => (
        <div
          key={review.id}
          className="flex space-x-4 pr-2 text-sm text-gray-500 hover:bg-gray-50 hover:border-gray-50 hover:rounded-lg transition-all ease-in-out duration-300"
        >
          <div className="flex-none py-10"></div>
          <div
            className={classNames(
              reviewIdx === 0 ? "" : "border-t border-gray-200",
              "py-10"
            )}
          >
            <div className="flex justify-between">
              <div className="flex items-center space-x-3">
                <img
                  alt=""
                  src={Default}
                  className="h-10 w-10 rounded-full bg-gray-100"
                />
                <div className="flex flex-col">
                  <h3 className="font-small ml-1 text-gray-900">
                    {review.name}
                  </h3>
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        aria-hidden="true"
                        className={classNames(
                          review.rating > rating
                            ? "text-yellow-400"
                            : "text-gray-300",
                          "h-5 w-5 flex-shrink-0"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end justify-end">
                {review.sentimentScore > 0.65 && (
                  <div className="relative group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.0}
                      stroke="green"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                      />
                    </svg>
                    <span className="absolute left-0 w-auto p-2 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Score: {review.sentimentScore}
                    </span>
                  </div>
                )}
                {review.sentimentScore <= 0.65 &&
                  review.sentimentScore >= 0.3 && (
                    <div className="relative group">
                      <img src={NeutralFace} className="size-6" alt="Neutral face" />
                      <span className="absolute left-0 w-auto p-2 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Score: {review.sentimentScore}
                      </span>
                    </div>
                  )}
                {review.sentimentScore < 0.3 && (
                  <div className="relative group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.0}
                      stroke="red"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                      />
                    </svg>
                    <span className="absolute left-0 w-auto p-2 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Score: {review.sentimentScore}
                    </span>
                  </div>
                )}
                <p className="text-gray-500 font-small">
                  {formatDate(review.date)}
                </p>
              </div>
            </div>
            <p className="mt-4 font-semibold text-black">{review.title}</p>
            <p className="mt-2 text-gray-500">{review.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Reviews;
