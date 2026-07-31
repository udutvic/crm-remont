import { useState, useEffect, useCallback } from "react";
import { AxiosError } from "axios";
interface ErrorResponse {
    error: string;
}
type Entity = {
    id?: number;
};
interface CrudFunctions<T extends Entity> {
    getAll: () => Promise<T[]>;
    create: (data: T) => Promise<T>;
    update: (id: number, data: T) => Promise<T>;
    remove: (id: number) => Promise<void>;
}
export default function useCrud<T extends Entity>(
    crudFunctions: CrudFunctions<T>
) {
    const [items, setItems] = useState<T[]>([]);
    const [selectedItem, setSelectedItem] = useState<T | undefined>(undefined);
    const [openForm, setOpenForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<T | null>(null);
    const [deleteDialogMessage, setDeleteDialogMessage] = useState<string>(
        "Are you sure you want to delete this item?"
    );
    const [isDeleteEnabled, setIsDeleteEnabled] = useState(true);
    const loadItems = useCallback(async () => {
        if (!loading) setLoading(true);
        try {
            const data = await crudFunctions.getAll();
            setItems(data);
            setError(null);
        } catch (error) {
            console.error("Error loading items:", error);
            setError("Failed to load items");
        } finally {
            setLoading(false);
        }
    }, [crudFunctions, loading]);
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const data = await crudFunctions.getAll();
                setItems(data);
                setError(null);
            } catch (error) {
                console.error("Error loading items:", error);
                setError("Failed to load items");
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);
    const handleAdd = useCallback(() => {
        setSelectedItem(undefined);
        setOpenForm(true);
    }, []);
    const handleEdit = useCallback((item: T) => {
        setSelectedItem(item);
        setOpenForm(true);
    }, []);
    const handleDelete = useCallback((item: T, nameField?: keyof T) => {
        setItemToDelete(item);
        if ((item as any)._deleteMessage) {
            setDeleteDialogMessage((item as any)._deleteMessage);
        } else {
            const itemName = nameField && item[nameField]
                ? String(item[nameField])
                : `item #${item.id}`;
            setDeleteDialogMessage(
                `Are you sure you want to delete <b>${itemName}</b>?`
            );
        }
        let message = (item as any)._deleteMessage || "";
        const isErrorMessage = 
            message.includes('Cannot delete') || 
            message.includes('open orders associated');
        setIsDeleteEnabled(!isErrorMessage);
        setDeleteDialogOpen(true);
    }, []);
    const confirmDelete = useCallback(async () => {
        if (!itemToDelete || !itemToDelete.id) return;
        try {
            await crudFunctions.remove(itemToDelete.id);
            setDeleteDialogOpen(false);
            setItemToDelete(null);
            setLoading(true);
            const data = await crudFunctions.getAll();
            setItems(data);
            setLoading(false);
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>;
            const message =
                axiosError.response?.data?.error ||
                "An error occurred while deleting the item";
            setDeleteDialogMessage(message);
            console.error("Error deleting item:", axiosError);
            setLoading(false);
        }
    }, [itemToDelete, crudFunctions]);
    const handleSubmit = useCallback(
        async (data: T) => {
            setLoading(true);
            try {
                if (selectedItem && selectedItem.id) {
                    await crudFunctions.update(selectedItem.id, data);
                } else {
                    await crudFunctions.create(data);
                }
                const updatedData = await crudFunctions.getAll();
                setItems(updatedData);
                setOpenForm(false);
                setSelectedItem(undefined);
                setLoading(false);
            } catch (error) {
                console.error("Error saving item:", error);
                setError("Failed to save item");
                setLoading(false);
            }
        },
        [selectedItem, crudFunctions]
    );
    const handleCloseForm = useCallback(() => {
        setOpenForm(false);
        setSelectedItem(undefined);
    }, []);
    const handleCloseDeleteDialog = useCallback(() => {
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