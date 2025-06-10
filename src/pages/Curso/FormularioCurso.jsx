import React, { useEffect, useState } from "react";
import { cursoService, empleadoService } from "../../api/requestApi";
import "../../styles/Botones.css";
import "../../styles/inputs.css";
import "../../styles/Notificacion.css";

export default function FormularioCurso({ onExito, initialData }) {
  const [form, setForm] = useState({
    nombre_curso: "",
    estado: true, // Agregado para soportar edición de estado
  });

  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        nombre_curso: initialData.nombre_curso || "",
        estado: initialData.estado ?? true,
        id_curso: initialData.id_curso,
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (mensajeExito) {
      const timer = setTimeout(() => setMensajeExito(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensajeExito]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "estado") {
      setForm((prev) => ({
        ...prev,
        estado: value === "true",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validarFormulario = () => {
    const { nombre_curso } = form;

    if (!nombre_curso) return "Todos los campos son obligatorios";

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/.test(nombre_curso.trim())) {
      return "El nombre del curso debe tener al menos 3 letras y sin números";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    const datos = {
      nombre_curso: form.nombre_curso.trim(),
      estado: form.estado,
    };

    try {
      if (form.id_curso) {
        await cursoService.actualizar(form.id_curso, datos);
        setMensajeExito("Curso actualizado con éxito");
        onExito("Curso actualizado con éxito");
      } else {
        await cursoService.crear(datos);
        setMensajeExito("Curso registrado con éxito");
        onExito("Curso registrado con éxito");
      }

      setForm({ nombre_curso: "", estado: true });
    } catch (err) {
      setError("Error al guardar. Verifique que el nombre no esté duplicado: " + err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      {error && (
        <div className="alert alert-danger col-12" role="alert">
          {error}
        </div>
      )}
      {mensajeExito && (
        <div className="alert alert-success col-12" role="alert">
          {mensajeExito}
        </div>
      )}

      <div className="col-md-12">
        <input
          name="nombre_curso"
          placeholder="Nombre del Curso"
          className="form-control"
          value={form.nombre_curso}
          onChange={handleChange}
        />
      </div>

      {form.id_curso && (
        <div className="col-md-12">
          <select
            name="estado"
            className="form-control"
            value={form.estado ? "true" : "false"}
            onChange={handleChange}
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>
      )}

      <div className="col-12">
        <button type="submit" className="btn btn-success me-2">
          {form.id_curso ? "Actualizar" : "Registrar"} Curso
        </button>
      </div>
    </form>
  );
}