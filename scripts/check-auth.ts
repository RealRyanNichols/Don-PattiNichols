import { loadEnvConfig } from "@next/env";

/** Read-only check: no sign-in, email, account mutation, or secret output. */
async function main() {
  loadEnvConfig(process.cwd());
  const { supabaseConfig } = await import("../lib/supabase");

  try {
    const response = await fetch(`${supabaseConfig.url}/auth/v1/settings`, {
      headers: { apikey: supabaseConfig.key },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error(`Auth service check failed (HTTP ${response.status}).`);
      process.exitCode = 1;
      return;
    }
    const settings = (await response.json()) as {
      external?: { email?: boolean };
    };
    if (settings.external?.email !== true) {
      console.error(
        "Auth service responded, but email sign-in is not enabled.",
      );
      process.exitCode = 1;
      return;
    }
    console.log("Auth service is reachable and email sign-in is enabled.");
    console.log(
      "This check does not verify a person's password or posting access.",
    );
  } catch {
    console.error(
      "Auth service check failed: the service could not be reached or returned an invalid response.",
    );
    process.exitCode = 1;
  }
}

void main();
