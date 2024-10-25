import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig'; 

const capitalizeBrandName = (brand: string) => {
  return brand.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};


export const fetchAllCarBrands = async () => {
  try {
    const brandsCollection = collection(db, 'cars');
    const snapshot = await getDocs(brandsCollection);
    
    const brands: string[] = [];
    snapshot.forEach(doc => {
      brands.push(doc.id);
    });
    
    return brands;
  } catch (error) {
    console.error('Error fetching car brands:', error);
    throw new Error('Could not fetch car brands');
  }
};

export const fetchCarsByBrand = async (brand: string) => {
  try {
    const normalizedBrand = capitalizeBrandName(brand);
    const docRef = doc(db, 'cars', normalizedBrand);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();

      
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
