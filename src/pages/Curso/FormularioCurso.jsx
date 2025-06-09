import React, { useEffect, useState } from "react";
import { cursoService, empleadoService } from "../../api/requestApi";
import "../../styles/Botones.css";
import "../../styles/inputs.css";
import "../../styles/Notificacion.css";

export default function FormularioCurso({ onExito, initialData }) {
  const [form, setForm] = useState({
    nombre_curso: "",
    docente: "",
  });
  const [docentes, setDocentes] = useState([]);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        docente: String(initialData.docente),
      });
    }
  }, [initialData]);

  useEffect(() => {
    const cargarDocentes = async () => {
      try {
        const data = await empleadoService.obtenerDocentes();
        setDocentes(data);
      } catch (err) {
        setError("Error al cargar los docentes: " + err);
      }
    };
    cargarDocentes();
  }, []);

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
    const { nombre_curso, docente } = form;
    if (!nombre_curso || !docente) return "Todos los campos son obligatorios";

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/.test(nombre_curso.trim())) {
      return "El nombre del curso debe tener al menos 3 letras y sin números";
    }

    if (!docente || isNaN(Number(docente))) {
      return "Debe seleccionar un docente válido";
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
      docente: parseInt(form.docente, 10),
      estado: true,
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

      setForm({ nombre_curso: "", docente: "" });
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

      <div className="col-md-6">
        <input
          name="nombre_curso"
          placeholder="Nombre del Curso"
          className="form-control"
          value={form.nombre_curso}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <select
          name="docente"
          className="form-select"
          value={form.docente}
          onChange={handleChange}
        >
          <option value="" disabled>
            Seleccione un docente
          </option>
          {docentes.map((d) => (
            <option key={d.id_emp} value={d.id_emp}>
              {d.nombre_completo}
            </option>
          ))}
        </select>
      </div>

      <div className="col-12">
        <button type="submit" className="btn btn-success me-2">
          {form.id_curso ? "Actualizar" : "Registrar"} Curso
        </button>
      </div>
    </form>
  );
}