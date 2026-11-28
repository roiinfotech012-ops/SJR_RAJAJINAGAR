import { Button } from "@/components/ui/button";
import { ChevronRight, GraduationCap, BookOpen, Users, Trophy, Sparkles } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { getPublicContent, type AdminContentItem } from "@/lib/api";
import { defaultBannerSlides, mergeBannerItems } from "@/lib/bannerContent";

const AnimatedBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [adminBanners, setAdminBanners] = useState<AdminContentItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    getPublicContent("banner", 100)
      .then((result) => {
        if (isMounted && Array.isArray(result?.items)) {
          setAdminBanners(result.items);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const slides = useMemo(() => {
    const merged = mergeBannerItems(adminBanners).filter((b) => b.isVisible !== false);
    return merged.length > 0 ? merged : defaultBannerSlides;
  }, [adminBanners]);

  useEffect(() => {
    if (currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [currentSlide, slides.length]);

  const stats = [
    { icon: GraduationCap, label: "Students", value: "1000+" },
    { icon: BookOpen, label: "Curriculum", value: "CBSE Syllabus" },
    { icon: Users, label: "Faculty", value: "50+" },
    { icon: Trophy, label: "Alumni", value: "600+" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative w-full overflow-hidden min-h-[500px] sm:min-h-[580px] lg:min-h-0 lg:aspect-[1920/880] lg:max-h-[90vh]">
      {/* Slides with Ken Burns zoom */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className={`w-full h-full object-cover ${
                index === currentSlide ? "scale-110" : "scale-100"
              } transition-transform duration-[7000ms] ease-out`}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            {/* Layered overlays for maximum contrast and crystal-clear text readability */}
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 via-55% to-black/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/55" />
            {/* Subtle pattern */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
                backgroundSize: "26px 26px",
              }}
            />
          </div>
        ))}
      </div>

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-saffron-orange/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 w-[480px] h-[480px] rounded-full bg-indian-green/20 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center py-12 sm:py-16 lg:py-0">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* Left: copy (displayed cleanly without background box, like earlier) */}
            <div className="lg:col-span-7 text-white">
              <div
                key={currentSlide}
                className="animate-fade-in space-y-4 sm:space-y-6"
              >
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/25 shadow-lg">
                  <Sparkles className="h-3.5 w-3.5 text-saffron-orange" />
                  <span className="font-sans font-semibold text-[10px] sm:text-xs tracking-[0.2em] uppercase">
                    {slides[currentSlide].tag}
                  </span>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <p className="font-sans text-saffron-orange font-semibold text-xs sm:text-base tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                    SJR Public School • Rajajinagar
                  </p>
                  <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                    <span className="block">{slides[currentSlide].title}</span>
                    <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-saffron-orange via-golden-yellow to-saffron-orange bg-clip-text text-transparent drop-shadow-md">
                      {slides[currentSlide].subtitle}
                    </span>
                  </h1>
                </div>

                <p className="font-sans text-sm sm:text-lg lg:text-xl text-white leading-relaxed max-w-2xl line-clamp-3 sm:line-clamp-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                  {slides[currentSlide].description}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                  <Button
                    asChild
                    className="group bg-gradient-to-r from-indian-green to-indian-green/85 hover:from-indian-green/90 hover:to-indian-green text-white px-6 sm:px-8 h-11 sm:h-13 py-2.5 sm:py-3 w-full sm:w-auto sm:min-w-[170px] text-sm sm:text-base font-semibold shadow-2xl shadow-indian-green/40 hover:shadow-indian-green/60 transition-all hover:-translate-y-0.5"
                  >
                    <Link to="/about/overview" className="justify-center">
                      Discover Our School
                      <ChevronRight className="ml-1 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="group border-2 border-white/40 bg-white/10 text-white hover:bg-white hover:text-school-brown px-6 sm:px-8 h-11 sm:h-13 py-2.5 sm:py-3 w-full sm:w-auto sm:min-w-[170px] text-sm sm:text-base font-semibold backdrop-blur-md transition-all hover:-translate-y-0.5"
                  >
                    <Link to="/admissions/admissions-process" className="justify-center">
                      Apply Now
                      <ChevronRight className="ml-1 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Right: stats card with exact reference glass opacity */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="relative rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-7 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                      At A Glance
                    </p>
                    <p className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                      Excellence by Numbers
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-saffron-orange/25 border border-saffron-orange/50 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-saffron-orange" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  {stats.map((stat, i) => (
                    <div
                      key={i}
                      className="group relative rounded-2xl bg-white/10 border border-white/15 p-4 sm:p-5 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:-translate-y-1"
                    >
                      <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-saffron-orange mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-2xl sm:text-3xl font-bold text-white leading-none tracking-tight">
                        {stat.value}
                      </div>
                      <p className="text-[11px] sm:text-xs font-semibold tracking-wider text-white/85 mt-1.5 uppercase">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2.5 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentSlide
                ? "w-10 bg-saffron-orange"
                : "w-4 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default AnimatedBanner;
