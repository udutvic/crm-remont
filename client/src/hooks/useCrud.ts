import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  useTranslation,
} from "react-i18next";

import getDeleteErrorMessage from "utils/getDeleteErrorMessage";

interface Entity {
  id?: number;
  _deleteMessage?: string;
}

interface CrudFunctions<
  TEntity extends Entity,
  TPayload = TEntity
> {
  getAll: () => Promise<TEntity[]>;

  create: (
    data: TPayload
  ) => Promise<TEntity>;

  update: (
    id: number,
    data: TPayload
  ) => Promise<TEntity>;

  remove: (
    id: number
  ) => Promise<void>;
}

export default function useCrud<
  TEntity extends Entity,
  TPayload = TEntity
>({
  getAll,
  create,
  update,
  remove,
}: CrudFunctions<
  TEntity,
  TPayload
>) {
  const {
    t,
  } = useTranslation();

  const [
    items,
    setItems,
  ] = useState<TEntity[]>([]);

  const [
    selectedItem,
    setSelectedItem,
  ] = useState<
    TEntity | undefined
  >();

  const [
    openForm,
    setOpenForm,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const [
    itemToDelete,
    setItemToDelete,
  ] = useState<
    TEntity | null
  >(null);

  const [
    deleteDialogMessage,
    setDeleteDialogMessage,
  ] = useState("");

  const [
    isDeleteEnabled,
    setIsDeleteEnabled,
  ] = useState(true);

  const loadItems =
    useCallback(
      async (): Promise<void> => {
        setLoading(true);

        try {
          const data =
            await getAll();

          setItems(data);
          setError(null);
        } catch (
          loadError: unknown
        ) {
          console.error(
            "Error loading items:",
            loadError
          );

          setError(
            "Failed to load items"
          );
        } finally {
          setLoading(false);
        }
      },
      [getAll]
    );

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const handleAdd =
    useCallback(
      (): void => {
        setSelectedItem(
          undefined
        );

        setOpenForm(true);
      },
      []
    );

  const handleEdit =
    useCallback(
      (
        item: TEntity
      ): void => {
        setSelectedItem(item);
        setOpenForm(true);
      },
      []
    );

  const handleDelete =
    useCallback(
      (
        item: TEntity,
        nameField?:
          keyof TEntity
      ): void => {
        setItemToDelete(item);
        setIsDeleteEnabled(true);

        const customMessage =
          item._deleteMessage?.trim();

        if (customMessage) {
          setDeleteDialogMessage(
            customMessage
          );
        } else {
          const fieldValue =
            nameField
              ? item[nameField]
              : undefined;

          const itemName =
            fieldValue !==
              undefined &&
            fieldValue !== null
              ? String(
                  fieldValue
                )
              : t(
                  "deleteDialog.itemNumber",
                  {
                    id:
                      item.id ??
                      "?",
                  }
                );

          setDeleteDialogMessage(
            t(
              "deleteDialog.confirmItem",
              {
                name:
                  itemName,
              }
            )
          );
        }

        setDeleteDialogOpen(true);
      },
      [t]
    );

  const confirmDelete =
    useCallback(
      async (): Promise<void> => {
        if (
          !itemToDelete ||
          itemToDelete.id ===
            undefined
        ) {
          return;
        }

        setLoading(true);

        try {
          await remove(
            itemToDelete.id
          );

          const updatedItems =
            await getAll();

          setItems(
            updatedItems
          );

          setDeleteDialogOpen(
            false
          );

          setItemToDelete(null);
          setDeleteDialogMessage("");
          setIsDeleteEnabled(true);
          setError(null);
        } catch (
          deleteError: unknown
        ) {
          setDeleteDialogMessage(
            getDeleteErrorMessage(
              deleteError,
              t
            )
          );

          setIsDeleteEnabled(false);

          console.error(
            "Error deleting item:",
            deleteError
          );
        } finally {
          setLoading(false);
        }
      },
      [
        getAll,
        itemToDelete,
        remove,
        t,
      ]
    );

  const handleSubmit =
    useCallback(
      async (
        data: TPayload
      ): Promise<void> => {
        try {
          if (
            selectedItem?.id !==
            undefined
          ) {
            await update(
              selectedItem.id,
              data
            );
          } else {
            await create(data);
          }

          const updatedItems =
            await getAll();

          setItems(
            updatedItems
          );

          setOpenForm(false);

          setSelectedItem(
            undefined
          );

          setError(null);
        } catch (
          submitError: unknown
        ) {
          console.error(
            "Error saving item:",
            submitError
          );

          throw submitError;
        }
      },
      [
        create,
        getAll,
        selectedItem,
        update,
      ]
    );

  const handleCloseForm =
    useCallback(
      (): void => {
        setOpenForm(false);

        setSelectedItem(
          undefined
        );
      },
      []
    );

  const handleCloseDeleteDialog =
    useCallback(
      (): void => {
        setDeleteDialogOpen(
          false
        );

        setItemToDelete(null);
        setDeleteDialogMessage("");
        setIsDeleteEnabled(true);
      },
      []
    );

  return {
    items,
    selectedItem,
    openForm,
    loading,
    error,
    deleteDialogOpen,
    deleteDialogMessage,
    isDeleteEnabled,
    loadItems,
    handleAdd,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleSubmit,
    handleCloseForm,
    handleCloseDeleteDialog,
    setDeleteDialogMessage,
  };
}
