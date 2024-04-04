import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsReult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionValue =
    databaseMaxConnectionsReult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const sql =
    "SELECT count(*)::int FROM pg_stat_activity WHERE datname = '$1';";

  const databaseOpennedConnectionsResult = await database.query({
    text: sql,
    value: databaseName,
  });
  const databaseOpennedConnectionsValue =
    databaseOpennedConnectionsResult.rows.length;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionValue),
        openned_connections: databaseOpennedConnectionsValue,
      },
    },
  });
}

export default status;
