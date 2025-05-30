<template>
  <div>
    <!-- 语言翻译 -->
    <el-tooltip :content="$t('header.language')">
      <el-dropdown @command="handleChangeLanguage" style="vertical-align: baseline;">
        <SvgIcon
          name="koi-menu-earth"
          width="20"
          height="20"
          class="rounded-full p-6px bg-[rgba(50,50,50,0.06)] dark:bg-[rgba(255,255,255,0.06)] m-r-10px border-none outline-none"
        ></SvgIcon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in languageList"
              :key="item.value"
              :command="item.value"
              :disabled="language === item.value"
            >
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, onMounted, watch, computed } from "vue";
import useGlobalStore from "@/stores/modules/global.ts";
import { LanguageType } from "@/stores/interface/index.ts";

const i18n = useI18n();
const globalStore = useGlobalStore();
const language = computed(() => globalStore.language);

const languageList = ref<any>([]);

onMounted(() => {
  handleSwitchLanguage();
});

const handleSwitchLanguage = () => {
  // 当 language 变化时，手动触发 dimensionList 的更新
  if (globalStore.language === "en") {
    languageList.value = [
    { label: "Chinese", value: "zh" },
    { label: "English", value: "en" }
    ];
  } else {
    languageList.value = [
      { label: "简体中文", value: "zh" },
      { label: "英文", value: "en" }
    ];
  }
};

// 监听 globalStore.language 的变化
watch(
  () => globalStore.language,
  () => {
    // 当 language 变化时，手动触发 dimensionList 的更新
    handleSwitchLanguage();
  }
);

const handleChangeLanguage = (lang: string) => {
  i18n.locale.value = lang;
  globalStore.setGlobalState("language", lang as LanguageType);
};
</script>

<style scoped></style>
