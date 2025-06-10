import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cursoService } from "../../api/requestApi";
import Tabla from "../../components/TablaAuditoria";
import "../../styles/Botones.css";

export default function AuditoriaCurso() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();

  const cargarAuditorias = async () => {
    const data = await cursoService.auditar();
    setAuditorias(data);
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Auditoría de Curso</h1>
      <button onClick={() => navigate("/")} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />
      <Tabla
        columnas={[
          { key: "id_audit_curso", label: "ID Auditoría" },
          { key: "id_curso", label: "ID Aula" },
          { key: "nombre_curso_anterior", label: "Curso Anterior" },
          { key: "nombre_curso_nuevo", label: "Curso Nuevo" },
          { key: "operacion", label: "Operación" },
          { key: "fecha_modificacion", label: "Fecha Modificación" },
          { key: "usuario_modificador", label: "Usuario Modificador" },
        ]}
        datos={auditorias}
        idKey="id_audit_curso"
      />
    </div>
  );
}
