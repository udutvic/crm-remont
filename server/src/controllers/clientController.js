const { Op } = require("sequelize");

const Client = require("../models/Client");
const Device = require("../models/Device");
const Order = require("../models/Order");
const normalizePhone = require(
  "../utils/normalizePhone"
);
const {
  validateClientPayload,
} = require("../validators/clientValidator");

const clientIncludes = [
  {
    model: Device,
    as: "devices",
  },
];

const parseClientId = (value) => {
  const id = Number(value);

  return Number.isInteger(id) && id > 0
    ? id
    : null;
};

const sendValidationError = (
  res,
  errors
) => {
  return res.status(400).json({
    error: "Client validation failed.",
    details: errors,
  });
};

const handleClientError = (
  res,
  error,
  operation
) => {
  if (
    error.name ===
    "SequelizeUniqueConstraintError"
  ) {
    const fields = Object.keys(
      error.fields ?? {}
    );

    if (
      fields.includes("phone") ||
      fields.includes("phoneNormalized")
    ) {
      return res.status(409).json({
        error:
          "A client with this phone number already exists.",
      });
    }

    if (fields.includes("email")) {
      return res.status(409).json({
        error:
          "A client with this email address already exists.",
      });
    }

    return res.status(409).json({
      error:
        "Client with these details already exists.",
    });
  }

  if (
    error.name ===
    "SequelizeValidationError"
  ) {
    return res.status(400).json({
      error: "Client validation failed.",
      details: error.errors.map(
        (validationError) => ({
          field: validationError.path,
          message: validationError.message,
        })
      ),
    });
  }

  console.error(
    `Client ${operation} failed:`,
    error
  );

  return res.status(500).json({
    error: "Internal server error.",
  });
};

exports.getAllClients = async (
  req,
  res
) => {
  try {
    const clients = await Client.findAll({
      include: clientIncludes,
      order: [
        ["name", "ASC"],
        ["id", "ASC"],
      ],
    });

    return res.status(200).json(clients);
  } catch (error) {
    return handleClientError(
      res,
      error,
      "list"
    );
  }
};

exports.getClient = async (req, res) => {
  const clientId = parseClientId(
    req.params.id
  );

  if (!clientId) {
    return res.status(400).json({
      error: "Invalid client ID.",
    });
  }

  try {
    const client = await Client.findByPk(
      clientId,
      {
        include: clientIncludes,
      }
    );

    if (!client) {
      return res.status(404).json({
        error: "Client not found.",
      });
    }

    return res.status(200).json(client);
  } catch (error) {
    return handleClientError(
      res,
      error,
      "read"
    );
  }
};

exports.createClient = async (
  req,
  res
) => {
  const validation =
    validateClientPayload(req.body);

  if (!validation.isValid) {
    return sendValidationError(
      res,
      validation.errors
    );
  }

  try {
    const client = await Client.create(
      validation.payload
    );

    return res.status(201).json(client);
  } catch (error) {
    return handleClientError(
      res,
      error,
      "create"
    );
  }
};

exports.updateClient = async (
  req,
  res
) => {
  const clientId = parseClientId(
    req.params.id
  );

  if (!clientId) {
    return res.status(400).json({
      error: "Invalid client ID.",
    });
  }

  const validation =
    validateClientPayload(req.body);

  if (!validation.isValid) {
    return sendValidationError(
      res,
      validation.errors
    );
  }

  try {
    const client = await Client.findByPk(
      clientId
    );

    if (!client) {
      return res.status(404).json({
        error: "Client not found.",
      });
    }

    await client.update(
      validation.payload
    );

    return res.status(200).json(client);
  } catch (error) {
    return handleClientError(
      res,
      error,
      "update"
    );
  }
};

exports.deleteClient = async (
  req,
  res
) => {
  const clientId = parseClientId(
    req.params.id
  );

  if (!clientId) {
    return res.status(400).json({
      error: "Invalid client ID.",
    });
  }

  try {
    const client = await Client.findByPk(
      clientId
    );

    if (!client) {
      return res.status(404).json({
        error: "Client not found.",
      });
    }

    const [ordersCount, devicesCount] =
      await Promise.all([
        Order.count({
          where: {
            clientId,
          },
        }),

        Device.count({
          where: {
            clientId,
          },
        }),
      ]);

    if (ordersCount > 0) {
      return res.status(409).json({
        error:
          "Cannot delete client because repair orders are associated with this client.",
      });
    }

    if (devicesCount > 0) {
      return res.status(409).json({
        error:
          "Cannot delete client because devices are associated with this client.",
      });
    }

    await client.destroy();

    return res.status(204).send();
  } catch (error) {
    return handleClientError(
      res,
      error,
      "delete"
    );
  }
};

exports.lookupClientByPhone = async (
  req,
  res
) => {
  const rawPhone = String(
    req.query.phone ?? ""
  ).trim();

  if (!rawPhone) {
    return res.status(400).json({
      error:
        "Phone query parameter is required.",
    });
  }

  const phoneNormalized =
    normalizePhone(rawPhone);

  if (
    phoneNormalized.length < 8 ||
    phoneNormalized.length > 15
  ) {
    return res.status(400).json({
      error:
        "Phone must contain between 8 and 15 digits.",
    });
  }

  try {
    const client = await Client.findOne({
      where: {
        phoneNormalized,
      },
      include: clientIncludes,
    });

    return res.status(200).json({
      found: Boolean(client),
      client: client ?? null,
    });
  } catch (error) {
    return handleClientError(
      res,
      error,
      "phone lookup"
    );
  }
};

exports.searchClients = async (
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
    normalizePhone(query);

  const searchConditions = [
    {
      name: {
        [Op.iLike]: `%${query}%`,
      },
    },
    {
      phone: {
        [Op.iLike]: `%${query}%`,
      },
    },
    {
      secondaryPhone: {
        [Op.iLike]: `%${query}%`,
      },
    },
    {
      email: {
        [Op.iLike]: `%${query}%`,
      },
    },
  ];

  if (normalizedQuery) {
    searchConditions.push({
      phoneNormalized: {
        [Op.like]: `%${normalizedQuery}%`,
      },
    });
  }

  try {
    const clients = await Client.findAll({
      where: {
        [Op.or]: searchConditions,
      },
      include: clientIncludes,
      order: [
        ["name", "ASC"],
        ["id", "ASC"],
      ],
      limit: 50,
    });

    return res.status(200).json(clients);
  } catch (error) {
    return handleClientError(
      res,
      error,
      "search"
    );
  }
};