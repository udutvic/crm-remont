const INTAKE_MODES = new Set([
  "existing",
  "new",
]);

const isPlainObject = (value) =>
  Boolean(
    value &&
      typeof value === "object" &&
      !Array.isArray(value)
  );

const parsePositiveId = (value) => {
  const id = Number(value);

  return Number.isInteger(id) && id > 0
    ? id
    : null;
};

const validateSelection = ({
  selection,
  fieldName,
  errors,
}) => {
  if (!isPlainObject(selection)) {
    errors[fieldName] =
      `${fieldName} must be an object.`;

    return null;
  }

  const mode = String(
    selection.mode ?? ""
  )
    .trim()
    .toLowerCase();

  if (!INTAKE_MODES.has(mode)) {
    errors[`${fieldName}.mode`] =
      `${fieldName} mode must be existing or new.`;

    return null;
  }

  if (mode === "existing") {
    const id = parsePositiveId(
      selection.id
    );

    if (!id) {
      errors[`${fieldName}.id`] =
        `A valid existing ${fieldName} ID is required.`;

      return null;
    }

    return {
      mode,
      id,
    };
  }

  if (!isPlainObject(selection.data)) {
    errors[`${fieldName}.data`] =
      `New ${fieldName} data must be an object.`;

    return null;
  }

  return {
    mode,
    data: selection.data,
  };
};

const validateIntakePayload = (body) => {
  const errors = {};

  if (!isPlainObject(body)) {
    return {
      isValid: false,
      payload: {},
      errors: {
        body:
          "Request body must be a JSON object.",
      },
    };
  }

  const client = validateSelection({
    selection: body.client,
    fieldName: "client",
    errors,
  });

  const device = validateSelection({
    selection: body.device,
    fieldName: "device",
    errors,
  });

  let order = null;

  if (!isPlainObject(body.order)) {
    errors.order =
      "Order data must be an object.";
  } else {
    order = body.order;
  }

  return {
    isValid:
      Object.keys(errors).length === 0,
    payload: {
      client,
      device,
      order,
    },
    errors,
  };
};

module.exports = {
  INTAKE_MODES,
  validateIntakePayload,
};
