import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { empleadoService } from "../../api/requestApi";
import Tabla from "../../components/TablaAuditoria";
import "../../styles/Botones.css";

export default function AuditoriaEmpleado() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();

  const cargarAuditorias = async () => {
    const data = await empleadoService.auditar();
    setAuditorias(data);
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Auditoría de Empleados</h1>
      <button onClick={() => navigate("/")} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />
      <Tabla
        columnas={[
          { key: "id_audit_emp", label: "ID Auditoría" },
          { key: "id_emp", label: "ID Empleado" },
          { key: "nombre_emp_anterior", label: "Nombre Anterior" },
          { key: "nombre_emp_nuevo", label: "Nombre Nuevo" },
          { key: "ape_pat_emp_anterior", label: "Apellido Paterno Anterior" },
          { key: "ape_pat_emp_nuevo", label: "Apellido Paterno Nuevo" },
          { key: "ape_mat_emp_anterior", label: "Apellido Materno Anterior" },
          { key: "ape_mat_emp_nuevo", label: "Apellido Materno Nuevo" },
          { key: "fec_nac_anterior", label: "Fecha Nacimiento Anterior" },
          { key: "fec_nac_nuevo", label: "Fecha Nacimiento Nueva" },
          { key: "especialidad_anterior", label: "Especialidad Anterior" },
          { key: "especialidad_nuevo", label: "Especialidad Nueva" },
          { key: "dni_anterior", label: "DNI Anterior" },
          { key: "dni_nuevo", label: "DNI Nuevo" },
          { key: "telefono_anterior", label: "Teléfono Anterior" },
          { key: "telefono_nuevo", label: "Teléfono Nuevo" },
          { key: "observacion_anterior", label: "Observación Anterior" },
          { key: "observacion_nuevo", label: "Observación Nueva" },
          { key: "cargo_anterior", label: "Cargo Anterior" },
          { key: "cargo_nuevo", label: "Cargo Nuevo" },
          { key: "usuario_anterior", label: "Usuario Anterior" },
          { key: "usuario_nuevo", label: "Usuario Nuevo" },
          /*{ key: "estado_anterior", label: "Estado Anterior" },
          { key: "estado_nuevo", label: "Estado Nuevo" },*/
          { key: "operacion", label: "Operación" },
          { key: "fecha_modificacion", label: "Fecha Modificación" },
          { key: "usuario_modificador", label: "Usuario Modificador" }
        ]}
        datos={auditorias}
        idKey="id_audit_emp"
      />
    </div>
  );
}
