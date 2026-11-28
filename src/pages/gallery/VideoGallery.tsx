import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Sparkles, Video as VideoIcon, Images, Play, Calendar, Film } from "lucide-react";
import { useEffect, useState, useMemo, useRef } from "react";
import { getPublicContent } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export type Video = {
  id: string;
  youtubeId?: string;
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  date?: string;
  videoUrl?: string;
  thumbnail?: string;
  isDirectVideo?: boolean;
};

export const defaultVideos: Video[] = [
  {
    id: "sjrps-rajajinagar-campus-film",
    title: "SJR Public School, Rajajinagar — Campus Tour & Highlights",
    description: "Experience our state-of-the-art campus, dedicated faculty, and dynamic student life at SJR Public School, Rajajinagar.",
    category: "Campus & Activities",
    categorySlug: "campus",
    date: "14/10/2026",
    videoUrl: "/videos/sjrps-rajajinagar.mp4",
    thumbnail: "/images/Photos/School Building/school-building-main-gate.jpg",
    isDirectVideo: true,
  },
];

export const videos = defaultVideos;

function getYoutubeId(value: unknown): string {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return "";
  const watchMatch = text.match(/[?&]v=([^&]+)/);
  const shortMatch = text.match(/youtu\.be\/([^?&]+)/);
  const embedMatch = text.match(/youtube\.com\/embed\/([^?&]+)/);
  const liveMatch = text.match(/youtube\.com\/live\/([^?&]+)/);
  const shortsMatch = text.match(/youtube\.com\/shorts\/([^?&]+)/);
  const directId = /^[a-zA-Z0-9_-]{11}$/.test(text) ? text : "";
  return watchMatch?.[1] || shortMatch?.[1] || embedMatch?.[1] || liveMatch?.[1] || shortsMatch?.[1] || directId || "";
}

