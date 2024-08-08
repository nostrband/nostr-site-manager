"use client";
import { HeaderOnboarding } from "@/components/HeaderOnboarding";
import { HeadIntroOnboarding } from "@/components/HeadIntroOnboarding";
import { ThemesOnboarding } from "@/components/ThemesOnboarding";
import { Benefits } from "@/components/Pages/Onboarding/components/Benefits";
import { FAQ } from "@/components/Pages/Onboarding/components/FAQ";
import { Pricing } from "@/components/Pages/Onboarding/components/Pricing";
import { Footer } from "@/components/Pages/Onboarding/components/Footer";
import { Reviews } from "./components/Reviews";
import { HeaderOnboardingScroll } from "@/components/HeaderOnboardingScroll";
import { useEffect, useRef, useState } from "react";

export const Onboarding = () => {
  const headerRef = useRef(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeaderVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0,
      },
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
    };
  }, []);

  return (
    <>
      <HeaderOnboardingScroll isHeaderVisible={isHeaderVisible} />
      <div ref={headerRef}>
        <HeaderOnboarding />
      </div>
      <HeadIntroOnboarding />
      <Benefits />
      <ThemesOnboarding />
      <Reviews />
      <FAQ />
      <Pricing />
      <Footer />
    </>
  );
};
