import { useMessage } from "naive-ui";
import { supabase } from "../../lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";

type CreateCategory = {
  name: string;
  category: any;
  id?: number;
};

export const tableName = "sub_categories";

class CategoryRepository {
  async all() {
    return supabase.from(tableName).select("*, category(*)");
  }

  async create(payload: { name: string }) {
    await supabase.from(tableName).insert(payload);
  }

  async update(payload: Partial<CreateCategory>) {
    await supabase
      .from(tableName)
      .update(payload)
      .eq("id", id);
  }

  async delete(id: number) {
    return await supabase.from(tableName).delete().eq("id", id);
  }

  async detail(id: number) {
    return await supabase.from(tableName).select("*").eq("id", id).single();
  }
}

export function useSubCategory() {
  const queryClient = useQueryClient();
  const route = useRoute();
  const router = useRouter();

  const message = useMessage();

  const repository = new CategoryRepository();

  const { data: sub_categories, isLoading: loadingData } = useQuery(
    ["sub-category"],
    () => repository.all()
  );

  const { data: category, isLoading: loadingDetail } = useQuery(
    ["sub-category", route.params.id],
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
        queryClient.refetchQueries(["sub-category"]);
        message.success("Berhasil menghapus data");
      },
    }
  );

  return {
    all: {
      isLoading: loadingData,
      data: sub_categories,
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
