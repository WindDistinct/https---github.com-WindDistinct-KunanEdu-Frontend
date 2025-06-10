import React from "react";
import { useEffect, useState } from "react";
import { alumnoService } from "../../api/requestApi";
import "../../styles/Botones.css";
import "../../styles/inputs.css";
import "../../styles/Notificacion.css";

const fechaMaximaNacimiento = (() => {
  const fecha = new Date();
  fecha.setFullYear(fecha.getFullYear() - 5);
  return fecha.toISOString().split("T")[0];
})();

const inicialForm = {
  nombre: "",
  apellido_paterno: "",
  apellido_materno: "",
  dni: "",
  direccion: "",
  telefono: "",
  fecha_nacimiento: "",
  estado: true,
};

const validarTexto = (texto, minLen = 2) =>
  /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(texto) && texto.length >= minLen;

const validarNumeroExacto = (valor, digitos) =>
  /^\d+$/.test(valor) && valor.length === digitos;

export default function FormularioAlumno({ onExito, initialData }) {
  const [form, setForm] = useState(inicialForm);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...inicialForm,
        ...initialData,
        fecha_nacimiento: initialData.fecha_nacimiento
          ? initialData.fecha_nacimiento.split("T")[0]
          : "",
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (mensajeExito) {
      const timer = setTimeout(() => setMensajeExito(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensajeExito]);

  const handleChange = ({ target: { name, value, type, checked } }) => {
    let newValue = type === "checkbox" ? checked : value;

    if (["dni", "telefono"].includes(name)) {
      newValue = newValue.replace(/\D/g, "");
    }

    if (["nombre", "apellido_paterno", "apellido_materno"].includes(name)) {
      newValue = newValue.replace(/[0-9]/g, "").trimStart();
    }

    if (name === "direccion") {
      newValue = newValue.trimStart();
    }

    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const validarFormulario = () => {
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      dni,
      direccion,
      telefono,
      fecha_nacimiento,
    } = form;

    if (
      !nombre ||
      !apellido_paterno ||
      !apellido_materno ||
      !dni ||
      !direccion ||
      !telefono ||
      !fecha_nacimiento
    ) {
      return "Todos los campos son obligatorios";
    }

    if (!validarTexto(nombre, 3))
      return "El nombre debe tener al menos 3 letras y no contener números";
    if (!validarTexto(apellido_paterno))
      return "El apellido paterno debe tener al menos 2 letras y no contener números";
    if (!validarTexto(apellido_materno))
      return "El apellido materno debe tener al menos 2 letras y no contener números";
    if (!validarNumeroExacto(dni, 8))
      return "El DNI debe tener exactamente 8 dígitos numéricos";
    if (direccion.length < 5)
      return "La dirección debe tener al menos 5 caracteres";
    if (!validarNumeroExacto(telefono, 9))
      return "El teléfono debe tener exactamente 9 dígitos numéricos";
    if (new Date(fecha_nacimiento) > new Date(fechaMaximaNacimiento))
      return "El alumno debe tener al menos 5 años";

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

    try {
      if (initialData) {
        await alumnoService.actualizar(initialData.id_alumno, form);
        setMensajeExito("Alumno actualizado con éxito");
        onExito("Alumno actualizado con éxito");
      } else {
        await alumnoService.crear(form);
        setMensajeExito("Alumno registrado con éxito");
        onExito("Alumno registrado con éxito");
        setForm(inicialForm);
      }
    } catch {
      setError("Error al guardar. Verifique que el DNI no esté duplicado");
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
          name="nombre"
          placeholder="Nombres"
          className="form-control"
          value={form.nombre}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <input
          name="apellido_paterno"
          placeholder="Apellido Paterno"
          className="form-control"
          value={form.apellido_paterno}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <input
          name="apellido_materno"
          placeholder="Apellido Materno"
          className="form-control"
          value={form.apellido_materno}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <input
          name="dni"
          placeholder="DNI"
          className="form-control"
          value={form.dni}
          onChange={handleChange}
          maxLength={8}
          inputMode="numeric"
          onKeyDown={(e) => e.key === " " && e.preventDefault()}
        />
      </div>

      <div className="col-md-6">
        <input
          name="telefono"
          placeholder="Teléfono"
          className="form-control"
          value={form.telefono}
          onChange={handleChange}
          maxLength={9}
          inputMode="numeric"
          onKeyDown={(e) => e.key === " " && e.preventDefault()}
        />
      </div>

      <div className="col-md-6">
        <input
          name="direccion"
          placeholder="Dirección"
          className="form-control"
          value={form.direccion}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <input
          name="fecha_nacimiento"
          type="date"
          className="form-control"
          value={form.fecha_nacimiento}
          onChange={handleChange}
          max={fechaMaximaNacimiento}
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
          {initialData ? "Actualizar" : "Registrar"} Alumno
        </button>
      </div>
    </form>
  );
}