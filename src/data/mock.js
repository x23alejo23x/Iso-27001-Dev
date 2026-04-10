export const MOCK_DOMAINS = [
  "A.5 Políticas de seguridad de la información",
  "A.6 Organización de la seguridad de la información",
  "A.7 Seguridad de los recursos humanos",
  "A.8 Gestión de activos",
  "A.9 Control de acceso",
  "A.10 Criptografía",
  "A.11 Seguridad física y del entorno",
  "A.12 Seguridad de las operaciones",
  "A.13 Seguridad de las comunicaciones",
  "A.14 Adquisición, desarrollo y mantenimiento de sistemas",
  "A.15 Relaciones con los proveedores",
  "A.16 Gestión de incidentes de seguridad",
];

export const MOCK_CHECKLIST = [
  {
    id: "1",
    controlId: "A.5.1.1",
    title: "Políticas para la seguridad de la información",
    description:
      "Un conjunto de políticas para la seguridad de la información debe ser definido, aprobado por la dirección, publicado y comunicado a los empleados y partes externas relevantes.",
    status: "completed",
    domain: "A.5 Políticas de seguridad de la información",
    priority: "high",
    responsible: "Dirección",
    completedBy: "Ana García",
    completedAt: "12 oct 2024",
    evidence: ["Política_Seguridad_v2.pdf", "Acta_Aprobacion_Directiva.pdf"],
  },
  {
    id: "2",
    controlId: "A.5.1.2",
    title: "Revisión de las políticas para la seguridad de la información",
    description:
      "Las políticas para la seguridad de la información deben ser revisadas a intervalos planificados o si ocurren cambios significativos.",
    status: "in_progress",
    domain: "A.5 Políticas de seguridad de la información",
    priority: "medium",
    responsible: "Comité de Seguridad",
  },
  {
    id: "3",
    controlId: "A.6.1.1",
    title: "Roles y responsabilidades de seguridad de la información",
    description:
      "Todas las responsabilidades de seguridad de la información deben ser definidas y asignadas.",
    status: "completed",
    domain: "A.6 Organización de la seguridad de la información",
    priority: "high",
    responsible: "RRHH / TI",
    completedBy: "Carlos López",
    completedAt: "15 oct 2024",
    evidence: ["Matriz_Responsabilidades.xlsx"],
  },
  {
    id: "4",
    controlId: "A.6.1.2",
    title: "Segregación de tareas",
    description:
      "Las tareas y áreas de responsabilidad conflictivas deben ser segregadas para reducir las oportunidades de modificación no autorizada.",
    status: "not_started",
    domain: "A.6 Organización de la seguridad de la información",
    priority: "medium",
    responsible: "Operaciones",
  },
  {
    id: "5",
    controlId: "A.6.1.3",
    title: "Contacto con las autoridades",
    description:
      "Se deben mantener los contactos adecuados con las autoridades relevantes.",
    status: "completed",
    domain: "A.6 Organización de la seguridad de la información",
    priority: "low",
    responsible: "Dirección",
    completedBy: "Ana García",
    completedAt: "18 oct 2024",
  },
  {
    id: "6",
    controlId: "A.7.1.1",
    title: "Investigación de antecedentes",
    description:
      "Se deben llevar a cabo verificaciones de antecedentes sobre todos los candidatos a empleo.",
    status: "in_progress",
    domain: "A.7 Seguridad de los recursos humanos",
    priority: "high",
    responsible: "RRHH",
  },
  {
    id: "7",
    controlId: "A.7.1.2",
    title: "Términos y condiciones del empleo",
    description:
      "Los acuerdos contractuales con empleados deben declarar sus responsabilidades para la seguridad de la información.",
    status: "completed",
    domain: "A.7 Seguridad de los recursos humanos",
    priority: "high",
    responsible: "RRHH",
    completedBy: "María Rodríguez",
    completedAt: "22 oct 2024",
    evidence: ["Clausulas_Seguridad_Contratos.docx"],
  },
  {
    id: "8",
    controlId: "A.7.2.2",
    title: "Concienciación, educación y capacitación en seguridad",
    description:
      "Todos los empleados deben recibir educación y formación en concienciación apropiada.",
    status: "in_progress",
    domain: "A.7 Seguridad de los recursos humanos",
    priority: "high",
    responsible: "RRHH / TI",
  },
  {
    id: "9",
    controlId: "A.8.1.1",
    title: "Inventario de activos",
    description:
      "Se debe identificar los activos asociados con información y elaborar un inventario.",
    status: "completed",
    domain: "A.8 Gestión de activos",
    priority: "high",
    responsible: "TI",
    completedBy: "Ana García",
    completedAt: "20 oct 2024",
    evidence: ["Inventario_Activos_2024.xlsx"],
  },
  {
    id: "10",
    controlId: "A.8.1.2",
    title: "Propiedad de los activos",
    description:
      "Los activos mantenidos en el inventario deben tener un propietario asignado.",
    status: "completed",
    domain: "A.8 Gestión de activos",
    priority: "medium",
    responsible: "TI",
    completedBy: "Carlos López",
    completedAt: "21 oct 2024",
  },
  {
    id: "11",
    controlId: "A.8.2.1",
    title: "Clasificación de la información",
    description:
      "La información debe ser clasificada en términos de requisitos legales, valor, criticidad y sensibilidad.",
    status: "pending_update",
    domain: "A.8 Gestión de activos",
    priority: "high",
    responsible: "Dirección / TI",
  },
  {
    id: "12",
    controlId: "A.9.1.1",
    title: "Política de control de acceso",
    description:
      "Una política de control de acceso debe ser establecida, documentada y revisada.",
    status: "not_started",
    domain: "A.9 Control de acceso",
    priority: "high",
    responsible: "CISO",
  },
  {
    id: "13",
    controlId: "A.9.2.1",
    title: "Registro y baja de usuarios",
    description:
      "Se debe implementar un proceso formal de registro y baja de usuarios.",
    status: "not_started",
    domain: "A.9 Control de acceso",
    priority: "high",
    responsible: "TI",
  },
  {
    id: "14",
    controlId: "A.9.4.1",
    title: "Restricción de acceso a la información",
    description:
      "El acceso a la información debe ser restringido de acuerdo con la política de control de acceso.",
    status: "in_progress",
    domain: "A.9 Control de acceso",
    priority: "high",
    responsible: "TI",
  },
  {
    id: "15",
    controlId: "A.10.1.1",
    title: "Política sobre el uso de controles criptográficos",
    description:
      "Una política sobre el uso de controles criptográficos debe ser desarrollada e implementada.",
    status: "not_started",
    domain: "A.10 Criptografía",
    priority: "medium",
    responsible: "Arquitectura TI",
  },
  {
    id: "16",
    controlId: "A.11.1.1",
    title: "Perímetro de seguridad física",
    description:
      "Los perímetros de seguridad deben ser definidos para proteger áreas que contienen información sensible.",
    status: "completed",
    domain: "A.11 Seguridad física y del entorno",
    priority: "high",
    responsible: "Infraestructura",
    completedBy: "Carlos López",
    completedAt: "25 oct 2024",
    evidence: ["Planos_Seguridad_Oficinas.pdf", "Registro_Acceso_Fisico.xlsx"],
  },
  {
    id: "17",
    controlId: "A.12.1.1",
    title: "Procedimientos operacionales documentados",
    description:
      "Los procedimientos de operación deben ser documentados y disponibles para todos los usuarios que los necesiten.",
    status: "in_progress",
    domain: "A.12 Seguridad de las operaciones",
    priority: "medium",
    responsible: "TI / Operaciones",
  },
  {
    id: "18",
    controlId: "A.12.3.1",
    title: "Respaldo de la información",
    description:
      "Las copias de respaldo deben ser tomadas y probadas regularmente de acuerdo con la política de respaldo.",
    status: "completed",
    domain: "A.12 Seguridad de las operaciones",
    priority: "high",
    responsible: "TI",
    completedBy: "Carlos López",
    completedAt: "28 oct 2024",
    evidence: ["Politica_Backup.pdf", "Logs_Backup_Oct2024.txt"],
  },
];

