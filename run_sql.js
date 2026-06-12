const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres:HmYu1US6XRNltdD3@db.ibruffhhtkewildogqiy.supabase.co:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  try {
    console.log('Connecting to Supabase...');
    await client.connect();
    
    console.log('Reading schema file...');
    const sql = fs.readFileSync(path.join(__dirname, 'supabase_schema.sql'), 'utf8');
    
    console.log('Executing schema...');
    await client.query(sql);
    
    console.log('Schema executed successfully!');
  } catch (err) {
    console.error('Error executing schema:', err);
  } finally {
    await client.end();
  }
}

run();
