import { ref } from "vue";
import { projectFirestore } from "../../firebase/config";

const useCollection = (collection) => {
  const error = ref(null);
  const isPending = ref(false);
  const id = ref(null);

  // add a new document
  const addDoc = async (doc) => {
    error.value = null;
    isPending.value = true;

    try {
      const res = await projectFirestore
        .collection(collection)
        .add(doc)
        .then((docRef) => {
          id.value = docRef.id;
        });
      isPending.value = false;
      return res;
    } catch (err) {
      error.value = "could not add to database";
      isPending.value = false;
    }
  };

  return { error, addDoc, isPending, id };
};

export default useCollection;
