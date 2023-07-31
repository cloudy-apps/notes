<template>
  <div class="relative bg-white mx-auto rounded shadow-md py-3">
    <button
      @click="onToggle"
      class="absolute top-1 right-1 w-8 h-8 text-lg leading-none transition transform"
      :class="!note.collapse && 'rotate-180'"
    >
      <span class="material-icons text-primary">expand_more</span>
    </button>
    <div>
      <input
        class="text-lg px-6 font-medium text-black bg-transparent w-full"
        placeholder="New note"
        v-model="note.title"
      />
      <textarea
        v-model="note.content"
        class="text-gray-600 text-sm px-6 py-3 w-full block bg-transparent whitespace-pre-wrap"
        placeholder="Note..."
        v-if="!note.collapse"
      >
        {{ note.content }}
      </textarea>
      <div class="flex justify-end text-gray-900">
        <button
          @click="tools = !tools"
          class="transform w-8 h-8 text-lg leading-none p-1"
          :class="(tools && '-rotate-90') || 'rotate-90'"
        >
          <span class="material-icons text-primary">expand_more</span>
        </button>
        <template v-if="tools">
          <button
            @click="onCreateChecklist"
            class="w-8 h-8 text-lg leading-none p-1 bg-gray-100 rounded-sm"
          >
            <span
              class="material-icons"
              :class="generating && 'animate-spin'"
              >{{ generating ? "refresh" : "checklist" }}</span
            >
          </button>
          <button
            @click="onDeleteNote"
            class="w-8 h-8 text-lg leading-none p-1 bg-gray-100 rounded-sm"
          >
            <span class="material-icons text-red-600">delete</span>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Note } from "./types";
import createChecklist from "https://aifn.run/fn/12c5cd32-9c33-4a4b-8a18-787a27df8109.js";

const tools = ref(false);
const generating = ref(false);
const emit = defineEmits(["delete-note"]);
const props = defineProps({
  note: {
    type: Object as () => Note,
    required: true,
  },
});

function onDeleteNote() {
  emit("delete-note", props.note);
}

async function onCreateChecklist() {
  generating.value = true;
  const response = await createChecklist({ task: props.note.title });
  const list = tryParse(response);

  if (Array.isArray(list)) {
    props.note.content = list.map((s) => `- [ ] ${s}`).join("\n");
  }

  generating.value = false;
}

function tryParse(input: string) {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

function onToggle() {
  props.note.collapse = !props.note.collapse;
  this.$emit("input");
}
</script>
