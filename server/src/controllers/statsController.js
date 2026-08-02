const {
  col,
  fn,
} = require(
  "sequelize"
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

const toFiniteNumber = (
  value
) => {
  const number =
    Number(value);

  return Number.isFinite(
    number
  )
    ? number
    : 0;
};

exports.getDashboardStats =
  async (
    req,
    res
  ) => {
    try {
      const [
        clientCount,
        deviceCount,
        orderCount,
        incomeRow,
        recentOrders,
      ] = await Promise.all([
        Client.count(),

        Device.count(),

        Order.count(),

        Order.findOne({
          attributes: [
            [
              fn(
                "COALESCE",
                fn(
                  "SUM",
                  fn(
                    "COALESCE",
                    col(
                      "finalPrice"
                    ),
                    col(
                      "price"
                    ),
                    0
                  )
                ),
                0
              ),
              "totalIncome",
            ],
          ],

          where: {
            status:
              "completed",
          },

          raw: true,
        }),

        Order.findAll({
          attributes: [
            "id",
            "clientId",
            "deviceId",
            "status",
            "receivedAt",
            "createdAt",
          ],

          include: [
            {
              model: Client,
              as: "client",

              attributes: [
                "id",
                "name",
                "email",
              ],
            },
            {
              model: Device,
              as: "device",

              attributes: [
                "id",
                "clientId",
                "deviceType",
                "brand",
                "model",
              ],
            },
          ],

          order: [
            [
              "id",
              "DESC",
            ],
          ],

          limit: 5,
        }),
      ]);

      return res
        .status(200)
        .json({
          clientCount,
          deviceCount,
          orderCount,

          totalIncome:
            toFiniteNumber(
              incomeRow
                ?.totalIncome
            ),

          recentOrders,
        });
    } catch (error) {
      console.error(
        "Dashboard statistics load failed:",
        error
      );

      return res
        .status(500)
        .json({
          code:
            "DASHBOARD_STATS_INTERNAL_ERROR",

          error:
            "Internal server error.",
        });
    }
  };
