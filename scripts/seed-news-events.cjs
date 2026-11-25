// Seed script to store all official school news & events in the database
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Read .env if present
try {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  }
} catch (e) {}

const client = new Client({
  host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE || 'sjrsr258_sjrpsraj',
  user: process.env.PGUSER || 'sjrsr258_sjrpsraj',
  password: process.env.PGPASSWORD || '+7v#qvBj9Y*!L9-N&S',
  ssl: false,
});

const defaultNewsItems = [
  {
    id: "annual-day-2025-26",
    title: "Annual Day 2025-26",
    subtitle: "Annual Day 2025-26 brought together two memorable evenings of creativity, culture, music, and student performances.",
    body: "Day 1: A Journey Through Creativity and Innovation (4th December 2025). The festivities kicked off with an inspiring evening dedicated to our pre-primary and primary stars.\n\nFormal Proceedings: Chief Guest Shri Sandeep Pai S., Sri Prabhudev Kalmath (Honourable Secretary, SJRES), Sri Rajendra Prasad (Vice President, SJRES), and Principal Mrs. Jyothi Shashidhar.\n\nDay 2: Samskruti - A Tribute to Global and Regional Heritage (5th December 2025). The second evening saw students from Classes 5 to 11 deliver high-energy, rhythmic performances celebrating cultural richness.",
    image_url: "/placeholder.svg",
    category: "Campus Events",
    published_at: "2025-12-04T00:00:00Z",
    is_visible: true,
    display_order: 1,
    fields: { slug: "annual-day-2025-26" }
  },
  {
    id: "annual-science-exhibition-2025-26",
    title: "Annual Science Exhibition 2025-26",
    subtitle: "The Annual Exhibition of SJR Public School was a grand celebration of learning, creativity, and innovation.",
    body: "The Annual Exhibition of SJR Public School was a grand celebration of learning, creativity, and innovation. The event was formally inaugurated by our esteemed Principal and Vice President Rajendra Prasad, marking the beginning of a vibrant and colourful showcase of student talent and hard work.\n\nThe exhibition beautifully highlighted various disciplines including Language, Mathematics, Social Science, Science, Robotics, Music, and Art.",
    image_url: "/placeholder.svg",
    category: "Academic",
    published_at: "2026-02-28T00:00:00Z",
    is_visible: true,
    display_order: 2,
    fields: { slug: "annual-science-exhibition-2025-26" }
  },
  {
    id: "investiture-ceremony-2026-27",
    title: "Investiture Ceremony 2026–27",
    subtitle: "Formal leadership induction, badge pinning, and oath-taking ceremony for the newly elected Student Council at SJR Public School.",
    body: "SJR Public School proudly conducted the Investiture Ceremony 2026–27, celebrating leadership, responsibility, and excellence. The ceremony featured the traditional lighting of the lamp, an energetic welcome dance, badge pinning of the newly elected Student Council, and the solemn oath-taking ceremony. Students who secured Centum in the Academic Year 2025–26 were felicitated with special honours and gifts from their subject teachers.",
    image_url: "/images/Events/Investiture%20ceremony/WhatsApp%20Image%202026-10-05%20at%202.08.27%20PM%20(1).jpeg",
    category: "Campus Life",
    published_at: "2026-07-15T00:00:00Z",
    is_visible: true,
    display_order: 3,
    fields: { slug: "investiture-ceremony-2026-27" }
  },
  {
    id: "school-election-democracy",
    title: "Student Council Election",
    subtitle: "Experiential democratic ballot voting giving students first-hand exposure to fair elections, leadership, and civic responsibility.",
    body: "SJR Public School successfully conducted the Student Council Election, providing students with a valuable opportunity to experience the democratic process first-hand. The election was organized in a fair, transparent, and systematic manner, encouraging students to exercise their right to vote responsibly.",
    image_url: "/images/Events/School%20Election/WhatsApp%20Image%202026-10-05%20at%202.08.28%20PM%20(1).jpeg",
    category: "Academic",
    published_at: "2026-06-20T00:00:00Z",
    is_visible: true,
    display_order: 4,
    fields: { slug: "school-election-democracy" }
  },
  {
    id: "international-yoga-day-2026",
    title: "International Yoga Day 2026",
    subtitle: "Promoting physical wellness, mindfulness, and discipline through synchronized yoga asanas.",
    body: "On International Yoga Day, students and staff assembled on campus for dynamic pranayama, surya namaskars, and guided meditation, fostering balance, stamina, and harmony.",
    image_url: "/placeholder.svg",
    category: "Sports & Wellness",
    published_at: "2026-06-21T00:00:00Z",
    is_visible: true,
    display_order: 5,
    fields: { slug: "international-yoga-day-2026" }
  },
  {
    id: "world-environment-day-2026",
    title: "World Environment Day 2026",
    subtitle: "Eco-club tree plantation drive and environmental awareness rally led by students.",
    body: "World Environment Day was celebrated with enthusiastic sapling plantations around the school perimeter, handmade poster presentations on water conservation, and clean campus pledges.",
    image_url: "/placeholder.svg",
    category: "Campus Life",
    published_at: "2026-06-05T00:00:00Z",
    is_visible: true,
    display_order: 6,
    fields: { slug: "world-environment-day-2026" }
  },
  {
    id: "krishna-janmashtami-celebration",
    title: "Krishna Janmashtami Festivities",
    subtitle: "Cultural celebration with traditional attire, devotional music, and festive enthusiasm across classes.",
    body: "Students dressed as little Krishnas and Radhas celebrated Krishna Janmashtami with vibrant stage acts, butter-pot decoration competitions, and traditional bhajans.",
    image_url: "/images/Events/Krishna%20Janmastmi/WhatsApp%20Image%202026-10-01%20at%2013.37.09%20(1).jpeg",
    category: "Cultural",
    published_at: "2026-08-26T00:00:00Z",
    is_visible: true,
    display_order: 7,
    fields: { slug: "krishna-janmashtami-celebration" }
  },
  {
    id: "annual-sports-meet",
    title: "Annual Sports Meet & Athletics",
    subtitle: "Track & field athletics, march past, and inter-house sporting championship.",
    body: "The Annual Sports Meet witnessed fierce inter-house sports competitions, relay races, high jumps, tug-of-war, and taekwondo demonstrations, celebrating sportsmanship and physical grit.",
    image_url: "/images/Events/Annual%20Sports%20Meet/FB_IMG_1791268754974.jpg",
    category: "Sports",
    published_at: "2026-01-20T00:00:00Z",
    is_visible: true,
    display_order: 8,
    fields: { slug: "annual-sports-meet" }
  }
];

