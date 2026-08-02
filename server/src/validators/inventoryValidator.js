const MOVEMENT_TYPES =
  new Set([
    "receipt",
    "issue",
    "return",
    "adjustment",
  ]);

const normalizeText = (
  value
) =>
  String(
    value ?? ""
  ).trim();

const optionalText = (
  value,
  maxLength
) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return {
      value: null,
    };
  }

  const normalized =
    normalizeText(
      value
    );

  if (
    normalized.length >
    maxLength
  ) {
    return {
      error:
        `Cannot exceed ${maxLength} characters.`,
    };
  }

  return {
    value:
      normalized || null,
  };
};

const requiredText = (
  value,
  maxLength
) => {
  const normalized =
    normalizeText(
      value
    );

  if (!normalized) {
    return {
      error:
        "This field is required.",
    };
  }

  if (
    normalized.length >
    maxLength
  ) {
    return {
      error:
        `Cannot exceed ${maxLength} characters.`,
    };
  }

  return {
    value: normalized,
  };
};

const nonNegativeInteger = (
  value,
  {
    defaultValue,
  }
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return {
      value:
        defaultValue,
    };
  }

  const number =
    Number(value);

  if (
    !Number.isInteger(
      number
    ) ||
    number < 0
  ) {
    return {
      error:
        "Must be a non-negative whole number.",
    };
  }

  return {
    value: number,
  };
};

const moneyValue = (
  value,
  {
    defaultValue,
    allowNull = false,
  }
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return {
      value:
        allowNull
          ? null
          : defaultValue,
    };
  }

  const number =
    Number(value);

  if (
    !Number.isFinite(
      number
    ) ||
    number < 0 ||
    number >
      9999999999.99
  ) {
    return {
      error:
        "Must be a valid non-negative amount.",
    };
  }

  return {
    value:
      Math.round(
        number * 100
      ) / 100,
  };
};

const booleanValue = (
  value,
  defaultValue
) => {
  if (
    value === undefined
  ) {
    return defaultValue;
  }

  if (
    typeof value ===
    "boolean"
  ) {
    return value;
  }

  if (
    value === "true" ||
    value === 1 ||
    value === "1"
  ) {
    return true;
  }

  if (
    value === "false" ||
    value === 0 ||
    value === "0"
  ) {
    return false;
  }

  return null;
};

const validateItemPayload = (
  body,
  {
    isUpdate = false,
  } = {}
) => {
  const errors = {};
  const payload = {};

  const requiredFields = [
    [
      "sku",
      100,
    ],
    [
      "name",
      200,
    ],
    [
      "category",
      120,
    ],
  ];

  for (
    const [
      field,
      maxLength,
    ] of requiredFields
  ) {
    if (
      isUpdate &&
      body[field] ===
        undefined
    ) {
      continue;
    }

    const result =
      requiredText(
        body[field],
        maxLength
      );

    if (result.error) {
      errors[field] =
        result.error;
    } else {
      payload[field] =
        field === "sku"
          ? result.value
              .toUpperCase()
          : result.value;
    }
  }

  const optionalFields = [
    [
      "supplierSku",
      120,
    ],
    [
      "barcode",
      120,
    ],
    [
      "brand",
      120,
    ],
    [
      "compatibility",
      4000,
    ],
    [
      "supplier",
      200,
    ],
    [
      "location",
      200,
    ],
    [
      "note",
      4000,
    ],
  ];

  for (
    const [
      field,
      maxLength,
    ] of optionalFields
  ) {
    if (
      body[field] ===
      undefined
    ) {
      continue;
    }

    const result =
      optionalText(
        body[field],
        maxLength
      );

    if (result.error) {
      errors[field] =
        result.error;
    } else {
      payload[field] =
        field ===
          "supplierSku" &&
        result.value
          ? result.value
              .toUpperCase()
          : result.value;
    }
  }

  for (
    const field of [
      "purchasePrice",
      "salePrice",
    ]
  ) {
    if (
      isUpdate &&
      body[field] ===
        undefined
    ) {
      continue;
    }

    const result =
      moneyValue(
        body[field],
        {
          defaultValue: 0,
        }
      );

    if (result.error) {
      errors[field] =
        result.error;
    } else {
      payload[field] =
        result.value;
    }
  }

  if (
    !isUpdate ||
    body.minStock !==
      undefined
  ) {
    const result =
      nonNegativeInteger(
        body.minStock,
        {
          defaultValue: 0,
        }
      );

    if (result.error) {
      errors.minStock =
        result.error;
    } else {
      payload.minStock =
        result.value;
    }
  }

  if (
    !isUpdate ||
    body.isActive !==
      undefined
  ) {
    const isActive =
      booleanValue(
        body.isActive,
        true
      );

    if (
      isActive === null
    ) {
      errors.isActive =
        "Must be true or false.";
    } else {
      payload.isActive =
        isActive;
    }
  }

  let initialQuantity = 0;

  if (!isUpdate) {
    const result =
      nonNegativeInteger(
        body.initialQuantity,
        {
          defaultValue: 0,
        }
      );

    if (result.error) {
      errors.initialQuantity =
        result.error;
    } else {
      initialQuantity =
        result.value;
    }
  }

  return {
    isValid:
      Object.keys(
        errors
      ).length === 0,

    errors,
    payload,
    initialQuantity,
  };
};

