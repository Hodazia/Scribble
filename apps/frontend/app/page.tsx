import Header from "@/component/Landing/Header";
import Hero from "@/component/Landing/Hero";
import Features from "@/component/Landing/Features";
import HowItWorks from "@/component/Landing/HowItWorks";
import CallToAction from "@/component/Landing/CalltoAction";

export default function Home() {
  return (
   <>
   <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <div id="features">
          <Features />
        </div>
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <CallToAction />
      </main>
    </div>
   </>
  );
}
