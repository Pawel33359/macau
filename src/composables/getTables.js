import { ref} from '@vue/reactivity'
import { projectFirestore } from '../firebase/config'

const getTables = (field,action,value) => {
    const tables = ref([])
    const error = ref(null)

    const load = async ()=>{
      try {
      const res = await projectFirestore.collection('tables')
        .where(field,action,value)//check if the name exists
        .get()

      tables.value = res.docs.map(doc => {
        return { ...doc.data(), id: doc.id }
      })
    }
      catch(err){
        error.value = err.message
      }
    }

    return {tables, error, load}
}

export default getTables