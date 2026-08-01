const { Op } = require("sequelize");

const Client = require("../models/Client");
const Device = require("../models/Device");
const Order = require("../models/Order");

const normalizeDeviceIdentifier =
  require(
    "../utils/normalizeDeviceIdentifier"
  );

const {
  validateDevicePayload,
} = require(
  "../validators/deviceValidator"
);

const deviceIncludes = [
  {
    model: Client,
    as: "client",
  },
];

const parsePositiveId = (value) => {
  const id = Number(value);

  return Number.isInteger(id) && id > 0
    ? id
    : null;
};

const sendValidationError = (
  res,
  errors
) =>
  res.status(400).json({
    error: "Device validation failed.",
    details: errors,
  });

const handleDeviceError = (
  res,
  error,
  operation
) => {
  if (
    error.name ===
    "SequelizeValidationError"
  ) {
    return res.status(400).json({
      error: "Device validation failed.",

      details: error.errors.map(
        (validationError) => ({
          field: validationError.path,
          message:
            validationError.message,
        })
      ),
    });
  }

  if (
    error.name ===
    "SequelizeUniqueConstraintError"
  ) {
    return res.status(409).json({
      error:
        "A device with these identifiers already exists.",
    });
  }

  if (
    error.name ===
    "SequelizeForeignKeyConstraintError"
  ) {
    return res.status(400).json({
      error:
        "The selected client is invalid.",
    });
  }

  console.error(
    `Device ${operation} failed:`,
    error
  );

  return res.status(500).json({
    error: "Internal server error.",
  });
};

const clientExists = async (
  clientId
) => {
  const client = await Client.findByPk(
    clientId,
    {
      attributes: ["id"],
    }
  );

  return Boolean(client);
};

