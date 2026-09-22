<script lang="ts">
import { onMount } from 'svelte';
import { url } from '@utils/url-utils';
import type { SearchResult } from '@/global';

let keyword = '';
let results: SearchResult[] = [];
let open = false;
let busy = false;
let error = '';
let generation = 0;
let timer: ReturnType<typeof setTimeout>;
let mobileInput: HTMLInputElement;
let engine: Promise<typeof window.pagefind> | undefined;

function loadSearch() {
  if (!engine) {
    const scriptUrl = url('/pagefind/pagefind.js');
    engine = import(/* @vite-ignore */ scriptUrl).catch((error) => { engine = undefined; throw error; });
  }
  return engine;
}

function scheduleSearch(value: string) {
  keyword = value;
  open = true;
  error = '';
  clearTimeout(timer);
  const request = ++generation;
  results = [];
  busy = Boolean(keyword.trim());
  if (!busy) return;
  timer = setTimeout(async () => {
    try {
      const search = await loadSearch();
      const response = await search.search(keyword.trim());
      const found = await Promise.all(response.results.slice(0, 12).map(item => item.data()));
      if (request === generation) results = found;
    } catch {
      if (request === generation) error = import.meta.env.DEV ? '搜索索引会在构建后生成，请使用 pnpm build 和 pnpm preview 预览。' : '搜索暂时无法加载，请稍后重试，或浏览文章归档。';
    } finally {
      if (request === generation) busy = false;
    }
  }, 180);
}

async function toggle() {
  open = !open;
  if (open) {
    await import('svelte').then(({ tick }) => tick());
    mobileInput?.focus();
  }
}

onMount(() => {
  const close = () => { open = false; };
  const outside = (event: MouseEvent) => {
    if (!(event.target as HTMLElement).closest('[data-search]')) close();
  };
  const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
  document.addEventListener('click', outside);
  document.addEventListener('keydown', escape);
  document.addEventListener('swup:page:view', close);
  return () => {
    clearTimeout(timer);
    document.removeEventListener('click', outside);
    document.removeEventListener('keydown', escape);
    document.removeEventListener('swup:page:view', close);
  };
});
</script>

<div data-search>
  <div class="hidden lg:flex items-center h-11 mr-2 rounded-lg bg-black/[0.04] dark:bg-white/5">
    <svg aria-hidden="true" class="ml-3 text-50" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>
    <input aria-label="搜索文章" aria-controls="search-panel" aria-expanded={open} placeholder="搜索文章" value={keyword} on:input={e => scheduleSearch(e.currentTarget.value)} on:focus={() => { open = true; }} class="pl-2 pr-3 text-sm bg-transparent h-11 w-36 focus:w-48 text-75 transition-all" />
  </div>
  <button on:click={toggle} aria-label="搜索文章" aria-controls="search-panel" aria-expanded={open} id="search-switch" class="btn-plain lg:!hidden rounded-lg w-11 h-11">
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>
  </button>
  <div id="search-panel" hidden={!open} class="float-panel search-panel absolute top-20 left-3 right-3 md:left-auto md:w-[30rem] shadow-xl rounded-2xl p-3 max-h-[70vh] overflow-y-auto">
    <input bind:this={mobileInput} aria-label="搜索文章" placeholder="输入关键词…" value={keyword} on:input={e => scheduleSearch(e.currentTarget.value)} class="lg:hidden w-full rounded-lg p-3 mb-2 bg-black/5 dark:bg-white/5 text-90" />
    <div aria-live="polite" class="text-sm text-75">
      {#if busy}<p class="p-3">正在搜索…</p>
      {:else if error}<p class="p-3">{error}</p>
      {:else if !keyword.trim()}<p class="p-3">搜索标题或正文，例如「Linux」「绘画」。</p>
      {:else if results.length === 0}<p class="p-3">没有找到相关内容，换个关键词试试。</p>
      {:else}<p class="px-3 pb-2">找到 {results.length} 条结果</p>{/if}
    </div>
    {#each results as item}
      <a href={item.url} on:click={() => { open = false; }} class="block rounded-xl px-3 py-3 hover:bg-[var(--btn-plain-bg-hover)]">
        <div class="font-bold text-90 mb-1">{item.meta.title}</div>
        <div class="text-sm text-75">{@html item.excerpt}</div>
      </a>
    {/each}
    <a href="/archive/" class="block text-sm text-[var(--primary)] px-3 py-2">浏览全部文章 →</a>
  </div>
</div>
