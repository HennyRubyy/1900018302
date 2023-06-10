<script setup lang="ts">
import { useCategory } from "~/composable/category";
import { useSubCategory } from "~/composable/sub-category";

const route = useRoute();
const router = useRouter()

const formData = ref({
  name: "",
  id: route.params.id,
  category: "",
});

const {
  update: { mutate, isLoading },
  detail: { data, isLoading: loadingDetail },
} = useSubCategory();

const { all: {
  data: categories
} } = useCategory();


const categorySelect = computed(() => {
  return categories.value?.data?.map((item) => ({label: item.name, value: item.id}))
})


watch(
  data,
  (value) => {
    formData.value.name = value?.data?.name as string;
    formData.value.category = value?.data?.category?.id as string;
  },
  { deep: true }
);

function onSubmit() {
  mutate(formData.value as any);
}
</script>

<template>
  <n-spin :show="loadingDetail">
    <n-button @click="router.push('category')"> Kembali </n-button>
    <n-h2> Update Jenis </n-h2>
    <n-form @submit.prevent="onSubmit">
      <n-form-item label="Category">
        <n-select v-model:value="formData.category" :options="categorySelect" filterable />
      </n-form-item>
      <n-form-item label="Nama">
        <n-input v-model:value="formData.name"></n-input>
      </n-form-item>
      <n-button :loading="isLoading" type="primary" attr-type="submit"
        >Submit</n-button
      >
    </n-form>
  </n-spin>
</template>
