import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';


interface CarModel {
  model: string;
  battery: string;
  range: string;
  charge_time: string;
}

interface CarData {
  [brand: string]: CarModel[];
}

export const saveData = async (data: CarData) => {
  try {
    // Iterera över varje bilmärke i datan
    for (const [brand, models] of Object.entries(data)) {
      // Skapa en referens till dokumentet för det specifika bilmärket
      const docRef = doc(db, 'cars', brand);

      // Spara data under bilmärket
      await setDoc(docRef, { models });

      console.log(`Data saved successfully for brand: ${brand}`);
    }
  } catch (error) {
    console.error('Error saving data: ', error);
  }
};

