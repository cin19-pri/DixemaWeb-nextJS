"use client";
import React from "react";
import Navbar from "@/componentes/Navbar";
import { useRouter } from "next/navigation";
import styles from "./perfilusuario.module.css";

export default function ProfilePage() {
  const router = useRouter();

  const orders = [
    {
      id: 1,
      name: "Sandalias",
      provider: "(proveedor x)",
      status: "En proceso de envío",
      iconColor: "#27ae60",
    },
    {
      id: 2,
      name: "Laptop profesional",
      provider: "(proveedor xx)",
      status: "Transacción completada con éxito",
      iconColor: "#f1c40f",
    },
  ];

  return (
    <>
      <Navbar onSearch={() => {}} />

      <div className={styles.profileContainer}>
        {/* HEADER */}
        <div className={styles.profileBar}>
          <i
            className={`bx bx-chevron-left ${styles.backIcon}`}
            onClick={() => router.back()}
          ></i>

          <i className={`bx bx-cog ${styles.settingsIcon}`}></i>
        </div>

        {/* PERFIL */}
        <div className={styles.profileSection}>
          <div className={styles.profileAvatar}>
            <img src="/img/avatar.png.png" alt="avatar" />
          </div>

          <h2 className={styles.profileName}>Pedrito Buena Onda</h2>

          {/* ICONOS */}
          <div className={styles.profileActions}>
            <div className={styles.actionItem}>
              <i className="bx bx-time"></i>
              <p>Historial</p>
            </div>

            <div className={styles.actionItem}>
              <i className="bx bx-heart"></i>
              <p>Favoritos</p>
            </div>

            <div className={styles.actionItem}>
              <i className="bx bx-bell"></i>
              <p>Notificaciones</p>
            </div>

            <div className={styles.actionItem}>
              <i className="bx bx-user"></i>
              <p>Perfil</p>
            </div>
          </div>
        </div>

        {/* PEDIDOS */}
        <div className={styles.ordersCard}>
          <h3 className={styles.cardTitle}>Mis pedidos</h3>
          <hr className={styles.divider} />

          {orders.map((order) => (
            <div key={order.id} className={styles.orderItem}>
              <span style={{ color: order.iconColor }}>★</span>

              <div className={styles.orderInfo}>
                <h4>{order.name}</h4>
                <p className={styles.provider}>{order.provider}</p>
                <p className={styles.status}>{order.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
