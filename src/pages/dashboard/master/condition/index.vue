<script setup lang="ts">
import { useCondition } from "~/composable/condition";

const {
  all: { data, isLoading },
  delete: { mutate: deleteData, isLoading: isDeleting },
} = useCondition();

const router = useRouter()

function onDelete(id: number) {
  deleteData(id);
}
</script>
<template>
    <n-spin :show="isLoading">
      <n-button @click="router.push('condition/create')"> Tambah </n-button>
      <n-h2> Kondisi </n-h2>
      <n-table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="data?.data?.length == 0">
            <td colspan="2">
              <n-empty />
            </td>
          </tr>
          <template v-else>
            <tr v-for="item in data?.data">
              <td>
                {{ item.name }}
              </td>
              <td class="space-x-3">
                <n-button
                  type="primary"
                  text
                  @click="router.push(`condition/update/${item.id}`)"
                  >Update</n-button
                >
                <n-button
                  :loading="isDeleting"
                  type="error"
                  text
                  @click="onDelete(item.id)"
                  >Hapus</n-button
                >
              </td>
            </tr>
          </template>
        </tbody>
      </n-table>
    </n-spin>
</template>
