<template>
  <n-space vertical>
    <n-layout has-sider>
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <div
          class="flex justify-center h-24 items-center flex-col text-center p-3"
        >
          <img class="h-16" :src="Logo" />
        </div>
        <n-menu
          v-model:value="activeMenu"
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          :render-label="renderMenuLabel"
          :render-icon="renderMenuIcon"
          :expand-icon="expandIcon"
          @update:value="onSelect"
        />
      </n-layout-sider>
      <n-layout class="p-5">
        <slot />
      </n-layout>
    </n-layout>
  </n-space>
</template>

<script lang="ts">
import { h, ref, defineComponent } from "vue";
import { NIcon } from "naive-ui";
import type { MenuOption } from "naive-ui";
import { BookmarkOutline, CaretDownOutline } from "@vicons/ionicons5";
import Logo from "~/assets/images/logo.webp";

const menuOptions: MenuOption[] = [
  {
    label: "Hitung",
    key: "/",
  },
  {
    label: "Data Training",
    key: "/training",
  },
  {
    label: "Data Master",
    key: "master",
    children: [
      {
        label: "Category",
        key: "/dashboard/master/category",
      },
      {
        label: "Sub Category",
        key: "/dashboard/master/sub-category",
      },
    ],
  },
];

export default defineComponent({
  setup() {
    const router = useRouter();

    const activeMenu = ref("/");

    return {
      onSelect(key: string) {
        router.push(key);
      },
      menuOptions,
      activeMenu,
      Logo,
      collapsed: ref(false),
      renderMenuLabel(option: MenuOption) {
        if ("href" in option) {
          return h("a", { href: option.href, target: "_blank" }, [
            option.label as string,
          ]);
        }
        return option.label as string;
      },
      renderMenuIcon(option: MenuOption) {
        // return render placeholder for indent
        if (option.key === "sheep-man") return true;
        // return falsy, don't render icon placeholder
        if (option.key === "food") return null;
        return h(NIcon, null, { default: () => h(BookmarkOutline) });
      },
      expandIcon() {
        return h(NIcon, null, { default: () => h(CaretDownOutline) });
      },
    };
  },
});
</script>
