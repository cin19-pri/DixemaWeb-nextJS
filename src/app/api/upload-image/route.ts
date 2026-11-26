import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import {
  CloudinaryConfigurationError,
  ImageUploadValidationError,
  uploadImage,
} from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  if (session.role !== "SELLER" && session.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "La solicitud debe contener un formulario válido." },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Selecciona un archivo de imagen." },
      { status: 400 },
    );
  }

  try {
    const url = await uploadImage(file);
    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    if (error instanceof ImageUploadValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof CloudinaryConfigurationError) {
      console.error("Cloudinary no está configurado:", error.message);
      return NextResponse.json(
        { error: "El servicio de imágenes no está configurado." },
        { status: 500 },
      );
    }

    console.error("Error al subir imagen a Cloudinary:", error);
    return NextResponse.json(
      { error: "No se pudo subir la imagen." },
      { status: 502 },
    );
  }
}
