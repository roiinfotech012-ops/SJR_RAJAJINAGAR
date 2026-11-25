// Database initialization and table creation script for sjrsr258_sjrpsraj
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Simple native .env loader without external dependencies
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

async function initDatabase() {
  try {
    console.log('Connecting to PostgreSQL database at 168.119.64.101:5432...');
    await client.connect();
    console.log('CONNECTED TO sjrsr258_sjrpsraj!');

    // 1. Enquiries Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id VARCHAR(64) PRIMARY KEY,
        source VARCHAR(32) NOT NULL DEFAULT 'contact',
        name VARCHAR(255) NOT NULL,
        contact VARCHAR(64) NOT NULL,
        email VARCHAR(255) DEFAULT '',
        status VARCHAR(64) NOT NULL DEFAULT 'Not Contacted',
        first_contacted_at TIMESTAMP WITH TIME ZONE,
        next_follow_up_at TIMESTAMP WITH TIME ZONE,
        last_follow_up_at TIMESTAMP WITH TIME ZONE,
        submitted_data JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('Table verified/created: enquiries');

    // 2. Follow-ups Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS follow_ups (
        id VARCHAR(64) PRIMARY KEY,
        enquiry_id VARCHAR(64) NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
        status VARCHAR(64) NOT NULL DEFAULT 'Follow Up',
        remarks TEXT DEFAULT '',
        next_follow_up_date VARCHAR(64),
        next_follow_up_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('Table verified/created: follow_ups');

    // 3. Admin Content / CMS Table (News, Events, Testimonials, Gallery)
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_content (
        id VARCHAR(64) PRIMARY KEY,
        type VARCHAR(32) NOT NULL,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255) DEFAULT '',
        body TEXT DEFAULT '',
        image_url TEXT DEFAULT '',
        category VARCHAR(64) DEFAULT '',
        published_at TIMESTAMP WITH TIME ZONE,
        is_visible BOOLEAN DEFAULT TRUE,
        display_order INTEGER DEFAULT 0,
        fields JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('Table verified/created: admin_content');

    // 4. Admin Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('Table verified/created: admin_users');

    // List all tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('All tables in public schema:', res.rows.map(r => r.table_name));

    await client.end();
    console.log('Database initialization completed successfully!');
  } catch (err) {
    console.error('Database initialization error:', err);
    process.exit(1);
  }
}

initDatabase();
