import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

const HomePage = () => {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = 42183;
    const duration = 2000;
    const stepTime = Math.max(Math.floor(duration / end), 1);

    const counter = setInterval(() => {
      start += Math.floor(end / (duration / stepTime));
      if (start >= end) {
        start = end;
        clearInterval(counter);
      }
      setUserCount(start.toLocaleString());
    }, stepTime);
  }, []);

  return (
    <div className="bg-zinc-900 text-zinc-100 min-h-screen font-sans">

      {/* Hero Section */}
      <section className="w-full flex flex-col md:flex-row items-center justify-between px-8 py-16 bg-gradient-to-r from-zinc-800 to-zinc-900">
        <div className="w-full md:w-1/2 mb-12 md:mb-0 md:pr-12">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Lost Something? <br /> Let the World Help You Find It.
          </h1>
          <p className="text-zinc-400 text-lg mb-6">
            A secure, community-powered way to report and recover lost items — fast, easy, and trusted.
          </p>
          <Button variant='outline' className="px-6 py-3 text-black rounded-lg ">
            Report or Find an Item
          </Button>
        </div>
        <div className="w-full md:w-1/2">
          <img
            src="https://media.istockphoto.com/id/2154680707/photo/portrait-of-a-funny-curious-cat-scottish-straight-looking-through-a-magnifying-glass-isolated.jpg?s=2048x2048&w=is&k=20&c=8d0yMIeRg2NnbCC52qjuhVjzzlWedwi4xrABa6vcsas="
            alt="Lost and Found Illustration"
            className="w-full h-96 rounded-xl shadow-2xl"
          />
        </div>
      </section>

      {/* User Count Section */}
      <section className="bg-zinc-800 py-12 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-3">
            <span className="text-indigo-400 font-bold">{userCount}+</span> Items Reported & Tracked
          </h2>
          <p className="text-zinc-400">
            Join thousands of users contributing to the largest lost & found network.
          </p>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 px-6 bg-zinc-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Who We Are</h2>
          <p className="text-lg text-zinc-400 mb-6">
            We’re on a mission to reunite people with their lost belongings.
            Whether it’s a misplaced phone, a dropped wallet, or a cherished keepsake, our platform connects finders and owners in minutes.
          </p>
          <p className="text-lg text-zinc-400">
            Built on trust, speed, and visibility — our community grows stronger every day, helping others feel supported when it matters most.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
