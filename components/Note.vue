<template>
  <div class="relative bg-white mx-auto rounded shadow-md py-3">
    <button
      @click="onToggle"
      class="absolute top-1 right-1 w-8 h-8 text-lg leading-none transition transform"
      :class="!note.collapse && 'rotate-180'"
    >
      <span class="material-icons text-primary">expand_more</span>
    </button>
    <div class="text-gray-800">
      <input
        class="text-lg pl-3 pr-8 font-medium text-black bg-transparent w-full"
        placeholder="New note"
        v-model="note.title"
      />
      <template v-if="!note.collapse">
        <template v-if="note.type == 'text' || !note.type">
          <textarea
            v-model="note.content"
            class="text-sm px-6 py-3 w-full block bg-transparent whitespace-pre-wrap"
            placeholder="Note..."
          ></textarea>
        </template>
        <template v-if="note.type == 'tasks'">
          <div v-for="task of note.tasks" class="flex px-2 py-3 text-sm">
            <input v-model="task.completed" type="checkbox" class="mr-2" />
            <input
              v-model="task.task"
              @keyup="onTaskKeyUp($event, task)"
              type="text"
              class="bg-transparent border-0 flex-grow text-sm"
            />
          </div>
          <div class="text-right pt-2">
            <button
              class="text-sm"
              @click="note.tasks?.push({ completed: false, task: '' })"
            >
              <span class="material-icons text-primary">add</span>
            </button>
          </div>
        </template>
        <template v-if="note.type == 'html'">
          <div
            class=""
            contenteditable="true"
            @change="onNoteHtmlChange(note, $event)"
          >
            {{ note.html }}
          </div>
        </template>

        <div
          class="flex justify-end text-gray-900 shadow bg-gray-100 rounded-sm ml-auto"
        >
          <button
            @click="onCreateChecklist"
            class="w-8 h-8 text-lg leading-none p-1"
          >
            <span
              class="material-icons"
              :class="generating && 'animate-spin'"
              >{{ generating ? "refresh" : "checklist" }}</span
            >
          </button>
          <button @click="onUseText" class="w-8 h-8 text-lg leading-none p-1">
            <span class="material-icons">article</span>
          </button>
          <button @click="onUseHtml" class="w-8 h-8 text-lg leading-none p-1">
            <span class="material-icons">code</span>
          </button>
          <button
            @click="onDeleteNote"
            class="w-8 h-8 text-lg leading-none p-1"
          >
            <span class="material-icons text-red-600">delete</span>
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { Note, Task } from "./types";
import createChecklist from "https://aifn.run/fn/12c5cd32-9c33-4a4b-8a18-787a27df8109.js";

const generating = ref(false);
const emit = defineEmits(["delete-note"]);
const props = defineProps({
  note: {
    type: Object as () => Note,
    required: true,
  },
});

function onNoteHtmlChange(note, $event) {
  note.html = $event.target.textContent;
}

function onDeleteNote() {
  emit("delete-note", props.note);
}

function onUseHtml() {
  props.note.type = "html";
}

function onUseText() {
  props.note.type = "text";
}

async function onCreateChecklist() {
  generating.value = true;
  const response = await createChecklist({ task: props.note.title });
  const list = tryParse(response);

  if (Array.isArray(list)) {
    props.note.type = "tasks";
    props.note.tasks = list.map((task) => ({ completed: false, task }));
  }

  generating.value = false;
}

function onTaskKeyUp(event: KeyboardEvent, task: Task) {
  if (event.code === "Backspace" && (event.target as any).value === "") {
    props.note.tasks = props.note.tasks?.filter((t) => t !== task);
  }
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
