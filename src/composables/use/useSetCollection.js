import { ref } from "vue";
import { projectFirestore } from "../../firebase/config";

const useSetCollection = (collection, userid) => {
  const error = ref(null);
  const isPending = ref(false);

  // add a new document
  const setDoc = async (doc) => {
    error.value = null;
    isPending.value = true;

    try {
      const res = await projectFirestore
        .collection(collection)
        .doc(userid)
        .set(doc);
      isPending.value = false;
      return res;
    } catch (err) {
      error.value = "could not send the message";
      isPending.value = false;
    }
  };

  return { error, setDoc, isPending };
};

export default useSetCollection;
