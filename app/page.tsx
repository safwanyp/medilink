'use client';

import Footer from "./components/footer";
import Process from "./components/home/how-it-works/process";
import Intro from "./components/home/intro";
import Navbar from "./components/navbar";


export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col px-32 bg-cream bg-opacity-20 text-2xl font-['Satoshi_Medium'] overflow-auto">
      <Navbar mode="home"/>
      <div className="w-full h-auto">
        <h1 className="font-cool text-dark-grey text-9xl leading-none">Bridging the information gap in healthcare.</h1>
      </div>
      <Intro />
      <Process />
      <Footer />
    </div>
  )
}