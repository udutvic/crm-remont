const parseCookies = (
  cookieHeader
) => {
  const cookies = {};

  if (!cookieHeader) {
    return cookies;
  }

  for (
    const part of
    String(
      cookieHeader
    ).split(";")
  ) {
    const separatorIndex =
      part.indexOf("=");

    if (
      separatorIndex <= 0
    ) {
      continue;
    }

    const name =
      part
        .slice(
          0,
          separatorIndex
        )
        .trim();

    const rawValue =
      part
        .slice(
          separatorIndex + 1
        )
        .trim();

    if (!name) {
      continue;
    }

    try {
      cookies[name] =
        decodeURIComponent(
          rawValue
        );
    } catch {
      cookies[name] =
        rawValue;
    }
  }

  return cookies;
};

module.exports = {
  parseCookies,
};
