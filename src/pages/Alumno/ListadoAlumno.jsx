import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { alumnoService } from "../../api/requestApi";
import Tabla from "../../components/Tabla";
import FormularioAlumno from "./FormularioAlumno";
import Notificacion from "../../components/Notificacion";
import "../../styles/Botones.css";

export default function ListadoAlumno() {
	const [alumnos, setAlumnos] = useState([]);
	const [formData, setFormData] = useState(null);
	const [mensaje, setMensaje] = useState(null);
	const [mostrarFormulario, setMostrarFormulario] = useState(false);
	const navigate = useNavigate();

	const [rol] = useState(() => localStorage.getItem("rol"));
	const puedeAdministrar = rol === "administrador";

	const cargarAlumnos = useCallback(async () => {
		try {
			const data = rol === "administrador" ? await alumnoService.obtenerTodos() : await alumnoService.obtener();
			const alumnosFormateados = data
				.map((alumno) => ({
					...alumno,
					fecha_nacimiento: alumno.fecha_nacimiento
						? alumno.fecha_nacimiento.split("T")[0]
						: "",
				}))
				.sort((a, b) => a.id_alumno - b.id_alumno)
			setAlumnos(alumnosFormateados);
		} catch (error) {
			setMensaje({ tipo: "error", texto: "Error al cargar los alumnos" });
		}
	}, [rol]);

	useEffect(() => {
		cargarAlumnos();
	}, [cargarAlumnos]);



	const handleEliminar = async (id) => {
		try {
			await alumnoService.eliminar(id);
			setMensaje({ tipo: "success", texto: "Alumno eliminado correctamente" });
			await alumnoService.crear();
		} catch (error) {
			setMensaje({ tipo: "error", texto: "Error al eliminar el alumno" });
		}
	};

	const handleEditar = (alumno) => {
		setFormData(alumno);
		setMostrarFormulario(true);
	};

	const handleExito = async (texto) => {
		setMensaje({ tipo: "success", texto });
		setFormData(null);
		setMostrarFormulario(false);
		await cargarAlumnos();
	};

	const handleCancelar = () => {
		setFormData(null);
		setMostrarFormulario(false);
	};
	useEffect(() => {
		if (mensaje?.texto) {
			const timer = setTimeout(() => setMensaje(null), 3000);
			return () => clearTimeout(timer);
		}
	}, [mensaje]);
	return (
		<div className="container mt-4">

			<h1 className="mb-4">
				{puedeAdministrar ? "Gestión de Alumno" : "Listado de Alumnos"}
			</h1>

			<button onClick={() => navigate("/")} className="btn btn-secondary mb-3">
				Volver al Menú
			</button>
			<br />
			<Notificacion mensaje={mensaje?.texto} tipo={mensaje?.tipo} />
			<br />
			{mostrarFormulario || formData ? (
				<div>
					<FormularioAlumno onExito={handleExito} initialData={formData} />
					<div className="d-flex mt-2">
						<button
							onClick={handleCancelar}
							type="button"
							className="btn btn-danger me-2"
						>
							Cancelar Registro
						</button>
					</div>
				</div>
			) : (
				puedeAdministrar && (
					<button
						onClick={() => setMostrarFormulario(true)}
						className="btn btn-primary mb-3"
					>
						Registrar nuevo Alumno
					</button>
				)
			)}
			<br />
			<br />
			<Tabla
				columnas={[
					{ key: "nombre", label: "Nombres" },
					{ key: "apellido_paterno", label: "Apellido Paterno" },
					{ key: "apellido_materno", label: "Apellido Materno" },
					{ key: "dni", label: "DNI" },
					{ key: "direccion", label: "Dirección" },
					{ key: "telefono", label: "Teléfono" },
					{ key: "fecha_nacimiento", label: "Fecha Nacimiento" },
					...(puedeAdministrar ? [{ key: "estado", label: "Estado" }] : []),
				]}
				datos={alumnos}
				onEditar={handleEditar}
				onEliminar={handleEliminar}
				idKey="id_alumno"
				mostrarAcciones={puedeAdministrar}
			/>
		</div>
	);
}