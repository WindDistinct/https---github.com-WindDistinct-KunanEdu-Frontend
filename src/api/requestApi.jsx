import axiosInstance from "./axiosInstance";

const createApiService = (resource) => ({
  obtener: () => axiosInstance.get(`/api/${resource}/all`).then(r => r.data),
  obtenerTodos: () => axiosInstance.get(`/api/${resource}/all-adm`).then(r => r.data),
  crear: (data) => axiosInstance.post(`/api/${resource}/create`, data).then(r => r.data),
  actualizar: (id, data) => axiosInstance.put(`/api/${resource}/update/${id}`, data).then(r => r.data),
  eliminar: (id) => axiosInstance.delete(`/api/${resource}/delete/${id}`).then(r => r.data),
  auditar: () => axiosInstance.get(`/api/${resource}/all-audit`).then(r => r.data)
});

const alumnoService = createApiService("estudiante");
const usuarioService = {
  ...createApiService("usuario"),
  login: async ({ username, password }) => {
    try {
      const res = await axiosInstance.post(`/api/usuario/login`, { username, password });
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Error en login";
    }
  }
};
const seccionService = createApiService("seccion");
const gradoService = createApiService("grado");
const periodoService = createApiService("periodo");
const empleadoService = {
  ...createApiService("empleado"),
  obtenerDocentes: () => axiosInstance.get(`/api/empleado/all-docente`).then(r => r.data)
};
const cursoService = createApiService("curso");
const aulaService = createApiService("aula");
const examenService = {
  obtenerNotasporAlumno: (id) => axiosInstance.get(`/api/examen/notas-alum/${idAlumno}`).then(r => r.data)
}

export { examenService, aulaService, usuarioService, alumnoService, seccionService, gradoService, periodoService, empleadoService, cursoService };
