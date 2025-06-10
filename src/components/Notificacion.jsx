import React from "react";
import "../styles/Notificacion.css";

export default function Notificacion({ mensaje, tipo }) {
  if (!mensaje) return null;

  return (
    <div
      className={`alert ${tipo === "success" ? "alert-success" : "alert-danger"} mt-3 mb-3`}
      role="alert"
    >
      {mensaje}
    </div>
  );
}