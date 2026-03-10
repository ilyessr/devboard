import { useForm } from "react-hook-form";
import { useCreateBoard } from "./hooks";
import type { FormValues } from "./types";

export function CreateBoardForm() {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const createBoard = useCreateBoard();

  const onSubmit = async (data: FormValues) => {
    await createBoard.mutateAsync(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", gap: 8 }}>
      <input
        placeholder="Board name"
        {...register("name", { required: true })}
      />

      <button type="submit" disabled={createBoard.isPending}>
        Create
      </button>
    </form>
  );
}
