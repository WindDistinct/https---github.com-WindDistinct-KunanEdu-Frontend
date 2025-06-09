import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { alumnoService } from "../../api/requestApi";
import Tabla from "../../components/TablaAuditoria";
import "../../styles/Botones.css";

export default function AuditoriaAlumno() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();

  const cargarAuditorias = async () => {
    const data = await alumnoService.auditar();
    setAuditorias(data);
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Auditoría de Alumnos</h1>
      <button onClick={() => navigate("/")} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />
      <Tabla
        columnas={[
          { key: "id_audit_alumno", label: "ID Auditoría" },
          { key: "id_alumno", label: "ID Alumno" },
          { key: "nombre_anterior", label: "Nombre Anterior" },
          { key: "nombre_nuevo", label: "Nombre Nuevo" },
          { key: "apellido_paterno_anterior", label: "Apellido Paterno Anterior" },
          { key: "apellido_paterno_nuevo", label: "Apellido Paterno Nuevo" },
          { key: "apellido_materno_anterior", label: "Apellido Materno Anterior" },
          { key: "apellido_materno_nuevo", label: "Apellido Materno Nuevo" },
          { key: "dni_anterior", label: "DNI Anterior" },
          { key: "dni_nuevo", label: "DNI Nuevo" },
          { key: "direccion_anterior", label: "Dirección Anterior" },
          { key: "direccion_nuevo", label: "Dirección Nueva" },
          { key: "telefono_anterior", label: "Teléfono Anterior" },
          { key: "telefono_nuevo", label: "Teléfono Nuevo" },
          /*
           { key: "fecha_nacimiento_anterior", label: "Fecha Nacimiento Anterior" },
           { key: "fecha_nacimiento_nuevo", label: "Fecha Nacimiento Nueva" },
          { key: "estado_anterior", label: "Estado Anterior" },
           { key: "estado_nuevo", label: "Estado Nuevo" },*/
          { key: "operacion", label: "Operación" },
          { key: "fecha_modificacion", label: "Fecha Modificación" },
          { key: "usuario_modificador", label: "Usuario Modificador" }
        ]}
        datos={auditorias}
        idKey="id_audit_alumno"
      />
    </div>
  );
}
