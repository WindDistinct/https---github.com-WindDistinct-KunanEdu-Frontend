import React, { useEffect, useState } from "react";
import { usuarioService } from "../../api/requestApi"
import "../../styles/Botones.css";
import "../../styles/inputs.css";
import "../../styles/Notificacion.css";

export default function FormularioUsuario({ onExito, initialData }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    rol: "",
    estado: true,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        password: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.username || !form.rol || (!initialData && !form.password)) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const datos = {
      username: form.username.trim(),
      rol: form.rol,
      estado: form.estado,
    };

    if (!initialData) {
      datos.password = form.password;
    }

    try {
      if (initialData) {
        await usuarioService.actualizar(initialData.id_usuario, datos);
        onExito("Usuario actualizado con éxito");
      } else {
        await usuarioService.crear(datos);
        onExito("Usuario registrado con éxito");
      }
      setForm({ username: "", password: "", rol: "", estado: true });
    } catch (err) {
      setError(err + ": Error al guardar. Verifique que el usuario no esté duplicado");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      {error && <div className="alert alert-danger col-12">{error}</div>}

      <div className="col-md-6">
        <input
          name="username"
          placeholder="Usuario"
          className="input-form"
          value={form.username}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (/\d/.test(e.key) || e.key === " ") e.preventDefault(); // bloquea números y espacios
          }}
        />
      </div>

      {!initialData && (
        <div className="col-md-6">
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            className="input-form"
            value={form.password}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === " ") e.preventDefault();
            }}
          />
        </div>
      )}

      <div className="col-md-6">
        <select
          name="rol"
          className="form-select"
          value={form.rol}
          onChange={handleChange}
        >
          <option value="" disabled>Seleccione Rol</option>
          <option value="administrador">Administrador</option>
          <option value="usuario">Usuario</option>
          <option value="profesor">Profesor</option>
          <option value="auditor">Auditor</option>
        </select>
      </div>

      {initialData && (
        <div className="col-md-6">
          <div className="form-check d-flex align-items-center gap-2 mt-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="estado"
              name="estado"
              checked={!!form.estado}
              onChange={handleChange}
            />
            <label className="form-check-label mb-0" htmlFor="estado">
              Activo
            </label>
          </div>
        </div>
      )}

      <div className="col-12">
        <button type="submit" className="btn btn-success">
          {initialData ? "Actualizar" : "Registrar"} Usuario
        </button>
      </div>
    </form>
  );
}