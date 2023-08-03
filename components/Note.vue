<template>
  <div class="relative bg-white rounded shadow-md">
    <button
      @click="onToggle"
      class="absolute top-1 right-1 w-8 h-8 text-lg leading-none transition transform"
      :class="!note.collapse && 'rotate-180'"
    >
      <span class="material-icons text-primary">expand_more</span>
    </button>
    <div class="text-gray-800">
      <input
        class="text-lg pl-3 mt-3 pr-8 font-medium text-black bg-transparent w-full"
        placeholder="New note"
        v-model="note.title"
      />
      <template v-if="!note.collapse">
        <template v-if="note.type == 'text' || !note.type">
          <div class="m-3 p-3 bg-gray-100 rounded text-sm">
            <textarea
              v-model="note.content"
              :rows="textHeight"
              class="text-sm w-full block bg-transparent whitespace-pre-wrap"
              placeholder="Note..."
            ></textarea>
          </div>
        </template>
        <template v-if="note.type == 'tasks'">
          <div v-for="task of note.tasks" class="flex px-2 py-3 text-sm mx-1">
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
            class="m-3 p-3 bg-gray-100 rounded text-sm"
            contenteditable="true"
            @change="onNoteHtmlChange(note, $event)"
          >
            {{ note.html }}
          </div>
        </template>

        <div
          class="flex gap-2 justify-end text-gray-900 bg-gray-100 rounded-sm mt-3"
        >
          <button
            @click="onCreateChecklist"
            class="w-8 h-8 text-lg leading-none p-1"
          >
            <span
              class="material-icons"
              :class="generating && 'animate-spin'"
              >{{ generating ? "refresh" : "auto_awesome" }}</span
            >
          </button>
          <button
            @click="onUseCheckList"
            class="w-8 h-8 text-lg leading-none p-1"
          >
            <span class="material-icons">checklist</span>
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
import { ref, computed } from "vue";
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

const textHeight = computed(() => props.note.content?.split("\n").length || 2);

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

function onUseCheckList() {
  props.note.type = "tasks";
}

async function onCreateChecklist() {
  generating.value = true;
  const task = props.note.title;
  const context = props.note.tasks?.map((n) => n.task).join("\n");
  const response = await createChecklist({
    task,
    context: context ? "Previous tasks in the list:\n" + context : "",
  });

  const list = tryParse(response);

  if (Array.isArray(list)) {
    props.note.type = "tasks";
    props.note.tasks = list.map((task) => ({ completed: false, task }));
  }

  generating.value = false;
}

function onTaskKeyUp(event: KeyboardEvent, task: Task) {
  const target = event.target as HTMLInputElement;

  if (event.code === "Backspace" && target.value === "") {
    (target.parentNode?.previousSibling?.childNodes[1] as any).focus();
    props.note.tasks = props.note.tasks?.filter((t) => t !== task);
  }

  if (event.code === "Enter") {
    const index = Number(props.note.tasks?.indexOf(task) || 0) + 1;

    props.note.tasks = props.note.tasks
      ?.slice(0, index)
      .concat({ completed: false, task: "" })
      .concat(props.note.tasks.slice(index));
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
