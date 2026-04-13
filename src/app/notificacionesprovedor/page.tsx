"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./notificaciones.module.css";

export default function Notificaciones() {
  const router = useRouter();

  const notifications = [
    {
      id: 1,
      title: "Nuevo Mensaje",
      text: "Tu carga ha salido del CEDIS. Chofer: Juan R. Placas: ABC-123.",
      date: "Hoy",
      icon: "bx-envelope",
      color: "pink",
    },
    {
      id: 2,
      title: "Confirmación de Entrega",
      text: "Se ha registrado la recepción de 50 cajas en tu sucursal Norte.",
      date: "Ayer",
      icon: "bx-cart",
      color: "lila",
    },
    {
      id: 3,
      title: "Confirmación de Pago Pendiente",
      text: "Tu transferencia bancaria por la orden #1234 está siendo validada.",
      date: "20-10-25",
      icon: "bx-star",
      color: "dark",
    },
  ];

  return (
    <>
      <div className={styles.notificationscontainer}>
        {/* HEADER */}
        <div className={styles.notificationsheader}>
          <div className={styles.titleleft}>
            <i
              className="bx bx-chevron-left back-icon"
              onClick={() => router.back()}
            ></i>
            <h1>Notificaciones</h1>
          </div>
        </div>

        {/* SUBTITULO */}
        <div className={styles.notificationssubtitle}>
          <h4>¿Qué está pasando?</h4>
          <p>Aquí encontrarás todas las nuevas interacciones de tus pedidos</p>
        </div>

        {/* LISTA DE NOTIFICACIONES */}

        {notifications.map((n) => (
          <div key={n.id} className={styles.notificationcard}>
            <div className={`icon-circle ${n.color}`}>
              <i className={`bx ${n.icon}`}></i>
            </div>

            <div className={styles.notificationcontent}>
              <h3>{n.title}</h3>
              <p>{n.text}</p>
            </div>

            <span className={styles.date}>{n.date}</span>
          </div>
        ))}
      </div>
    </>
  );
}
