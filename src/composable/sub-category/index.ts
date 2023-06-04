import { supabase } from "../../lib/supabase";
import { useQuery, useMutation } from "@tanstack/vue-query";

type CreateSubCategory = {
  name: string;
  id?: number;
};

class SubCategoryRepository {
  private tableName = "sub_categories";

  async all() {
    return supabase.from(this.tableName).select("*");
  }

  async create({ name }: { name: string }) {
    await supabase.from(this.tableName).insert({
      name,
    });
  }

  async update({ id, name }: Partial<CreateSubCategory>) {
    await supabase
      .from(this.tableName)
      .update({
        name,
      })
      .eq("id", id);
  }

  async delete(id: number) {
    await supabase.from(this.tableName).delete().eq("id", id);
  }
}

export function useSubCategory() {
  const repository = new SubCategoryRepository();

  const { data: categories, isLoading: loadingData } = useQuery(
    ["SubCategory"],
    repository.all
  );

  const { mutate, isLoading: creatingData } = useMutation(
    (payload: CreateSubCategory) => repository.create(payload)
  );

  const { mutate: updateData, isLoading: updatingData } = useMutation(
    (payload: Partial<CreateSubCategory>) => repository.update(payload)
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
