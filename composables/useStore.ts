import { getProperty, setProperty } from "https://auth.homebots.io/auth.js";
import { Store } from "https://store.homebots.io/store.mjs";
import { onMounted, ref } from "vue";

const storeIdKey = "notes:storeId";

export function useStore() {
  const store = ref<any>(null);
  const ready = new Promise((resolve) => {
    onMounted(async function () {
      let storeId = await getProperty(storeIdKey);

      if (!storeId) {
        storeId = await Store.create();
        await setProperty(storeIdKey, storeId);
      }

      store.value = Store.get(storeId);
      resolve(null);
    });
  });

  return { ready, store };
}
