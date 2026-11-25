// Seed script to store all official school teachers/faculty in the PostgreSQL database
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

    // Read staff members from staff.ts
    const staffPath = path.resolve(__dirname, '../src/data/staff.ts');
    const content = fs.readFileSync(staffPath, 'utf8');
    const marker = 'export const staffMembers: StaffMember[] = ';
    const jsonStart = content.indexOf(marker);
    if (jsonStart === -1) {
      throw new Error("Could not find staffMembers in staff.ts");
    }

    // Evaluate array in isolated context
    const endMarker = '];\n\nexport const getStaffByCategory';
    const jsonEnd = content.indexOf(endMarker);
    const arrayCode = (jsonEnd !== -1 ? content.slice(jsonStart + marker.length, jsonEnd + 1) : content.slice(jsonStart + marker.length)).trim().replace(/;$/, '');
    const fn = new Function(`return ${arrayCode}`);
    const staffList = fn();
    console.log(`Found ${staffList.length} staff members to seed.`);

    let index = 0;
    for (const s of staffList) {
      index++;
      const id = `staff-${s.id}`;
      const title = s.name;
      const subtitle = s.designation;
      const body = s.qualification || "Educational Faculty";
      const imageUrl = s.photo || "/placeholder.svg";
      const category = s.category || "Secondary and High School";
      const isFeatured = index <= 4;
      const fields = {
        subject: s.subject || "",
        qualification: s.qualification || "Educational Faculty",
        experience: s.experience || "Dedicated Educator",
        category: s.category || "Secondary and High School",
        section: s.category || "Secondary and High School",
        note: s.note || "",
        featured: isFeatured,
      };

      await client.query(`
        INSERT INTO admin_content (
          id, type, title, subtitle, body, image_url, category, published_at, is_visible, display_order, fields, created_at, updated_at
        ) VALUES (
          $1, 'teacher', $2, $3, $4, $5, $6, NULL, true, $7, $8, NOW(), NOW()
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
      console.log(`Stored teacher [${index}/${staffList.length}]: ${s.name} (${s.designation})`);
    }

    const counts = await client.query("SELECT type, count(*) FROM admin_content GROUP BY type;");
    console.log("Current admin_content counts in PostgreSQL:");
    console.table(counts.rows);

    await client.end();
    console.log("Teachers seeded successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
