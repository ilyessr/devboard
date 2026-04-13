import { Icon } from "@/components/Icon";
import { Modal } from "@/components/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateColumn } from "./hooks";

const createColumnSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom doit contenir au maximum 50 caractères"),
});

type CreateColumnFormValues = z.infer<typeof createColumnSchema>;

type Props = {
  boardId: number;
};

export function CreateColumnForm({ boardId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const createColumn = useCreateColumn(boardId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateColumnFormValues>({
    resolver: zodResolver(createColumnSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = async (data: CreateColumnFormValues) => {
    await createColumn.mutateAsync(data);
    reset();
    setIsOpen(false);
  };

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={() => setIsOpen(true)}>
        <Icon name="plus" className="icon" />
        <span>Ajouter une colonne</span>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Créer une colonne">
        <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
          <label className="field">
            <span>Nom de la colonne</span>
            <input placeholder="In progress" {...register("name")} />
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </label>

          <button type="submit" className="btn btn-primary" disabled={createColumn.isPending}>
            {createColumn.isPending ? "Ajout..." : "Ajouter"}
          </button>
        </form>
      </Modal>
    </>
  );
}
