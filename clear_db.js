const { Client } = require('pg');

const connectionString = 'postgresql://postgres:HmYu1US6XRNltdD3@db.ibruffhhtkewildogqiy.supabase.co:5432/postgres';

async function clearData() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected to Supabase.");

    const tables = ['events', 'vaccinations', 'deworming', 'medications', 'growth_logs', 'memories', 'documents', 'profiles'];
    
    for (const table of tables) {
      await client.query(`DELETE FROM ${table};`);
      console.log(`Cleared data from ${table}`);
    }

    console.log("Database slate is clean!");
  } catch (err) {
    console.error("Error clearing data:", err.message);
  } finally {
    await client.end();
  }
}

clearData();
