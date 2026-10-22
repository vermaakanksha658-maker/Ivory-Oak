const DEFAULT_ADMIN_PATH = "/admin";

export function safeAdminNext(value: FormDataEntryValue | null): string {
  if (typeof value !== "string" || value.length === 0) {
    return DEFAULT_ADMIN_PATH;
  }

  if (!value.startsWith("/admin")) {
    return DEFAULT_ADMIN_PATH;
  }

  try {
    const base = "http://localhost";
    const url = new URL(value, base);

    if (
      url.origin !== base ||
      (url.pathname !== "/admin" && !url.pathname.startsWith("/admin/")) ||
      url.pathname === "/admin/login" ||
      url.pathname.startsWith("/admin/login/")
    ) {
      return DEFAULT_ADMIN_PATH;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DEFAULT_ADMIN_PATH;
  }
}
