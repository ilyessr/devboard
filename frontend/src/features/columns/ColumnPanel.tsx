import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EntityMenu } from "@/components/EntityMenu";
import { ColumnCardList } from "@/features/cards/ColumnCardList";
import { Modal } from "@/components/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDeleteColumn, useUpdateColumn } from "./hooks";
import type { Column } from "./types";

type Props = {
  column: Column;
  boardId: number;
};

const updateColumnSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom doit contenir au maximum 50 caractères"),
});

type UpdateColumnFormValues = z.infer<typeof updateColumnSchema>;

export function ColumnPanel({ column, boardId }: Props) {
  const deleteColumn = useDeleteColumn(boardId);
  const updateColumn = useUpdateColumn(boardId);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateColumnFormValues>({
    resolver: zodResolver(updateColumnSchema),
    defaultValues: { name: column.name },
  });

  useEffect(() => {
    reset({ name: column.name });
  }, [column.name, reset]);

  const onSubmit = async (data: UpdateColumnFormValues) => {
    await updateColumn.mutateAsync({ columnId: column.id, input: data });
    setIsEditOpen(false);
  };

  return (
    <section className="column">
      <div className="column__header">
        <h2>{column.name}</h2>
        <EntityMenu
          label={`colonne ${column.name}`}
          onEdit={() => setIsEditOpen(true)}
          onDelete={() => setIsDeleteOpen(true)}
        />
      </div>

      <ColumnCardList columnId={column.id} />

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Modifier la colonne">
        <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
          <label className="field">
            <span>Nom de la colonne</span>
            <input placeholder="Nom" {...register("name")} />
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </label>

          <button type="submit" className="btn btn-primary" disabled={updateColumn.isPending}>
            {updateColumn.isPending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Supprimer cette colonne ?"
        description={`La colonne "${column.name}" et ses cartes seront supprimées.`}
        confirmLabel="Supprimer la colonne"
        isLoading={deleteColumn.isPending}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={async () => {
          await deleteColumn.mutateAsync(column.id);
          setIsDeleteOpen(false);
        }}
      />
    </section>
  );
}
