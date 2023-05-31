<template>
  <div
    class="relative py-6 bg-yellow-100 mx-auto rounded-xl shadow-md"
    @click="onToggle"
  >
    <button
      @click="onDeleteNote"
      class="absolute top-0 right-0 w-8 h-8 text-lg"
    >
      ❌
    </button>
    <div>
      <input
        class="text-xl px-6 font-medium text-black bg-transparent w-full"
        placeholder="New note"
        v-model="note.title"
      />
      <p
        @input="note.content = $event.target.textContent"
        class="text-gray-600 px-6 py-3 w-full block whitespace-pre-wrap"
        contenteditable="true"
      >
        {{ note.content }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Note',
  props: {
    note: {
      type: Object as () => { title: string; content: string },
      required: true,
    },
  },
  methods: {
    onDeleteNote() {
      this.$emit('delete-note', this.note);
    },
  },
});
</script>
