test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();

  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);
});

test("Should return the Database version", async () => {
  const response = await (
    await fetch("http://localhost:3000/api/v1/status")
  ).json();
  const version = response.dependencies.database.version;

  expect(version).toContain("16.2");
});

test("Should return the max connections quantity", async () => {
  const response = await (
    await fetch("http://localhost:3000/api/v1/status")
  ).json();
  const maxConnections = response.dependencies.database.max_connections;

  expect(maxConnections).toBeDefined();
  expect(maxConnections).toEqual(100);
});

test("Should return the open connections quantity", async () => {
  const response = await (
    await fetch("http://localhost:3000/api/v1/status")
  ).json();

  const opennedConnections = response.dependencies.database.openned_connections;
  expect(opennedConnections).toBeDefined();
  expect(opennedConnections).toEqual(1);
});

test("Test de SQL Injection", async () => {
  await fetch("http://localhost:3000/api/v1/status?databaseName=local_db");
  await fetch(
    "http://localhost:3000/api/v1/status?databaseName='; SELECT pg_sleep(4); --",
  );
});
