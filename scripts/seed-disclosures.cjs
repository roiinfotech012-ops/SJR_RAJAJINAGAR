// Seed script to store all mandatory disclosure documents in the PostgreSQL database
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

    // Read disclosures from disclosures.ts
    const disclosuresPath = path.resolve(__dirname, '../src/data/disclosures.ts');
    const content = fs.readFileSync(disclosuresPath, 'utf8');
    const marker = 'export const mandatoryDocuments: MandatoryDocument[] = ';
    const jsonStart = content.indexOf(marker);
    if (jsonStart === -1) {
      throw new Error("Could not find mandatoryDocuments in disclosures.ts");
    }

    // Evaluate array in isolated context
    const arrayCode = content.slice(jsonStart + marker.length).trim().replace(/;$/, '');
    const fn = new Function(`return ${arrayCode}`);
    const docs = fn();
    console.log(`Found ${docs.length} mandatory documents to seed.`);

    let index = 0;
    for (const doc of docs) {
      index++;
      const id = `doc-${doc.id}`;
      const title = doc.title;
      const subtitle = `${doc.filename} (${doc.fileSize})`;
      const body = doc.description || "";
      const imageUrl = doc.pdfUrl || "";
      const category = doc.category || "Affiliation & Society";
      const fields = {
        filename: doc.filename,
        fileSize: doc.fileSize,
        pdfUrl: doc.pdfUrl,
        description: doc.description,
        category: doc.category,
        isAvailable: doc.isAvailable !== false,
      };

      await client.query(`
        INSERT INTO admin_content (
          id, type, title, subtitle, body, image_url, category, published_at, is_visible, display_order, fields, created_at, updated_at
        ) VALUES (
          $1, 'disclosure', $2, $3, $4, $5, $6, NULL, true, $7, $8, NOW(), NOW()
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
        id,
        title,
        subtitle,
        body,
        imageUrl,
        category,
        index,
        JSON.stringify(fields)
      ]);
      console.log(`Stored disclosure document [${index}/${docs.length}]: ${doc.title} (${doc.filename})`);
    }

    const counts = await client.query("SELECT type, count(*) FROM admin_content GROUP BY type;");
    console.log("Current admin_content counts in PostgreSQL:");
    console.table(counts.rows);

    await client.end();
    console.log("Mandatory disclosure documents seeded successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
