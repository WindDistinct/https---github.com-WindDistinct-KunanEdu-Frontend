import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { seccionService } from "../../api/requestApi"
import Tabla from "../../components/Tabla";
import FormularioSeccion from "./FormularioSeccion";
import Notificacion from "../../components/Notificacion";
import "../../styles/Botones.css";

export default function ListadoSeccion() {
  const [secciones, setSecciones] = useState([]);
  const [formData, setFormData] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  const [rol] = useState(() => localStorage.getItem("rol"));
  const puedeAdministrar = rol === "administrador";

  const cargarSecciones = useCallback(async () => {
    try {
      const data =
        rol === "administrador" ? await seccionService.obtenerTodos() : await seccionService.obtener();

      const ordenadas = data.sort((a, b) => a.id_seccion - b.id_seccion);
      setSecciones(ordenadas);
    } catch (err) {
      setMensaje({ tipo: "error", texto: err + ": Error al cargar las secciones" });
    }
  }, [rol]);

  useEffect(() => {
    cargarSecciones();
  }, [cargarSecciones]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleEliminar = async (id) => {
    try {
      await seccionService.eliminar(id);
      setMensaje({ tipo: "success", texto: "Sección eliminada correctamente" });
      await cargarSecciones();
    } catch (error) {
      setMensaje({ tipo: "error", texto: error + ": Error al eliminar la sección" });
    }
  };

  const handleEditar = (seccion) => {
    const formateado = {
      ...seccion,
      aula: seccion.id_aula,
      grado: seccion.id_grado,
      periodo: seccion.id_periodo,
    };
    setFormData(formateado);
    setMostrarFormulario(true);
  };

  const handleExito = async (texto) => {
    setMensaje({ tipo: "success", texto });
    setFormData(null);
    setMostrarFormulario(false);
    await cargarSecciones();
  };

  const handleCancelar = () => {
    setFormData(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">
        {puedeAdministrar ? "Gestión de Secciones" : "Listado de Secciones"}
      </h1>

      <button onClick={() => navigate("/")} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br></br>
      <Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
      <br></br>
      {mostrarFormulario || formData ? (
        <div>
          <FormularioSeccion onExito={handleExito} initialData={formData} />
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
            Registrar nueva Sección
          </button>
        )
      )}
      <br />
      <Tabla
        columnas={[
          { key: "nombre", label: "Nombre" },
          { key: "grado", label: "Grado" },
          { key: "aula", label: "Aula" },
          { key: "periodo", label: "Periodo" },
          ...(puedeAdministrar ? [{ key: "estado", label: "Estado" }] : []),
        ]}
        datos={secciones}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        idKey="id_seccion"
        mostrarAcciones={puedeAdministrar}
      />
    </div>
  );
}