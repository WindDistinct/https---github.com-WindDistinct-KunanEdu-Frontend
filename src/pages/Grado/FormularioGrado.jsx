import React, { useEffect, useState } from "react";
import { gradoService } from "../../api/requestApi";
import "../../styles/Botones.css";
import "../../styles/inputs.css";
import "../../styles/Notificacion.css";

export default function FormularioGrado({ onExito, initialData }) {
  const [form, setForm] = useState({
    nivel: "",
    anio: "",
    cupos_totales: "",
    cupos_disponibles: "",
    estado: true,
  });

  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  useEffect(() => {
    if (mensajeExito) {
      const timer = setTimeout(() => setMensajeExito(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensajeExito]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let nuevoValor = value;

    if (type === "checkbox") {
      nuevoValor = checked;
    } else if (name === "cupos_totales" || name === "cupos_disponibles") {
      nuevoValor = value.replace(/\D/g, "");
    } else {
      nuevoValor = value.trimStart();
    }

    setForm((prev) => ({ ...prev, [name]: nuevoValor }));
  };

  const validarFormulario = () => {
    const { nivel, anio, cupos_totales, cupos_disponibles } = form;
    if (!nivel || !anio || !cupos_totales || !cupos_disponibles) {
      return "Todos los campos son obligatorios";
    }
    if (!/^\d+$/.test(cupos_totales) || !/^\d+$/.test(cupos_disponibles)) {
      return "Cupos deben ser números válidos";
    }
    if (parseInt(cupos_disponibles) > parseInt(cupos_totales)) {
      return "Los cupos disponibles no pueden superar a los cupos totales";
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
      ...form,
      cupos_totales: String(form.cupos_totales).trim(),
      cupos_disponibles: String(form.cupos_disponibles).trim(),
    };

    try {
      if (form.id_grado) {
        await gradoService.actualizar(form.id_grado, datos);
        setMensajeExito("Grado actualizado con éxito");
        onExito("Grado actualizado con éxito");
      } else {
        await gradoService.crear(datos);
        setMensajeExito("Grado registrado con éxito");
        onExito("Grado registrado con éxito");
      }
      setForm({
        nivel: "",
        anio: "",
        cupos_totales: "",
        cupos_disponibles: "",
        estado: true,
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

      <div className="col-md-6">
        <input
          name="cupos_totales"
          placeholder="Cupos Totales"
          className="form-control"
          value={form.cupos_totales}
          onChange={handleChange}
          maxLength={3}
          inputMode="numeric"
          onKeyDown={(e) => e.key === " " && e.preventDefault()}
        />
      </div>

      <div className="col-md-6">
        <input
          name="cupos_disponibles"
          placeholder="Cupos Disponibles"
          className="form-control"
          value={form.cupos_disponibles}
          onChange={handleChange}
          maxLength={3}
          inputMode="numeric"
          onKeyDown={(e) => e.key === " " && e.preventDefault()}
        />
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
        <button type="submit" className="btn btn-success me-2">
          {form.id_grado ? "Actualizar" : "Registrar"} Grado
        </button>
      </div>
    </form>
  );
}