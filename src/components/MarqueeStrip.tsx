import { useEffect, useMemo, useState } from "react";
import { getPublicContent, type AdminContentItem } from "@/lib/api";
import { mergeLatestNewsItems } from "@/lib/latestNewsContent";

const MarqueeStrip = () => {
  const [adminItems, setAdminItems] = useState<AdminContentItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    getPublicContent("latest_news", 100)
      .then((result) => {
        if (isMounted && Array.isArray(result?.items)) {
          setAdminItems(result.items);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const items = useMemo(() => {
    return mergeLatestNewsItems(adminItems)
      .filter((item) => item.isVisible !== false)
      .map((item) => item.text);
  }, [adminItems]);

  if (items.length === 0) return null;

  // Repeat items for seamless scroll
  const loop = [...items, ...items, ...items];

  return (
    <div className="bg-indian-green text-white border-y border-white/10 overflow-hidden">
      <div className="relative flex overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee py-2.5 will-change-transform">
          {loop.map((text, i) => (
            <span key={i} className="mx-8 inline-flex items-center text-sm sm:text-base font-medium">
              <span className="text-golden-yellow mr-3">★</span>
              {text}
            </span>
          ))}
        </div>
        <div className="flex whitespace-nowrap animate-marquee py-2.5 will-change-transform" aria-hidden="true">
          {loop.map((text, i) => (
            <span key={`b-${i}`} className="mx-8 inline-flex items-center text-sm sm:text-base font-medium">
              <span className="text-golden-yellow mr-3">★</span>
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarqueeStrip;
