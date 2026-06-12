const { Client } = require('pg');

const connectionString = 'postgresql://postgres:HmYu1US6XRNltdD3@db.ibruffhhtkewildogqiy.supabase.co:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    
    const tables = ['profiles', 'events', 'vaccinations', 'deworming', 'medications', 'growth_logs', 'memories', 'documents'];
    for (const table of tables) {
      await client.query(`ALTER PUBLICATION supabase_realtime ADD TABLE ${table};`);
      console.log(`Enabled realtime for ${table}`);
    }
  } catch (err) {
    // Ignore error if it's already added
    console.log('Error or already enabled:', err.message);
  } finally {
    await client.end();
  }
}

run();
