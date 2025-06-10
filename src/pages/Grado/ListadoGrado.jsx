import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { gradoService } from "../../api/requestApi";
import Tabla from "../../components/Tabla";
import FormularioGrado from "./FormularioGrado";
import Notificacion from "../../components/Notificacion";
import "../../styles/Botones.css";

export default function ListadoGrado() {
  const [grados, setGrados] = useState([]);
  const [formData, setFormData] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  const [rol] = useState(() => localStorage.getItem("rol"));
  const puedeAdministrar = rol === "administrador";

  const cargarGrados = useCallback(async () => {
    try {
      const data =
        rol === "administrador" ? await gradoService.obtenerTodos : await gradoService.obtener();

      setGrados(data);
    } catch (error) {
      setMensaje({ tipo: "error", texto: error + ": Error al cargar los grados" });
    }
  }, [rol]);

  useEffect(() => {
    cargarGrados();
  }, [cargarGrados]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleEliminar = async (id) => {
    try {
      await gradoService.eliminar(id);
      setMensaje({ tipo: "success", texto: "Grado eliminado correctamente" });
      await cargarGrados();
    } catch (error) {
      setMensaje({ tipo: "error", texto: error + ": Error al eliminar el grado" });
    }
  };

  const handleEditar = (grado) => {
    setFormData(grado);
    setMostrarFormulario(true);
  };

  const handleExito = async (texto) => {
    setMensaje({ tipo: "success", texto });
    setFormData(null);
    setMostrarFormulario(false);
    await cargarGrados();
  };

  const handleCancelar = () => {
    setFormData(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">
        {puedeAdministrar ? "Gestión de Grado" : "Listado de Grado"}
      </h1>


      <button onClick={() => navigate("/")} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />
      <Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
      <br />

      {mostrarFormulario || formData ? (
        <div>
          <FormularioGrado onExito={handleExito} initialData={formData} />
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
            Registrar nuevo Grado
          </button>
        )
      )}
      <br />
      <br />
      <Tabla
        columnas={[
          { key: "nivel", label: "Nivel del Grado" },
          { key: "anio", label: "Año" },
          ...(puedeAdministrar
            ? [
              {
                key: "estado",
                label: "Estado",
                render: (valor) => (valor ? "Activo" : "Inactivo"),
              },
            ]
            : []),
        ]}
        datos={grados}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        idKey="id_grado"
        mostrarAcciones={puedeAdministrar}
      />
    </div>
  );
}