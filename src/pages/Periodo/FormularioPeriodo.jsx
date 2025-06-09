import React, { useEffect, useState } from "react";
import { periodoService } from "../../api/requestApi"
import "../../styles/Botones.css";
import "../../styles/inputs.css";
import "../../styles/Notificacion.css";

export default function FormularioPeriodo({ onExito, initialData }) {
  const [form, setForm] = useState({
    anio: "",
    descripcion: "",
    progreso: "",
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
    } else if (name === "anio") {
      nuevoValor = value.replace(/\D/g, "");
    } else {
      nuevoValor = value.trimStart();
    }

    setForm((prev) => ({ ...prev, [name]: nuevoValor }));
  };

  const validarFormulario = () => {
    const { anio, descripcion, progreso } = form;
    if (!anio || !descripcion || !progreso) {
      return "Todos los campos son obligatorios";
    }
    if (!/^\d{4}$/.test(anio)) {
      return "Introduce un año válido de 4 dígitos";
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
      anio: String(form.anio ?? "").trim(),
      descripcion: String(form.descripcion ?? "").trim(),
      progreso: String(form.progreso ?? "").trim(),
      estado: form.estado,
    };

    try {
      if (form.id_periodo) {
        await periodoService.actualizar(form.id_periodo, datos);
        setMensajeExito("Periodo actualizado con éxito");
        onExito("Periodo actualizado con éxito");
      } else {
        await periodoService.crear(datos);
        setMensajeExito("Periodo registrado con éxito");
        onExito("Periodo registrado con éxito");
      }

      setForm({
        anio: "",
        descripcion: "",
        progreso: "",
        estado: true,
      });
    } catch (err) {
      setError(err + ": Error al guardar. Verifique.");
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

      <div className="col-md-6">
        <input
          name="anio"
          placeholder="Año"
          className="form-control"
          value={form.anio}
          onChange={handleChange}
          maxLength={4}
          inputMode="numeric"
          onKeyDown={(e) => e.key === " " && e.preventDefault()}
        />
      </div>

      <div className="col-md-6">
        <select
          name="descripcion"
          className="form-select"
          value={form.descripcion}
          onChange={handleChange}
        >
          <option value="" disabled>
            Seleccione descripción
          </option>
          <option value="Año escolar">Año Escolar</option>
          <option value="Vacacional">Vacacional</option>
        </select>
      </div>

      <div className="col-md-6">
        <select
          name="progreso"
          className="form-select"
          value={form.progreso}
          onChange={handleChange}
        >
          <option value="" disabled>
            Seleccione progreso
          </option>
          <option value="En curso">En Curso</option>
          <option value="Finalizado">Finalizado</option>
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
        <button type="submit" className="btn btn-success me-2">
          {form.id_periodo ? "Actualizar" : "Registrar"} Periodo
        </button>
      </div>
    </form>
  );
}
