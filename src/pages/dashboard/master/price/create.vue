<script setup lang="ts">

import { usePrice } from "~/composable/price";

const formData = ref({
    name: ''
})

const router = useRouter()

const { create: {
mutate,
isLoading
} } = usePrice();

function onSubmit() {
    mutate(formData.value)
}

</script>

<template>
    <n-button @click="router.go(-1)"> Kembali </n-button>
        <n-h2>
        Tambah Harga
      </n-h2>
        <n-form @submit.prevent="onSubmit">
            <n-form-item label="Nama">
                <n-input v-model:value="formData.name"></n-input>
            </n-form-item>
            <n-button :loading="isLoading" attr-type="submit" type="primary"> Submit</n-button>
        </n-form>
</template>