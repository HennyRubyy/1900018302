<script setup lang="ts">
import Layout from "~/layouts/dashboard.vue";
import { useCategory } from "~/composable/category";

const { categories } = useCategory();
</script>
<template>
  <layout>
    <n-table>
      <thead>
        <tr>
          <th>nama</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in categories">
          <td>
            {{ item.name }}
          </td>
        </tr>
      </tbody>
    </n-table>
  </layout>
</template>
