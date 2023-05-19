import { ref, watchEffect } from 'vue'
import { projectFirestore } from '../firebase/config'

const getWatchedtables = (query) => {
  
    const tables = ref(null)
    const error = ref(null)
  
    // register the firestore collection reference
    let collectionRef = projectFirestore.collection('tables')
      .orderBy('name','asc')
    
    if(query){
      collectionRef = collectionRef.where(...query)
    }
  
    const unsub = collectionRef.onSnapshot(snap => {
      let results = []
      snap.docs.forEach(doc => {
        results.push({...doc.data(), id: doc.id})
      });
      
      // update values
      tables.value = results
      error.value = null
    }, err => {
      tables.value = null    
      error.value = 'could not fetch the data'
    })
  
    watchEffect((onInvalidate) => {
      onInvalidate(() => unsub());
    });
  
    return { error, tables }
  }

  export default getWatchedtables