const VideoGallery = () => {
  const [adminVideos, setAdminVideos] = useState<Video[] | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPublicContent("video")
      .then((result) => {
        if (result && result.items && result.items.length > 0) {
          const sorted = [...result.items].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setAdminVideos(
            sorted.map((item) => {
              const ytId = getYoutubeId(item.fields?.youtubeId || item.image_url || item.title);
              const isDirect =
                Boolean(item.fields?.isDirectVideo) ||
                (item.image_url
                  ? /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(item.image_url) || item.image_url.startsWith("/videos/")
                  : false);
              const thumb =
                (item.fields?.thumbnail as string) ||
                (ytId && !isDirect
                  ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                  : item.image_url && !isDirect
                  ? item.image_url
                  : "/images/Photos/School Building/school-building-main-gate.jpg");

              const catSlug = item.category || "campus";
              const catLabel =
                (item.fields?.categoryLabel as string) ||
                item.subtitle ||
                catSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

              return {
                id: item.id,
                youtubeId: ytId || undefined,
                title: item.title || "Untitled video",
                description: item.body || item.subtitle || "SJR Public School video gallery item.",
                category: catLabel,
                categorySlug: catSlug,
                date: item.published_at ? new Date(item.published_at).toLocaleDateString("en-GB") : undefined,
                videoUrl: isDirect ? item.image_url : undefined,
                thumbnail: thumb,
                isDirectVideo: isDirect,
              };
            })
          );
        } else {
          setAdminVideos(null);
        }
      })
      .catch(() => setAdminVideos(null));
  }, []);

  // Display items: merge admin videos and default videos if not present
  const displayVideos = useMemo(() => {
    if (adminVideos && adminVideos.length > 0) {
      const hasDefaultCampusFilm = adminVideos.some(
        (v) => v.id === "sjrps-rajajinagar-campus-film" || (v.videoUrl && v.videoUrl.includes("sjrps-rajajinagar.mp4"))
      );
      if (!hasDefaultCampusFilm) {
        return [...adminVideos, ...defaultVideos];
      }
      return adminVideos;
    }
    return defaultVideos;
  }, [adminVideos]);

  // Determine active video playing in the showcase
  const activeVideo = useMemo(() => {
    if (activeVideoId) {
      const found = displayVideos.find((v) => v.id === activeVideoId);
      if (found) return found;
    }
    return displayVideos[0] || null;
  }, [displayVideos, activeVideoId]);

  // Derive categories from all available videos
  const categories = useMemo(() => {
    const map = new Map<string, { label: string; count: number }>();
    displayVideos.forEach((v) => {
      const slug = v.categorySlug || "campus";
      const existing = map.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(slug, { label: v.category, count: 1 });
      }
    });

    return [
      { id: "all", label: "All Videos", count: displayVideos.length },
      ...Array.from(map.entries()).map(([slug, data]) => ({
        id: slug,
        label: data.label,
        count: data.count,
      })),
    ];
  }, [displayVideos]);

  // Filtered videos according to active category tab
  const filteredVideos = useMemo(() => {
    if (activeCategory === "all") return displayVideos;
    return displayVideos.filter(
      (v) => (v.categorySlug || "campus") === activeCategory || v.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [displayVideos, activeCategory]);

  const selectVideo = (video: Video) => {
    setActiveVideoId(video.id);
    if (playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Layout>
      <PageHero
        title="Video Gallery"
        breadcrumbs={[{ label: "Gallery" }, { label: "Videos" }]}
      />

      {/* Featured / Active Video Showcase */}
      {activeVideo && (
        <section ref={playerRef} className="py-10 lg:py-14 bg-gradient-to-b from-slate-50 to-white scroll-mt-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 bg-[#137a49]/10 text-[#137a49] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                Now Playing
              </span>
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3b241d]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {activeVideo.title}
              </h2>
              {activeVideo.description && (
                <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto">
                  {activeVideo.description}
                </p>
              )}
              <div className="flex items-center justify-center gap-3 mt-3">
                <Badge variant="outline" className="border-[#137a49]/30 bg-[#137a49]/5 text-[#137a49]">
                  {activeVideo.category}
                </Badge>
                {activeVideo.date && (
                  <span className="inline-flex items-center text-xs text-muted-foreground gap-1">
                    <Calendar className="h-3 w-3" />
                    {activeVideo.date}
                  </span>
                )}
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video border border-slate-200">
              {activeVideo.isDirectVideo || activeVideo.videoUrl ? (
                <video
                  key={activeVideo.id + (activeVideo.videoUrl || "")}
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  preload="metadata"
                  poster={activeVideo.thumbnail}
                  className="w-full h-full object-contain"
                >
                  Your browser does not support HTML5 video.
                </video>
              ) : activeVideo.youtubeId ? (
                <iframe
                  key={activeVideo.id + activeVideo.youtubeId}
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?rel=0&autoplay=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white/60">
                  <Film className="mr-2 h-6 w-6" />
                  Video not playable
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Video Gallery Grid Section */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#137a49] uppercase tracking-wider mb-1">
                <Film className="h-4 w-4" />
                Explore Our Collection
              </div>
              <h3 className="text-2xl font-bold text-[#3b241d]">All Videos ({displayVideos.length})</h3>
            </div>

            {/* Category Filter Tabs */}
            {categories.length > 2 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeCategory === cat.id
                        ? "bg-[#137a49] text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {cat.label} ({cat.count})
                  </button>
                ))}
              </div>
            )}
          </div>

          {filteredVideos.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVideos.map((video) => {
                const isCurrent = activeVideo?.id === video.id;
                return (
                  <div
                    key={video.id}
                    onClick={() => selectVideo(video)}
                    className={`group cursor-pointer flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md ${
                      isCurrent
                        ? "border-[#137a49] ring-2 ring-[#137a49]/30"
                        : "border-[#e5ded4] hover:border-[#137a49]/50"
                    }`}
                  >
                    {/* Thumbnail with Play Overlay */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                      <img
                        src={video.thumbnail || "/images/Photos/School Building/school-building-main-gate.jpg"}
                        alt={video.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/images/Photos/School Building/school-building-main-gate.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40 flex items-center justify-center">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-110 shadow-lg ${
                            isCurrent
                              ? "bg-[#137a49] text-white"
                              : "bg-white/90 text-[#137a49] group-hover:bg-[#137a49] group-hover:text-white"
                          }`}
                        >
                          <Play className="h-5 w-5 fill-current ml-0.5" />
                        </div>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5">
                        <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                          {video.category}
                        </span>
                      </div>

                      {isCurrent && (
                        <div className="absolute top-2.5 right-2.5">
                          <span className="rounded-full bg-[#137a49] px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                            Playing
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-4">
                      <h4 className="font-semibold text-[#3b241d] group-hover:text-[#137a49] transition-colors line-clamp-2">
                        {video.title}
                      </h4>
                      {video.description && (
                        <p className="mt-1 text-xs text-[#6e4a3b] line-clamp-2 flex-1">
                          {video.description}
                        </p>
                      )}
                      <div className="mt-4 pt-3 border-t border-[#f1eee9] flex items-center justify-between">
                        <span className="text-[11px] text-[#6e4a3b] flex items-center gap-1">
                          {video.date && (
                            <>
                              <Calendar className="h-3 w-3" />
                              {video.date}
                            </>
                          )}
                        </span>
                        <span className="text-xs font-semibold text-[#137a49] group-hover:underline inline-flex items-center gap-1">
                          Watch Video &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center">
              <Film className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <p className="text-base font-semibold text-[#3b241d]">No videos found in this category</p>
              <p className="text-xs text-[#6e4a3b] mt-1">Try selecting a different category or view all videos.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveCategory("all")}
                className="mt-4 text-[#137a49] border-[#137a49]/30"
              >
                Show All Videos
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Link to Photo Gallery */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <p className="text-sm font-semibold text-school-brown mb-2">Want to see our campus photos?</p>
          <Button asChild variant="outline" className="border-[#137a49] text-[#137a49] hover:bg-[#137a49]/10">
            <Link to="/gallery/photos" className="inline-flex items-center gap-2">
              <Images className="h-4 w-4" />
              Explore Photo Gallery
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default VideoGallery;
