<template>
  <div class="">
    <div class="z-10 absolute bottom-0 right-0 mr-4 mb-4">
      <button
        v-if="profile"
        class="shadow-lg bg-white text-4xl text-primary w-12 h-12 rounded-full"
        @click="onAdd"
      >
        <span class="material-icons">edit</span>
      </button>
      <button
        v-if="!profile"
        class="shadow-lg bg-white text-4xl text-primary w-12 h-12 rounded-full"
        @click="signIn()"
      >
        <span class="material-icons">account_circle</span>
      </button>
    </div>

    <div class="h-screen overflow-y-auto p-4 pb-20" v-if="profile">
      <NoteCard
        class="w-full mb-2"
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

  if (index !== -1 && confirm("Are you sure?")) {
    notes.value.splice(index, 1);
    onSave();
  }
}

function onAdd() {
  unref(notes).push({
    uid: crypto.randomUUID(),
    title: "",
    content: "",
    collapse: true,
    type: 'text',
  });
}

onMounted(async function () {
  profile.value = await getProfile();
  await ready;

  notesBackend = store.value.getResource("notes");

  const list = await notesBackend.get("all");
  notes.value = list || [];

  watch(notes, onSave, { deep: true });
});
</script>
