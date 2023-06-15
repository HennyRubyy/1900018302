import { supabase } from "../../lib/supabase";

type Training = {
  id: number;
  category: {
    name: string;
  };
  sub_category: {
    name: string;
  };
  classification: {
    name: string;
  };
  condition: {
    name: string;
  };
  price: string;
  result: "Yes" | "No";
};

export function useTraining() {
  const trainings = ref<Training[]>([]);

  async function getAll() {
    try {
      const { data: todos, error } = await supabase
        .from("trainings")
        .select(
          "*, category(*), sub_category(*), price(*), classification(*), condition(*)"
        )
        .order("id");

      if (error) {
        console.log("error", error);
        return;
      }
      // handle for when no todos are returned
      if (todos === null) {
        trainings.value = [];
        return;
      }
      // store response to allTodos
      trainings.value = todos as any;
    } catch (err) {
      console.error("Error retrieving data from db", err);
    }
  }

  async function createOne(
    category: string,
    sub_category: string,
    price: string,
    classification: string,
    condition: string,
    result: string
  ) {
    await supabase.from("trainings").insert({
      category,
      sub_category,
      price,
      classification,
      condition,
      result,
    });
    return getAll();
  }
  async function updateOne(
    id: string,
    category: string,
    sub_category: string,
    price: string,
    classification: string,
    condition: string,
    result: string
  ) {
    await supabase
      .from("trainings")
      .update({
        category,
        sub_category,
        price,
        classification,
        condition,
        result,
      })
      .eq("id", id);
    return getAll();
  }

  async function deleteOne(id: string) {
    await supabase.from("trainings").delete().eq("id", id);
    getAll();
  }

  return { getAll, createOne, trainings, deleteOne, updateOne };
}
