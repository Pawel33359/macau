import { ref } from "@vue/reactivity";
import { projectFirestore } from "../../firebase/config";
import { FieldValue } from "../../firebase/config";

const useDocument = (collection, id) => {
  const error = ref(null);
  const isPending = ref(false);

  let docRef = projectFirestore.collection(collection).doc(id);

  const deleteDoc = async () => {
    isPending.value = true;
    error.value = null;

    try {
      const res = await docRef.delete();
      isPending.value = false;
      return res;
    } catch (err) {
      isPending.value = false;
      error.value = "Could not delete the document";
    }
  };

  const updateDoc = async (updates) => {
    isPending.value = true;
    error.value = null;

    try {
      const res = await docRef.update(updates);
      isPending.value = false;
      return res;
    } catch (err) {
      isPending.value = false;
      error.value = "Could not update the document";
    }
  };

  const removeArrayObject = async (arrayname, object) => {
    isPending.value = true;
    error.value = null;
    try {
      const res = await docRef.update({
        [arrayname]: FieldValue.arrayRemove(object),
      });
      isPending.value = false;
      return res;
    } catch (err) {
      isPending.value = false;
      error.value = "Could not remove Array Object";
    }
  };
  const updateArrayObject = async (arrayname, object) => {
    isPending.value = true;
    error.value = null;
    try {
      const res = await docRef.update({
        [arrayname]: FieldValue.arrayUnion(object),
      });
      isPending.value = false;
      return res;
    } catch (err) {
      isPending.value = false;
      error.value = "Could not update Array Object";
    }
  };

  return {
    error,
    isPending,
    deleteDoc,
    updateDoc,
    removeArrayObject,
    updateArrayObject,
  };
};

export default useDocument;
