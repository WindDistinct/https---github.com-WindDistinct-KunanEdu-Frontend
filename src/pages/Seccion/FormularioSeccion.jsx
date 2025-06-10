import React, { useEffect, useState } from "react";
import { seccionService, periodoService, aulaService, gradoService } from "../../api/requestApi"
import "../../styles/Botones.css";
import "../../styles/inputs.css";
import "../../styles/Notificacion.css";

export default function FormularioSeccion({ onExito, initialData }) {
  const [form, setForm] = useState({
    nombre: "",
    aula: "",
    grado: "",
    periodo: "",
    estado: true,
  });

  const [aulas, setAulas] = useState([]);
  const [grados, setGrados] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [aulasData, gradosData, periodosData] = await Promise.all([
          aulaService.obtener(),
          gradoService.obtener(),
          periodoService.obtener(),
        ]);
        setAulas(aulasData);
        setGrados(gradosData);
        setPeriodos(periodosData);
      } catch (e) {
        setError("Error al cargar datos para el formulario");
      }
    };
    cargarDatos();
  }, []);

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
    let nuevoValor = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: nuevoValor }));
  };

  const validarFormulario = () => {
    const { nombre, aula, grado, periodo } = form;
    if (!nombre || !aula || !grado || !periodo) {
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
      nombre: form.nombre.trim(),
      aula: parseInt(form.aula),
      grado: parseInt(form.grado),
      periodo: parseInt(form.periodo),
      ...(initialData && { estado: form.estado }),
    };

    try {
      if (form.id_seccion) {
        await seccionService.actualizar(form.id_seccion, datos);
        setMensajeExito("Sección actualizada con éxito");
        onExito("Sección actualizada con éxito");
      } else {
        await seccionService.crear(datos);
        setMensajeExito("Sección registrada con éxito");
        onExito("Sección registrada con éxito");
      }

      setForm({
        nombre: "",
        aula: "",
        grado: "",
        periodo: "",
        estado: true,
      });
    } catch (err) {
      setError(err + ": Error al guardar. Verifique que no esté duplicado el nombre de la sección");
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
          placeholder="Nombre de la sección"
          className="form-control"
          value={form.nombre}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <select
          name="aula"
          className="form-select"
          value={form.aula}
          onChange={handleChange}
        >
          <option value="">Seleccionar Aula</option>
          {aulas.map((aula) => (
            <option key={aula.id_aula} value={aula.id_aula}>
              Aula {aula.numero_aula}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-6">
        <select
          name="grado"
          className="form-select"
          value={form.grado}
          onChange={handleChange}
        >
          <option value="">Seleccionar Grado</option>
          {grados.map((grado) => (
            <option key={grado.id_grado} value={grado.id_grado}>
              {grado.nivel} - {grado.anio}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-6">
        <select
          name="periodo"
          className="form-select"
          value={form.periodo}
          onChange={handleChange}
        >
          <option value="">Seleccionar Periodo</option>
          {periodos.map((p) => (
            <option key={p.id_periodo} value={p.id_periodo}>
              {p.anio} - {p.descripcion}
            </option>
          ))}
        </select>
      </div>

      {initialData && (
        <div className="col-md-6">
          <label htmlFor="estado" className="form-label">Estado</label>
          <select
            name="estado"
            id="estado"
            className="form-select"
            value={form.estado === true ? "true" : "false"}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, estado: e.target.value === "true" }))
            }
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>
      )}

      <div className="col-12">
        <button type="submit" className="btn btn-success me-2">
          {form.id_seccion ? "Actualizar" : "Registrar"} Sección
        </button>
      </div>
    </form>
  );
}