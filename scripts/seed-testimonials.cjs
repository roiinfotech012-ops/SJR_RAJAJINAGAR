// Seed script to store all official school testimonials in the PostgreSQL database
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

    // Read authentic testimonials
    const testimonialsPath = path.resolve(__dirname, '../src/data/testimonials.ts');
    const content = fs.readFileSync(testimonialsPath, 'utf8');
    const marker = 'export const authenticTestimonials: TestimonialItem[] = ';
    const jsonStart = content.indexOf(marker);
    if (jsonStart === -1) {
      throw new Error("Could not find authenticTestimonials in testimonials.ts");
    }

    // Evaluate array in isolated context
    const arrayCode = content.slice(jsonStart + marker.length).trim().replace(/;$/, '');
    const fn = new Function(`return ${arrayCode}`);
    const testimonials = fn();
    console.log(`Found ${testimonials.length} authentic testimonials to seed.`);

    let index = 0;
    for (const t of testimonials) {
      index++;
      const subtitle = `Parent of ${t.childName} (${t.className})`;
      await client.query(`
        INSERT INTO admin_content (
          id, type, title, subtitle, body, image_url, category, published_at, is_visible, display_order, fields, created_at, updated_at
        ) VALUES (
          $1, 'testimonial', $2, $3, $4, $5, 'Parent', NULL, true, $6, $7, NOW(), NOW()
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
        t.id,
        t.parentName,
        subtitle,
        t.quote,
        t.image || "/placeholder.svg",
        index,
        JSON.stringify({
          childName: t.childName,
          className: t.className,
          language: t.language || "en",
          imageAlt: t.imageAlt,
          featured: t.featured !== false,
          subheadings: t.subheadings || [],
          sourcePage: t.sourcePage
        })
      ]);
      console.log(`Stored testimonial [${index}]: ${t.parentName} (${t.childName})`);
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
