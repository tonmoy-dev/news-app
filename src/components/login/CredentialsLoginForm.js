"use client";

import { doCredentialLogin } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const CredentialsLoginForm = () => {
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(event) {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      const response = await doCredentialLogin(formData);

      if (response && response.error) {
        console.error(response.error);
        // setError(response.error);  
        toast.error("Login failed! Check your credentials");
      } else {
        // Handle successful login (e.g., redirect)
        toast.success("Logged in successfully!");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed! Check your credentials");
    }
  }


  return (
    <form
      className="flex flex-col gap-4 px-0 py-4"
      onSubmit={onSubmit}>
      <div className="space-y-1">
        <label htmlFor="email text-gray-700">Email Address</label>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="font-medium text-2xl text-gray-600 absolute p-2.5 px-3 w-11"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
          />
        </svg>
        <input
          className="py-2 pl-10 border border-gray-200 w-full rounded-md"
          placeholder="Enter Email address"
          type="email" name="email" id="email" />
      </div>

      <div className="space-y-1">
        <label htmlFor="password text-gray-700">Password</label>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="font-medium text-2xl text-gray-600 absolute p-2.5 px-3 w-11"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <input
          className="py-2 pl-10 border border-gray-200 w-full rounded-md"
          placeholder="Enter Password"
          type="password" name="password" id="password" />
      </div>

      <button type="submit" className="border bg-[#1091ff] text-white duration-100 ease-in-out w-6/12 text-white flex flex-row justify-center items-center gap-1 w-full p-2 rounded-md">
        Login
      </button>
    </form>
  );
};

export default CredentialsLoginForm;