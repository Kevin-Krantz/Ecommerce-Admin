"use client";

import { Metadata } from "next";
import { useSession, signIn, signOut } from "next-auth/react";

export const metadata: Metadata = {
  title: "My Page Title",
};

export default function Home(): JSX.Element {
  const { data: session } = useSession();
  console.log(session, "session!?");

  if (!session) {
    return (
      <div className="bg-blue-900 w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button
            onClick={() => signIn("google")}
            className="bg-white p-2 px-4 rounded-lg"
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      logged in {session.user?.email}
      {/* <button onClick={() => signOut()}>logout</button> */}
    </div>
  );
}
