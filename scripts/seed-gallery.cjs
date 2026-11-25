// Seed script to store all official school gallery photos & videos in the PostgreSQL database
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

async function seed() {
  try {
    console.log("Connecting to PostgreSQL...");
    await client.connect();
    console.log("Connected to PostgreSQL database!");

    // 1. Load all school photos from src/data/galleryPhotos.ts
    const galleryFilePath = path.resolve(__dirname, '../src/data/galleryPhotos.ts');
    const content = fs.readFileSync(galleryFilePath, 'utf8');
    const marker = 'export const allSchoolPhotos: GalleryPhotoItem[] = ';
    const jsonStart = content.indexOf(marker);
    if (jsonStart === -1) {
      throw new Error("Could not find allSchoolPhotos marker in galleryPhotos.ts");
    }
    const arrayText = content.slice(jsonStart + marker.length).trim().replace(/;$/, '');
    const photos = JSON.parse(arrayText);
    console.log(`Found ${photos.length} photos to seed into database.`);

    let photoIndex = 0;
    for (const photo of photos) {
      photoIndex++;
      await client.query(`
        INSERT INTO admin_content (
          id, type, title, subtitle, body, image_url, category, published_at, is_visible, display_order, fields, created_at, updated_at
        ) VALUES (
          $1, 'gallery', $2, $3, $4, $5, $6, NULL, true, $7, $8, NOW(), NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          subtitle = EXCLUDED.subtitle,
          body = EXCLUDED.body,
          image_url = EXCLUDED.image_url,
          category = EXCLUDED.category,
          is_visible = EXCLUDED.is_visible,
          display_order = EXCLUDED.display_order,
          fields = EXCLUDED.fields,
          updated_at = NOW();
      `, [
        photo.id,
        photo.title,
        photo.eventTitle || photo.categoryLabel,
        photo.eventTitle || "",
        photo.src,
        photo.category,
        photoIndex,
        JSON.stringify({
          originalFilename: photo.originalFilename,
          eventTitle: photo.eventTitle,
          categoryLabel: photo.categoryLabel
        })
      ]);
    }
    console.log(`Successfully stored ${photoIndex} gallery photos in PostgreSQL database!`);

    // 2. Seed official school video
    const videos = [
      {
        id: "sjrps-rajajinagar-campus-film",
        title: "SJR Public School, Rajajinagar — Campus Tour & Highlights",
        subtitle: "Campus & Activities",
        body: "Experience our state-of-the-art campus, dedicated faculty, and dynamic student life at SJR Public School, Rajajinagar.",
        image_url: "/videos/sjrps-rajajinagar.mp4",
        category: "campus",
        published_at: "2026-10-14T00:00:00Z",
        is_visible: true,
        display_order: 1,
        fields: {
          videoUrl: "/videos/sjrps-rajajinagar.mp4",
          thumbnail: "/images/Photos/School Building/school-building-main-gate.jpg",
          isLocalVideo: true
        }
      }
    ];

    for (const video of videos) {
      await client.query(`
        INSERT INTO admin_content (
          id, type, title, subtitle, body, image_url, category, published_at, is_visible, display_order, fields, created_at, updated_at
        ) VALUES (
          $1, 'video', $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()
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
        video.id,
        video.title,
        video.subtitle,
        video.body,
        video.image_url,
        video.category,
        video.published_at,
        video.is_visible,
        video.display_order,
        JSON.stringify(video.fields)
      ]);
      console.log(`Stored video: ${video.title}`);
    }

    const counts = await client.query("SELECT type, count(*) FROM admin_content GROUP BY type;");
    console.log("Current admin_content counts in PostgreSQL:");
    console.table(counts.rows);

    await client.end();
  } catch (err) {
    console.error("Seeding error:", err);
  }
}

seed();
