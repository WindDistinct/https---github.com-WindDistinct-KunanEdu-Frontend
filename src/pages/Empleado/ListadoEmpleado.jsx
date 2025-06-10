import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { empleadoService } from "../../api/requestApi";
import Tabla from "../../components/Tabla";
import FormularioEmpleado from "./FormularioEmpleado";
import Notificacion from "../../components/Notificacion";
import "../../styles/Botones.css";

export default function ListadoEmpleado() {
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  const [rol] = useState(() => localStorage.getItem("rol"));
  const puedeAdministrar = rol === "administrador";

  const cargarEmpleados = useCallback(async () => {
    try {
      const data =
        rol === "administrador" ? await empleadoService.obtenerTodos() : await empleadoService.obtener();

      const empleadosFormateados = data
        .map((empleado) => ({
          ...empleado,
          fec_nac: empleado.fec_nac ? empleado.fec_nac.split("T")[0] : "",
        }))
        .sort((a, b) => a.id_emp - b.id_emp);
      setEmpleados(empleadosFormateados);
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al cargar los empleados" });
    }
  }, [rol]);

  useEffect(() => {
    cargarEmpleados();
  }, [cargarEmpleados]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleEliminar = async (id) => {
    try {
      await empleadoService.eliminar(id);
      setMensaje({ tipo: "success", texto: "Empleado eliminado correctamente" });
      await cargarEmpleados();
    } catch (error) {
      setMensaje({ tipo: "error", texto: error + ": Error al eliminar el empleado" });
    }
  };

  const handleEditar = (empleado) => {
    setFormData(empleado);
    setMostrarFormulario(true);
  };

  const handleExito = async (texto) => {
    setMensaje({ tipo: "success", texto });
    setFormData(null);
    setMostrarFormulario(false);
    await cargarEmpleados();
  };

  const handleCancelar = () => {
    setFormData(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">
        {puedeAdministrar ? "Gestión de Empleado" : "Listado de Empleado"}
      </h1>

      <button onClick={() => navigate("/")} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />
      <Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
      <br />
      {mostrarFormulario || formData ? (
        <div>
          <FormularioEmpleado onExito={handleExito} initialData={formData} />
          <div className="d-flex mt-2">
            <button
              onClick={handleCancelar}
              type="button"
              className="btn btn-danger me-2"
            >
              Cancelar Registro
            </button>
          </div>
        </div>
      ) : (
        puedeAdministrar && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="btn btn-primary mb-3"
          >
            Registrar nuevo Empleado
          </button>
        )
      )}
      <br />
      <Tabla
        columnas={[
          { key: "nombre_emp", label: "Nombre" },
          { key: "ape_pat_emp", label: "Apellido Paterno" },
          { key: "ape_mat_emp", label: "Apellido Materno" },
          { key: "fec_nac", label: "Fecha de Nacimiento" },
          { key: "dni", label: "DNI" },
          { key: "telefono", label: "Teléfono" },
          { key: "especialidad", label: "Especialidad" },
          { key: "cargo", label: "Cargo" },
          { key: "observacion", label: "Observación" },

          ...(puedeAdministrar ? [{ key: "estado", label: "Estado" }] : []),
        ]}
        datos={empleados}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        idKey="id_emp"
        mostrarAcciones={puedeAdministrar}
      />
    </div>
  );
}