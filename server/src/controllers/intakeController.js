const {
  Op,
} = require("sequelize");

const sequelize = require(
  "../config/database"
);

const Client = require(
  "../models/Client"
);
const Device = require(
  "../models/Device"
);
const Order = require(
  "../models/Order"
);

const normalizeDeviceIdentifier =
  require(
    "../utils/normalizeDeviceIdentifier"
  );

const normalizePhone = require(
  "../utils/normalizePhone"
);

const {
  encryptAccessCode,
} = require(
  "../utils/accessCodeCrypto"
);

const {
  validateClientPayload,
} = require(
  "../validators/clientValidator"
);

const {
  validateDevicePayload,
} = require(
  "../validators/deviceValidator"
);

const {
  validateOrderPayload,
} = require(
  "../validators/orderValidator"
);

const {
  validateIntakePayload,
} = require(
  "../validators/intakeValidator"
);

const OrderWithAccessCode =
  Order.scope("withAccessCode");

const orderIncludes = [
  {
    model: Client,
    as: "client",
  },
  {
    model: Device,
    as: "device",
  },
];

const createIntakeError = ({
  status,
  code,
  message,
  details,
  meta,
}) => {
  const error = new Error(message);

  error.status = status;
  error.code = code;

  if (details) {
    error.details = details;
  }

  if (meta) {
    error.meta = meta;
  }

  return error;
};

const prefixDetails = (
  prefix,
  details
) =>
  Object.fromEntries(
    Object.entries(details).map(
      ([fieldName, message]) => [
        `${prefix}.${fieldName}`,
        message,
      ]
    )
  );

const toNumberOrNull = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
};

const serializeOrder = (order) => {
  const plain = order.get({
    plain: true,
  });

  const hasAccessCode = Boolean(
    plain.accessCodeEncrypted
  );

  delete plain.accessCodeEncrypted;

  plain.price = toNumberOrNull(
    plain.price
  );

  plain.estimatedPrice =
    toNumberOrNull(
      plain.estimatedPrice
    );

  plain.finalPrice =
    toNumberOrNull(
      plain.finalPrice
    );

  plain.laborPrice =
    toNumberOrNull(
      plain.laborPrice
    ) ?? 0;

  plain.discount =
    toNumberOrNull(
      plain.discount
    ) ?? 0;

  plain.otherCosts =
    toNumberOrNull(
      plain.otherCosts
    ) ?? 0;

  plain.hasAccessCode =
    hasAccessCode;

  return plain;
};

const resolveClient = async ({
  selection,
  transaction,
}) => {
  if (
    selection.mode ===
    "existing"
  ) {
    const client =
      await Client.findByPk(
        selection.id,
        {
          transaction,
          lock:
            transaction.LOCK.UPDATE,
        }
      );

    if (!client) {
      throw createIntakeError({
        status: 404,
        code:
          "INTAKE_CLIENT_NOT_FOUND",
        message:
          "Client not found.",
      });
    }

    return {
      client,
      created: false,
    };
  }

  const validation =
    validateClientPayload(
      selection.data
    );

  if (!validation.isValid) {
    throw createIntakeError({
      status: 400,
      code:
        "INTAKE_CLIENT_VALIDATION_FAILED",
      message:
        "Client validation failed.",
      details: prefixDetails(
        "client",
        validation.errors
      ),
    });
  }

  const phoneNormalized =
    normalizePhone(
      validation.payload.phone
    );

  const existingByPhone =
    await Client.findOne({
      where: {
        phoneNormalized,
      },
      transaction,
      lock:
        transaction.LOCK.UPDATE,
    });

  if (existingByPhone) {
    throw createIntakeError({
      status: 409,
      code:
        "INTAKE_CLIENT_PHONE_CONFLICT",
      message:
        "A client with this phone number already exists.",
      meta: {
        existingClientId:
          existingByPhone.id,
      },
    });
  }

  if (validation.payload.email) {
    const existingByEmail =
      await Client.findOne({
        where: {
          email:
            validation.payload.email,
        },
        transaction,
        lock:
          transaction.LOCK.UPDATE,
      });

    if (existingByEmail) {
      throw createIntakeError({
        status: 409,
        code:
          "INTAKE_CLIENT_EMAIL_CONFLICT",
        message:
          "A client with this email address already exists.",
        meta: {
          existingClientId:
            existingByEmail.id,
        },
      });
    }
  }

  const client =
    await Client.create(
      validation.payload,
      {
        transaction,
      }
    );

  return {
    client,
    created: true,
  };
};

