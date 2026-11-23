import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, MessageCircle, ChevronDown, ChevronUp, User, GraduationCap, HeartHandshake } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getPublicContent, type AdminContentItem } from "@/lib/api";
import { mergeTestimonialItems, type TestimonialDisplayItem } from "@/lib/testimonialContent";
import { Button } from "@/components/ui/button";

const TestimonialCard = ({ t, i }: { t: TestimonialDisplayItem; i: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isKannada = t.language === "kn";
  const quoteParagraphs = t.quote.split("\n\n").filter(Boolean);
  const previewText = quoteParagraphs[0];
  const hasMore = quoteParagraphs.length > 1 || t.quote.length > 220;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3) }}
      className="h-full flex"
    >
      <Card className="group w-full bg-white rounded-2xl border border-border/70 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
        {/* Top color accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indian-green via-saffron-orange to-indian-green" />

        <CardContent className="p-6 md:p-7 flex flex-col flex-1 justify-between">
          <div>
            {/* Header with Photo, Names, Class Badge */}
            <div className="flex items-start gap-4 mb-5">
              <div className="relative flex-shrink-0">
                <div className="h-16 w-16 rounded-full p-[2px] bg-gradient-to-tr from-indian-green to-saffron-orange shadow-md">
                  <img
                    src={t.image}
                    alt={t.imageAlt || `Portrait of parent ${t.name}`}
                    loading="lazy"
                    className="h-full w-full rounded-full object-cover object-top bg-muted"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3
                    className={`font-bold text-school-brown text-base md:text-lg leading-snug ${
                      isKannada ? "font-kannada" : ""
                    }`}
                  >
                    {t.name}
                  </h3>
                  {t.className && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-indian-green/10 text-indian-green border border-indian-green/20">
                      <GraduationCap className="h-3 w-3" />
                      {t.className}
                    </span>
                  )}
                </div>

                {t.childName && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <User className="h-3 w-3 text-saffron-orange" />
                    <span>Parent of <strong className="text-foreground/80 font-medium">{t.childName}</strong></span>
                  </p>
                )}
              </div>
            </div>

            {/* Quote Body */}
            <div
              className={`relative text-foreground/85 leading-relaxed text-[14px] md:text-[15px] pt-1 border-t border-border/50 ${
                isKannada ? "font-kannada leading-loose" : ""
              }`}
              lang={t.language || "en"}
            >
              <Quote className="h-4 w-4 text-indian-green/40 mb-2 inline-block mr-1.5" />
              
              {!isExpanded ? (
                <div>
                  <p className="line-clamp-4 italic text-foreground/80">
                    "{previewText}"
                  </p>
                </div>
              ) : (
                <div className="space-y-3 italic text-foreground/90">
                  {t.subheadings && t.subheadings.length > 0 ? (
                    <div className="space-y-3.5 not-italic">
                      <p className="italic">"{previewText}"</p>
                      {t.subheadings.map((sub, sIdx) => (
                        <div key={sIdx} className="bg-slate-50/80 p-3 rounded-lg border-l-2 border-indian-green">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-school-brown mb-1">
                            {sub.title}
                          </h4>
                          <p className="text-xs md:text-sm text-foreground/80 leading-relaxed italic">
                            {sub.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    quoteParagraphs.map((para, pIdx) => (
                      <p key={pIdx}>"{para}"</p>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Expand / Collapse Action */}
          {hasMore && (
            <div className="mt-4 pt-3 border-t border-border/40 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-semibold text-indian-green hover:text-indian-green/80 hover:bg-indian-green/10 h-8 px-2.5 gap-1"
                aria-expanded={isExpanded}
              >
                {isExpanded ? (
                  <>
                    Show Less <ChevronUp className="h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    Read Full Testimonial <ChevronDown className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Testimonials = () => {
  const [adminTestimonials, setAdminTestimonials] = useState<AdminContentItem[]>([]);

  useEffect(() => {
    getPublicContent("testimonial")
      .then((result) => setAdminTestimonials(result.items))
      .catch(() => setAdminTestimonials([]));
  }, []);

  const testimonials = useMemo(() => mergeTestimonialItems(adminTestimonials), [adminTestimonials]);

  return (
    <Layout>
      <PageHero
        title="Student & Parent Testimonials"
        subtitle="Hear from our school community about learning, growth, and life at SJR Public School, Rajajinagar."
        breadcrumbs={[{ label: "Life @ SJRPS-Rajajinagar" }, { label: "Testimonials" }]}
      />

      {/* Intro Banner */}
      <section className="py-14 bg-gradient-to-b from-white via-slate-50/50 to-muted/20 border-b border-border/40">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 bg-indian-green/10 text-indian-green px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <HeartHandshake className="h-4 w-4 text-indian-green" />
            Voices of Our Parents
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-school-brown mb-4 tracking-tight">
            Partners in <span className="text-indian-green">Learning</span> & <span className="text-saffron-orange">Growth</span>
          </h2>
          <div className="mx-auto h-1 w-16 bg-indian-green rounded-full mb-5" />
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            The experiences shared by our parents reflect our shared dedication to academic excellence,
            moral values, discipline, and the joyful holistic development of every child at SJR Public School, Rajajinagar.
          </p>
        </div>
      </section>

      {/* Testimonials 13 Grid */}
      <section className="py-16 bg-slate-50/40 min-h-[500px]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.key || t.name} t={t} i={i} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Testimonials;
