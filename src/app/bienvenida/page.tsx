import Link from "next/link"
import Image from "next/image"
import "./bienvenida.css"

export default function BienvenidaPage() {
  return (
      <main className="background-dots">
        <Link href="../" className="btn-back" >
          <svg  xmlns="http://www.w3.org/2000/svg" width="30" height="30"  
          fill="currentColor" viewBox="0 0 24 24" >
          <path d="m6 12 6 5v-4h6v-2h-6V7z"></path>
          </svg>
        </Link>
        <section className="container">
          <h1 className="title">
            ¡Por favor elige la <span>opción</span> con la que
            <br />
            quieres <span>unirte</span> a nuestra familia!
          </h1>

          <section className="cards">
            {/* Tarjeta Proveedor: Redirige a la carpeta de login para proveedores */}
            <Link href="/login_proveedor" className="card provider">
              <Image
                src="/images/proveedor-card-img.png"
                alt="Proveedor"
                width={200}
                height={200}
                className="img-provider"
              />
              <h2>Proveedor</h2>
              <p>
                Ofrezco productos y busco nuevos clientes (Venta al mayoreo).
              </p>
            </Link>

            {/* Tarjeta Comprador: Redirige a la carpeta de login para usuarios */}
            <Link href="/login_usuario" className="card buyer">
              <Image
                src="/images/user-card-img.png"
                alt="Comprador"
                width={200}
                height={200}
              />
              <h2>Comprador</h2>
              <p>
                Busco proveedores y proyectos al mayoreo (Compra grande).
              </p>
            </Link>
          </section>
        </section>
      </main>
    
  )
}