
const sql = require('mssql');
const pools = new Map();

async function getPool(config) {
  const key = config.database;

  if (pools.has(key)) {
    return pools.get(key);
  }

  const pool = new sql.ConnectionPool(config);
  await pool.connect();
  pools.set(key, pool);
  return pool;
}

async function closeAllPools() {
  for (const pool of pools.values()) {
    await pool.close();
  }
  pools.clear();
}

module.exports = { getPool, closeAllPools };