const admin = require("firebase-admin");
const serviceAccount = require("../config/ecommerce-firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://ecommerce-leraning-test.appspot.com/'
});
const bucket = admin.storage().bucket();

async function uploadFileToFirebaseStorage(file) {
  try {
    const { buffer, originalname } = file;

    const fileRef = bucket.file(originalname);

    await fileRef.save(buffer);

    const [url] = await fileRef.getSignedUrl({
      action: "read",
      expires: "01-01-2030", // URL amal qilish muddati
    });

    return {
      url,
      public_id: originalname, // Fayl nomini public_id sifatida qaytarish mumkin
    };
  } catch (error) {
    throw error;
  }
}

// Rasmi o'chirib tashlash uchun funksiya
async function deleteFileFromFirebaseStorage(fileName) {
  try {
    const file = bucket.file(fileName);

    // Rasmi o'chirib tashlash
    await file.delete();

    return {
      success: true,
    };
  } catch (error) {
    throw error;
  }
}

async function getImageUrl(fileName) {
  const file = bucket.file(fileName);
  const [url] = await file.getSignedUrl({
    action: "read",
    expires: "01-01-2030",
  });
  return { url, public_id: fileName };
}

module.exports = {
  uploadFileToFirebaseStorage,
  deleteFileFromFirebaseStorage,
  getImageUrl,
};
