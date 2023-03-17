<script setup lang="ts">
import Markdown from 'markdown-it';

const props = defineProps({
  statement: {
    type: String,
    default: '',
  },
});

const mkit = new Markdown({ html: true });

const statementHtml = mkit.render(props.statement);
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="markdown" v-html="statementHtml"></div>
</template>

<style lang="scss" scoped>
.statement {
  max-width: 1472px;
  margin: 0 auto;
  padding-top: 80px;
  padding-left: 16px;
  padding-right: 16px;
}
</style>
