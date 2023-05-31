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
      <Note
        class="mb-5 w-2/3 flex-grow"
        v-for="note in notes"
        :key="note.id"
        :note="note"
        @delete-note="onDelete"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, unref } from 'vue';
import Note from './Note.vue';

interface Note {
  id: number;
  title: string;
  content: string;
}

export default defineComponent({
  name: 'App',
  components: {
    Note,
  },
  setup() {
    const notes = ref<Note[]>(
      localStorage.notes ? JSON.parse(localStorage.notes) : []
    );

    function onSave() {
      localStorage.notes = JSON.stringify(unref(notes));
    }

    function onDelete(note: Note) {
      const index = unref(notes).findIndex((n) => n.id === note.id);
      if (index !== -1) {
        notes.value.splice(index, 1);
        onSave();
      }
    }

    function onAdd() {
      unref(notes).unshift({ id: Date.now(), title: '', content: '' });
    }

    return { notes, onSave, onDelete, onAdd };
  },
});
</script>
