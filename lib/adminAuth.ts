export type SignInMethod = "password" | "email" | "code" | "session";

/** Only known credential failures should tell someone their password is wrong. */
export function signInErrorMessage(error: unknown, method: SignInMethod) {
  const details =
    error && typeof error === "object"
      ? (error as {
          code?: string;
          status?: number;
          name?: string;
          message?: string;
        })
      : {};

  if (
    details.status === 429 ||
    details.code === "over_request_rate_limit" ||
    details.code === "over_email_send_rate_limit"
  ) {
    return "Too many attempts. Please wait a few minutes and try again.";
  }

  if (
    details.name === "AuthRetryableFetchError" ||
    details.name === "TypeError" ||
    details.name === "AbortError" ||
    details.name === "TimeoutError" ||
    (typeof details.status === "number" && details.status >= 500)
  ) {
    return "The sign-in service is unavailable right now. Please try again in a moment. This does not mean your password is wrong.";
  }

  if (
    method === "password" &&
    (details.code === "invalid_credentials" ||
      (details.status === 400 &&
        details.message === "Invalid login credentials"))
  ) {
    return "That email and password didn't match. Check both, or tap the link option below.";
  }

  if (details.code === "email_not_confirmed") {
    return "Your email address still needs to be confirmed. Check your email for the confirmation, or call Ryan for help.";
  }

  if (details.code === "otp_expired") {
    return "That code or sign-in link has expired or didn't match. Request a fresh one and try again.";
  }

  if (method === "email") {
    return "We couldn't send the sign-in email right now. Please try again in a moment. If it keeps happening, call Ryan.";
  }

  return "We couldn't finish signing you in. Please try again. If it keeps happening, call Ryan.";
}

/** Keep rejected SDK/network requests out of the UI's stuck-busy state. */
export async function requestSignIn(
  request: () => PromiseLike<{ error: unknown }>,
  method: SignInMethod,
): Promise<string | null> {
  try {
    const { error } = await request();
    return error ? signInErrorMessage(error, method) : null;
  } catch (error) {
    return signInErrorMessage(error, method);
  }
}

export type AuthorAccess = "allowed" | "denied" | "unavailable";

/** A failed allow-list lookup is not evidence that an account lost access. */
export async function checkAuthorAccess(
  lookup: () => PromiseLike<{ data: unknown[] | null; error: unknown }>,
): Promise<AuthorAccess> {
  try {
    const { data, error } = await lookup();
    if (error) return "unavailable";
    return data && data.length > 0 ? "allowed" : "denied";
  } catch {
    return "unavailable";
  }
}
