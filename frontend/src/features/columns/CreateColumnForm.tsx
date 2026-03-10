import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateColumn } from "./hooks";

const createColumnSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Column name must be at least 2 characters")
    .max(50, "Column name must be at most 50 characters"),
});

type CreateColumnFormValues = z.infer<typeof createColumnSchema>;

type Props = {
  boardId: number;
};

export function CreateColumnForm({ boardId }: Props) {
  const createColumn = useCreateColumn(boardId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateColumnFormValues>({
    resolver: zodResolver(createColumnSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CreateColumnFormValues) => {
    await createColumn.mutateAsync(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        maxWidth: 320,
        marginTop: 16,
        marginBottom: 24,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <input placeholder="Column name" {...register("name")} />
        {errors.name && (
          <p style={{ color: "red", margin: 0 }}>{errors.name.message}</p>
        )}
      </div>

      <button type="submit" disabled={createColumn.isPending}>
        {createColumn.isPending ? "Creating..." : "Add column"}
      </button>
    </form>
  );
}
