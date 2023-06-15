import { useMessage } from "naive-ui";
import { supabase } from "../../lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";

type CreatePrice = {
  name: string;
  id?: number;
};

export const tableName = "prices";

class PriceRepository {
  async all() {
    return supabase.from(tableName).select("*");
  }

  async create({ name }: { name: string }) {
    await supabase.from(tableName).insert({
      name,
    });
  }

  async update({ id, name }: Partial<CreatePrice>) {
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

export function usePrice() {
  const queryClient = useQueryClient();
  const route = useRoute();
  const router = useRouter();

  const message = useMessage();

  const repository = new PriceRepository();

  const { data: categories, isLoading: loadingData } = useQuery(
    ["price"],
    () => repository.all()
  );

  const { data: price, isLoading: loadingDetail } = useQuery(
    ["price", route.params.id],
    () => repository.detail(+route.params.id),
    {
      enabled: computed(() => !!route.params.id && route.name === 'dashboard-master-price-update-id'),
    }
  );

  const { mutate, isLoading: creatingData } = useMutation(
    (payload: CreatePrice) => repository.create(payload),
    {
      onSuccess: () => {
        router.go(-1);
        message.success("Berhasil menambahkan data");
      },
    }
  );

  const { mutate: updateData, isLoading: updatingData } = useMutation(
    (payload: Partial<CreatePrice>) => repository.update(payload),
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
        queryClient.refetchQueries(["price"]);
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
      data: price,
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
