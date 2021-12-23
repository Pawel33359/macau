import { ref } from '@vue/reactivity'
import { projectFirestore } from '../firebase/config'

const getUserprofiles = (displayName) => {
    const profiles = ref([])
    const error = ref(null)

    const load = async ()=>{
      try {
      const res = await projectFirestore.collection('user_profile')
        .where('name','==',displayName,)//check if the name exists
        .get()


      //console.log(res.docs)

      profiles.value = res.docs.map(doc => {
        // console.log(doc.data())
        return { ...doc.data(), id: doc.id }
      })
    }
      catch(err){
        error.value = err.message
        console.log(error.value)
      }
    }

    return {profiles, error, load}
}

export default getUserprofiles