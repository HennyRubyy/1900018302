import { supabase } from "../../lib/supabase";
import { useQuery, useMutation } from "@tanstack/vue-query";

type CreateCategory = {
  name: string;
  id?: number;
};

export const tableName = "categories";

class CategoryRepository {
  async all() {
    return supabase.from(tableName).select("*");
  }

  async create({ name }: { name: string }) {
    await supabase.from(tableName).insert({
      name,
    });
  }

  async update({ id, name }: Partial<CreateCategory>) {
    await supabase
      .from(tableName)
      .update({
        name,
      })
      .eq("id", id);
  }

  async delete(id: number) {
    await supabase.from(tableName).delete().eq("id", id);
  }
}

export function useCategory() {
  const repository = new CategoryRepository();

  const { data: categories, isLoading: loadingData } = useQuery(
    ["category"],
    () => repository.all()
  );

  const { mutate, isLoading: creatingData } = useMutation(
    (payload: CreateCategory) => repository.create(payload)
  );

  const { mutate: updateData, isLoading: updatingData } = useMutation(
    (payload: Partial<CreateCategory>) => repository.update(payload)
  );

  const { mutate: deleteData, isLoading: deletingData } = useMutation(
    (payload: number) => repository.delete(payload)
  );

  return {
    all: {
      isLoading: loadingData,
      data: categories,
    },
    create: {
      mutate,
      isLoading: creatingData,
    },
    update: {
      mutate: updateData,
      isLoading: updatingData,
    },
    delete: {
      mutate: deleteData,
      isLoading: deletingData,
    },
  };
}
