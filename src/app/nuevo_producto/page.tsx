/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  crearProducto,
  obtenerCategorias,
  type CategoriaProducto,
} from "@/actions/productos";
import {
  PlusCircle,
  UploadCloud,
  Tag,
  Scale,
  Palette,
  Layers3,
  NotebookText,
  DollarSign,
} from "lucide-react";

import "./nuevo_producto.css";

export default function AñadirProductoPage() {
  const router = useRouter();

  // --- 1. LÓGICA DE SCROLL PARA EL TÍTULO ---
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- 2. ESTADOS DEL FORMULARIO ---
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precioMenudeo, setPrecioMenudeo] = useState("");
  const [precioMayoreo, setPrecioMayoreo] = useState("");
  const [cantidadMinimaMayoreo, setCantidadMinimaMayoreo] = useState("");
  const [stock, setStock] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [medidas, setMedidas] = useState("");
  const [colores, setColores] = useState("");
  const [modelos, setModelos] = useState("");

  useEffect(() => {
    if (!imagePreview) return;
    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  useEffect(() => {
    let cancelled = false;
    obtenerCategorias()
      .then((result) => {
        if (cancelled) return;
        if (result.success) {
          setCategorias(result.categorias);
          setUploadError(null);
        } else {
          setUploadError(result.error);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUploadError("No se pudieron cargar las categorías.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingCategories(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // --- 3. MANEJO DE IMAGEN ---
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setUploadError(null);
    }
  };

  // --- 4. FUNCIÓN PARA GUARDAR EL PRODUCTO ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSaving(true);
    setUploadError(null);
    setSuccessMessage(null);

    try {
      if (!selectedImage) {
        throw new Error("Selecciona una imagen para el producto.");
      }

      const formData = new FormData();
      formData.append("file", selectedImage);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      const uploadResult: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof uploadResult === "object" &&
          uploadResult !== null &&
          "error" in uploadResult &&
          typeof uploadResult.error === "string"
            ? uploadResult.error
            : "No se pudo subir la imagen.";
        throw new Error(message);
      }

      if (
        typeof uploadResult !== "object" ||
        uploadResult === null ||
        !("url" in uploadResult) ||
        typeof uploadResult.url !== "string"
      ) {
        throw new Error("El servidor devolvió una URL de imagen inválida.");
      }

      const result = await crearProducto({
        titulo: nombre,
        descripcion,
        precioMenudeo,
        precioMayoreo,
        cantidadMinimaMayoreo,
        stock,
        categoriaId,
        imagen: uploadResult.url,
        medidas,
        colores,
        modelos,
      });

      if (!result.success) {
        setUploadError(result.error);
        return;
      }

      setSuccessMessage("El producto se creó correctamente.");
      setNombre("");
      setDescripcion("");
      setPrecioMenudeo("");
      setPrecioMayoreo("");
      setCantidadMinimaMayoreo("");
      setStock("");
      setCategoriaId("");
      setMedidas("");
      setColores("");
      setModelos("");
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "No se pudo guardar el producto.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="añadir-producto-wrapper">
      <main className="main-content-fluid">
        {/* Header Dinámico */}
        <header
          className={`content-header-minimal ${isScrolled ? "fade-out" : ""}`}
        >
          <div className="welcome-msg">
            <h1>
              Crear <span className="highlight-text">Nuevo Producto</span>
            </h1>
            <p>
              Rellena los campos para añadir un artículo al catálogo de Dixema.
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="form-añadir-producto">
          <div className="form-grid">
            {/* COLUMNA IZQUIERDA: Imagen y Descripción */}
            <div className="form-column">
              <div className="form-section card-dixema">
                <label className="section-title">Imagen del Producto</label>
                <div
                  className={`image-upload-zone ${imagePreview ? "has-image" : ""}`}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="upload-preview"
                    />
                  ) : (
                    <div className="upload-placeholder">
                      <UploadCloud size={48} color="#8E8E93" />
                      <p>Arrastra o haz clic para subir</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="file-input-hidden"
                    id="productImage"
                  />
                  <label htmlFor="productImage" className="btn-upload-trigger">
                    Seleccionar Archivo
                  </label>
                </div>
              </div>

              <div className="form-section card-dixema">
                <label htmlFor="descripcion" className="section-title">
                  <NotebookText size={18} /> Descripción Detallada
                </label>
                <textarea
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={8}
                  className="input-dixema textarea-dixema"
                  required
                />
              </div>
            </div>

            {/* COLUMNA DERECHA: Datos, Precios y Variantes */}
            <div className="form-column">
              <div className="form-section card-dixema">
                <div className="input-group">
                  <label htmlFor="categoria">Categoría</label>
                  <select
                    id="categoria"
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    className="input-dixema"
                    required
                    disabled={isLoadingCategories || categorias.length === 0}
                  >
                    <option value="">
                      {isLoadingCategories
                        ? "Cargando categorías..."
                        : "Selecciona una categoría"}
                    </option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.name}
                      </option>
                    ))}
                  </select>
                  {!isLoadingCategories && categorias.length === 0 && (
                    <p role="alert" style={{ color: "#b42318" }}>
                      No hay categorías disponibles. Contacta al administrador.
                    </p>
                  )}
                </div>
                <div className="input-group">
                  <label htmlFor="nombre">
                    <Tag size={16} /> Nombre del Producto
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="input-dixema"
                    required
                  />
                </div>

                <div className="input-row">
                  <div className="input-group flex-1">
                    <label>
                      <DollarSign size={16} /> Menudeo
                    </label>
                    <input
                      type="number"
                      value={precioMenudeo}
                      onChange={(e) => setPrecioMenudeo(e.target.value)}
                      className="input-dixema"
                      required
                    />
                  </div>
                  <div className="input-group flex-1">
                    <label>
                      <DollarSign size={16} /> Mayoreo
                    </label>
                    <input
                      type="number"
                      value={precioMayoreo}
                      onChange={(e) => setPrecioMayoreo(e.target.value)}
                      className="input-dixema"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="cantidadMinimaMayoreo">
                    Cantidad mínima para mayoreo
                  </label>
                  <input
                    type="number"
                    id="cantidadMinimaMayoreo"
                    min="1"
                    value={cantidadMinimaMayoreo}
                    onChange={(e) => setCantidadMinimaMayoreo(e.target.value)}
                    className="input-dixema"
                    required={precioMayoreo !== ""}
                  />
                </div>

                <div className="input-group">
                  <label>Stock Disponible (Unidades)</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="input-dixema"
                    required
                  />
                </div>
              </div>

              <div className="form-section card-dixema">
                <label className="section-title">Variantes</label>
                <div className="input-group">
                  <label>
                    <Scale size={16} /> Medidas / Tallas
                  </label>
                  <input
                    type="text"
                    value={medidas}
                    onChange={(e) => setMedidas(e.target.value)}
                    className="input-dixema"
                    placeholder="S, M, L..."
                  />
                </div>
                <div className="input-group">
                  <label>
                    <Palette size={16} /> Colores
                  </label>
                  <input
                    type="text"
                    value={colores}
                    onChange={(e) => setColores(e.target.value)}
                    className="input-dixema"
                    placeholder="Rojo, Negro..."
                  />
                </div>
                <div className="input-group">
                  <label>
                    <Layers3 size={16} /> Modelos
                  </label>
                  <input
                    type="text"
                    value={modelos}
                    onChange={(e) => setModelos(e.target.value)}
                    className="input-dixema"
                    placeholder="Pro, Max..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          {uploadError && (
            <p role="alert" style={{ color: "#b42318" }}>
              {uploadError}
            </p>
          )}
          {successMessage && (
            <p role="status" style={{ color: "#067647" }}>
              {successMessage}
            </p>
          )}
          <footer className="form-actions-bar">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => router.back()}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary-large"
              disabled={isSaving || isLoadingCategories || categorias.length === 0}
            >
              <PlusCircle size={20} />{" "}
              {isSaving ? "Guardando..." : "Guardar Producto"}
            </button>
          </footer>
        </form>
      </main>
    </div>
  );
}
