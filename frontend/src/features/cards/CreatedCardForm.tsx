import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateCard } from "./hooks";

const createCardSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Card title must be at least 2 characters")
    .max(100, "Card title must be at most 100 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters")
    .optional()
    .or(z.literal("")),
});

type CreateCardFormValues = z.infer<typeof createCardSchema>;

type Props = {
  columnId: number;
};

export function CreateCardForm({ columnId }: Props) {
  const createCard = useCreateCard(columnId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCardFormValues>({
    resolver: zodResolver(createCardSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateCardFormValues) => {
    await createCard.mutateAsync({
      title: data.title,
      description: data.description || "",
    });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginBottom: 12,
      }}
    >
      <input placeholder="Card title" {...register("title")} />
      {errors.title && (
        <p style={{ color: "red", margin: 0 }}>{errors.title.message}</p>
      )}

      <textarea
        placeholder="Description (optional)"
        rows={3}
        {...register("description")}
      />
      {errors.description && (
        <p style={{ color: "red", margin: 0 }}>{errors.description.message}</p>
      )}

      <button type="submit" disabled={createCard.isPending}>
        {createCard.isPending ? "Adding..." : "Add card"}
      </button>
    </form>
  );
}
