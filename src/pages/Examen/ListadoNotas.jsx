import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { alumnoService, examenService } from "../../api/requestApi";
import Tabla from "../../components/TablaAuditoria";
import "../../styles/Botones.css";

export default function ListadoNotas() {
  const [alumnos, setAlumnos] = useState([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState("");
  const [notas, setNotas] = useState([]);
  const navigate = useNavigate();

  const cargarAlumnos = async () => {
    try {
      const data = await alumnoService.obtener();
      setAlumnos(data);
    } catch (error) {
      console.error("Error al cargar alumnos:", error);
    }
  };

  const cargarNotas = async (idAlumno) => {
    try {
      const data = await examenService.obtenerNotasporAlumno(idAlumno);
      setNotas(data);
    } catch (error) {
      console.error("Error al cargar notas:", error);
    }
  };


  const handleSeleccionAlumno = (e) => {
    const id = e.target.value;
    setAlumnoSeleccionado(id);
    if (id) {
      cargarNotas(id);
    } else {
      setNotas([]);
    }
  };

  useEffect(() => {
    cargarAlumnos();
  }, []);

  return (
    <div>
      <div>
        <h1>Reporte de Notas</h1>
        <button onClick={() => navigate("/")} className="menu-button">
          Volver al Menú
        </button>
      </div>
      <br />

      <div>
        <label htmlFor="alumnoSelect">Seleccione un alumno:</label>
        <select
          id="alumnoSelect"
          value={alumnoSeleccionado}
          onChange={handleSeleccionAlumno}
        >
          <option value="">-- Seleccione --</option>
          {alumnos.map((alumno) => (
            <option key={alumno.id_alumno} value={alumno.id_alumno}>
              {alumno.nombre + " " + alumno.apellido_paterno}
            </option>
          ))}
        </select>
      </div>

      <br />

      {notas.length > 0 ? (
        <Tabla
          columnas={[
            { key: "id_alumno", label: "ID Alumno" },
            { key: "nombre_alumno", label: "Alumno" },
            { key: "nombre_curso", label: "Curso" },
            { key: "nombre_seccion", label: "Sección" },
            { key: "bimestre", label: "Bimestre" },
            { key: "nota", label: "Nota" }
          ]}
          datos={notas}
          idKey="id_alumno"
        />
      ) : (
        alumnoSeleccionado && <p>No hay notas para este alumno.</p>
      )}
    </div>
  );
}
