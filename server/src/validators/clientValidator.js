const normalizePhone = require(
  "../utils/normalizePhone"
);

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const hasOwnField = (object, fieldName) =>
  Object.prototype.hasOwnProperty.call(
    object,
    fieldName
  );

const normalizeOptionalText = (value) => {
  const normalized = String(value ?? "").trim();

  return normalized.length > 0
    ? normalized
    : null;
};

const validateClientPayload = (body) => {
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
        body: "Request body must be a JSON object.",
      },
    };
  }

  const name = String(body.name ?? "").trim();

  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length > 120) {
    errors.name =
      "Name cannot exceed 120 characters.";
  } else {
    payload.name = name;
  }

  const phone = String(body.phone ?? "").trim();
  const phoneNormalized = normalizePhone(phone);

  if (!phone) {
    errors.phone = "Phone is required.";
  } else if (
    phoneNormalized.length < 8 ||
    phoneNormalized.length > 15
  ) {
    errors.phone =
      "Phone must contain between 8 and 15 digits.";
  } else {
    payload.phone = phone;
  }

  if (hasOwnField(body, "email")) {
    const email = normalizeOptionalText(
      body.email
    );

    if (email && email.length > 160) {
      errors.email =
        "Email cannot exceed 160 characters.";
    } else if (
      email &&
      !EMAIL_PATTERN.test(email)
    ) {
      errors.email = "Invalid email format.";
    } else {
      payload.email = email
        ? email.toLowerCase()
        : null;
    }
  }

  if (hasOwnField(body, "secondaryPhone")) {
    const secondaryPhone =
      normalizeOptionalText(
        body.secondaryPhone
      );

    if (secondaryPhone) {
      const normalizedSecondaryPhone =
        normalizePhone(secondaryPhone);

      if (
        normalizedSecondaryPhone.length < 8 ||
        normalizedSecondaryPhone.length > 15
      ) {
        errors.secondaryPhone =
          "Secondary phone must contain between 8 and 15 digits.";
      } else {
        payload.secondaryPhone =
          secondaryPhone;
      }
    } else {
      payload.secondaryPhone = null;
    }
  }

  if (hasOwnField(body, "address")) {
    const address = normalizeOptionalText(
      body.address
    );

    if (address && address.length > 255) {
      errors.address =
        "Address cannot exceed 255 characters.";
    } else {
      payload.address = address;
    }
  }

  if (hasOwnField(body, "note")) {
    const note = normalizeOptionalText(
      body.note
    );

    if (note && note.length > 2000) {
      errors.note =
        "Note cannot exceed 2000 characters.";
    } else {
      payload.note = note;
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
  validateClientPayload,
};