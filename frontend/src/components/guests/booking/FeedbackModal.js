import React, { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { StarIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { API_URL } from "../../../constants/constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSession, getEmail } from "../../../lib/session";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function FeedbackModal({ open, setOpen, roomId }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const token = getSession();

  const handleSubmit = async () => {
    const date = new Date().getTime();
    const email = await getEmail();
    // Handle form submission
    axios
      .post(
        `${API_URL}/api/feedback`,
        {
          rating,
          title,
          description,
          roomId,
          email,
          date
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          toast.success("Feedback submitted successfully");
          setTimeout(() => {
            setOpen(false);
          }, 3000);
        }
      })
      .catch((error) => {
        toast.error("Error submitting feedback");
      });
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-85 transition-opacity"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto ">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
          >
            <DialogTitle
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              Submit your review
            </DialogTitle>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Your review is valuable to us. Please share your feedback.
              </p>
            </div>
            <div className="mt-5 sm:mt-6">
              <form className="w-full">
                <div className="overflow-hidden p-4 rounded-lg border border-gray-300 shadow-sm">
                  <label htmlFor="title" className="sr-only">
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Title"
                    className="block w-full border-0 pt-2.5 text-lg font-medium placeholder:text-gray-400 focus:ring-0 focus:outline-none"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label htmlFor="description" className="sr-only">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={2}
                    placeholder="Write a description..."
                    className="block w-full h-64 mt-3 resize-none border-0 py-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6"
                    defaultValue={""}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <div className="flex gap-28 mt-5 sm:mt-6">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <StarIcon
                          key={index}
                          onClick={() => setRating(index + 1)}
                          onMouseEnter={() => setHoverRating(index + 1)}
                          onMouseLeave={() => setHoverRating(0)}
                          className={classNames(
                            (hoverRating || rating) > index
                              ? "text-yellow-400"
                              : "text-gray-300",
                            "h-7 w-7 flex-shrink-0 cursor-pointer transition ease-in-out duration-300"
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <div className="flex flex-1 gap-4 justify-between">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="inline-flex w-full justify-center rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-500 hover:text-white transition ease-in-out duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition ease-in-out duration-200"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </DialogPanel>
        </div>
      </div>
      <ToastContainer />
    </Dialog>
  );
}
