import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { aulaService } from "../../api/requestApi"
import Tabla from "../../components/TablaAuditoria";
import "../../styles/Botones.css";

export default function AuditoriaAula() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();

  const cargarAuditorias = async () => {
    const data = await aulaService.auditar();
    setAuditorias(data);
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Auditoría de Aulas</h1>
      <button onClick={() => navigate("/")} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />
      <Tabla
        columnas={[
          { key: "id_audit_aula", label: "ID Auditoría" },
          { key: "id_aula", label: "ID Aula" },
          { key: "numero_aula_anterior", label: "N° Aula Anterior" },
          { key: "numero_aula_nuevo", label: "N° Aula Nuevo" },
          { key: "aforo_anterior", label: "Aforo Anterior" },
          { key: "aforo_nuevo", label: "Aforo Nuevo" },
          { key: "ubicacion_anterior", label: "Ubicación Anterior" },
          { key: "ubicacion_nuevo", label: "Ubicación Nuevo" },
          { key: "operacion", label: "Operación" },
          { key: "fecha_modificacion", label: "Fecha Modificación" },
          { key: "usuario_modificador", label: "Usuario Modificador" },
        ]}
        datos={auditorias}
        idKey="id_audit_aula"
      />
    </div>
  );
}
