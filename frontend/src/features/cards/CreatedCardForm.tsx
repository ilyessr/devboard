import { Icon } from "@/components/Icon";
import { Modal } from "@/components/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateCard } from "./hooks";

const createCardSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Le titre doit contenir au moins 2 caractères")
    .max(100, "Le titre doit contenir au maximum 100 caractères"),
  description: z
    .string()
    .trim()
    .max(500, "La description doit contenir au maximum 500 caractères")
    .optional()
    .or(z.literal("")),
  due_date: z.string().optional().or(z.literal("")),
});

type CreateCardFormValues = z.infer<typeof createCardSchema>;

type Props = {
  columnId: number;
};

export function CreateCardForm({ columnId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const createCard = useCreateCard(columnId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCardFormValues>({
    resolver: zodResolver(createCardSchema),
    defaultValues: { title: "", description: "", due_date: "" },
  });

  const onSubmit = async (data: CreateCardFormValues) => {
    await createCard.mutateAsync({
      title: data.title,
      description: data.description || "",
      due_date: data.due_date || null,
    });
    reset();
    setIsOpen(false);
  };

  return (
    <>
      <button type="button" className="btn btn-ghost" onClick={() => setIsOpen(true)}>
        <Icon name="plus" className="icon" />
        <span>Nouvelle carte</span>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Créer une carte">
        <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
          <label className="field">
            <span>Titre</span>
            <input placeholder="Implémenter la recherche" {...register("title")} />
            {errors.title && <p className="field-error">{errors.title.message}</p>}
          </label>

          <label className="field">
            <span>Description</span>
            <textarea rows={4} placeholder="Détails optionnels..." {...register("description")} />
            {errors.description && (
              <p className="field-error">{errors.description.message}</p>
            )}
          </label>

          <label className="field">
            <span>Date</span>
            <input type="date" {...register("due_date")} />
            {errors.due_date && <p className="field-error">{errors.due_date.message}</p>}
          </label>

          <button type="submit" className="btn btn-primary" disabled={createCard.isPending}>
            {createCard.isPending ? "Ajout..." : "Ajouter"}
          </button>
        </form>
      </Modal>
    </>
  );
}
