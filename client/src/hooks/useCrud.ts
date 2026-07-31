import { useCallback, useEffect, useState } from "react";
import type { AxiosError } from "axios";

interface ErrorResponse {
  error: string;
}

interface Entity {
  id?: number;
  _deleteMessage?: string;
}

interface CrudFunctions<T extends Entity> {
  getAll: () => Promise<T[]>;
  create: (data: T) => Promise<T>;
  update: (id: number, data: T) => Promise<T>;
  remove: (id: number) => Promise<void>;
}

export default function useCrud<T extends Entity>({
  getAll,
  create,
  update,
  remove,
}: CrudFunctions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [selectedItem, setSelectedItem] = useState<T | undefined>();
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState<boolean>(false);

  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  const [deleteDialogMessage, setDeleteDialogMessage] = useState<string>(
    "Are you sure you want to delete this item?"
  );

  const [isDeleteEnabled, setIsDeleteEnabled] =
    useState<boolean>(true);

  const loadItems = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      const data = await getAll();

      setItems(data);
      setError(null);
    } catch (loadError: unknown) {
      console.error("Error loading items:", loadError);
      setError("Failed to load items");
    } finally {
      setLoading(false);
    }
  }, [getAll]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const handleAdd = useCallback((): void => {
    setSelectedItem(undefined);
    setOpenForm(true);
  }, []);

  const handleEdit = useCallback((item: T): void => {
    setSelectedItem(item);
    setOpenForm(true);
  }, []);

  const handleDelete = useCallback(
    (item: T, nameField?: keyof T): void => {
      setItemToDelete(item);

      const customMessage = item._deleteMessage ?? "";

      if (customMessage) {
        setDeleteDialogMessage(customMessage);
      } else {
        const fieldValue = nameField ? item[nameField] : undefined;

        const itemName =
          fieldValue !== undefined && fieldValue !== null
            ? String(fieldValue)
            : `item #${item.id}`;

        setDeleteDialogMessage(
          `Are you sure you want to delete "${itemName}"?`
        );
      }

      const isErrorMessage =
        customMessage.includes("Cannot delete") ||
        customMessage.includes("open orders associated");

      setIsDeleteEnabled(!isErrorMessage);
      setDeleteDialogOpen(true);
    },
    []
  );

  const confirmDelete = useCallback(async (): Promise<void> => {
    if (!itemToDelete || itemToDelete.id === undefined) {
      return;
    }

    setLoading(true);

    try {
      await remove(itemToDelete.id);

      const updatedItems = await getAll();

      setItems(updatedItems);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      setError(null);
    } catch (deleteError: unknown) {
      const axiosError = deleteError as AxiosError<ErrorResponse>;

      const message =
        axiosError.response?.data?.error ??
        "An error occurred while deleting the item";

      setDeleteDialogMessage(message);

      console.error("Error deleting item:", deleteError);
    } finally {
      setLoading(false);
    }
  }, [getAll, itemToDelete, remove]);

  const handleSubmit = useCallback(
    async (data: T): Promise<void> => {
      setLoading(true);

      try {
        if (selectedItem?.id !== undefined) {
          await update(selectedItem.id, data);
        } else {
          await create(data);
        }

        const updatedItems = await getAll();

        setItems(updatedItems);
        setOpenForm(false);
        setSelectedItem(undefined);
        setError(null);
      } catch (submitError: unknown) {
        console.error("Error saving item:", submitError);
        setError("Failed to save item");

        throw submitError;
      } finally {
        setLoading(false);
      }
    },
    [create, getAll, selectedItem, update]
  );

  const handleCloseForm = useCallback((): void => {
    setOpenForm(false);
    setSelectedItem(undefined);
  }, []);

  const handleCloseDeleteDialog = useCallback((): void => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  }, []);

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