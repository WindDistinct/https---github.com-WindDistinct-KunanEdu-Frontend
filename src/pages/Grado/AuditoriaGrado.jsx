import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gradoService } from "../../api/requestApi";
import Tabla from "../../components/TablaAuditoria";
import "../../styles/Botones.css";

export default function AuditoriaGrado() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();

  const cargarAuditorias = async () => {
    const data = await gradoService.auditar();
    setAuditorias(data);
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Auditoría de Grados</h1>
      <button onClick={() => navigate("/")} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />
      <Tabla
        columnas={[
          { key: "id_audit_grado", label: "ID Auditoría" },
          { key: "id_grado", label: "ID Grado" },
          { key: "nivel_anterior", label: "Nivel Anterior" },
          { key: "nivel_nuevo", label: "Nivel Nuevo" },
          { key: "anio_anterior", label: "Año Anterior" },
          { key: "anio_nuevo", label: "Año Nuevo" },
          { key: "operacion", label: "Operación" },
          { key: "fecha_modificacion", label: "Fecha Modificación" },
          { key: "usuario_modificador", label: "Usuario Modificador" }
        ]}
        datos={auditorias}
        idKey="id_audit_grado"
      />
    </div>
  );
}
