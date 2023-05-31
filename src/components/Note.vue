<template>
  <div
    class="relative py-6 bg-yellow-100 mx-auto rounded-xl shadow-md"
  >
    <button
      @click="onToggle"
      class="absolute top-1 right-1 w-8 h-8 text-lg leading-none"
    >
      <span class="material-icons">expand_more</span>
    </button>
    <div>
      <input
        class="text-xl px-6 font-medium text-black bg-transparent w-full"
        placeholder="New note"
        v-model="note.title"
      />
      <p
        @input="onContentChange"
        class="text-gray-600 px-6 py-3 w-full block whitespace-pre-wrap"
        contenteditable="true"
        v-if="!note.collapse"
      >
        {{ note.content }}
      </p>
      <div class="text-right">
        <button
          @click="onDeleteNote"
          class="w-8 h-8 text-lg leading-none"
        >
          <span class="material-icons">delete</span>
        </button>
      <div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Note } from './types';

export default defineComponent({
  name: 'Note',
  props: {
    note: {
      type: Object as () => Note,
      required: true,
    },
  },
  methods: {
    onDeleteNote() {
      this.$emit('delete-note', this.note);
    },
    onContentChange($event: any) {
      this.note.content = $event.target?.textContent;
    },
    onToggle() {
      this.note.collapse = !this.note.collapse;
      this.$emit('input');
    }
  },
});
</script>
