<template>
  <div class="p-10" @input="onSave">
    <header class="flex justify-items-stretch items-center mb-10">
      <h1 class="flex-grow text-5xl">Notes</h1>
      <div class="text-right">
        <button
          class="
            top-2
            right-2
            rounded-lg
            border
            border-gray-500
            bg-white
            text-4xl
            w-12
            h-12
            rounded-full
          "
          @click="onAdd"
        >
          <span class="material-icons">edit</span>
        </button>
      </div>
    </header>

    <div class="flex flex-wrap gap-4">
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

<script lang="ts">
import { defineComponent, ref, unref } from 'vue';
import NoteCard from './components/Note.vue';
import { Note } from './components/types';

export default defineComponent({
  name: 'App',
  components: {
    NoteCard,
  },
  setup() {
    const notes = ref<Note[]>(
      localStorage.notes ? JSON.parse(localStorage.notes) : []
    );

    function onSave() {
      localStorage.notes = JSON.stringify(unref(notes));
    }

    function onDelete(note: Note) {
      const index = unref(notes).findIndex((n) => n.uid === note.uid);
      if (index !== -1) {
        notes.value.splice(index, 1);
        onSave();
      }
    }

    function onAdd() {
      unref(notes).unshift({ uid: String(Date.now()), title: '', content: '', collapse: false });
    }

    return { notes, onSave, onDelete, onAdd };
  },
});
</script>
