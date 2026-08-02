const {
  DataTypes,
} = require(
  "sequelize"
);

const sequelize = require(
  "../config/database"
);

const Order = require(
  "./Order"
);

const User = require(
  "./User"
);

const PHOTO_CATEGORIES = [
  "before",
  "during",
  "after",
];

const normalizeOptionalText = (
  value
) => {
  const normalized =
    String(
      value ?? ""
    ).trim();

  return normalized || null;
};

const OrderPhoto =
  sequelize.define(
    "OrderPhoto",
    {
      id: {
        type:
          DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      orderId: {
        type:
          DataTypes.INTEGER,
        allowNull: false,
      },

      storagePath: {
        type:
          DataTypes.STRING(500),
        allowNull: false,
        unique: true,
      },

      category: {
        type:
          DataTypes.STRING(20),
        allowNull: false,

        validate: {
          isIn: [
            PHOTO_CATEGORIES,
          ],
        },
      },

      caption: {
        type:
          DataTypes.TEXT,
        allowNull: true,
      },

      originalName: {
        type:
          DataTypes.STRING(255),
        allowNull: false,
      },

      mimeType: {
        type:
          DataTypes.STRING(100),
        allowNull: false,
      },

      fileSize: {
        type:
          DataTypes.INTEGER,
        allowNull: false,

        validate: {
          min: 1,
        },
      },

      width: {
        type:
          DataTypes.INTEGER,
        allowNull: true,

        validate: {
          min: 1,
        },
      },

      height: {
        type:
          DataTypes.INTEGER,
        allowNull: true,

        validate: {
          min: 1,
        },
      },

      uploadedBy: {
        type:
          DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName:
        "order_photos",
      timestamps: true,

      hooks: {
        beforeValidate(
          photo
        ) {
          if (
            photo.category !==
            undefined
          ) {
            photo.category =
              String(
                photo.category ??
                  ""
              )
                .trim()
                .toLowerCase();
          }

          if (
            photo.caption !==
            undefined
          ) {
            photo.caption =
              normalizeOptionalText(
                photo.caption
              );
          }

          if (
            photo.originalName !==
            undefined
          ) {
            photo.originalName =
              String(
                photo.originalName ??
                  ""
              )
                .trim()
                .slice(
                  0,
                  255
                );
          }
        },
      },
    }
  );

OrderPhoto.PHOTO_CATEGORIES =
  PHOTO_CATEGORIES;

OrderPhoto.belongsTo(
  Order,
  {
    foreignKey:
      "orderId",
    as: "order",
  }
);

Order.hasMany(
  OrderPhoto,
  {
    foreignKey:
      "orderId",
    as: "photos",
  }
);

OrderPhoto.belongsTo(
  User,
  {
    foreignKey:
      "uploadedBy",
    as: "uploadedByUser",
  }
);

User.hasMany(
  OrderPhoto,
  {
    foreignKey:
      "uploadedBy",
    as: "uploadedOrderPhotos",
  }
);

module.exports =
  OrderPhoto;
