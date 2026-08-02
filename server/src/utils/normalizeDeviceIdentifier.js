const normalizeDeviceIdentifier = (
  value
) => {
  const normalized = String(
    value ?? ""
  )
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();

  return normalized || null;
};

module.exports =
  normalizeDeviceIdentifier;