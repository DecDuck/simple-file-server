<template>
  <div class="bg-white py-16 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:mx-0">
        <p class="text-base font-semibold leading-7 text-blue-600">Download</p>
        <h2
          class="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-mono"
        >
          {{ meta.name }}
        </h2>
        <p class="mt-5 text-lg leading-8 text-gray-600">
          This file was uploaded on {{ date.toDateString() }} and is {{ size }} in size. The download will begin when you click the button below.
        </p>
        <a
          :href="`/api/v1/${id}/download`"
          type="button"
          class="inline-flex mt-7 items-center gap-x-1.5 rounded-md bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-800"
        >
          Download
          <ArrowDownTrayIcon class="-mr-0.5 h-5 w-5" aria-hidden="true" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDownTrayIcon } from "@heroicons/vue/24/outline";
const route = useRoute();

const id = route.params.id;
if (!id) {
  throw new Error("no id");
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const meta: { name: string; size: number; type: string; uploadDate: string } =
  await $fetch(`/api/v1/${id}`);

const size = formatBytes(meta.size);
const date = new Date(meta.uploadDate);

useHead({
  title: `${meta.name}`,
  meta: [{ name: "description", content: `${meta.name} (${size})` }],
});
</script>
