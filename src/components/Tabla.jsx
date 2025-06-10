import React, { useState } from "react";

export default function Tabla({
  columnas,
  datos,
  onEditar,
  onEliminar,
  idKey = "id",
  mostrarAcciones = true,
  filasPorPagina = 5,
}) {
  const [paginaActual, setPaginaActual] = useState(1);

  const totalPaginas = Math.ceil(datos.length / filasPorPagina);

  const datosPaginados = datos.slice(
    (paginaActual - 1) * filasPorPagina,
    paginaActual * filasPorPagina
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    setPaginaActual(nuevaPagina);
  };

  const renderValor = (key, valor) => {
    if (key === "estado") {
      return valor === true ? "Activo" : "Inactivo";
    }

    if (typeof valor === "string" && (key.includes("fec") || key.includes("fecha"))) {
      const [año, mes, dia] = valor.split("-");
      return `${dia}/${mes}/${año}`;
    }
    return valor;
  };


  return (
    <>
      <table className="table table-bordered table-striped table-hover table-sm">
        <thead className="table-warning">
          <tr>
            {columnas.map(({ key, label }) => (
              <th key={key}>{label}</th>
            ))}
            {mostrarAcciones && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {datosPaginados.map((item) => (
            <tr key={item[idKey]}>
              {columnas.map(({ key }) => (
                <td key={key}>
                  {renderValor(key, item[key])}
                </td>
              ))}
              {mostrarAcciones && (
                <td>
                  <button onClick={() => onEditar(item)} className="btn btn-sm btn-warning me-1">
                    Editar
                  </button>
                  <button onClick={() => onEliminar(item[idKey])} className="btn btn-sm btn-danger">
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

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