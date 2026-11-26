import { v2 as cloudinary } from "cloudinary";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const uploadFolder = "dixema/productos";

export class ImageUploadValidationError extends Error {}

export class CloudinaryConfigurationError extends Error {}

const signatureValidators: Record<string, (bytes: Uint8Array) => boolean> = {
  "image/jpeg": (bytes) =>
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff,
  "image/png": (bytes) =>
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a,
  "image/webp": (bytes) =>
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP",
};

function isValidImageSignature(mimeType: string, bytes: Uint8Array) {
  return signatureValidators[mimeType]?.(bytes) ?? false;
}

export async function uploadImage(file: File): Promise<string> {
  if (file.size === 0) {
    throw new ImageUploadValidationError("El archivo está vacío.");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new ImageUploadValidationError(
      "La imagen no puede superar los 5 MB.",
    );
  }

  const mimeType = file.type.toLowerCase();
  if (!signatureValidators[mimeType]) {
    throw new ImageUploadValidationError(
      "Solo se permiten imágenes JPG, PNG o WEBP.",
    );
  }

  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (!isValidImageSignature(mimeType, header)) {
    throw new ImageUploadValidationError(
      "El contenido no coincide con una imagen JPG, PNG o WEBP.",
    );
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new CloudinaryConfigurationError(
      "Configura CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET.",
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: uploadFolder, resource_type: "image" },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result?.secure_url) {
            reject(new Error("Cloudinary no devolvió una URL segura."));
            return;
          }

          resolve(result.secure_url);
        },
      )
      .end(buffer);
  });
}