export const MOCK_RADAR_DATA = [
  { subject: "A.5", fullDomain: "Políticas", A: 85, fullMark: 100 },
  { subject: "A.6", fullDomain: "Organización", A: 72, fullMark: 100 },
  { subject: "A.7", fullDomain: "RRHH", A: 60, fullMark: 100 },
  { subject: "A.8", fullDomain: "Activos", A: 78, fullMark: 100 },
  { subject: "A.9", fullDomain: "Acceso", A: 45, fullMark: 100 },
  { subject: "A.10", fullDomain: "Criptografía", A: 30, fullMark: 100 },
  { subject: "A.11", fullDomain: "Física", A: 90, fullMark: 100 },
  { subject: "A.12", fullDomain: "Operaciones", A: 65, fullMark: 100 },
];

export const MOCK_BAR_DATA = [
  { name: "Dirección", completed: 85, pending: 15 },
  { name: "TI", completed: 52, pending: 48 },
  { name: "RRHH", completed: 68, pending: 32 },
  { name: "Operaciones", completed: 35, pending: 65 },
  { name: "Finanzas", completed: 45, pending: 55 },
  { name: "Legal", completed: 60, pending: 40 },
];

export const MOCK_LINE_DATA = Array.from({ length: 30 }).map((_, i) => ({
  date: new Date(
    Date.now() - (29 - i) * 24 * 60 * 60 * 1000,
  ).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
  }),
  compliance: Math.min(100, Math.floor(42 + i * 1.2 + Math.sin(i * 0.5) * 3)),
  target: Math.min(100, Math.floor(40 + i * 1.5)),
}));

export const RECENT_ACTIVITY = [
  {
    action: "Control completado",
    item: "A.12.3.1 Respaldo de la información",
    user: "Carlos López",
    time: "Hace 2 horas",
    color: "bg-emerald-500",
  },
  {
    action: "Evidencia cargada",
    item: "A.8.1.1 Inventario de activos",
    user: "Ana García",
    time: "Hace 5 horas",
    color: "bg-blue-500",
  },
  {
    action: "Estado actualizado",
    item: "A.8.2.1 Clasificación de la información",
    user: "María Rodríguez",
    time: "Ayer",
    color: "bg-amber-500",
  },
  {
    action: "Control iniciado",
    item: "A.9.4.1 Restricción de acceso",
    user: "Carlos López",
    time: "Ayer",
    color: "bg-indigo-500",
  },
];
