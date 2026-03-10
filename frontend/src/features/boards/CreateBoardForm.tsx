import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateBoard } from "./hooks";

const createBoardSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Board name must be at least 3 characters")
    .max(50, "Board name must be at most 50 characters"),
});

type CreateBoardFormValues = z.infer<typeof createBoardSchema>;

export function CreateBoardForm() {
  const createBoard = useCreateBoard();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBoardFormValues>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CreateBoardFormValues) => {
    await createBoard.mutateAsync(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        maxWidth: 400,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <input placeholder="Board name" {...register("name")} />
        {errors.name && (
          <p style={{ color: "red", margin: 0 }}>{errors.name.message}</p>
        )}
      </div>

      <button type="submit" disabled={createBoard.isPending}>
        {createBoard.isPending ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
