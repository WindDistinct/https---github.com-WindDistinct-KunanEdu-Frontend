import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { periodoService, seccionService } from "../../api/requestApi"
import Tabla from "../../components/Tabla";
import FormularioPeriodo from "./FormularioPeriodo";
import Notificacion from "../../components/Notificacion";
import "../../styles/Botones.css";

export default function ListadoPeriodo() {
  const [periodos, setPeriodos] = useState([]);
  const [formData, setFormData] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  const [rol] = useState(() => localStorage.getItem("rol"));
  const puedeAdministrar = rol === "administrador";

  const cargarPeriodos = useCallback(async () => {
    try {
      const data =
        rol === "administrador" ? await periodoService.obtenerTodos() : await seccionService.obtener();
      const ordenados = data.sort((a, b) => a.anio - b.anio);
      setPeriodos(ordenados);
    } catch (error) {
      setMensaje({ tipo: "error", texto: error + ": Error al cargar los periodos" });
    }
  }, [rol]);

  useEffect(() => {
    cargarPeriodos();
  }, [cargarPeriodos]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleEliminar = async (id) => {
    try {
      await seccionService.eliminar(id);
      setMensaje({ tipo: "success", texto: "Periodo eliminado correctamente" });
      await cargarPeriodos();
    } catch (error) {
      setMensaje({ tipo: "error", texto: error + ": Error al eliminar el periodo" });
    }
  };

  const handleEditar = (periodo) => {
    setFormData(periodo);
    setMostrarFormulario(true);
  };

  const handleExito = async (texto) => {
    setMensaje({ tipo: "success", texto });
    setFormData(null);
    setMostrarFormulario(false);
    await cargarPeriodos();
  };

  const handleCancelar = () => {
    setFormData(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">
        {puedeAdministrar ? "Gestión de Periodo" : "Listado de Periodo"}
      </h1>

      <button onClick={() => navigate("/")} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />
      <Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
      <br />
      {mostrarFormulario || formData ? (
        <div>
          <FormularioPeriodo onExito={handleExito} initialData={formData} />
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
            Registrar nuevo Periodo
          </button>
        )
      )}
      <br />
      <br />
      <Tabla
        columnas={[
          { key: "anio", label: "Año" },
          { key: "descripcion", label: "Descripción" },
          { key: "progreso", label: "Progreso" },
          ...(puedeAdministrar ? [{ key: "estado", label: "Estado" }] : []),
        ]}
        datos={periodos}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        idKey="id_periodo"
        mostrarAcciones={puedeAdministrar}
      />
    </div>
  );
}