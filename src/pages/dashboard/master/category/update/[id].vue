<script setup lang="ts">
import Layout from "~/layouts/dashboard.vue";

import { useCategory } from "~/composable/category";

const route = useRoute()

const formData = ref({
  name: "",
  id: route.params.id
});

const {
  update: { mutate, isLoading },
  detail: { data, isLoading: loadingDetail },
} = useCategory();

watch(
  data,
  (value) => {
    formData.value.name = value.data.name;
  },
  { deep: true }
);

function onSubmit() {
  mutate(formData.value);
}
</script>

<template>

    <n-button @click="$router.push('category')"> Kembali </n-button>
    <n-h2>
      Update Jenis
    </n-h2>
    <n-form @submit.prevent="onSubmit">
      <n-form-item label="Nama">
        <n-input v-model:value="formData.name"></n-input>
      </n-form-item>
      <n-button :loading="isLoading" type="primary" attr-type="submit">Submit</n-button>
    </n-form>
</template>
