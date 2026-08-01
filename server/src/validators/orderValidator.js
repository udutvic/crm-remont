const ORDER_STATUSES = new Set([
  "pending",
  "in_progress",
  "completed",
  "cancelled",
]);

const ACCESS_TYPES = new Set([
  "none",
  "pin",
  "password",
  "pattern",
  "unknown",
]);

const REQUIRED_CODE_TYPES = new Set([
  "pin",
  "password",
  "pattern",
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

const validateOptionalText = ({
  body,
  fieldName,
  maxLength,
  errors,
  payload,
}) => {
  if (!hasOwnField(body, fieldName)) {
    return;
  }

  const value = normalizeOptionalText(
    body[fieldName]
  );

  if (
    value &&
    value.length > maxLength
  ) {
    errors[fieldName] =
      `${fieldName} cannot exceed ` +
      `${maxLength} characters.`;

    return;
  }

  payload[fieldName] = value;
};

const validateMoneyField = ({
  body,
  fieldName,
  errors,
  payload,
}) => {
  if (!hasOwnField(body, fieldName)) {
    return null;
  }

  const rawValue = body[fieldName];

  if (
    rawValue === null ||
    rawValue === ""
  ) {
    payload[fieldName] = null;

    return null;
  }

  const value = Number(rawValue);

  if (!Number.isFinite(value)) {
    errors[fieldName] =
      `${fieldName} must be a number.`;

    return null;
  }

  if (value < 0) {
    errors[fieldName] =
      `${fieldName} cannot be negative.`;

    return null;
  }

  if (value > 9999999999.99) {
    errors[fieldName] =
      `${fieldName} is too large.`;

    return null;
  }

  const roundedValue =
    Math.round(
      (value + Number.EPSILON) * 100
    ) / 100;

  payload[fieldName] =
    roundedValue;

  return roundedValue;
};

const validateDateField = ({
  body,
  fieldName,
  errors,
  payload,
}) => {
  if (!hasOwnField(body, fieldName)) {
    return null;
  }

  const rawValue = body[fieldName];

  if (
    rawValue === null ||
    rawValue === ""
  ) {
    payload[fieldName] = null;

    return null;
  }

  const date = new Date(rawValue);

  if (
    Number.isNaN(date.getTime())
  ) {
    errors[fieldName] =
      `${fieldName} must be a valid date.`;

    return null;
  }

  payload[fieldName] =
    date.toISOString();

  return date;
};

const validateOrderPayload = (
  body,
  {
    isUpdate = false,
  } = {}
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
      accessCodeAction:
        "preserve",
      accessCode: null,
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

  const deviceId = Number(
    body.deviceId
  );

  if (
    !Number.isInteger(deviceId) ||
    deviceId <= 0
  ) {
    errors.deviceId =
      "A valid device ID is required.";
  } else {
    payload.deviceId = deviceId;
  }

  const problem = String(
    body.problem ?? ""
  ).trim();

  if (!problem) {
    errors.problem =
      "Problem description is required.";
  } else if (problem.length > 255) {
    errors.problem =
      "Problem description cannot exceed 255 characters.";
  } else {
    payload.problem = problem;
  }

  const status = String(
    body.status ?? "pending"
  )
    .trim()
    .toLowerCase();

  if (!ORDER_STATUSES.has(status)) {
    errors.status =
      "Unsupported order status.";
  } else {
    payload.status = status;
  }

  validateOptionalText({
    body,
    fieldName:
      "deviceCondition",
    maxLength: 5000,
    errors,
    payload,
  });

  validateOptionalText({
    body,
    fieldName: "accessories",
    maxLength: 2000,
    errors,
    payload,
  });

  validateOptionalText({
    body,
    fieldName: "diagnosis",
    maxLength: 10000,
    errors,
    payload,
  });

  validateOptionalText({
    body,
    fieldName:
      "workPerformed",
    maxLength: 10000,
    errors,
    payload,
  });

  validateOptionalText({
    body,
    fieldName: "internalNote",
    maxLength: 10000,
    errors,
    payload,
  });

  const price =
    validateMoneyField({
      body,
      fieldName: "price",
      errors,
      payload,
    });

  const estimatedPrice =
    validateMoneyField({
      body,
      fieldName:
        "estimatedPrice",
      errors,
      payload,
    });

  validateMoneyField({
    body,
    fieldName: "finalPrice",
    errors,
    payload,
  });

  if (
    !hasOwnField(
      body,
      "estimatedPrice"
    ) &&
    price !== null
  ) {
    payload.estimatedPrice =
      price;
  }

  if (
    !hasOwnField(body, "price") &&
    estimatedPrice !== null
  ) {
    /*
     * Temporary backward
     * compatibility for the current
     * order list and dashboard.
     */
    payload.price =
      estimatedPrice;
  }

  const receivedAt =
    validateDateField({
      body,
      fieldName: "receivedAt",
      errors,
      payload,
    });

  const dueAt =
    validateDateField({
      body,
      fieldName: "dueAt",
      errors,
      payload,
    });

  if (
    receivedAt &&
    dueAt &&
    dueAt.getTime() <
      receivedAt.getTime()
  ) {
    errors.dueAt =
      "Due date cannot be earlier than the received date.";
  }

  const accessTypeProvided =
    hasOwnField(
      body,
      "accessType"
    );

  let accessType = null;

  if (
    accessTypeProvided ||
    !isUpdate
  ) {
    accessType = String(
      body.accessType ?? "none"
    )
      .trim()
      .toLowerCase();

    if (
      !ACCESS_TYPES.has(
        accessType
      )
    ) {
      errors.accessType =
        "Unsupported access type.";
    } else {
      payload.accessType =
        accessType;
    }
  }

  const accessCodeProvided =
    hasOwnField(
      body,
      "accessCode"
    );

  let accessCodeAction =
    isUpdate
      ? "preserve"
      : "clear";

  let accessCode = null;

  if (accessCodeProvided) {
    const normalizedAccessCode =
      normalizeOptionalText(
        body.accessCode
      );

    if (!normalizedAccessCode) {
      accessCodeAction = "clear";
    } else if (
      normalizedAccessCode.length >
      256
    ) {
      errors.accessCode =
        "Access code cannot exceed 256 characters.";
    } else {
      accessCodeAction = "set";
      accessCode =
        normalizedAccessCode;
    }
  }

  if (accessType === "none") {
    if (
      accessCodeAction === "set"
    ) {
      errors.accessCode =
        "Access code cannot be provided when access type is none.";
    }

    accessCodeAction = "clear";
    accessCode = null;
  }

  if (
    !isUpdate &&
    accessType &&
    REQUIRED_CODE_TYPES.has(
      accessType
    ) &&
    accessCodeAction !== "set"
  ) {
    errors.accessCode =
      "Access code is required for the selected access type.";
  }

  return {
    isValid:
      Object.keys(errors).length === 0,
    payload,
    errors,
    accessCodeAction,
    accessCode,
  };
};

module.exports = {
  ORDER_STATUSES,
  ACCESS_TYPES,
  REQUIRED_CODE_TYPES,
  validateOrderPayload,
};