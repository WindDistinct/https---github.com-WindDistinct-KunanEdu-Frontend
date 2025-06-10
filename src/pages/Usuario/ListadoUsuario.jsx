import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usuarioService } from "../../api/requestApi"
import Tabla from "../../components/Tabla";
import FormularioUsuario from "./FormularioUsuario";
import Notificacion from "../../components/Notificacion";
import "../../styles/Botones.css";

export default function ListadoUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  const [rol] = useState(() => localStorage.getItem("rol"));
  const puedeAdministrar = rol === "administrador";

  const cargarUsuarios = useCallback(async () => {
    try {
      const data =
        rol === "administrador" ? await usuarioService.obtenerTodos() : await usuarioService.obtener();

      const usuariosOrdenados = data.sort((a, b) => a.id_usuario - b.id_usuario);
      setUsuarios(usuariosOrdenados);
    } catch (error) {
      setMensaje({ tipo: "error", texto: error + ": Error al cargar los usuarios" });
    }
  }, [rol]);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleEliminar = async (id_usuario) => {
    try {
      await usuarioService.eliminar(id_usuario);
      setMensaje({ tipo: "success", texto: "Usuario eliminado correctamente" });
      await cargarUsuarios();
    } catch (error) {
      setMensaje({ tipo: "error", texto: error + ": Error al eliminar el usuario" });
    }
  };

  const handleEditar = (usuario) => {
    setFormData(usuario);
    setMostrarFormulario(true);
  };

  const handleExito = async (texto) => {
    setMensaje({ tipo: "success", texto });
    setFormData(null);
    setMostrarFormulario(false);
    await cargarUsuarios();
  };

  const handleCancelar = () => {
    setFormData(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">
        {puedeAdministrar ? "Gestión de Usuario" : "Listado de Usuario"}
      </h1>

      <button onClick={() => navigate("/")} className="btn btn-secondary mb-3">
        Volver al Menú
      </button>
      <br />
      <Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
      <br />
      {mostrarFormulario || formData ? (
        <div>
          <FormularioUsuario onExito={handleExito} initialData={formData} />
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
            Registrar nuevo Usuario
          </button>
        )
      )}
      <br />
      <br />
      <Tabla
        columnas={[
          { key: "username", label: "Nombre de Usuario" },
          { key: "rol", label: "Rol" },
          ...(puedeAdministrar ? [{ key: "estado", label: "Estado" }] : []),
        ]}
        datos={usuarios}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        idKey="id_usuario"
        mostrarAcciones={puedeAdministrar}
      />
    </div>
  );
}