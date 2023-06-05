import { useMessage } from "naive-ui";
import { supabase } from "../../lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";

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
    return await supabase.from(tableName).delete().eq("id", id);
  }

  async detail(id: number) {
    return await supabase.from(tableName).select("*").eq("id", id).single();
  }
}

export function useCategory() {
  const queryClient = useQueryClient();
  const route = useRoute();
  const router = useRouter();

  const message = useMessage();

  const repository = new CategoryRepository();

  const { data: categories, isLoading: loadingData } = useQuery(
    ["category"],
    () => repository.all()
  );

  const { data: category, isLoading: loadingDetail } = useQuery(
    ["category", route.params.id],
    () => repository.detail(+route.params.id),
    {
      enabled: computed(() => !!route.params.id),
    }
  );

  const { mutate, isLoading: creatingData } = useMutation(
    (payload: CreateCategory) => repository.create(payload),
    {
      onSuccess: () => {
        router.go(-1);
        message.success("Berhasil menambahkan data");
      },
    }
  );

  const { mutate: updateData, isLoading: updatingData } = useMutation(
    (payload: Partial<CreateCategory>) => repository.update(payload),
    {
      onSuccess: () => {
        router.go(-1);
        message.success("Berhasil update data");
      },
    }
  );

  const { mutate: deleteData, isLoading: deletingData } = useMutation(
    (payload: number) => repository.delete(payload),
    {
      onSuccess: () => {
        queryClient.refetchQueries(["category"]);
        message.success("Berhasil menghapus data");
      },
    }
  );

  return {
    all: {
      isLoading: loadingData,
      data: categories,
    },
    detail: {
      isLoading: loadingDetail,
      data: category,
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
