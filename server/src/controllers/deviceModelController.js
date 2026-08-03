const { Op } = require(
  "sequelize"
);

const DeviceModel = require(
  "../models/DeviceModel"
);

const parseLimit = (value) => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    return 20;
  }

  return Math.min(
    Math.max(parsed, 1),
    50
  );
};

const normalizeAliases = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((alias) =>
      String(alias ?? "").trim()
    )
    .filter(Boolean)
    .slice(0, 20);
};

const validatePayload = (body) => {
  const deviceType = String(
    body.deviceType ?? "phone"
  )
    .trim()
    .toLowerCase();
  const brand = String(
    body.brand ?? ""
  ).trim();
  const model = String(
    body.model ?? ""
  ).trim();

  const errors = [];

  if (
    !DeviceModel.DEVICE_TYPES.includes(
      deviceType
    )
  ) {
    errors.push({
      field: "deviceType",
      message: "Unsupported device type.",
    });
  }

  if (!brand || brand.length > 120) {
    errors.push({
      field: "brand",
      message:
        "Brand is required and cannot exceed 120 characters.",
    });
  }

  if (!model || model.length > 160) {
    errors.push({
      field: "model",
      message:
        "Model is required and cannot exceed 160 characters.",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    payload: {
      deviceType,
      brand,
      model,
      aliases: normalizeAliases(
        body.aliases
      ),
    },
  };
};

exports.listDeviceModels = async (
  req,
  res
) => {
  const query = String(
    req.query.q ?? ""
  ).trim();
  const limit = parseLimit(
    req.query.limit
  );

  if (query.length > 100) {
    return res.status(400).json({
      error:
        "Search query cannot exceed 100 characters.",
    });
  }

  const where = {
    isActive: true,
  };

  if (query) {
    where[Op.or] = [
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
    ];
  }

  try {
    const models =
      await DeviceModel.findAll({
        where,
        order: [
          ["usageCount", "DESC"],
          ["brand", "ASC"],
          ["model", "ASC"],
          ["id", "ASC"],
        ],
        limit,
      });

    return res.status(200).json(
      models
    );
  } catch (error) {
    console.error(
      "Device model list failed:",
      error
    );

    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};

exports.createDeviceModel = async (
  req,
  res
) => {
  const validation = validatePayload(
    req.body ?? {}
  );

  if (!validation.isValid) {
    return res.status(400).json({
      error:
        "Device model validation failed.",
      details: validation.errors,
    });
  }

  try {
    const deviceModel =
      await DeviceModel.create(
        validation.payload
      );

    return res.status(201).json(
      deviceModel
    );
  } catch (error) {
    if (
      error.name ===
      "SequelizeUniqueConstraintError"
    ) {
      const existing =
        await DeviceModel.findOne({
          where: {
            normalizedKey:
              DeviceModel.buildNormalizedKey(
                validation.payload.deviceType,
                validation.payload.brand,
                validation.payload.model
              ),
          },
        });

      return res.status(409).json({
        error:
          "This device model already exists.",
        deviceModel: existing,
      });
    }

    console.error(
      "Device model create failed:",
      error
    );

    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};
