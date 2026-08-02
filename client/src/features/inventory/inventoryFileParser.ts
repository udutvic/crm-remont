import type {
  WorkBook,
} from "xlsx";

import type {
  InventoryColumnMapping,
  InventoryImportField,
  InventoryImportInputRow,
} from "types";

export interface InventorySourceColumn {
  id: string;
  index: number;
  label: string;
}

export interface InventorySourceRow {
  rowNumber: number;
  values: Record<
    string,
    unknown
  >;
}

export interface InventorySheetData {
  columns: InventorySourceColumn[];
  headerRowNumber: number;
  rows: InventorySourceRow[];
}

export interface ParsedInventoryWorkbook {
  fileName: string;
  sheetNames: string[];
  workbook: WorkBook;
}

const FIELD_ORDER:
  InventoryImportField[] = [
    "sku",
    "supplierSku",
    "barcode",
    "name",
    "category",
    "brand",
    "compatibility",
    "purchasePrice",
    "salePrice",
    "quantity",
    "minStock",
    "supplier",
    "location",
    "note",
    "isActive",
    "action",
  ];

const HEADER_ALIASES:
  Record<
    InventoryImportField,
    string[]
  > = {
    sku: [
      "sku",
      "item sku",
      "article",
      "article number",
      "part number",
      "артикул",
      "код товару",
      "код товара",
      "kód položky",
      "kod polozky",
    ],

    supplierSku: [
      "supplier sku",
      "supplier code",
      "vendor sku",
      "vendor code",
      "артикул постачальника",
      "код постачальника",
      "артикул поставщика",
      "код поставщика",
      "kód dodavatele",
      "kod dodavatele",
    ],

    barcode: [
      "barcode",
      "bar code",
      "ean",
      "ean13",
      "upc",
      "штрихкод",
      "штрих код",
      "čárový kód",
      "carovy kod",
    ],

    name: [
      "name",
      "item name",
      "product",
      "product name",
      "part",
      "part name",
      "назва",
      "назва товару",
      "название",
      "наименование",
      "název",
      "nazev",
    ],

    category: [
      "category",
      "type",
      "group",
      "категорія",
      "категория",
      "група",
      "группа",
      "kategorie",
    ],

    brand: [
      "brand",
      "manufacturer",
      "бренд",
      "виробник",
      "производитель",
      "značka",
      "znacka",
      "výrobce",
      "vyrobce",
    ],

    compatibility: [
      "compatibility",
      "compatible",
      "compatible models",
      "models",
      "model",
      "сумісність",
      "сумісні моделі",
      "совместимость",
      "совместимые модели",
      "kompatibilita",
      "modely",
    ],

    purchasePrice: [
      "purchase price",
      "purchase",
      "cost",
      "cost price",
      "buy price",
      "закупівельна ціна",
      "ціна закупівлі",
      "закупочная цена",
      "себестоимость",
      "nákupní cena",
      "nakupni cena",
    ],

    salePrice: [
      "sale price",
      "selling price",
      "retail price",
      "price",
      "ціна продажу",
      "продажна ціна",
      "цена продажи",
      "розничная цена",
      "prodejní cena",
      "prodejni cena",
      "cena",
    ],

    quantity: [
      "quantity",
      "qty",
      "stock",
      "stock quantity",
      "balance",
      "кількість",
      "залишок",
      "остаток",
      "количество",
      "množství",
      "mnozstvi",
      "stav",
      "sklad",
    ],

    minStock: [
      "minimum stock",
      "min stock",
      "minimum",
      "reorder level",
      "мінімальний залишок",
      "мінімум",
      "минимальный остаток",
      "минимум",
      "minimální stav",
      "minimalni stav",
    ],

    supplier: [
      "supplier",
      "vendor",
      "постачальник",
      "поставщик",
      "dodavatel",
    ],

    location: [
      "location",
      "storage location",
      "shelf",
      "bin",
      "місце",
      "місце зберігання",
      "полиця",
      "место",
      "место хранения",
      "полка",
      "umístění",
      "umisteni",
      "pozice",
    ],

    note: [
      "note",
      "notes",
      "comment",
      "description",
      "примітка",
      "коментар",
      "опис",
      "примечание",
      "комментарий",
      "описание",
      "poznámka",
      "poznamka",
      "popis",
    ],

    isActive: [
      "active",
      "is active",
      "enabled",
      "активна",
      "активний",
      "активно",
      "активная",
      "активный",
      "aktivní",
      "aktivni",
    ],

    action: [
      "action",
      "import action",
      "дія",
      "действие",
      "akce",
    ],
  };

