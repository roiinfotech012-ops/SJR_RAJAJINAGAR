import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Quote, ChevronDown, ChevronUp, User, GraduationCap, HeartHandshake } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getPublicContent, type AdminContentItem } from "@/lib/api";
import { mergeTestimonialItems, type TestimonialDisplayItem } from "@/lib/testimonialContent";
import { Button } from "@/components/ui/button";

const TestimonialCard = ({ t, i }: { t: TestimonialDisplayItem; i: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isKannada = t.language === "kn";
  const quoteParagraphs = t.quote.split("\n\n").filter(Boolean);
  const previewText = quoteParagraphs[0];
  const hasMore = quoteParagraphs.length > 1 || t.quote.length > 210 || Boolean(t.subheadings?.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.25) }}
      className="h-full flex"
    >
      <Card className="group w-full bg-white rounded-2xl border border-border/70 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
        {/* Top brand gradient line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indian-green via-saffron-orange to-indian-green" />

        <CardContent className="p-5 md:p-6 flex flex-col flex-1 justify-between">
          <div>
            {/* Header: Photo, Name, Badge, Attribution */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="relative flex-shrink-0">
                <div className="h-13 w-13 md:h-14 md:w-14 rounded-full p-[2px] bg-gradient-to-tr from-indian-green to-saffron-orange shadow-sm">
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
                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                  <h3
                    className={`font-bold text-school-brown text-base md:text-[17px] leading-tight ${
                      isKannada ? "font-kannada" : ""
                    }`}
                  >
                    {t.name}
                  </h3>
                  {t.className && (
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indian-green/10 text-indian-green border border-indian-green/20">
                      <GraduationCap className="h-3 w-3" />
                      {t.className}
                    </span>
                  )}
                </div>

                {t.childName && (
                  <p className="text-[12px] text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
                    <User className="h-3 w-3 text-saffron-orange flex-shrink-0" />
                    <span className="truncate">
                      Parent of <strong className="text-foreground/80 font-medium">{t.childName}</strong>
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Quote Body */}
            <div
              className={`relative text-foreground/80 leading-relaxed text-[13.5px] md:text-[14px] pt-3 border-t border-border/40 ${
                isKannada ? "font-kannada leading-loose" : ""
              }`}
              lang={t.language || "en"}
            >
              <Quote className="h-3.5 w-3.5 text-indian-green/50 mb-1.5 inline-block mr-1" />

              {!isExpanded ? (
                <p
                  className="italic text-foreground/80"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: "5.5rem",
                  }}
                >
                  "{previewText}"
                </p>
              ) : (
                <div className="space-y-3 italic text-foreground/90">
                  {t.subheadings && t.subheadings.length > 0 ? (
                    <div className="space-y-3 not-italic">
                      <p className="italic">"{previewText}"</p>
                      {t.subheadings.map((sub, sIdx) => (
                        <div key={sIdx} className="bg-slate-50 p-2.5 rounded-lg border-l-2 border-indian-green text-[13px]">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-school-brown mb-0.5">
                            {sub.title}
                          </h4>
                          <p className="text-foreground/80 leading-relaxed italic">
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

          {/* Action: Expand / Collapse Toggle button */}
          <div className="mt-3 pt-2.5 border-t border-border/30 flex justify-end min-h-[36px] items-center">
            {hasMore ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[11.5px] font-semibold text-indian-green hover:text-indian-green/80 hover:bg-indian-green/10 h-7 px-2 gap-1"
                aria-expanded={isExpanded}
              >
                {isExpanded ? (
                  <>
                    Show Less <ChevronUp className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    Read Full Testimonial <ChevronDown className="h-3 w-3" />
                  </>
                )}
              </Button>
            ) : (
              <span className="text-[11px] text-muted-foreground/60 italic">Verified SJR Parent</span>
            )}
          </div>
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
      <section className="py-12 bg-gradient-to-b from-white via-slate-50/50 to-muted/20 border-b border-border/40">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 bg-indian-green/10 text-indian-green px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <HeartHandshake className="h-4 w-4 text-indian-green" />
            Voices of Our Parents
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-school-brown mb-3 tracking-tight">
            Partners in <span className="text-indian-green">Learning</span> & <span className="text-saffron-orange">Growth</span>
          </h2>
          <div className="mx-auto h-1 w-16 bg-indian-green rounded-full mb-4" />
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            The experiences shared by our parents reflect our shared dedication to academic excellence,
            moral values, discipline, and the joyful holistic development of every child at SJR Public School, Rajajinagar.
          </p>
        </div>
      </section>

      {/* Testimonials 18 Grid */}
      <section className="py-12 md:py-16 bg-slate-50/40 min-h-[500px]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
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
