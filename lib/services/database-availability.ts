export function hasPostgresDatabaseUrl() {
  return /^postgres(ql)?:\/\//.test(process.env.DATABASE_URL ?? "");
}

export function getDatabaseMode() {
  return hasPostgresDatabaseUrl() ? "postgres" : "sandbox";
}
