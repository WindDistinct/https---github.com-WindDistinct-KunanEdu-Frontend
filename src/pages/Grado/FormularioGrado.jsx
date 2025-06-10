import React, { useEffect, useState } from "react";
import { gradoService } from "../../api/requestApi";
import "../../styles/Botones.css";
import "../../styles/inputs.css";
import "../../styles/Notificacion.css";

export default function FormularioGrado({ onExito, initialData }) {
  const [form, setForm] = useState({
    nivel: "",
    anio: "",
    estado: "activo",
  });

  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  useEffect(() => {
    if (initialData) {
      const estadoStr = initialData.estado ? "activo" : "inactivo";
      setForm({
        nivel: initialData.nivel || "",
        anio: initialData.anio || "",
        estado: estadoStr,
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validarFormulario = () => {
    const { nivel, anio } = form;
    if (!nivel || !anio) {
      return "Todos los campos son obligatorios";
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
      nivel: form.nivel,
      anio: form.anio,
      estado: form.estado === "activo",
    };

    try {
      if (initialData && initialData.id_grado) {
        await gradoService.actualizar(initialData.id_grado, datos);
        setMensajeExito("Grado actualizado con éxito");
        onExito("Grado actualizado con éxito");
      } else {
        // Para nuevo registro no envías estado, o lo defines en backend
        await gradoService.crear({
          nivel: form.nivel,
          anio: form.anio,
          estado: true, // si quieres que por defecto sea activo
        });
        setMensajeExito("Grado registrado con éxito");
        onExito("Grado registrado con éxito");
      }
      setForm({
        nivel: "",
        anio: "",
        estado: "activo",
      });
    } catch (err) {
      setError(err + ": Error al guardar. Verifique que el grado no esté duplicado");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      {error && (
        <div className="alert alert-danger col-12" role="alert">
          {error}
        </div>
      )}

      <div className="col-md-6">
        <select
          name="nivel"
          className="form-select"
          value={form.nivel}
          onChange={handleChange}
        >
          <option value="" disabled>
            Seleccione nivel
          </option>
          <option value="inicial">Inicial</option>
          <option value="primaria">Primaria</option>
          <option value="secundaria">Secundaria</option>
        </select>
      </div>

      <div className="col-md-6">
        <select
          name="anio"
          className="form-select"
          value={form.anio}
          onChange={handleChange}
        >
          <option value="" disabled>
            Seleccione año
          </option>
          <option value="1ro">1ro</option>
          <option value="2do">2do</option>
          <option value="3ro">3ro</option>
          <option value="4to">4to</option>
          <option value="5to">5to</option>
          <option value="6to">6to</option>
        </select>
      </div>

      {initialData && (
        <div className="col-md-6">
          <select
            name="estado"
            className="form-select"
            value={form.estado}
            onChange={handleChange}
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      )}

      <div className="col-12">
        <button type="submit" className="btn btn-success me-2">
          {initialData && initialData.id_grado ? "Actualizar" : "Registrar"} Grado
        </button>
      </div>
    </form>
  );
}