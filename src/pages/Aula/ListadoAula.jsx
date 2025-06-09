import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { aulaService } from "../../api/requestApi";
import Tabla from "../../components/Tabla";
import FormularioAula from "./FormularioAula";
import Notificacion from "../../components/Notificacion";
import "../../styles/Botones.css";

export default function ListadoAula() {
  const [aulas, setAulas] = useState([]);
  const [formData, setFormData] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  const [rol] = useState(() => localStorage.getItem("rol"));
  const puedeAdministrar = rol === "administrador";

  const cargarAulas = useCallback(async () => {
    try {
      const data =
        rol === "administrador" ? await aulaService.obtenerTodos() : await aulaService.obtener();

      const aulasOrdenadas = data.sort((a, b) => a.id_aula - b.id_aula);
      setAulas(aulasOrdenadas);
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al cargar las aulas: " + error });
    }
  }, [rol]);

  useEffect(() => {
    cargarAulas();
  }, [cargarAulas]);

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
      await aulaService.eliminar(id);
      setMensaje({ tipo: "success", texto: "Aula eliminada correctamente" });
      await cargarAulas();
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al eliminar el aula: " + error });
    }
  };

  const handleEditar = (aula) => {
    setFormData(aula);
    setMostrarFormulario(true);
  };

  const handleExito = async (texto) => {
    setMensaje({ tipo: "success", texto });
    setFormData(null);
    setMostrarFormulario(false);
    await cargarAulas();
  };

  const handleCancelar = () => {
    setFormData(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">
        {puedeAdministrar ? "Gestión de Aulas" : "Listado de Aulas"}
      </h1>
      <button onClick={() => navigate("/")} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />
      <Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
      <br />
      {mostrarFormulario || formData ? (
        <div>
          <FormularioAula onExito={handleExito} initialData={formData} />
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
            Registrar nueva Aula
          </button>
        )
      )}
      <br />
      <br />
      <Tabla
        columnas={[
          { key: "numero_aula", label: "N° Aula" },
          { key: "aforo", label: "Aforo" },
          { key: "ubicacion", label: "Ubicación" },
          ...(puedeAdministrar ? [{ key: "estado", label: "Estado" }] : []),
        ]}
        datos={aulas}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        idKey="id_aula"
        mostrarAcciones={puedeAdministrar}
      />
    </div>
  );
}