async function seed() {
  try {
    console.log("Connecting to PostgreSQL...");
    await client.connect();
    console.log("Connected to PostgreSQL database!");

    for (const item of defaultNewsItems) {
      await client.query(`
        INSERT INTO admin_content (
          id, type, title, subtitle, body, image_url, category, published_at, is_visible, display_order, fields, created_at, updated_at
        ) VALUES (
          $1, 'news', $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          subtitle = EXCLUDED.subtitle,
          body = EXCLUDED.body,
          image_url = EXCLUDED.image_url,
          category = EXCLUDED.category,
          published_at = EXCLUDED.published_at,
          is_visible = EXCLUDED.is_visible,
          display_order = EXCLUDED.display_order,
          fields = EXCLUDED.fields,
          updated_at = NOW();
      `, [
        item.id,
        item.title,
        item.subtitle,
        item.body,
        item.image_url,
        item.category,
        item.published_at,
        item.is_visible,
        item.display_order,
        JSON.stringify(item.fields)
      ]);
      console.log(`Stored in database: ${item.title}`);
    }

    const countRes = await client.query("SELECT COUNT(*) FROM admin_content WHERE type = 'news';");
    console.log(`Total news & events stored in database: ${countRes.rows[0].count}`);

    await client.end();
  } catch (err) {
    console.error("Seeding error:", err.message);
  }
}

seed();