const normalizeHeader = (
  value: unknown
): string =>
  String(
    value ?? ""
  )
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .replace(
      /[_\-./\\]+/g,
      " "
    )
    .replace(
      /[^a-z0-9а-яіїєґё\s]+/gi,
      ""
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();

const isEmptyCell = (
  value: unknown
): boolean =>
  value === null ||
  value === undefined ||
  String(value).trim() === "";

const createUniqueLabels = (
  values: unknown[]
): string[] => {
  const counts =
    new Map<string, number>();

  return values.map(
    (
      value,
      index
    ) => {
      const base =
        String(
          value ?? ""
        ).trim() ||
        `Column ${index + 1}`;

      const next =
        (
          counts.get(
            base
          ) ?? 0
        ) + 1;

      counts.set(
        base,
        next
      );

      return next === 1
        ? base
        : `${base} (${next})`;
    }
  );
};

export const parseInventoryFile =
  async (
    file: File
  ): Promise<ParsedInventoryWorkbook> => {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase();

    if (
      !extension ||
      ![
        "xlsx",
        "xls",
        "csv",
      ].includes(
        extension
      )
    ) {
      throw new Error(
        "UNSUPPORTED_FILE"
      );
    }

    const XLSX =
      await import(
        "xlsx"
      );

    const data =
      await file.arrayBuffer();

    const workbook =
      XLSX.read(
        data,
        {
          type: "array",
          cellDates: false,
        }
      );

    if (
      workbook.SheetNames
        .length === 0
    ) {
      throw new Error(
        "EMPTY_WORKBOOK"
      );
    }

    return {
      fileName:
        file.name,
      sheetNames:
        workbook.SheetNames,
      workbook,
    };
  };

export const extractInventorySheet =
  async (
    workbook: WorkBook,
    sheetName: string
  ): Promise<InventorySheetData> => {
    const worksheet =
      workbook.Sheets[
        sheetName
      ];

    if (!worksheet) {
      throw new Error(
        "SHEET_NOT_FOUND"
      );
    }

    const XLSX =
      await import(
        "xlsx"
      );

    const matrix =
      XLSX.utils
        .sheet_to_json<
          unknown[]
        >(
          worksheet,
          {
            header: 1,
            defval: "",
            raw: true,
            blankrows: false,
          }
        );

    const headerIndex =
      matrix.findIndex(
        (
          row
        ) =>
          Array.isArray(
            row
          ) &&
          row.some(
            (
              cell
            ) =>
              !isEmptyCell(
                cell
              )
          )
      );

    if (
      headerIndex < 0
    ) {
      throw new Error(
        "EMPTY_SHEET"
      );
    }

    const rawHeaders =
      matrix[
        headerIndex
      ] ?? [];

    const labels =
      createUniqueLabels(
        rawHeaders
      );

    const columns =
      labels.map(
        (
          label,
          index
        ) => ({
          id:
            `column_${index}`,
          index,
          label,
        })
      );

    const rows:
      InventorySourceRow[] =
      [];

    for (
      let index =
        headerIndex + 1;
      index <
      matrix.length;
      index += 1
    ) {
      const source =
        matrix[index] ??
        [];

      if (
        !source.some(
          (
            cell
          ) =>
            !isEmptyCell(
              cell
            )
        )
      ) {
        continue;
      }

      const values:
        Record<
          string,
          unknown
        > = {};

      for (
        const column of
        columns
      ) {
        values[
          column.id
        ] =
          source[
            column.index
          ] ?? "";
      }

      rows.push({
        rowNumber:
          index + 1,
        values,
      });
    }

    return {
      columns,
      headerRowNumber:
        headerIndex + 1,
      rows,
    };
  };

export const autoMapInventoryColumns =
  (
    columns:
      InventorySourceColumn[]
  ): InventoryColumnMapping => {
    const mapping:
      InventoryColumnMapping =
      {};

    const used =
      new Set<string>();

    for (
      const field of
      FIELD_ORDER
    ) {
      const aliases =
        new Set(
          HEADER_ALIASES[
            field
          ].map(
            normalizeHeader
          )
        );

      const matching =
        columns.filter(
          (
            column
          ) =>
            !used.has(
              column.id
            ) &&
            aliases.has(
              normalizeHeader(
                column.label
              )
            )
        );

      if (
        matching.length === 1
      ) {
        mapping[field] =
          matching[0].id;

        used.add(
          matching[0].id
        );
      }
    }

    return mapping;
  };

const asText = (
  value: unknown
): string =>
  String(
    value ?? ""
  ).trim();

const asNumber = (
  value: unknown
):
  | number
  | string => {
  if (
    typeof value ===
      "number" &&
    Number.isFinite(
      value
    )
  ) {
    return value;
  }

  const raw =
    asText(
      value
    );

  if (!raw) {
    return "";
  }

  const compact =
    raw.replace(
      /\s+/g,
      ""
    );

  let normalized =
    compact;

  const comma =
    compact.lastIndexOf(
      ","
    );

  const dot =
    compact.lastIndexOf(
      "."
    );

  if (
    comma >= 0 &&
    dot >= 0
  ) {
    if (
      comma > dot
    ) {
      normalized =
        compact
          .replace(
            /\./g,
            ""
          )
          .replace(
            ",",
            "."
          );
    } else {
      normalized =
        compact.replace(
          /,/g,
          ""
        );
    }
  } else if (
    comma >= 0
  ) {
    normalized =
      compact.replace(
        ",",
        "."
      );
  }

  const number =
    Number(
      normalized
    );

  return Number.isFinite(
    number
  )
    ? number
    : raw;
};

const asBoolean = (
  value: unknown
):
  | boolean
  | string => {
  if (
    typeof value ===
    "boolean"
  ) {
    return value;
  }

  if (
    value === 1
  ) {
    return true;
  }

  if (
    value === 0
  ) {
    return false;
  }

  const normalized =
    normalizeHeader(
      value
    );

  if (
    [
      "true",
      "yes",
      "y",
      "1",
      "ano",
      "tak",
      "так",
      "да",
      "active",
      "aktivni",
    ].includes(
      normalized
    )
  ) {
    return true;
  }

  if (
    [
      "false",
      "no",
      "n",
      "0",
      "ne",
      "ni",
      "ні",
      "нет",
      "inactive",
      "neaktivni",
    ].includes(
      normalized
    )
  ) {
    return false;
  }

  return asText(
    value
  );
};

export const buildInventoryImportRows =
  (
    rows:
      InventorySourceRow[],
    mapping:
      InventoryColumnMapping
  ): InventoryImportInputRow[] =>
    rows.map(
      (
        sourceRow
      ) => {
        const result:
          InventoryImportInputRow =
          {
            rowNumber:
              sourceRow.rowNumber,
          };

        const getValue = (
          field:
            InventoryImportField
        ): unknown => {
          const columnId =
            mapping[field];

          return columnId
            ? sourceRow
                .values[
                  columnId
                ]
            : undefined;
        };

        const setText = (
          field:
            Exclude<
              InventoryImportField,
              | "purchasePrice"
              | "salePrice"
              | "quantity"
              | "minStock"
              | "isActive"
            >,
          {
            includeEmpty = false,
          } = {}
        ): void => {
          if (
            !mapping[field]
          ) {
            return;
          }

          const value =
            asText(
              getValue(
                field
              )
            );

          if (
            value ||
            includeEmpty
          ) {
            result[field] =
              value;
          }
        };

        setText(
          "sku",
          {
            includeEmpty: true,
          }
        );

        setText(
          "name",
          {
            includeEmpty: true,
          }
        );

        setText(
          "category",
          {
            includeEmpty: true,
          }
        );

        for (
          const field of [
            "supplierSku",
            "barcode",
            "brand",
            "compatibility",
            "supplier",
            "location",
            "note",
            "action",
          ] as const
        ) {
          setText(
            field
          );
        }

        for (
          const field of [
            "purchasePrice",
            "salePrice",
            "quantity",
            "minStock",
          ] as const
        ) {
          if (
            !mapping[field]
          ) {
            continue;
          }

          const value =
            asNumber(
              getValue(
                field
              )
            );

          if (
            value !== ""
          ) {
            result[field] =
              value;
          }
        }

        if (
          mapping.isActive
        ) {
          const raw =
            getValue(
              "isActive"
            );

          if (
            !isEmptyCell(
              raw
            )
          ) {
            result.isActive =
              asBoolean(
                raw
              );
          }
        }

        return result;
      }
    );
