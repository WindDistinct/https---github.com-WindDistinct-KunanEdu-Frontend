import React, { useState } from 'react';
import { usuarioService } from '../api/requestApi';

export default function LoginUser({ onLoginCorrecto }) {
	const [usuario, setUsuario] = useState('');
	const [password, setPassword] = useState('');
	const [mensaje, setMensaje] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = await usuarioService.login({ username: usuario, password });
			localStorage.setItem("token", data.token);
			localStorage.setItem("rol", data.rol);
			setMensaje("Bienvenido!");
			onLoginCorrecto();
		} catch (error) {
			setMensaje("Usuario o contraseña incorrectos");
		}
	};

	return (
		<div className="container d-flex justify-content-center align-items-center min-vh-100">
			<div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
				<h3 className="text-center mb-4">Iniciar Sesión</h3>
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label htmlFor="usuario" className="form-label">Usuario</label>
						<input
							type="text"
							id="usuario"
							className="form-control"
							value={usuario}
							onChange={e => setUsuario(e.target.value)}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="password" className="form-label">Contraseña</label>
						<input
							type="password"
							id="password"
							className="form-control"
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
						/>
					</div>
					<button type="submit" className="btn btn-primary w-100">Ingresar</button>
				</form>
				{mensaje && (
					<div className="alert alert-info mt-3 text-center" role="alert">
						{mensaje}
					</div>
				)}
			</div>
		</div>
	);
}