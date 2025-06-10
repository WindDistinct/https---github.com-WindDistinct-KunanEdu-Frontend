import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { cursoService } from "../../api/requestApi";
import Tabla from "../../components/Tabla";
import FormularioCurso from "./FormularioCurso";
import Notificacion from "../../components/Notificacion";
import "../../styles/Botones.css";

export default function ListadoCurso() {
  const [cursos, setCursos] = useState([]);
  const [formData, setFormData] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  const [rol] = useState(() => localStorage.getItem("rol"));
  const puedeAdministrar = rol === "administrador";

  const cargarCursos = useCallback(async () => {
    try {
      const data =
        rol === "administrador" ? await cursoService.obtenerTodos() : await cursoService.obtener();

      const cursosOrdenados = data.sort((a, b) => a.id_curso - b.id_curso);
      setCursos(cursosOrdenados);
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al cargar los cursos: " + error });
    }
  }, [rol]);

  useEffect(() => {
    cargarCursos();
  }, [cargarCursos]);

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
      await cursoService.eliminar(id);
      setMensaje({ tipo: "success", texto: "Curso eliminado correctamente" });
      await cargarCursos();
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al eliminar el curso: " + error });
    }
  };

  const handleEditar = (curso) => {
    setFormData(curso);
    setMostrarFormulario(true);
  };

  const handleExito = async (texto) => {
    setMensaje({ tipo: "success", texto });
    setFormData(null);
    setMostrarFormulario(false);
    await cargarCursos();
  };

  const handleCancelar = () => {
    setFormData(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">
        {puedeAdministrar ? "Gestión de Curso" : "Listado de Curso"}
      </h1>

      <button onClick={() => navigate("/")} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />
      <Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
      <br />
      {mostrarFormulario || formData ? (
        <div>
          <FormularioCurso onExito={handleExito} initialData={formData} />
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
            Registrar nuevo Curso
          </button>
        )
      )}
      <br />
      <br />
      <Tabla
        columnas={[
          { key: "nombre_curso", label: "Nombre del Curso" },
          ...(puedeAdministrar ? [{ key: "estado", label: "Estado" }] : []),
        ]}
        datos={cursos}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        idKey="id_curso"
        mostrarAcciones={puedeAdministrar}
      />
    </div>
  );
}