const positiveId = (
  value
) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number =
    Number(value);

  return (
    Number.isInteger(
      number
    ) &&
    number > 0
  )
    ? number
    : null;
};

const validateMovementPayload = (
  body
) => {
  const errors = {};
  const payload = {};

  const type =
    normalizeText(
      body.type
    ).toLowerCase();

  if (
    !MOVEMENT_TYPES.has(
      type
    )
  ) {
    errors.type =
      "Unsupported stock movement type.";
  } else {
    payload.type =
      type;
  }

  const quantity =
    Number(
      body.quantity
    );

  if (
    !Number.isInteger(
      quantity
    ) ||
    quantity === 0
  ) {
    errors.quantity =
      "Quantity must be a non-zero whole number.";
  } else if (
    type !==
      "adjustment" &&
    quantity < 0
  ) {
    errors.quantity =
      "Receipt, issue and return quantity must be positive.";
  } else {
    payload.quantity =
      quantity;
  }

  const unitCost =
    moneyValue(
      body.unitCost,
      {
        defaultValue: null,
        allowNull: true,
      }
    );

  if (unitCost.error) {
    errors.unitCost =
      unitCost.error;
  } else if (
    unitCost.value !== null &&
    !Number.isInteger(
      unitCost.value
    )
  ) {
    errors.unitCost =
      "Unit cost must be a whole amount in CZK.";
  } else {
    payload.unitCost =
      unitCost.value;
  }

  const unitPrice =
    moneyValue(
      body.unitPrice,
      {
        defaultValue: null,
        allowNull: true,
      }
    );

  if (unitPrice.error) {
    errors.unitPrice =
      unitPrice.error;
  } else if (
    unitPrice.value !== null &&
    !Number.isInteger(
      unitPrice.value
    )
  ) {
    errors.unitPrice =
      "Unit price must be a whole amount in CZK.";
  } else {
    payload.unitPrice =
      unitPrice.value;
  }

  const note =
    optionalText(
      body.note,
      4000
    );

  if (note.error) {
    errors.note =
      note.error;
  } else {
    payload.note =
      note.value;
  }

  const orderId =
    positiveId(
      body.orderId
    );

  if (
    (
      type === "issue" ||
      type === "return"
    ) &&
    !orderId
  ) {
    errors.orderId =
      "An order is required for issue and return movements.";
  } else if (
    body.orderId !==
      undefined &&
    body.orderId !==
      null &&
    body.orderId !==
      "" &&
    !orderId
  ) {
    errors.orderId =
      "Order ID is invalid.";
  } else {
    payload.orderId =
      orderId;
  }

  return {
    isValid:
      Object.keys(
        errors
      ).length === 0,

    errors,
    payload,
  };
};

module.exports = {
  MOVEMENT_TYPES,
  positiveId,
  validateItemPayload,
  validateMovementPayload,
};
