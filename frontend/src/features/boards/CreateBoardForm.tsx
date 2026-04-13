import { Icon } from "@/components/Icon";
import { Modal } from "@/components/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateBoard } from "./hooks";

const createBoardSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(50, "Le nom doit contenir au maximum 50 caractères"),
});

type CreateBoardFormValues = z.infer<typeof createBoardSchema>;

export function CreateBoardForm() {
  const [isOpen, setIsOpen] = useState(false);
  const createBoard = useCreateBoard();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBoardFormValues>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = async (data: CreateBoardFormValues) => {
    await createBoard.mutateAsync(data);
    reset();
    setIsOpen(false);
  };

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={() => setIsOpen(true)}>
        <Icon name="plus" className="icon" />
        <span>Nouveau board</span>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Créer un board">
        <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
          <label className="field">
            <span>Nom du board</span>
            <input placeholder="Roadmap produit" {...register("name")} />
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </label>

          <button type="submit" className="btn btn-primary" disabled={createBoard.isPending}>
            {createBoard.isPending ? "Création..." : "Créer"}
          </button>
        </form>
      </Modal>
    </>
  );
}
