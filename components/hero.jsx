"use client";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

const HeroSection = () => {
  const imageRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;
      if (scrollPosition > scrollThreshold) {
        imageRef.current.classList.add("scrolled");
      } else {
        imageRef.current.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <section className="w-full pt-36 md:pt-48 pb-10">
      <div className="space-y-6 text-center">
        <div className="space-y-4 mx-auto">
          <h1 className="text-5xl gradient-title font-bold md:text-6xl lg:text-7xl  xl:text-8xl ">
            Your AI Career Coach <br /> for Professional Success
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg">
            Advance your career with personalized guidance, interview prep, and
            AI-powered tools for job success.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Link href="/onboarding">
            <Button className={"px-8"} size={"lg"}>
              Get Started
            </Button>
          </Link>
          <Link href="https://fullstack-portfolio-main.netlify.app">
            <Button variant={"outline"} className={"px-8"} size={"lg"}>
              About Me
            </Button>
          </Link>
        </div>

        <div className="hero-image-wrapper mt-5 md:mt-0 overflow-hidden">
          <div ref={imageRef} className="hero-image ">
            <Image
              draggable={false}
              priority
              className="rounded-lg shadow-2xl border mx-auto"
              src={"/banner.jpeg"}
              alt="banner image"
              width={1280}
              height={720}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
