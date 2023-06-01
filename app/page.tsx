'use client';

import Navbar from "./components/navbar";

export default function Home() {
  return (
    <div className="w-screen h-screen px-10 bg-cream bg-opacity-10 text-2xl font-['Satoshi_Medium']">
      <Navbar mode="home"/>
    </div>
  )
}