import { ref, watchEffect } from 'vue'
import { projectFirestore } from '../firebase/config'

const getUserrankings = (query) => {
  
  const rankings = ref(null)
  const error = ref(null)

  // register the firestore collection reference
  let collectionRef = projectFirestore.collection('user_ranking')
    .orderBy('points','desc')
  
  if(query){
    collectionRef = collectionRef.where(...query)
  }

  const unsub = collectionRef.onSnapshot(snap => {
    let results = []
    snap.docs.forEach(doc => {
      results.push({...doc.data(), id: doc.id})
    });
    
    // update values
    rankings.value = results
    error.value = null
  }, err => {
    rankings.value = null    
    error.value = 'could not fetch the data'
  })

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsub());
  });

  return { error, rankings }
}

export default getUserrankings