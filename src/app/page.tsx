"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <header>
        <nav className="navbar">
          <Link href="#" className="nav-logo">
            <Image
              src="/images/logo-dixema.png"
              alt="logo"
              className="nav-image"
              width={100}
              height={100}
            />
            <h2 className="logo-text">DIXEMA</h2>
          </Link>

          <ul className="nav-menu">
            <li className="nav-item">
              <a href="#" className="nav-link">
                Inicio
              </a>
            </li>
            <li className="nav-item">
              <a href="#about" className="nav-link">
                ¿Quiénes somos?
              </a>
            </li>
            <li className="nav-item">
              <a href="#skills" className="nav-link">
                Filosofía
              </a>
            </li>
            <li className="nav-item">
              <a href="#testimonials" className="nav-link">
                Testimonios
              </a>
            </li>
            <li className="nav-item">
              <a href="#gallery" className="nav-link">
                Galería
              </a>
            </li>
            <li className="nav-item">
              <a href="#contact" className="nav-link">
                Contáctanos
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section className="hero-section">
          <div className="section-content">
            <div className="hero-details">
              <h1 className="subtitle">
                La red que une a tu <span className="max">empresa</span> con{" "}
                <span className="max">proveedores</span> de confianza.
              </h1>

              <p className="description">
                Elige lo que quieres comprar y recíbelo en tu negocio.
              </p>

              <div className="buttons">
                <Link href="/bienvenida" className="button order-now">
                  Crear Cuenta
                </Link>

                <a href="#contact" className="button contact-us">
                  Instalar App
                </a>
              </div>
            </div>

            <div className="hero-image-wrapper">
              <Image
                src="/images/hero-girl.png"
                alt="imagen"
                width={900}
                height={500}
                className="hero-image"
              />
            </div>
          </div>
        </section>
        {/* ---QUIÉNES SOMOS--- */}
        <section className="about-section" id="about">
          <div className="section-content">
            <div className="about-image-wrapper">
              <Image
                src="/images/about-image.jpg"
                alt="About"
                width={200}
                height={200}
                className="about-image"
              />
            </div>

            <div className="about-details">
              <h2 className="section-title">¿Quiénes somos?</h2>

              <p className="text">
                Somos una plataforma diseñada para tender un puente sólido entre
                vendedores y proveedores medianos en todo el país. Entendemos
                los desafíos únicos de tu negocio, desde encontrar socios
                comerciales confiables hasta optimizar la logística, es por eso
                que nace Dixema, una tienda en línea diseñada específicamente
                para la compra/venta de mayoreo. Selecciona, ordena y recibe sin
                salir de tu negocio.
              </p>

              <div className="social-link-list">
                <a href="#" className="social-link">
                  <i className="fa-brands fa-facebook"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fa-brands fa-x-twitter"></i>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* --- FILOSOFÍA DIXEMA --- */}
        <section className="container py-5" id="skills">
          <div className="row d-flex justify-content-between mx-0">
            <h2 className="section-title">Filosofía</h2>

            {/* MISIÓN */}
            <div
              className="card mt-5 d-flex flex-column align-items-center text-center bg-white p-4"
              style={{ width: "25rem" }}
            >
              <i className="text-white bg-warning d-flex align-items-center justify-content-center fs-2 rounded-circle fa-solid fa-flag"></i>

              <h3 className="mt-4 h4">Misión</h3>

              <p className="text-center">
                <br />
                Transformar el comercio mayorista en México ofreciendo una
                experiencia digital segura, rápida y confiable que conecte a
                vendedores y compradores, facilitando negocios de gran volumen y
                generando oportunidades de crecimiento para todos.
              </p>
            </div>

            {/* VISIÓN */}
            <div
              className="card mt-5 d-flex flex-column align-items-center text-center bg-white p-4"
              style={{ width: "25rem" }}
            >
              <i className="text-white bg-warning d-flex align-items-center justify-content-center fs-2 rounded-circle fa-solid fa-lightbulb"></i>

              <h3 className="mt-4 h4">Visión</h3>

              <p className="text-center">
                <br />
                Liderar la evolución del comercio mayorista en México mediante
                un ecosistema digital B2B, donde cada empresa pueda acceder
                fácilmente a oportunidades mayoristas a través de una plataforma
                digital segura, transparente y preparada para transformar el
                comercio del futuro.
              </p>
            </div>

            {/* VALORES */}
            <div
              className="card mt-5 d-flex flex-column align-items-center text-center bg-white p-4"
              style={{ width: "25rem" }}
            >
              <i className="text-white bg-warning d-flex align-items-center justify-content-center fs-2 rounded-circle fa-solid fa-heart"></i>

              <h3 className="mt-4 h4">Valores</h3>

              <ul className="text-center">
                <li style={{ padding: "10px", marginRight: "31px" }}>
                  Confianza
                </li>
                <li style={{ padding: "10px", marginRight: "33px" }}>
                  Eficiencia
                </li>
                <li style={{ padding: "10px" }}>Transparencia</li>
                <li style={{ padding: "10px", marginRight: "28px" }}>
                  Seguridad
                </li>
                <li style={{ padding: "10px", marginRight: "22px" }}>
                  Innovación
                </li>
              </ul>
            </div>
          </div>
        </section>
        {/* TESTIMONIOS */}
        <section className="testimonials-section" id="testimonials">
          <h2 className="section-title">Testimonios</h2>

          <Swiper
            modules={[Pagination, Navigation]}
            loop={true}
            grabCursor={true}
            spaceBetween={25}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            <SwiperSlide>
              <div className="testimonial">
                <Image
                  src="/images/user-1.jpg"
                  className="user-image"
                  alt="user-image"
                  width={100}
                  height={100}
                />
                <h3 className="name">Sara Martínez</h3>
                <i className="feedback">
                  “Ahora compro al mayoreo tan fácil como comprar en línea.”
                </i>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="testimonial">
                <Image
                  src="/images/user-2.jpg"
                  className="user-image"
                  alt="user-image"
                  width={100}
                  height={100}
                />
                <h3 className="name">Juan Galván</h3>
                <i className="feedback">
                  “Ahorro tiempo y recibo pedidos directo en mi negocio.”
                </i>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="testimonial">
                <Image
                  src="/images/user-3.jpg"
                  className="user-image"
                  alt="user-image"
                  width={100}
                  height={100}
                />
                <h3 className="name">Manuel Robledo</h3>
                <i className="feedback">
                  “Encontré proveedores confiables sin llamadas ni catálogos.”
                </i>
              </div>
            </SwiperSlide>
          </Swiper>
        </section>

        <section className="gallery-section" id="gallery">
          <h2 className="section-title">Galería</h2>
          <div className="section-content">
            <ul className="gallery-list">
              <li className="gallery-item">
                <Image
                  src="/images/gallery-1.jpg"
                  alt="Gallery Image"
                  className="gallery-image"
                  width={200}
                  height={200}
                />
              </li>
              <li className="gallery-item">
                <Image
                  src="/images/gallery-2.jpg"
                  alt="Gallery Image"
                  className="gallery-image"
                  width={200}
                  height={200}
                />
              </li>
              <li className="gallery-item">
                <Image
                  src="/images/gallery-3.jpg"
                  alt="Gallery Image"
                  className="gallery-image"
                  width={200}
                  height={200}
                />
              </li>
              <li className="gallery-item">
                <Image
                  src="/images/gallery-4.jpg"
                  alt="Gallery Image"
                  className="gallery-image"
                  width={200}
                  height={200}
                />
              </li>
              <li className="gallery-item">
                <Image
                  src="/images/gallery-5.jpg"
                  alt="Gallery Image"
                  className="gallery-image"
                  width={200}
                  height={200}
                />
              </li>
              <li className="gallery-item">
                <Image
                  src="/images/gallery-6.jpg"
                  alt="Gallery Image"
                  className="gallery-image"
                  width={200}
                  height={200}
                />
              </li>
            </ul>
          </div>
        </section>
        {/*-- Contact section --*/}
        <section className="contact-section" id="contact">
          <h2 className="section-title">Contáctanos</h2>
          <div className="section-content">
            <ul className="contact-info-list">
              <li className="contact-info">
                <p>
                  Si tienes dudas o quieres unirte a nuestro equipo, contáctanos
                  por los siguientes medios.
                </p>
              </li>
              <li className="contact-info">
                <i className="fa-solid fa-location-crosshairs"></i>
                <p>Avenida Universidad Tecnológica 200, Salamanca, GTO</p>
              </li>
              <li className="contact-info">
                <i className="fa-regular fa-envelope"></i>
                <p>info@dixema.com</p>
              </li>
              <li className="contact-info">
                <i className="fa-solid fa-phone"></i>
                <p>(123) 456-78909</p>
              </li>
              <li className="contact-info">
                <i className="fa-solid fa-phone"></i>
                <p>(123) 456-78909</p>
              </li>
              <li className="contact-info">
                <i className="fa-solid fa-globe"></i>
                <p>www.dixema.com</p>
              </li>
            </ul>
            <form action="#" className="contact-form">
              <input
                type="text"
                placeholder="Nombre"
                className="form-input"
                required
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                className="form-input"
                required
              />
              <textarea
                placeholder="Mensaje"
                className="form-input"
                required
              ></textarea>
              <button type="submit" className="button submit-button">
                Enviar
              </button>
            </form>
          </div>
        </section>
        {/*-- Footer section */}
        <footer className="footer-section">
          <div className="section-content">
            <p className="copyright-text">© 2026 Dixema</p>
            <div className="social-link-list">
              <a href="#" className="social-link">
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
            </div>
            <p className="policy-text">
              <a href="#" className="policy-link">
                Política de privacidad
              </a>
              <span className="separator">•</span>
              <a href="#" className="policy-link"></a>
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
