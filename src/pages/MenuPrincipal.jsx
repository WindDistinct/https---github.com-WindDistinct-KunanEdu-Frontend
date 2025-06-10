import React from "react";
import { Link } from "react-router-dom";
import "./../styles/Botones.css";

export default function MenuPrincipal() {
	const rol = localStorage.getItem("rol");
	const puedeVerAuditoria = rol === "auditor";
	const puedeVerMantenimientos= ["usuario", "administrador","profesor"].includes(rol);
	const menuItems = [
	{ path: "/aulas", nombre: "Aulas" },
	{ path: "/alumnos", nombre: "Alumnos" },
	{ path: "/empleados", nombre: "Empleados" },
	{ path: "/grados", nombre: "Grados" },
	{ path: "/usuarios", nombre: "Usuarios" },
	{ path: "/periodos", nombre: "Periodos" },
	{ path: "/cursos", nombre: "Cursos" },
	{ path: "/seccion", nombre: "Seccion" },
	];

	return (
	<div className="p-8 max-w-xl mx-auto">

		{puedeVerMantenimientos && (
		<>
			<h1 className="mb-4">Mantenimiento de Entidades</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div className="menu-grid">
				{menuItems.map(({ path, nombre }) => (
				<Link key={path} to={path} className="menu-button space-link">
					{rol === "administrador" ? `Gestionar ${nombre}` : `Listar ${nombre}`}
				</Link>
				))}
			</div>
			</div>
		</>
		)}

		 {puedeVerAuditoria && (
        <>
          <h1 className="mb-4">Registros de Auditoría</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="menu-grid">
              {menuItems.map(({ path, nombre }) => (
                <Link
                  key={path}
                  to={`/auditoria${path}`}
                  className="menu-button2 space-link"
                >
                  Auditoría {nombre}
                </Link>
              ))}
            </div>
          </div>
        </>
        )}
		
		<h1 className="mb-4">Servicios Extras</h1>
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div className="menu-grid">
				<Link to="/notas" className="menu-button3 space-link">Notas</Link>
			</div>
		</div>
	</div>
 
		
	);
}
