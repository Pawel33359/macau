import { ref } from 'vue'
import { projectDatabase } from '../firebase/config'

const useDatabase = (database) => {

  const error = ref(null)
  const isPending = ref(false)

  // add a new document
  const addDat = async (doc) => {
    error.value = null
    isPending.value = true

    try {
      const res = await projectDatabase.ref(database).set(doc)
      isPending.value = false
      return res
    }
    catch(err) {
      console.log(err.message)
      error.value = 'could not add to database'
      isPending.value = false
    }
  }

  const deleteDat = async()=>{
    isPending.value = true
    error.value = null
    
    try{
        const res = await projectDatabase.ref(database).remove()
        isPending.value = false
        return res
    } catch(err) {
        console.log(err.message)
        isPending.value = false
        error.value = 'Could not delete the document'
    }
}

  return { error, addDat, isPending , deleteDat}

}

export default useDatabase