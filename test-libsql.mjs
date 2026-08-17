import { createClient } from '@libsql/client';
async function run() {
try {
  const libsql = createClient({
    url: 'file:./dev.db',
  });
  console.log("Client created");
  await libsql.execute("SELECT 1;");
  console.log("Query executed");
} catch (e) {
  console.error("ERROR:", e);
}
}
run();
