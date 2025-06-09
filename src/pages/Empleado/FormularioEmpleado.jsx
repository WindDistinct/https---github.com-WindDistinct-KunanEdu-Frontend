import React, { useEffect, useState } from "react";
import { empleadoService, usuarioService } from "../../api/requestApi";
import "../../styles/Botones.css";
import "../../styles/inputs.css";
import "../../styles/Notificacion.css";

export default function FormularioEmpleado({ onExito, initialData }) {
  const [form, setForm] = useState({
    nombre_emp: "",
    ape_pat_emp: "",
    ape_mat_emp: "",
    fec_nac: "",
    dni: "",
    telefono: "",
    especialidad: "",
    cargo: "",
    observacion: "",
    usuario: "",
    estado: true,
  });

  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const cargarUsuarios = async () => {
      const data = await usuarioService.obtener();
      setUsuarios(data);
    };
    cargarUsuarios();
  }, []);

  useEffect(() => {
    if (initialData) {
      const fechaFormateada = initialData.fec_nac
        ? initialData.fec_nac.split("T")[0]
        : "";
      setForm({
        ...initialData,
        fec_nac: fechaFormateada,
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
    const { name, value, type, checked } = e.target;
    let nuevoValor = value;
    if (type === "checkbox") {
      nuevoValor = checked;
    }

    if (["dni", "telefono"].includes(name)) {
      nuevoValor = value.replace(/\D/g, "");
    }
    if (["nombre_emp", "ape_pat_emp", "ape_mat_emp"].includes(name)) {
      nuevoValor = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
    }
    if (name === "cargo" && (value === "almacen" || value === "limpieza")) {
      setForm((prev) => ({
        ...prev,
        [name]: nuevoValor,
        usuario: "",
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: nuevoValor }));
    }
  };
  const obtenerFechaMaximaNacimiento = () => {
    const hoy = new Date();
    hoy.setFullYear(hoy.getFullYear() - 18);
    return hoy.toISOString().split("T")[0];
  };
  const esTextoValido = (texto) =>
    /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(texto.trim());

  const esNumeroExacto = (numero, longitud) =>
    new RegExp(`^\\d{${longitud}}$`).test(numero.trim());

  const validarFormulario = () => {
    const camposObligatorios = [
      "nombre_emp",
      "ape_pat_emp",
      "ape_mat_emp",
      "fec_nac",
      "dni",
      "telefono",
      "especialidad",
      "cargo",
      "observacion",
      ...(form.cargo !== "almacen" && form.cargo !== "limpieza"
        ? ["usuario"]
        : []),
    ];

    for (const campo of camposObligatorios) {
      if (!form[campo]) {
        return "Todos los campos obligatorios deben estar completos";
      }
    }
    if (!esTextoValido(form.nombre_emp)) {
      return "El nombre solo debe contener letras y espacios";
    }
    if (!esTextoValido(form.ape_pat_emp)) {
      return "El apellido paterno solo debe contener letras y espacios";
    }
    if (!esTextoValido(form.ape_mat_emp)) {
      return "El apellido materno solo debe contener letras y espacios";
    }
    if (!esTextoValido(form.especialidad)) {
      return "La especialidad solo debe contener letras y espacios";
    }
    if (!esTextoValido(form.observacion)) {
      return "La observación solo debe contener letras y espacios";
    }
    if (!esNumeroExacto(form.dni, 8)) {
      return "El DNI debe contener exactamente 8 dígitos numéricos";
    }
    if (!esNumeroExacto(form.telefono, 9)) {
      return "El teléfono debe contener exactamente 9 dígitos numéricos";
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

    try {

      if (form.id_emp) {
        await empleadoService.actualizar(form.id_emp, form);
        setMensajeExito("Empleado actualizado con éxito");
        onExito && onExito("Empleado actualizado con éxito");
      } else {
        await empleadoService.crear(form);
        setMensajeExito("Empleado registrado con éxito");
        onExito && onExito("Empleado registrado con éxito");
      }
      setForm({
        nombre_emp: "",
        ape_pat_emp: "",
        ape_mat_emp: "",
        fec_nac: "",
        dni: "",
        telefono: "",
        especialidad: "",
        cargo: "",
        observacion: "",
        usuario: "",
        estado: true,
      });
    } catch (err) {
      setError(
        err + ": Error al guardar. Verifique que los datos sean correctos y no estén duplicados."
      );
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
          name="nombre_emp"
          placeholder="Nombres"
          className="form-control"
          value={form.nombre_emp}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <input
          name="ape_pat_emp"
          placeholder="Apellido Paterno"
          className="form-control"
          value={form.ape_pat_emp}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <input
          name="ape_mat_emp"
          placeholder="Apellido Materno"
          className="form-control"
          value={form.ape_mat_emp}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <input
          name="fec_nac"
          type="date"
          placeholder="Fecha Nacimiento"
          className="form-control"
          value={form.fec_nac}
          onChange={handleChange}
          max={obtenerFechaMaximaNacimiento()}
        />
      </div>

      <div className="col-md-6">
        <select
          name="cargo"
          className="form-select"
          value={form.cargo}
          onChange={handleChange}
        >
          <option value="" disabled>
            Seleccione cargo
          </option>
          <option value="docente">Docente</option>
          <option value="tutor">Tutor</option>
          <option value="director">Director</option>
          <option value="consultor">Consultor</option>
          <option value="limpieza">Limpieza</option>
          <option value="almacen">Almacen</option>

        </select>
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
        />
      </div>

      <div className="col-md-6">
        <input
          name="observacion"
          placeholder="Observación"
          className="form-control"
          value={form.observacion}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <select
          name="usuario"
          className="form-select"
          value={form.usuario}
          onChange={handleChange}
          disabled={form.cargo === "almacen" || form.cargo === "limpieza"}
        >
          <option value="" disabled>
            Seleccione usuario
          </option>
          {usuarios.map((usuario) => (
            <option key={usuario.id_usuario} value={usuario.id_usuario}>
              {usuario.username}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-6">
        <select
          name="especialidad"
          className="form-select"
          value={form.especialidad}
          onChange={handleChange}
        >
          <option value="" disabled>
            Seleccione especialidad
          </option>
          <option value="ciencias">Ciencias</option>
          <option value="letras">Letras</option>
          <option value="matematicas">Matemáticas</option>
          <option value="mixto">Mixto</option>
          <option value="aseo">Aseo</option>
          <option value="supervisor">Supervisor</option>
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
          {form.id_emp ? "Actualizar" : "Registrar"} Empleado
        </button>
      </div>
    </form>
  );
}