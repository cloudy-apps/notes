<template>
  <div class="p-10">
    <header class="flex justify-items-stretch items-center mb-10">
      <h1 class="flex-grow text-5xl text-white">Notes</h1>
      <div class="text-right" v-if="profile">
        <button
          class="top-2 right-2 shadow-lg bg-white text-4xl w-12 h-12 rounded-full"
          @click="onAdd"
        >
          <span class="material-icons">edit</span>
        </button>
      </div>
    </header>
    <button
      class="flex mx-auto px-4 py-3 my-4 bg-white shadow-md rounded"
      v-if="!profile"
      @click="signIn()"
    >
      Sign in to start
    </button>
    <div class="flex flex-wrap gap-4" v-if="profile">
      <NoteCard
        class="mb-5 w-2/3 flex-grow"
        v-for="note in notes"
        :key="note.uid"
        :note="note"
        @delete-note="onDelete"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, unref, watch } from "vue";
import { getProfile, signIn } from "https://auth.homebots.io/auth.js";
import NoteCard from "./components/Note.vue";
import { Note } from "./components/types";
import { useStore } from "./composables/useStore";

let notesBackend;
const { ready, store } = useStore();

const notes = ref<Note[]>([]);
const profile = ref(null);
const debounce = function (fn: any, time: number) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), time);
  };
};

const onSave = debounce(() => notesBackend.set("all", unref(notes)), 1000);

function onDelete(note: Note) {
  const index = unref(notes).findIndex((n) => n.uid === note.uid);

  if (index !== -1) {
    notes.value.splice(index, 1);
    onSave();
  }
}

function onAdd() {
  unref(notes).unshift({
    uid: crypto.randomUUID(),
    title: "",
    content: "",
    collapse: false,
  });
}

onMounted(async function () {
  profile.value = await getProfile();
  await ready;

  notesBackend = store.value.getResource("notes");
  watch(notes, onSave, { deep: true });
});
</script>
