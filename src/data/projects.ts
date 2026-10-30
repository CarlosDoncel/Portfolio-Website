import { asset } from '../utils/asset';
export type Bi = { es: string; en: string };

export interface Project {
  key: string;
  group: 'immersive' | 'software';
  index: string; // "01 / 02"
  title: string;
  type: Bi; // short label on card
  kicker: string;
  category: Bi;
  summary: Bi; // card
  description: Bi; // modal
  role: Bi;
  tags: string[];
  cardRole: Bi; // one-line role shown on the card
  cover: string;
  link: string;
  linkLabel: Bi;
  github?: string;
  facts: { label: Bi; value: Bi }[];
  flowTitle: Bi;
  flow: { title: Bi; desc: Bi }[];
  stack: string;
  contribution: Bi;
  gallery: { src: string; alt: string; caption: Bi }[];
  video: string;
  videoFormat: 'vertical' | 'horizontal'; // trailer orientation
}

const same = (s: string): Bi => ({ es: s, en: s });

export const projects: Project[] = [
  {
    key: 'alas',
    group: 'immersive',
    index: '01 / 02',
    title: 'Alas del Calabozo',
    type: { es: 'VIDEOJUEGO · GEOLOCALIZACIÓN', en: 'VIDEO GAME · GEOLOCATION' },
    kicker: '01 — SOFTWARE / GAMEPLAY / UX/UI',
    category: {
      es: 'VIDEOJUEGO · GEOLOCALIZACIÓN · EDUCACIÓN',
      en: 'VIDEO GAME · GEOLOCATION · EDUCATION',
    },
    summary: {
      es: 'Videojuego móvil que combina exploración del mundo real, geolocalización, aprendizaje y multijugador.',
      en: 'Mobile game combining real-world exploration, geolocation, learning, and multiplayer.',
    },
    description: {
      es: 'Videojuego educativo de exploración que convierte los recorridos por el mundo real en una misión: descubrir aves endémicas, enfrentar criaturas, recolectar pistas y compartir el reto con otros jugadores.',
      en: 'Educational exploration game that turns real-world movement into a mission: discover endemic birds, face creatures, collect clues, and share the challenge with other players.',
    },
    role: {
      es: 'Software Developer · Gameplay · Geolocalización · Multiplayer · UX/UI · QA y validación',
      en: 'Software Developer · Gameplay · Geolocation · Multiplayer · UX/UI · QA & validation',
    },
    tags: ['Unity 6', 'Firebase', 'Mapbox', 'Photon PUN 2'],
    cardRole: { es: 'Software · Gameplay · UX/UI', en: 'Software · Gameplay · UX/UI' },
    cover: asset('/imagenes/alas-portada.jpg'),
    link: 'https://ingenmultimedia.github.io/AlasdelCalabozo/index.html',
    linkLabel: { es: 'Visitar proyecto ↗', en: 'Visit project ↗' },
    facts: [
      { label: { es: 'MOTOR', en: 'ENGINE' }, value: same('Unity') },
      { label: { es: 'JUGADORES', en: 'PLAYERS' }, value: { es: 'Hasta 3', en: 'Up to 3' } },
      { label: { es: 'MAPA', en: 'MAP' }, value: same('Mapbox') },
      { label: { es: 'MULTIJUGADOR', en: 'MULTIPLAYER' }, value: same('Photon PUN 2') },
      { label: { es: 'DATOS', en: 'DATA' }, value: same('Firebase + SQLite') },
    ],
    flowTitle: { es: 'Explora → Enfrenta → Descubre', en: 'Explore → Face → Discover' },
    flow: [
      {
        title: { es: 'Explora', en: 'Explore' },
        desc: {
          es: 'Recorre el campus usando el mapa y encuentra puntos de interés.',
          en: 'Explore the campus using the map and find points of interest.',
        },
      },
      {
        title: { es: 'Enfrenta', en: 'Face' },
        desc: {
          es: 'Supera combates contra criaturas para avanzar en la misión.',
          en: 'Defeat creatures in combat to advance the mission.',
        },
      },
      {
        title: { es: 'Descubre', en: 'Discover' },
        desc: {
          es: 'Recolecta pistas y aprende sobre las aves representadas.',
          en: 'Collect clues and learn about the birds featured in the game.',
        },
      },
    ],
    stack: 'Unity · C# · Mapbox · Photon PUN 2 · Firebase · SQLite · PlayerPrefs',
    contribution: {
      es: 'Gameplay, lógica de exploración y combate, integración de geolocalización, sistemas multijugador y gestión de datos. Participé en QA: validación de funcionalidades, pruebas de errores y revisión de la experiencia antes de entregar.',
      en: 'Gameplay, exploration and combat logic, geolocation integration, multiplayer systems, and data management. I took part in QA: feature validation, error testing, and experience review before delivery.',
    },
    gallery: [
      { src: asset('/imagenes/alas-gameplay.jpg'), alt: 'Alas del Calabozo — gameplay', caption: { es: 'Criaturas y sistema de combate', en: 'Creatures and combat system' } },
      { src: asset('/imagenes/alas-mapa.jpg'), alt: 'Alas del Calabozo — mapa', caption: { es: 'Mapa y exploración del campus', en: 'Campus map and exploration' } },
      { src: asset('/imagenes/alas-aves.jpg'), alt: 'Alas del Calabozo — aves', caption: { es: 'Aves, pistas y contenido educativo', en: 'Birds, clues, and educational content' } },
      { src: asset('/imagenes/alas-portada.jpg'), alt: 'Alas del Calabozo — portada', caption: { es: 'Identidad visual del proyecto', en: 'Project visual identity' } },
    ],
    video: asset('/imagenes/alas-trailer.mp4'),
    videoFormat: 'vertical',
  },
  {
    key: 'ojos',
    group: 'immersive',
    index: '02 / 02',
    title: 'Los Ojos del Planeta',
    type: { es: 'REALIDAD VIRTUAL · META QUEST', en: 'VIRTUAL REALITY · META QUEST' },
    kicker: '02 — VR / INTERACTION / NARRATIVE',
    category: {
      es: 'REALIDAD VIRTUAL · META QUEST · EDUCACIÓN',
      en: 'VIRTUAL REALITY · META QUEST · EDUCATION',
    },
    summary: {
      es: 'Experiencia inmersiva de realidad virtual que convierte al usuario en una abeja para explorar, desde primera persona, los desafíos ambientales que amenazan a los polinizadores.',
      en: 'Immersive virtual reality experience that turns the user into a bee to explore, firsthand, the environmental challenges threatening pollinators.',
    },
    description: {
      es: 'Experiencia inmersiva de realidad virtual donde el usuario se convierte en una abeja y vive en primera persona los desafíos ecológicos que enfrentan estos polinizadores esenciales.',
      en: 'Immersive virtual reality experience where the user becomes a bee and experiences firsthand the ecological challenges faced by these essential pollinators.',
    },
    role: {
      es: 'VR Developer · Diseño de interacción · UX/UI · Optimización VR · QA y validación',
      en: 'VR Developer · Interaction Design · UX/UI · VR Optimization · QA & validation',
    },
    tags: ['Meta Quest', 'Unity', 'C#', 'VR'],
    cardRole: { es: 'VR · Interacción · UX/UI', en: 'VR · Interaction · UX/UI' },
    cover: asset('/imagenes/ojos-portada.jpg'),
    link: 'https://www.behance.net/gallery/230275761/Los-ojos-del-planeta',
    linkLabel: { es: 'Visitar proyecto ↗', en: 'Visit project ↗' },
    facts: [
      { label: { es: 'MOTOR', en: 'ENGINE' }, value: same('Unity') },
      { label: { es: 'PLATAFORMA', en: 'PLATFORM' }, value: same('Meta Quest') },
      { label: { es: 'EQUIPO', en: 'TEAM' }, value: { es: '3 personas', en: '3 people' } },
      { label: { es: 'ENFOQUE', en: 'FOCUS' }, value: { es: 'VR · interacción', en: 'VR · interaction' } },
      { label: { es: 'FORMATO', en: 'FORMAT' }, value: { es: 'Experiencia educativa', en: 'Educational experience' } },
    ],
    flowTitle: { es: 'Vuela → Interactúa → Aprende', en: 'Fly → Interact → Learn' },
    flow: [
      {
        title: { es: 'Vuela', en: 'Fly' },
        desc: {
          es: 'Explora el entorno desde la escala de una abeja y recorre la ruta de la experiencia.',
          en: 'Explore the environment at a bee’s scale and follow the experience route.',
        },
      },
      {
        title: { es: 'Interactúa', en: 'Interact' },
        desc: {
          es: 'Usa movimientos del torso y gestos de aleteo para experimentar el vuelo en VR.',
          en: 'Use torso movement and flapping gestures to experience flight in VR.',
        },
      },
      {
        title: { es: 'Aprende', en: 'Learn' },
        desc: {
          es: 'Percibe cambios visuales y sonoros que representan las amenazas ecológicas.',
          en: 'Perceive visual and sound changes that represent ecological threats.',
        },
      },
    ],
    stack: 'Unity · C# · Meta Quest · VR',
    contribution: {
      es: 'Movimiento del jugador, interacciones inmersivas, UX/UI, optimización para VR y aportes a la narrativa dentro de un equipo de tres personas. Participé en QA: validación de interacciones y pruebas de errores en VR.',
      en: 'Player movement, immersive interactions, UX/UI, VR optimization, and narrative contributions within a three-person team. I took part in QA: interaction validation and error testing in VR.',
    },
    gallery: [
      { src: asset('/imagenes/ojos-experiencia.jpg'), alt: 'Los Ojos del Planeta — experiencia', caption: { es: 'Conciencia ambiental desde la perspectiva de una abeja', en: 'Environmental awareness from a bee’s perspective' } },
      { src: asset('/imagenes/ojos-vr.jpg'), alt: 'Los Ojos del Planeta — mundo', caption: { es: 'Mundo diseñado para explorar y vivir la naturaleza', en: 'A world designed to explore and experience nature' } },
      { src: asset('/imagenes/ojos-detalle.jpg'), alt: 'Los Ojos del Planeta — interacción', caption: { es: 'Vuelo e interacción inmersiva', en: 'Immersive flight and interaction' } },
      { src: asset('/imagenes/ojos-portada.jpg'), alt: 'Los Ojos del Planeta — portada', caption: { es: 'Identidad visual del proyecto', en: 'Project visual identity' } },
    ],
    video: asset('/imagenes/ojos-trailer.mp4'),
    videoFormat: 'vertical',
  },
  {
    key: 'flowdesk',
    group: 'software',
    index: '01 / 02',
    title: 'FlowDesk',
    type: { es: 'SOFTWARE FULL-STACK · QA', en: 'FULL-STACK SOFTWARE · QA' },
    kicker: '03 — FULL-STACK / PROJECT MANAGEMENT / QA',
    category: {
      es: 'DESARROLLO DE SOFTWARE · FULL-STACK · QA',
      en: 'SOFTWARE DEVELOPMENT · FULL-STACK · QA',
    },
    summary: {
      es: 'Plataforma full-stack para equipos pequeños que centraliza tareas, bugs, casos de prueba y métricas de calidad en un solo lugar.',
      en: 'Full-stack platform for small teams that centralizes tasks, bugs, test cases, and quality metrics in one place.',
    },
    description: {
      es: 'Plataforma full-stack de gestión de proyectos y QA que centraliza tareas, bugs, casos de prueba y métricas de calidad para equipos pequeños de desarrollo.',
      en: 'Full-stack project and QA management platform that centralizes tasks, bugs, test cases, and quality metrics for small development teams.',
    },
    role: same('Full-Stack Developer · Backend · Frontend · QA · DevOps'),
    tags: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'CI/CD', 'QA'],
    cardRole: { es: 'Full-Stack · QA · DevOps', en: 'Full-Stack · QA · DevOps' },
    cover: asset('/imagenes/flowdesk-portada.jpg'),
    link: 'https://flow-desk-ochre.vercel.app',
    linkLabel: { es: 'Visitar proyecto ↗', en: 'Visit project ↗' },
    github: 'https://github.com/CarlosDoncel/FlowDesk',
    facts: [
      { label: same('FRONTEND'), value: same('React + TypeScript') },
      { label: same('BACKEND'), value: same('FastAPI') },
      { label: { es: 'BASE DE DATOS', en: 'DATABASE' }, value: same('PostgreSQL') },
      { label: same('TESTS'), value: { es: '54 automatizados', en: '54 automated' } },
      { label: same('DEPLOY'), value: same('Vercel + Render') },
    ],
    flowTitle: { es: 'Planifica → Desarrolla → Verifica', en: 'Plan → Develop → Verify' },
    flow: [
      {
        title: { es: 'Planifica', en: 'Plan' },
        desc: {
          es: 'Organiza proyectos, miembros, tareas y responsabilidades desde un solo espacio.',
          en: 'Organize projects, members, tasks, and responsibilities from one workspace.',
        },
      },
      {
        title: { es: 'Desarrolla', en: 'Develop' },
        desc: {
          es: 'Gestiona el trabajo con Kanban, seguimiento de bugs y estados claros de desarrollo.',
          en: 'Manage work through Kanban, bug tracking, and clear development states.',
        },
      },
      {
        title: { es: 'Verifica', en: 'Verify' },
        desc: {
          es: 'Ejecuta casos de prueba, revisa resultados y usa métricas para evaluar la salud del proyecto.',
          en: 'Run test cases, review results, and use metrics to evaluate project health.',
        },
      },
    ],
    stack: 'React 18 · TypeScript · FastAPI · Python · PostgreSQL · SQLAlchemy · React Query · Tailwind CSS',
    contribution: {
      es: 'Arquitectura full-stack, autenticación JWT, RBAC, gestión de proyectos, bug tracking, Testing Center, analytics, Project Health, notificaciones y automatización de pruebas/CI. Incluye validación funcional y pruebas de errores del propio producto.',
      en: 'Full-stack architecture, JWT authentication, RBAC, project management, bug tracking, Testing Center, analytics, Project Health, notifications, and automated testing/CI. Includes functional validation and error testing of the product itself.',
    },
    gallery: [
      { src: asset('/imagenes/flowdesk-dashboard.jpg'), alt: 'FlowDesk — dashboard', caption: { es: 'Dashboard y visión general del proyecto', en: 'Project dashboard and overview' } },
      { src: asset('/imagenes/flowdesk-qa.jpg'), alt: 'FlowDesk — QA', caption: { es: 'Gestión de bugs y casos de prueba', en: 'Bug tracking and test case management' } },
      { src: asset('/imagenes/flowdesk-analytics.jpg'), alt: 'FlowDesk — analytics', caption: { es: 'Métricas de calidad y Project Health', en: 'Quality metrics and Project Health' } },
      { src: asset('/imagenes/flowdesk-portada.jpg'), alt: 'FlowDesk — portada', caption: { es: 'Identidad visual de la plataforma', en: 'Platform visual identity' } },
    ],
    video: asset('/imagenes/flowdesk-trailer.mp4'),
    videoFormat: 'horizontal',
  },
  {
    key: 'gymtrack',
    group: 'software',
    index: '02 / 02',
    title: 'GymTrack',
    type: { es: 'FULL-STACK · MOBILE · FITNESS', en: 'FULL-STACK · MOBILE · FITNESS' },
    kicker: '04 — MOBILE / BACKEND / FULL-STACK',
    category: {
      es: 'DESARROLLO DE SOFTWARE · FULL-STACK · MOBILE',
      en: 'SOFTWARE DEVELOPMENT · FULL-STACK · MOBILE',
    },
    summary: {
      es: 'Aplicación móvil de fitness full-stack para gestionar entrenamientos, progreso, rutinas y objetivos con backend propio y base de datos real.',
      en: 'Full-stack fitness mobile application for managing workouts, progress, routines, and goals with its own backend and real database.',
    },
    description: {
      es: 'Aplicación móvil de fitness full-stack para gestionar entrenamientos, progreso, rutinas y objetivos, con backend propio, base de datos real y una app móvil nativa.',
      en: 'Full-stack fitness mobile application for managing workouts, progress, routines, and goals with its own backend and real database.',
    },
    role: same('Full-Stack Developer · Mobile · Backend · Database · DevOps · QA'),
    tags: ['React Native', 'Expo', 'FastAPI', 'PostgreSQL', 'TypeScript', 'JWT'],
    cardRole: { es: 'Full-Stack · Mobile · Backend', en: 'Full-Stack · Mobile · Backend' },
    cover: asset('/imagenes/gymtrack-portada.jpg'),
    link: 'https://github.com/CarlosDoncel/GymTrack',
    linkLabel: { es: 'Descargar APK ↗', en: 'Download APK ↗' },
    facts: [
      { label: { es: 'MÓVIL', en: 'MOBILE' }, value: same('React Native + Expo') },
      { label: same('BACKEND'), value: same('Python + FastAPI') },
      { label: { es: 'BASE DE DATOS', en: 'DATABASE' }, value: same('PostgreSQL + Neon') },
      { label: { es: 'AUTENTICACIÓN', en: 'AUTHENTICATION' }, value: same('JWT + bcrypt') },
      { label: same('DEPLOY'), value: same('Render + EAS Build') },
    ],
    flowTitle: { es: 'Planifica → Entrena → Progresa', en: 'Plan → Train → Progress' },
    flow: [
      {
        title: { es: 'Planifica', en: 'Plan' },
        desc: {
          es: 'Crea rutinas personalizadas, asigna ejercicios por día y utiliza plantillas populares como 5x5 y PPL.',
          en: 'Create custom routines, assign exercises by day, and use popular templates such as 5x5 and PPL.',
        },
      },
      {
        title: { es: 'Entrena', en: 'Train' },
        desc: {
          es: 'Registra sesiones en vivo con temporizador de descanso y almacenamiento preparado para conectividad limitada.',
          en: 'Log live workout sessions with a rest timer and storage designed to work with limited connectivity.',
        },
      },
      {
        title: { es: 'Progresa', en: 'Progress' },
        desc: {
          es: 'Consulta PRs, 1RM, volumen semanal, rachas e insignias mientras participas en funciones sociales y ranking.',
          en: 'Track PRs, 1RM, weekly volume, streaks, and badges while using social and leaderboard features.',
        },
      },
    ],
    stack: 'React Native · Expo · TypeScript · FastAPI · Python · PostgreSQL · SQLAlchemy · TanStack Query · Axios · Expo Router',
    contribution: {
      es: 'Desarrollo full-stack de la app móvil y backend, autenticación JWT, rutinas, ejercicios, sesiones de entrenamiento, progreso, gamificación, funciones sociales, nutrición, notificaciones y soporte offline-friendly. Participé en QA: validación de funcionalidades y pruebas de errores.',
      en: 'Full-stack development of the mobile app and backend, JWT authentication, routines, exercises, workout sessions, progress tracking, gamification, social features, nutrition, notifications, and offline-friendly support. I took part in QA: feature validation and error testing.',
    },
    gallery: [
      { src: asset('/imagenes/gymtrack-dashboard.jpg'), alt: 'GymTrack — dashboard', caption: { es: 'Dashboard y seguimiento del entrenamiento', en: 'Workout dashboard and tracking' } },
      { src: asset('/imagenes/gymtrack-workout.jpg'), alt: 'GymTrack — entrenamiento', caption: { es: 'Sesión de entrenamiento y temporizador de descanso', en: 'Workout session and rest timer' } },
      { src: asset('/imagenes/gymtrack-progress.jpg'), alt: 'GymTrack — progreso', caption: { es: 'PRs, 1RM y volumen de entrenamiento', en: 'PRs, 1RM, and training volume' } },
      { src: asset('/imagenes/gymtrack-social.jpg'), alt: 'GymTrack — social', caption: { es: 'Amigos, insignias y ranking', en: 'Friends, badges, and leaderboard' } },
    ],
    video: asset('/imagenes/gymtrack-trailer.mp4'),
    videoFormat: 'vertical',
  },
];

export const groups = [
  {
    key: 'immersive' as const,
    num: '01',
    title: { es: 'Videojuegos y VR', en: 'Games & VR' },
    note: { es: '2 proyectos', en: '2 projects' },
  },
  {
    key: 'software' as const,
    num: '02',
    title: { es: 'Software', en: 'Software' },
    note: { es: '2 proyectos', en: '2 projects' },
  },
];
