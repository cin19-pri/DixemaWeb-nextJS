/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlusCircle, 
  UploadCloud, 
  Tag, 
  Scale, 
  Palette, 
  Layers3, 
  NotebookText, 
  DollarSign 
} from 'lucide-react';

import './nuevo_producto.css'; 

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
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precioMenudeo, setPrecioMenudeo] = useState('');
  const [precioMayoreo, setPrecioMayoreo] = useState('');
  const [stock, setStock] = useState('');
  const [medidas, setMedidas] = useState(''); 
  const [colores, setColores] = useState(''); 
  const [modelos, setModelos] = useState(''); 

  // --- 3. MANEJO DE IMAGEN ---
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- 4. FUNCIÓN PARA GUARDAR Y REDIRIGIR ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Creamos el objeto con el formato que necesitan tus otras pantallas
    const nuevoProducto = {
      id: Date.now(), 
      nombre,
      descripcion,
      precio: precioMenudeo, // Lo guardamos como 'precio' para compatibilidad
      precioMayoreo,
      unidades: stock,       // Lo guardamos como 'unidades' para el Dashboard
      medidas,
      colores,
      modelos,
      imagen: imagePreview || '/images/lap.jpg', 
      estatus: parseInt(stock) > 0 ? 'Disponible' : 'Agotado'
    };

    // Obtenemos lo existente, agregamos el nuevo y guardamos
    const productosExistentes = JSON.parse(localStorage.getItem('productos_dixema') || '[]');
    const nuevaLista = [...productosExistentes, nuevoProducto];
    localStorage.setItem('productos_dixema', JSON.stringify(nuevaLista));

    // Redirección inmediata a Gestión
    router.push('/gestion_producto');
  };

  return (
    <div className="añadir-producto-wrapper">
      <main className="main-content-fluid">
        
        {/* Header Dinámico */}
        <header className={`content-header-minimal ${isScrolled ? 'fade-out' : ''}`}>
          <div className="welcome-msg">
            <h1>Crear <span className="highlight-text">Nuevo Producto</span></h1>
            <p>Rellena los campos para añadir un artículo al catálogo de Dixema.</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="form-añadir-producto">
          <div className="form-grid">
            
            {/* COLUMNA IZQUIERDA: Imagen y Descripción */}
            <div className="form-column">
              <div className="form-section card-dixema">
                <label className="section-title">Imagen del Producto</label>
                <div className={`image-upload-zone ${imagePreview ? 'has-image' : ''}`}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="upload-preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <UploadCloud size={48} color="#8E8E93" />
                      <p>Arrastra o haz clic para subir</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="file-input-hidden" 
                    id="productImage" 
                  />
                  <label htmlFor="productImage" className="btn-upload-trigger">Seleccionar Archivo</label>
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
                  <label htmlFor="nombre"><Tag size={16} /> Nombre del Producto</label>
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
                    <label><DollarSign size={16} /> Menudeo</label>
                    <input 
                      type="number" 
                      value={precioMenudeo} 
                      onChange={(e) => setPrecioMenudeo(e.target.value)} 
                      className="input-dixema" 
                      required 
                    />
                  </div>
                  <div className="input-group flex-1">
                    <label><DollarSign size={16} /> Mayoreo</label>
                    <input 
                      type="number" 
                      value={precioMayoreo} 
                      onChange={(e) => setPrecioMayoreo(e.target.value)} 
                      className="input-dixema" 
                      required 
                    />
                  </div>
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
                  <label><Scale size={16} /> Medidas / Tallas</label>
                  <input type="text" value={medidas} onChange={(e) => setMedidas(e.target.value)} className="input-dixema" placeholder="S, M, L..." />
                </div>
                <div className="input-group">
                  <label><Palette size={16} /> Colores</label>
                  <input type="text" value={colores} onChange={(e) => setColores(e.target.value)} className="input-dixema" placeholder="Rojo, Negro..." />
                </div>
                <div className="input-group">
                  <label><Layers3 size={16} /> Modelos</label>
                  <input type="text" value={modelos} onChange={(e) => setModelos(e.target.value)} className="input-dixema" placeholder="Pro, Max..." />
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <footer className="form-actions-bar">
            <button type="button" className="btn-secondary" onClick={() => router.back()}>Cancelar</button>
            <button type="submit" className="btn-primary-large">
              <PlusCircle size={20} /> Guardar Producto
            </button>
          </footer>
        </form>
      </main>
    </div>
  );
}