const findDuplicateDevice =
  async ({
    payload,
    transaction,
  }) => {
    const imeiValues = [
      normalizeDeviceIdentifier(
        payload.imei1
      ),

      normalizeDeviceIdentifier(
        payload.imei2
      ),
    ].filter(Boolean);

    const uniqueImeiValues = [
      ...new Set(imeiValues),
    ];

    if (
      uniqueImeiValues.length > 0
    ) {
      const imeiConditions =
        uniqueImeiValues.flatMap(
          (imei) => [
            {
              imei1Normalized:
                imei,
            },
            {
              imei2Normalized:
                imei,
            },
          ]
        );

      const duplicateByImei =
        await Device.findOne({
          where: {
            [Op.or]:
              imeiConditions,
          },
          transaction,
          lock:
            transaction.LOCK.UPDATE,
        });

      if (duplicateByImei) {
        return {
          device:
            duplicateByImei,
          identifier: "imei",
        };
      }
    }

    const serialNormalized =
      normalizeDeviceIdentifier(
        payload.serial
      );

    if (
      serialNormalized &&
      payload.brand
    ) {
      const duplicateBySerial =
        await Device.findOne({
          where: {
            serialNormalized,

            brand: {
              [Op.iLike]:
                payload.brand,
            },
          },
          transaction,
          lock:
            transaction.LOCK.UPDATE,
        });

      if (duplicateBySerial) {
        return {
          device:
            duplicateBySerial,
          identifier: "serial",
        };
      }
    }

    return null;
  };

const resolveDevice = async ({
  selection,
  clientId,
  transaction,
}) => {
  if (
    selection.mode ===
    "existing"
  ) {
    const device =
      await Device.findByPk(
        selection.id,
        {
          transaction,
          lock:
            transaction.LOCK.UPDATE,
        }
      );

    if (!device) {
      throw createIntakeError({
        status: 404,
        code:
          "INTAKE_DEVICE_NOT_FOUND",
        message:
          "Device not found.",
      });
    }

    if (
      device.clientId !==
      clientId
    ) {
      throw createIntakeError({
        status: 409,
        code:
          "INTAKE_DEVICE_CLIENT_MISMATCH",
        message:
          "The selected device does not belong to the selected client.",
        meta: {
          existingClientId:
            device.clientId,
          existingDeviceId:
            device.id,
        },
      });
    }

    return {
      device,
      created: false,
    };
  }

  const validation =
    validateDevicePayload({
      ...selection.data,
      clientId,
    });

  if (!validation.isValid) {
    throw createIntakeError({
      status: 400,
      code:
        "INTAKE_DEVICE_VALIDATION_FAILED",
      message:
        "Device validation failed.",
      details: prefixDetails(
        "device",
        validation.errors
      ),
    });
  }

  const duplicate =
    await findDuplicateDevice({
      payload:
        validation.payload,
      transaction,
    });

  if (duplicate) {
    const message =
      duplicate.identifier ===
      "imei"
        ? "A device with this IMEI already exists."
        : "A device from this brand with this serial number already exists.";

    throw createIntakeError({
      status: 409,
      code:
        "INTAKE_DEVICE_IDENTIFIER_CONFLICT",
      message,
      meta: {
        identifier:
          duplicate.identifier,
        existingDeviceId:
          duplicate.device.id,
        existingClientId:
          duplicate.device.clientId,
      },
    });
  }

  const device =
    await Device.create(
      validation.payload,
      {
        transaction,
      }
    );

  return {
    device,
    created: true,
  };
};

