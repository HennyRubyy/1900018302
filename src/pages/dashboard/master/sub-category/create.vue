<script setup lang="ts">
import { useSubCategory } from "~/composable/sub-category";
import { useCategory } from "~/composable/category";

const formData = ref<Record<string, string | undefined>>({
  name: undefined,
  category: undefined,
});

const router = useRouter()

const {
  all: { data: categories },
} = useCategory();
const {
  create: { mutate, isLoading },
} = useSubCategory();

const categorySelect = computed(() => {
  return categories.value?.data?.map((item) => ({
    label: item.name,
    value: item.id,
  }));
});

function onSubmit() {
  mutate(formData.value as any);
}
</script>

<template>
  <n-button @click="router.go(-1)"> Kembali </n-button>
  <n-h2> Tambah Jenis </n-h2>
  <n-form @submit.prevent="onSubmit">
    <n-form-item label="Category">
      <n-select
        v-model:value="formData.category"
        :options="categorySelect"
        filterable
      />
    </n-form-item>
    <n-form-item label="Nama">
      <n-input v-model:value="formData.name"></n-input>
    </n-form-item>
    <n-button :loading="isLoading" attr-type="submit" type="primary">
      Submit
    </n-button>
  </n-form>
</template>
