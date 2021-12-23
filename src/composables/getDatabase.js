import { ref, watchEffect } from 'vue'
import { projectDatabase } from '../firebase/config'

const getDatabase = (database) => {
  
  const documents = ref(null)

  let databaseRef = projectDatabase.ref(database)
    databaseRef.on('value', (snapshot) => {
    const data = snapshot.val();
    documents.value = data
  });
  return {documents}
}

export default getDatabase