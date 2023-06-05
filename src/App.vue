<script setup lang="ts">
import Layout from "~/layouts/dashboard.vue";

</script>

<template>
  <layout>
    <n-message-provider>
      <router-view></router-view>
    </n-message-provider>
  </layout>
</template>