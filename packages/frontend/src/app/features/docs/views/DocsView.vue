<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import markdownContent from '@docs/instructives/dynamic-forms.md?raw'

const htmlContent = computed(() => {
  return marked.parse(markdownContent) as string
})
</script>

<template>
  <div class="docs-container">
    <div class="docs-content prose" v-html="htmlContent" />
  </div>
</template>

<style scoped>
.docs-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 2rem 4rem;
  background: #fff;
  min-height: 100vh;
}

.docs-content {
  color: #1e293b;
  font-size: 15px;
  line-height: 1.75;
}

.docs-content :deep(h1) {
  font-size: 2rem;
  font-weight: 700;
  color: #1e3a5f;
  margin-bottom: 0.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #3b82f6;
}

.docs-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e3a5f;
  margin-top: 2.5rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.docs-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #334155;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
}

.docs-content :deep(h4) {
  font-size: 1.1rem;
  font-weight: 600;
  color: #475569;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.docs-content :deep(p) {
  margin-bottom: 1rem;
}

.docs-content :deep(ul),
.docs-content :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.docs-content :deep(li) {
  margin-bottom: 0.35rem;
}

.docs-content :deep(code) {
  background: #f1f5f9;
  color: #be185d;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: 'Fira Code', 'Consolas', monospace;
}

.docs-content :deep(pre) {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 1.25rem;
  font-size: 0.875rem;
  line-height: 1.6;
}

.docs-content :deep(pre code) {
  background: none;
  color: inherit;
  padding: 0;
  border-radius: 0;
  font-size: inherit;
}

.docs-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.docs-content :deep(th) {
  background: #f1f5f9;
  color: #1e3a5f;
  font-weight: 600;
  text-align: left;
  padding: 0.6rem 0.75rem;
  border: 1px solid #e2e8f0;
}

.docs-content :deep(td) {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
}

.docs-content :deep(tr:nth-child(even)) {
  background: #f8fafc;
}

.docs-content :deep(blockquote) {
  border-left: 4px solid #3b82f6;
  background: #eff6ff;
  padding: 0.75rem 1rem;
  margin: 1rem 0;
  border-radius: 0 6px 6px 0;
  color: #1e40af;
}

.docs-content :deep(hr) {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 2rem 0;
}

.docs-content :deep(strong) {
  font-weight: 600;
  color: #0f172a;
}

.docs-content :deep(a) {
  color: #3b82f6;
  text-decoration: underline;
}
</style>
