import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; 

export const fetchCarsByBrand = async (brand: string) => {
  try {
    // Skapa en referens till dokumentet för det specifika bilmärket
    const docRef = doc(db, 'cars', brand);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      console.log(data);

      if (data && data.models) {
        return data.models; 
      } else {
        console.log(`No models found for brand: ${brand}`);
        return [];
      }
    } else {
      console.log(`Brand does not exist: ${brand}`);
      return [];
    }
  } catch (error) {
    console.error('Error fetching cars by brand:', error);
    throw new Error('Could not fetch cars');
  }
};
