import React, { useState } from "react";
import "../styles/Tablas.css";

export default function TablaAuditoria({
  columnas,
  datos,
  idKey = "id",
  filasPorPagina = 7,
}) {

  const [paginaActual, setPaginaActual] = useState(1);

  const totalPaginas = Math.ceil(datos.length / filasPorPagina);

  const datosPaginados = datos.slice(
    (paginaActual - 1) * filasPorPagina,
    paginaActual * filasPorPagina
  );
  const camposFechaConHora = ["fecha_modificacion"];
  const camposSoloFecha = ["fec_nac_anterior", "fec_nac_nuevo"];

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    setPaginaActual(nuevaPagina);
  };

  const formatearCampo = (key, valor) => {
    if (!valor) return "";

    if (camposFechaConHora.includes(key)) {
      return new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(valor));
    }

    if (camposSoloFecha.includes(key)) {
      return new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(valor));
    }

    return valor;
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover table-sm tabla-auditoria">
          <thead className="table-warning">
            <tr>
              {columnas.map(({ key, label }) => (
                <th key={key} className="encabezado-columna">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {datosPaginados.map((item) => (
              <tr key={item[idKey]}>
                {columnas.map(({ key }) => (
                  <td key={key}>
                    {formatearCampo(key, item[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => cambiarPagina(paginaActual - 1)}>
              Anterior
            </button>
          </li>
          {[...Array(totalPaginas)].map((_, i) => (
            <li
              key={i + 1}
              className={`page-item ${paginaActual === i + 1 ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => cambiarPagina(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => cambiarPagina(paginaActual + 1)}>
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
