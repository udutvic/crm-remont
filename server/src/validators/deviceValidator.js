const normalizeDeviceIdentifier =
  require(
    "../utils/normalizeDeviceIdentifier"
  );

const DEVICE_TYPES = new Set([
  "phone",
  "tablet",
  "laptop",
  "smartwatch",
  "other",
]);

const hasOwnField = (
  object,
  fieldName
) =>
  Object.prototype.hasOwnProperty.call(
    object,
    fieldName
  );

const normalizeOptionalText = (
  value
) => {
  const normalized = String(
    value ?? ""
  ).trim();

  return normalized || null;
};

const validateImeiField = ({
  body,
  fieldName,
  errors,
  payload,
}) => {
  if (!hasOwnField(body, fieldName)) {
    return;
  }

  const value = normalizeOptionalText(
    body[fieldName]
  );

  if (!value) {
    payload[fieldName] = null;

    return;
  }

  const normalized =
    normalizeDeviceIdentifier(value);

  if (value.length > 32) {
    errors[fieldName] =
      "IMEI cannot exceed 32 characters.";

    return;
  }

  if (
    !normalized ||
    !/^[0-9]{15}$/.test(normalized)
  ) {
    errors[fieldName] =
      "IMEI must contain exactly 15 digits.";

    return;
  }

  payload[fieldName] = value;
};

const validateDevicePayload = (
  body
) => {
  const errors = {};
  const payload = {};

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return {
      isValid: false,
      payload,
      errors: {
        body:
          "Request body must be a JSON object.",
      },
    };
  }

  const clientId = Number(
    body.clientId
  );

  if (
    !Number.isInteger(clientId) ||
    clientId <= 0
  ) {
    errors.clientId =
      "A valid client ID is required.";
  } else {
    payload.clientId = clientId;
  }

  const deviceType = String(
    body.deviceType ?? "phone"
  )
    .trim()
    .toLowerCase();

  if (!DEVICE_TYPES.has(deviceType)) {
    errors.deviceType =
      "Unsupported device type.";
  } else {
    payload.deviceType = deviceType;
  }

  const brand = String(
    body.brand ?? ""
  ).trim();

  if (!brand) {
    errors.brand = "Brand is required.";
  } else if (brand.length > 120) {
    errors.brand =
      "Brand cannot exceed 120 characters.";
  } else {
    payload.brand = brand;
  }

  const model = String(
    body.model ?? ""
  ).trim();

  if (!model) {
    errors.model = "Model is required.";
  } else if (model.length > 120) {
    errors.model =
      "Model cannot exceed 120 characters.";
  } else {
    payload.model = model;
  }

  validateImeiField({
    body,
    fieldName: "imei1",
    errors,
    payload,
  });

  validateImeiField({
    body,
    fieldName: "imei2",
    errors,
    payload,
  });

  const imei1Normalized =
    normalizeDeviceIdentifier(
      payload.imei1
    );

  const imei2Normalized =
    normalizeDeviceIdentifier(
      payload.imei2
    );

  if (
    imei1Normalized &&
    imei2Normalized &&
    imei1Normalized === imei2Normalized
  ) {
    errors.imei2 =
      "IMEI 2 must be different from IMEI 1.";
  }

  if (hasOwnField(body, "serial")) {
    const serial = normalizeOptionalText(
      body.serial
    );

    if (
      serial &&
      serial.length > 100
    ) {
      errors.serial =
        "Serial number cannot exceed 100 characters.";
    } else {
      payload.serial = serial;
    }
  }

  if (hasOwnField(body, "color")) {
    const color = normalizeOptionalText(
      body.color
    );

    if (color && color.length > 80) {
      errors.color =
        "Color cannot exceed 80 characters.";
    } else {
      payload.color = color;
    }
  }

  return {
    isValid:
      Object.keys(errors).length === 0,
    payload,
    errors,
  };
};

module.exports = {
  validateDevicePayload,
};