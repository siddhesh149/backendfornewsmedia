const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function loadSampleData() {
  try {
    // Read the SQL file
    const sql = fs.readFileSync('./sample-data.sql', 'utf8');
    
    // Execute the SQL without clearing existing data
    await pool.query(sql);
    console.log('New data added successfully');
  } catch (error) {
    console.error('Error loading sample data:', error);
  } finally {
    await pool.end();
  }
}

// Run the script
loadSampleData(); 