const createOrder = async ({
  orderData,
  clientId,
  deviceId,
  transaction,
}) => {
  const validation =
    validateOrderPayload({
      ...orderData,
      clientId,
      deviceId,
    });

  if (!validation.isValid) {
    throw createIntakeError({
      status: 400,
      code:
        "INTAKE_ORDER_VALIDATION_FAILED",
      message:
        "Order validation failed.",
      details: prefixDetails(
        "order",
        validation.errors
      ),
    });
  }

  const payload = {
    ...validation.payload,
  };

  const initialCustomerPrice =
    payload.finalPrice ??
    payload.estimatedPrice ??
    payload.price ??
    0;

  payload.laborPrice =
    initialCustomerPrice;

  payload.finalPrice =
    initialCustomerPrice;

  if (
    validation.accessCodeAction ===
    "set"
  ) {
    payload.accessCodeEncrypted =
      encryptAccessCode(
        validation.accessCode
      );
  } else {
    payload.accessCodeEncrypted =
      null;
  }

  if (
    payload.status ===
    "completed"
  ) {
    payload.completedAt =
      new Date();
  }

  const createdOrder =
    await Order.create(payload, {
      transaction,
    });

  const order =
    await OrderWithAccessCode.findByPk(
      createdOrder.id,
      {
        include:
          orderIncludes,
        transaction,
      }
    );

  if (!order) {
    throw createIntakeError({
      status: 500,
      code:
        "INTAKE_ORDER_READ_FAILED",
      message:
        "Created order could not be loaded.",
    });
  }

  return order;
};

const handleIntakeError = (
  res,
  error
) => {
  if (
    error.status &&
    error.code
  ) {
    const response = {
      code: error.code,
      error: error.message,
    };

    if (error.details) {
      response.details =
        error.details;
    }

    if (error.meta) {
      response.meta =
        error.meta;
    }

    return res
      .status(error.status)
      .json(response);
  }

  if (
    error.name ===
    "SequelizeUniqueConstraintError"
  ) {
    const fields = Object.keys(
      error.fields ?? {}
    );

    if (
      fields.includes("phone") ||
      fields.includes(
        "phoneNormalized"
      )
    ) {
      return res.status(409).json({
        code:
          "INTAKE_CLIENT_PHONE_CONFLICT",
        error:
          "A client with this phone number already exists.",
      });
    }

    if (
      fields.includes("email")
    ) {
      return res.status(409).json({
        code:
          "INTAKE_CLIENT_EMAIL_CONFLICT",
        error:
          "A client with this email address already exists.",
      });
    }

    return res.status(409).json({
      code:
        "INTAKE_UNIQUE_CONFLICT",
      error:
        "One of the supplied records already exists.",
    });
  }

  if (
    error.name ===
    "SequelizeValidationError"
  ) {
    return res.status(400).json({
      code:
        "INTAKE_DATABASE_VALIDATION_FAILED",
      error:
        "Intake validation failed.",
      details:
        error.errors.reduce(
          (
            details,
            validationError
          ) => {
            const field =
              validationError.path ??
              "intake";

            details[field] =
              validationError.message;

            return details;
          },
          {}
        ),
    });
  }

  if (
    error.name ===
    "SequelizeForeignKeyConstraintError"
  ) {
    return res.status(400).json({
      code:
        "INTAKE_RELATION_INVALID",
      error:
        "The selected client or device is invalid.",
    });
  }

  console.error(
    "Repair intake creation failed:",
    error
  );

  return res.status(500).json({
    code:
      "INTAKE_CREATE_FAILED",
    error:
      "Internal server error.",
  });
};

exports.createIntake = async (
  req,
  res
) => {
  const validation =
    validateIntakePayload(
      req.body
    );

  if (!validation.isValid) {
    return res.status(400).json({
      code:
        "INTAKE_VALIDATION_FAILED",
      error:
        "Intake validation failed.",
      details:
        validation.errors,
    });
  }

  try {
    const result =
      await sequelize.transaction(
        async (transaction) => {
          const clientResult =
            await resolveClient({
              selection:
                validation.payload
                  .client,
              transaction,
            });

          const deviceResult =
            await resolveDevice({
              selection:
                validation.payload
                  .device,
              clientId:
                clientResult.client
                  .id,
              transaction,
            });

          const order =
            await createOrder({
              orderData:
                validation.payload
                  .order,
              clientId:
                clientResult.client
                  .id,
              deviceId:
                deviceResult.device
                  .id,
              transaction,
            });

          const serializedOrder =
            serializeOrder(order);

          return {
            client:
              serializedOrder.client,
            device:
              serializedOrder.device,
            order:
              serializedOrder,
            created: {
              client:
                clientResult.created,
              device:
                deviceResult.created,
            },
          };
        }
      );

    return res
      .status(201)
      .json(result);
  } catch (error) {
    return handleIntakeError(
      res,
      error
    );
  }
};
