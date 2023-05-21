import { ref } from "vue";
import { projectAuth } from "../../firebase/config";
import firebase from "firebase/app";

const error = ref(null);
const isPending = ref(false);

const create = async (email, password, displayName) => {
  error.value = null;
  isPending.value = true;

  try {
    const credential = await firebase.auth.EmailAuthProvider.credential(
      email,
      password
    );
    console.log(credential);
    if (!credential) {
      throw new Error("Could not complete creating credentials");
    }
    const res = await projectAuth.currentUser.linkWithCredential(credential);
    console.log(res);
    if (!res) {
      throw new Error("Could not complete creation");
    }
    await res.user.updateProfile({ displayName });
    error.value = null;
    isPending.value = false;

    return res;
  } catch (err) {
    error.value = err.message;
    isPending.value = false;
  }
};

const useCreateAccount = () => {
  return { error, create, isPending };
};

export default useCreateAccount;
