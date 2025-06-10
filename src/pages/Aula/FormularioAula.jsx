import React, { useEffect, useState } from "react";
import { aulaService } from "../../api/requestApi";
import '../../styles/Botones.css';
import '../../styles/inputs.css';
import '../../styles/Notificacion.css';

export default function FormularioAula({ onExito, initialData }) {
  const [form, setForm] = useState({
    numero_aula: "",
    aforo: "",
    ubicacion: "",
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
    } else if (name === "numero_aula" || name === "aforo") {
      nuevoValor = value.replace(/\D/g, "");
    } else {
      nuevoValor = value.trimStart();
    }
    setForm((prev) => ({ ...prev, [name]: nuevoValor }));
  };

  const validarFormulario = () => {
    const { numero_aula, aforo, ubicacion } = form;
    if (!numero_aula || !aforo || !ubicacion) {
      return "Todos los campos son obligatorios";
    }
    if (!/^\d+$/.test(numero_aula)) {
      return "Introduce un número válido para el número de aula";
    }
    if (!/^\d+$/.test(aforo)) {
      return "Introduce un número válido para el aforo";
    }
    if (parseInt(aforo, 10) <= 20) {
      return "El aforo debe ser mayor a 20";
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
      numero_aula: String(form.numero_aula ?? "").trim(),
      aforo: String(form.aforo ?? "").trim(),
      ubicacion: String(form.ubicacion ?? "").trim(),
      estado: form.estado,
    };

    try {
      if (form.id_aula) {
        await aulaService.actualizar(form.id_aula, datos);
        setMensajeExito("Aula actualizada con éxito");
        onExito("Aula actualizada con éxito");
      } else {
        await aulaService.crear(datos);
        setMensajeExito("Aula registrada con éxito");
        onExito("Aula registrada con éxito");
      }
      setForm({
        numero_aula: "",
        aforo: "",
        ubicacion: "",
        estado: true,
      });
    } catch (err) {
      setError("Error al guardar. Verifique que el número de aula no esté duplicado");
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
        <input
          name="numero_aula"
          placeholder="Número de Aula"
          className="form-control"
          value={form.numero_aula}
          onChange={handleChange}
          maxLength={3}
          inputMode="numeric"
          onKeyDown={(e) => e.key === " " && e.preventDefault()}
        />
      </div>

      <div className="col-md-6">
        <input
          name="aforo"
          placeholder="Aforo"
          className="form-control"
          value={form.aforo}
          onChange={handleChange}
          maxLength={3}
          inputMode="numeric"
          onKeyDown={(e) => e.key === " " && e.preventDefault()}
        />
      </div>

      <div className="col-md-6">
        <select
          name="ubicacion"
          className="form-select"
          value={form.ubicacion}
          onChange={handleChange}
        >
          <option value="" disabled>
            Ubicación
          </option>
          <option value="Primer Piso">Primer Piso</option>
          <option value="Segundo Piso">Segundo Piso</option>
          <option value="Tercer Piso">Tercer Piso</option>
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
          {form.id_aula ? "Actualizar" : "Registrar"} Aula
        </button>
      </div>
    </form>
  );
}