const findDuplicateDevice = async ({
  payload,
  excludeDeviceId = null,
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

  if (uniqueImeiValues.length > 0) {
    const imeiConditions =
      uniqueImeiValues.flatMap(
        (imei) => [
          {
            imei1Normalized: imei,
          },
          {
            imei2Normalized: imei,
          },
        ]
      );

    const where = {
      [Op.or]: imeiConditions,
    };

    if (excludeDeviceId) {
      where.id = {
        [Op.ne]: excludeDeviceId,
      };
    }

    const duplicateByImei =
      await Device.findOne({
        where,
      });

    if (duplicateByImei) {
      return {
        device: duplicateByImei,
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
    const where = {
      serialNormalized,

      brand: {
        [Op.iLike]: payload.brand,
      },
    };

    if (excludeDeviceId) {
      where.id = {
        [Op.ne]: excludeDeviceId,
      };
    }

    const duplicateBySerial =
      await Device.findOne({
        where,
      });

    if (duplicateBySerial) {
      return {
        device: duplicateBySerial,
        identifier: "serial",
      };
    }
  }

  return null;
};

const sendDuplicateError = (
  res,
  duplicate
) => {
  const error =
    duplicate.identifier === "imei"
      ? "A device with this IMEI already exists."
      : "A device from this brand with this serial number already exists.";

  return res.status(409).json({
    error,
    existingDeviceId:
      duplicate.device.id,
  });
};

exports.getAllDevices = async (
  req,
  res
) => {
  const where = {};

  if (
    req.query.clientId !== undefined
  ) {
    const clientId = parsePositiveId(
      req.query.clientId
    );

    if (!clientId) {
      return res.status(400).json({
        error: "Invalid client ID.",
      });
    }

    where.clientId = clientId;
  }

  try {
    const devices = await Device.findAll({
      where,
      include: deviceIncludes,

      order: [
        ["createdAt", "DESC"],
        ["id", "DESC"],
      ],
    });

    return res.status(200).json(devices);
  } catch (error) {
    return handleDeviceError(
      res,
      error,
      "list"
    );
  }
};

exports.getDevice = async (
  req,
  res
) => {
  const deviceId = parsePositiveId(
    req.params.id
  );

  if (!deviceId) {
    return res.status(400).json({
      error: "Invalid device ID.",
    });
  }

  try {
    const device = await Device.findByPk(
      deviceId,
      {
        include: deviceIncludes,
      }
    );

    if (!device) {
      return res.status(404).json({
        error: "Device not found.",
      });
    }

    return res.status(200).json(device);
  } catch (error) {
    return handleDeviceError(
      res,
      error,
      "read"
    );
  }
};

exports.createDevice = async (
  req,
  res
) => {
  const validation =
    validateDevicePayload(req.body);

  if (!validation.isValid) {
    return sendValidationError(
      res,
      validation.errors
    );
  }

  try {
    const hasClient = await clientExists(
      validation.payload.clientId
    );

    if (!hasClient) {
      return res.status(404).json({
        error: "Client not found.",
      });
    }

    const duplicate =
      await findDuplicateDevice({
        payload: validation.payload,
      });

    if (duplicate) {
      return sendDuplicateError(
        res,
        duplicate
      );
    }

    const createdDevice =
      await Device.create(
        validation.payload
      );

    const device =
      await Device.findByPk(
        createdDevice.id,
        {
          include: deviceIncludes,
        }
      );

    return res.status(201).json(device);
  } catch (error) {
    return handleDeviceError(
      res,
      error,
      "create"
    );
  }
};

exports.updateDevice = async (
  req,
  res
) => {
  const deviceId = parsePositiveId(
    req.params.id
  );

  if (!deviceId) {
    return res.status(400).json({
      error: "Invalid device ID.",
    });
  }

  const validation =
    validateDevicePayload(req.body);

  if (!validation.isValid) {
    return sendValidationError(
      res,
      validation.errors
    );
  }

  try {
    const device = await Device.findByPk(
      deviceId
    );

    if (!device) {
      return res.status(404).json({
        error: "Device not found.",
      });
    }

    const hasClient = await clientExists(
      validation.payload.clientId
    );

    if (!hasClient) {
      return res.status(404).json({
        error: "Client not found.",
      });
    }

    const duplicate =
      await findDuplicateDevice({
        payload: validation.payload,
        excludeDeviceId: deviceId,
      });

    if (duplicate) {
      return sendDuplicateError(
        res,
        duplicate
      );
    }

    await device.update(
      validation.payload
    );

    const updatedDevice =
      await Device.findByPk(
        deviceId,
        {
          include: deviceIncludes,
        }
      );

    return res
      .status(200)
      .json(updatedDevice);
  } catch (error) {
    return handleDeviceError(
      res,
      error,
      "update"
    );
  }
};

exports.deleteDevice = async (
  req,
  res
) => {
  const deviceId = parsePositiveId(
    req.params.id
  );

  if (!deviceId) {
    return res.status(400).json({
      error: "Invalid device ID.",
    });
  }

  try {
    const device = await Device.findByPk(
      deviceId
    );

    if (!device) {
      return res.status(404).json({
        error: "Device not found.",
      });
    }

    const ordersCount =
      await Order.count({
        where: {
          deviceId,
        },
      });

    if (ordersCount > 0) {
      return res.status(409).json({
        error:
          "Cannot delete device because repair orders are associated with this device.",
      });
    }

    await device.destroy();

    return res.status(204).send();
  } catch (error) {
    return handleDeviceError(
      res,
      error,
      "delete"
    );
  }
};

exports.searchDevices = async (
  req,
  res
) => {
  const query = String(
    req.query.q ?? ""
  ).trim();

  if (!query) {
    return res.status(200).json([]);
  }

  if (query.length > 100) {
    return res.status(400).json({
      error:
        "Search query cannot exceed 100 characters.",
    });
  }

  const normalizedQuery =
    normalizeDeviceIdentifier(query);

  const searchConditions = [
    {
      brand: {
        [Op.iLike]: `%${query}%`,
      },
    },
    {
      model: {
        [Op.iLike]: `%${query}%`,
      },
    },
    {
      color: {
        [Op.iLike]: `%${query}%`,
      },
    },
    {
      imei1: {
        [Op.iLike]: `%${query}%`,
      },
    },
    {
      imei2: {
        [Op.iLike]: `%${query}%`,
      },
    },
    {
      serial: {
        [Op.iLike]: `%${query}%`,
      },
    },
  ];

  if (normalizedQuery) {
    searchConditions.push(
      {
        imei1Normalized: {
          [Op.like]:
            `%${normalizedQuery}%`,
        },
      },
      {
        imei2Normalized: {
          [Op.like]:
            `%${normalizedQuery}%`,
        },
      },
      {
        serialNormalized: {
          [Op.like]:
            `%${normalizedQuery}%`,
        },
      }
    );
  }

  try {
    const devices = await Device.findAll({
      where: {
        [Op.or]: searchConditions,
      },

      include: deviceIncludes,

      order: [
        ["createdAt", "DESC"],
        ["id", "DESC"],
      ],

      limit: 50,
    });

    return res.status(200).json(devices);
  } catch (error) {
    return handleDeviceError(
      res,
      error,
      "search"
    );
  }
};