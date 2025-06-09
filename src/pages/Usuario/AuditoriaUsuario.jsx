import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usuarioService } from "../../api/requestApi"
import Tabla from "../../components/TablaAuditoria";
import "../../styles/Botones.css";

export default function AuditoriaUsuario() {
  const [auditorias, setAuditorias] = useState([]);
  const navigate = useNavigate();

  const cargarAuditorias = async () => {
    const data = await usuarioService.auditar();
    setAuditorias(data);
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Auditoría de Usuarios</h1>
      <button onClick={() => navigate("/")} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />
      <Tabla
        columnas={[
          { key: "id_audit_usuario", label: "ID Auditoría" },
          { key: "id_usuario", label: "ID Usuario" },
          { key: "username_anterior", label: "Username Anterior" },
          { key: "username_nuevo", label: "Username Nuevo" },
          /*{ key: "password_anterior", label: "Password Anterior" },
          { key: "password_nuevo", label: "Password Nuevo" },*/
          { key: "rol_anterior", label: "Rol Anterior" },
          { key: "rol_nuevo", label: "Rol Nuevo" },
          /*{ key: "estado_anterior", label: "Estado Anterior" },
          { key: "estado_nuevo", label: "Estado Nuevo" },*/
          { key: "operacion", label: "Operación" },
          { key: "fecha_modificacion", label: "Fecha Modificación" },
          { key: "usuario_modificador", label: "Usuario Modificador" }
        ]}
        datos={auditorias}
        idKey="id_audit_usuario"
      />
    </div>
  );
}
