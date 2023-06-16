<script setup lang="ts">
import { usePrice } from "~/composable/price";

const route = useRoute()

const formData = ref({
  name: "",
  id: route.params.id
});

const router = useRouter()

const {
  update: { mutate, isLoading },
  detail: { data, isLoading: loadingDetail },
} = usePrice();

watch(
  data,
  (value) => {
    formData.value.name = value?.data?.name;
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
    <n-h2>
      Update Harga
    </n-h2>
    <n-form @submit.prevent="onSubmit">
      <n-form-item label="Nama">
        <n-input v-model:value="formData.name"></n-input>
      </n-form-item>
      <n-button :loading="isLoading" type="primary" attr-type="submit">Submit</n-button>
    </n-form>
  </n-spin>
</template>
