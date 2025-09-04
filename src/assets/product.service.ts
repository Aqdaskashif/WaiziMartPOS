import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private firestore: Firestore) {}

  // ✅ Add product (barcode as ID, or generate random if empty)
  async addProduct(product: any): Promise<any> {
    try {
      if (!product.barcode) {
        product.barcode = await this.generateUniqueBarcode();
      }
  
      const productRef = doc(this.firestore, `products/${product.barcode}`);
      const docSnap = await getDoc(productRef);
  
      // Check if product already exists
      if (docSnap.exists()) {
        alert(`Record with barcode ${product.barcode} already exists!`);
        return false;
      }
  
      // Save product
      await setDoc(productRef, product);
      alert('Product added successfully:');
      return true
    } catch (err) {
      console.error('Error adding product:', err);
      throw err;
    }
  }

  async getProduct(barcode: string): Promise<any | null> {
    const productRef = doc(this.firestore, `products/${barcode}`);
    const snapshot = await getDoc(productRef);
    return snapshot.exists() ? snapshot.data() : null;
  }

  // ✅ Get all products
  async getAllProducts(type:any): Promise<any[]> {
    const querySnapshot = await getDocs(collection(this.firestore, type));
    debugger
    const data= querySnapshot.docs.map(doc => doc.data());
    return data
  }

  // ✅ Update product
  async updateProduct(product: any): Promise<void> {
    const productRef = doc(this.firestore, `products/${product.barcode}`);
    await updateDoc(productRef, { ...product });
  }

  // ✅ Delete product
  async deleteProduct(barcode: string): Promise<void> {
    const productRef = doc(this.firestore, `products/${barcode}`);
    await deleteDoc(productRef);
  }

  // 🔹 Helper: Generate unique 12-digit barcode
  private async generateUniqueBarcode(): Promise<string> {
    let unique = false;
    let newBarcode = '';

    while (!unique) {
      newBarcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
      const checkRef = doc(this.firestore, `products/${newBarcode}`);
      const checkSnap = await getDoc(checkRef);
      if (!checkSnap.exists()) {
        unique = true;
      }
    }

    return newBarcode;
  }
}
