import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No se ha subido ningún archivo" }, { status: 400 });
    }

    // Convertimos el archivo a un buffer para subirlo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Creamos un nombre único
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, "_")}`;

    // Subimos el archivo a Supabase Storage, al bucket llamado 'rdmarket-uploads'
    const { data, error } = await supabase
      .storage
      .from('rdmarket-uploads')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error("Supabase Storage error:", error);
      return NextResponse.json({ error: "Error subiendo a la nube de Supabase" }, { status: 500 });
    }

    // Obtenemos la URL pública del archivo
    const { data: { publicUrl } } = supabase
      .storage
      .from('rdmarket-uploads')
      .getPublicUrl(filename);

    return NextResponse.json({ url: publicUrl });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Error interno al procesar el archivo" }, { status: 500 });
  }
}
