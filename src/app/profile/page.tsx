import Image from "next/image";
import "./profile.css";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <main>
      <div className="profile-container">
        {/* Header */}
        <header className="profile-header">
          <Link href="/perfilusuario" className="back-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              viewBox="0 0 576 512"
            >
              <path
                fill="#737aa8"
                d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 544 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-434.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"
              />
            </svg>
          </Link>

          <div className="profile-avatar">
            <Image
              src="/img/user-profile.png"
              alt="Avatar"
              width={150}
              height={150}
            />
          </div>

          <div className="logo-small">
            <Image
              src="/images/logo-dixema.png"
              alt="LOGO"
              width={120}
              height={110}
            />
          </div>
        </header>

        {/* Name */}
        <h2 className="company-name">Nombre de la empresa</h2>

        {/* Cuenta */}
        <section className="profile-section">
          <h3>Cuenta</h3>

          <div className="card">
            {/* Item 1 */}
            <div className="item">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="#737aa8"
                    d="M144 128a80 80 0 1 1 160 0 80 80 0 1 1 -160 0zm208 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0zM48 480c0-70.7 57.3-128 128-128l96 0c70.7 0 128 57.3 128 128l0 8c0 13.3 10.7 24 24 24s24-10.7 24-24l0-8c0-97.2-78.8-176-176-176l-96 0C78.8 304 0 382.8 0 480l0 8c0 13.3 10.7 24 24 24s24-10.7 24-24l0-8z"
                  />
                </svg>
                <span className="text">Información general</span>
              </div>
              <div>
                <Link href="" className="link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#737aa8"
                      d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            {/* Item 2 */}
            <div className="item">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  viewBox="0 0 384 512"
                >
                  <path
                    fill="#737aa8"
                    d="M128 96l0 64 128 0 0-64c0-35.3-28.7-64-64-64s-64 28.7-64 64zM64 160l0-64C64 25.3 121.3-32 192-32S320 25.3 320 96l0 64c35.3 0 64 28.7 64 64l0 224c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 224c0-35.3 28.7-64 64-64z"
                  />
                </svg>
                <span className="text">Cambiar contraseña</span>
              </div>
              <div>
                <Link href="../olvide_contrasena" className="link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#737aa8"
                      d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Configuración */}
        <section className="profile-section">
          <h3>Configuración</h3>

          <div className="card">
            <div className="item">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  viewBox="0 0 384 512"
                >
                  <path
                    fill="#737aa8"
                    d="M64 48l112 0 0 88c0 39.8 32.2 72 72 72l88 0 0 240c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16zM224 67.9l92.1 92.1-68.1 0c-13.3 0-24-10.7-24-24l0-68.1zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-261.5c0-17-6.7-33.3-18.7-45.3L242.7 18.7C230.7 6.7 214.5 0 197.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"
                  />
                </svg>
                <span className="text">Política de privacidad</span>
              </div>
              <div>
                <Link href="" className="link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#737aa8"
                      d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="item">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  viewBox="0 0 576 512"
                >
                  <path
                    fill="#737aa8"
                    d="M160 0c17.7 0 32 14.3 32 32l0 32 128 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-9.6 0-8.4 23.1c-16.4 45.2-41.1 86.5-72.2 122 14.2 8.8 29 16.6 44.4 23.5l50.4 22.4 62.2-140c5.1-11.6 16.6-19 29.2-19s24.1 7.4 29.2 19l128 288c7.2 16.2-.1 35.1-16.2 42.2s-35.1-.1-42.2-16.2l-20-45-157.5 0-20 45c-7.2 16.2-26.1 23.4-42.2 16.2s-23.4-26.1-16.2-42.2l39.8-89.5-50.4-22.4c-23-10.2-45-22.4-65.8-36.4-21.3 17.2-44.6 32.2-69.5 44.7L78.3 380.6c-15.8 7.9-35 1.5-42.9-14.3s-1.5-35 14.3-42.9l34.5-17.3c16.3-8.2 31.8-17.7 46.4-28.3-13.8-12.7-26.8-26.4-38.9-40.9L81.6 224.7c-11.3-13.6-9.5-33.8 4.1-45.1s33.8-9.5 45.1 4.1l10.2 12.2c11.5 13.9 24.1 26.8 37.4 38.7 27.5-30.4 49.2-66.1 63.5-105.4l.5-1.2-210.3 0C14.3 128 0 113.7 0 96S14.3 64 32 64l96 0 0-32c0-17.7 14.3-32 32-32zM416 270.8L365.7 384 466.3 384 416 270.8z"
                  />
                </svg>
                <span className="text">Idioma</span>
              </div>
              <div>
                <Link href="" className="link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#737aa8"
                      d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="item">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#737aa8"
                    d="M464 256a208 208 0 1 0 -416 0 208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm256-80c-17.7 0-32 14.3-32 32 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-44.2 35.8-80 80-80s80 35.8 80 80c0 47.2-36 67.2-56 74.5l0 3.8c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-8.1c0-20.5 14.8-35.2 30.1-40.2 6.4-2.1 13.2-5.5 18.2-10.3 4.3-4.2 7.7-10 7.7-19.6 0-17.7-14.3-32-32-32zM224 368a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
                  />
                </svg>
                <span className="text">Ayuda & Soporte</span>
              </div>
              <div>
                <Link href="" className="link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#737aa8"
                      d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="item">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#737aa8"
                    d="M160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0zM502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"
                  />
                </svg>
                <span className="text">Cerrar sesión</span>
              </div>
              <div>
                <Link href="../../" className="link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#737aa8"
                      d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
