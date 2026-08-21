"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VendorOnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const router = useRouter();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simular envío de KYC a la base de datos e insertar location real
    const { submitKyc } = await import("@/actions/vendor");
    await submitKyc(location);
    setTimeout(() => {
      setLoading(false);
      setStep(4); // Pantalla de éxito
    }, 1500);
  };

  return (
    <div className="container" style={{ padding: "4rem 20px", maxWidth: "800px" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Verificación de Vendedor (KYC)</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
          RDMarket es la plataforma más segura del país. Para vender, necesitamos validar tu identidad y la de tu tienda.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem", position: "relative" }}>
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "2px", background: "var(--border)", zIndex: 0 }}></div>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{ width: "40px", height: "40px", borderRadius: "50%", background: step >= s ? "var(--primary)" : "var(--card-bg)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, fontWeight: "bold", border: `2px solid ${step >= s ? "var(--primary)" : "var(--border)"}` }}>
            {s}
          </div>
        ))}
      </div>

      <div className="glass" style={{ padding: "3rem", borderRadius: "16px" }}>
        {step === 1 && (
          <form onSubmit={handleNext} className="animate-fade-in-up">
            <h2 style={{ marginBottom: "1.5rem" }}>Paso 1: Información Legal</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                Nombre Completo del Propietario
                <input required type="text" placeholder="Ej. Juan Pérez" style={{ padding: "1rem", borderRadius: "8px", background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--text-color)" }} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                Cédula de Identidad o Pasaporte
                <input required type="text" placeholder="000-0000000-0" style={{ padding: "1rem", borderRadius: "8px", background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--text-color)" }} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                Foto Frontal de la Cédula/Pasaporte
                <div style={{ padding: "2rem", textAlign: "center", border: "2px dashed var(--primary)", borderRadius: "8px", cursor: "pointer", background: "rgba(var(--primary-rgb), 0.05)" }}>
                  <span style={{ fontSize: "2rem" }}>📄</span>
                  <p style={{ marginTop: "0.5rem", color: "var(--text-muted)" }}>
                    {documentFile ? documentFile.name : "Haz clic para subir documento (PDF/JPG)"}
                  </p>
                  <input 
                    type="file" 
                    required 
                    accept="image/*,.pdf" 
                    style={{ display: "none" }} 
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setDocumentFile(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </label>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "2rem", padding: "1rem" }}>Continuar al Paso 2</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleNext} className="animate-fade-in-up">
            <h2 style={{ marginBottom: "1.5rem" }}>Paso 2: Detalles de la Tienda</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                Nombre Comercial de la Tienda
                <input required type="text" placeholder="Ej. ElectroMundo RD" style={{ padding: "1rem", borderRadius: "8px", background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--text-color)" }} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                Número de Teléfono Oficial
                <input required type="tel" placeholder="(809) 000-0000" style={{ padding: "1rem", borderRadius: "8px", background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--text-color)" }} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                Dirección Física o ID de Ubicación
                <textarea 
                  required 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej. Av. Winston Churchill, Plaza Central, Local 14B... o pega el Link de Google Maps" 
                  style={{ padding: "1rem", borderRadius: "8px", background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--text-color)", minHeight: "100px" }} 
                />
              </label>
              <button 
                type="button" 
                onClick={() => {
                  if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        const coords = `${pos.coords.latitude}, ${pos.coords.longitude}`;
                        setLocation((prev) => prev ? `${prev}\nCoordenadas: ${coords}` : `Coordenadas: ${coords}`);
                      },
                      (err) => alert("No se pudo obtener la ubicación. Asegúrate de dar permisos.")
                    );
                  } else {
                    alert("Tu navegador no soporta geolocalización.");
                  }
                }}
                style={{ 
                  background: "rgba(255, 255, 255, 0.1)", 
                  border: "1px solid var(--border)", 
                  padding: "0.75rem", 
                  borderRadius: "8px", 
                  color: "white", 
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontWeight: "bold"
                }}
              >
                📍 Usar mi ubicación actual
              </button>
            </div>
            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <button type="button" onClick={() => setStep(1)} className="btn" style={{ flex: 1 }}>Atrás</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: "1rem" }}>Continuar al Paso 3</button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="animate-fade-in-up">
            <h2 style={{ marginBottom: "1.5rem" }}>Paso 3: Verificación por Video (Requisito Obligatorio)</h2>
            <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", padding: "1.5rem", borderRadius: "12px", marginBottom: "1.5rem" }}>
              <h3 style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "1.5rem" }}>⚠️</span> Anti-Fraude
              </h3>
              <p style={{ color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
                Para evitar suplantación de identidad o tiendas falsas, debes grabar un video **continuo y sin cortes** mostrando el local de tu tienda desde afuera hacia adentro, y mostrando parte de tu inventario real.
              </p>
            </div>
            
            <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              Sube tu Video de Verificación (MP4, Máx 50MB)
              <div style={{ padding: "3rem", textAlign: "center", border: "2px dashed #ef4444", borderRadius: "8px", cursor: "pointer", background: "rgba(255,255,255,0.02)" }}>
                <span style={{ fontSize: "2.5rem" }}>🎥</span>
                <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
                  {videoFile ? videoFile.name : "Haz clic para seleccionar o grabar video"}
                </p>
                <input 
                  type="file" 
                  required 
                  accept="video/mp4,video/*" 
                  capture="environment" 
                  style={{ display: "none" }} 
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setVideoFile(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </label>

            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <button type="button" onClick={() => setStep(2)} className="btn" style={{ flex: 1 }}>Atrás</button>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2, padding: "1rem" }}>
                {loading ? "Enviando Solicitud..." : "Enviar para Revisión"}
              </button>
            </div>
          </form>
        )}

        {step === 4 && (
          <div className="animate-fade-in-up" style={{ textAlign: "center", padding: "2rem 0" }}>
            <span style={{ fontSize: "4rem" }}>⏳</span>
            <h2 style={{ margin: "1.5rem 0 1rem 0" }}>Solicitud en Revisión</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "500px", margin: "0 auto 2rem auto", lineHeight: "1.6" }}>
              Hemos recibido tus documentos y el video de tu local. Nuestro equipo de seguridad está analizando tu solicitud. Esto suele tardar entre 24 y 48 horas laborables.
            </p>
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "1.5rem", borderRadius: "12px", display: "inline-block" }}>
              <p style={{ margin: 0, fontWeight: "bold" }}>Estatus: <span style={{ color: "var(--accent)" }}>Pendiente de Aprobación</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
