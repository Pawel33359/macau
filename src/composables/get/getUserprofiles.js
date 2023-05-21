import { ref } from "@vue/reactivity";
import { projectFirestore } from "../../firebase/config";

const getUserprofiles = (displayName) => {
  const profiles = ref([]);
  const error = ref(null);

  const load = async () => {
    try {
      const res = await projectFirestore
        .collection("user_profile")
        .where("name", "==", displayName) //check if the name exists
        .get();

      profiles.value = res.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
    } catch (err) {
      error.value = err.message;
    }
  };

  return { profiles, error, load };
};

export default getUserprofiles;
