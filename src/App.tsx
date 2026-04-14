import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

type Pantalla =
  | "inicio"
  | "cargando"
  | "casa"
  | "menu"
  | "tienda"
  | "sumas"
  | "restas"
  | "multiplicaciones"
  | "lenguaje"
  | "cienciasMenu"
  | "cienciasEstados"
  | "cienciasMezclas"
  | "cienciasCuerpo"
  | "cienciasCiclo"
  | "cienciasAnimales"
  | "cienciasHabitat"
  | "cienciasReciclaje"
  | "jefeFinal"
  | "ranking"
  | "panel";

type Jugador = {
  nombre: string;
  avatar: string;
  rol: string;
};

type Ejercicio = {
  pregunta: string;
  opciones: number[];
  correcta: number;
  orden?: number[];
  estrellas?: 1 | 2 | 3;
  boss?: boolean;
  recompensaMonedas?: number;
  danoJefe?: number;
};

type ItemClasificar = {
  id: string;
  nombre: string;
  tipo: string;
};

type Progreso = {
  puntaje: number;
  nivel: string;
};

type ProgresoJuego = {
  monedas: number;
  inventario: string[];
  skinActiva: string;
  bonusDanio: number;
  medallas: string[];
  sonidoActivo: boolean;
  musicaActiva: boolean;
  vozActiva: boolean;
  volumenGeneral: number;
};

type TarjetaInfo = {
  emoji: string;
  titulo: string;
  texto: string;
};

type ItemTienda = {
  id: string;
  nombre: string;
  emoji: string;
  precio: number;
  tipo: "skin" | "poder";
  descripcion: string;
};

const estudiantes: Jugador[] = [
  { nombre: "DAVID", avatar: "🧙‍♂️", rol: "Mago Supremo" },
  { nombre: "SNAYDER", avatar: "🐯", rol: "Dragón de fuego" },
  { nombre: "EYNER", avatar: "🦅", rol: "Águila Pro" },
  { nombre: "JOSUE", avatar: "🐺", rol: "Lobo Estratega" },
  { nombre: "SAMANTHA", avatar: "🦋", rol: "Hada Creativa" },
  { nombre: "AIDA", avatar: "🌸", rol: "Guardiana Floral" },
  { nombre: "IAN", avatar: "⚡", rol: "Rayo Veloz" },
  { nombre: "MILENA", avatar: "🌙", rol: "Maga Lunar" },
  { nombre: "EYMI", avatar: "🔥", rol: "Reina Fénix" },
  { nombre: "VALENTINA", avatar: "👑", rol: "Princesa Valiente" },
  { nombre: "JORDAN", avatar: "📖", rol: "Lector Misterioso" },
  { nombre: "SOPHIA", avatar: "📚", rol: "Sabia Exploradora" },
  { nombre: "ANDERZON", avatar: "🛡️", rol: "Caballero Fuerte" },
  { nombre: "ANAHI", avatar: "🌼", rol: "Espíritu Alegre" },
  { nombre: "JANNI", avatar: "🎨", rol: "Artista Mágica" },
  { nombre: "DARWIN", avatar: "🧠", rol: "Genio Inventor" },
  { nombre: "SHEILA", avatar: "💎", rol: "Guardiana Brillante" },
];

const repasoCasa = [
  "Practica sumas y restas con números del 1 al 999.",
  "Repasa las tablas de multiplicar del 0 al 10.",
  "Escucha el dictado y escribe con buena letra.",
  "Reconoce los estados de la materia y las mezclas.",
  "Nombra huesos, partes del cuerpo y el ciclo de los seres vivos.",
  "Clasifica animales vertebrados e invertebrados.",
  "Clasifica animales por hábitat y residuos para reciclar.",
];

const frasesDictado = [
  "El viernes pasado visitamos la biblioteca del barrio.",
  "Había varios libros nuevos de aventuras y biografías.",
  "La bibliotecaria nos mostró cómo buscar un buen libro.",
  "Luego leímos el cuento de Blanca Nieves.",
  "Blanca llevaba un vestido azul.",
  "Vicente tenía un abrigo verde.",
  "Ambos viajaban en bicicleta por la avenida principal.",
  "La brisa movía sus cabellos mientras avanzaban.",
  "Aunque volvían cansados, estaban muy contentos.",
  "Al volver a casa, hablamos sobre lo que íbamos a leer después.",
  "El agua puede estar sólida, líquida o gaseosa.",
  "La sal se disuelve en agua y forma una mezcla soluble.",
  "La arena no se disuelve y forma una mezcla insoluble.",
  "Los huesos sostienen nuestro cuerpo y nos ayudan a movernos.",
  "La mariposa cumple un ciclo de vida antes de volar.",
  "El perro es vertebrado porque tiene huesos.",
  "La lombriz es invertebrada y vive en la tierra húmeda.",
  "Hoy resolvimos sumas y restas hasta el número novecientos noventa y nueve.",
];

const ejerciciosJefe: Ejercicio[] = [
  { pregunta: "9 × 8", opciones: [63, 72, 81], correcta: 72 },
  { pregunta: "845 - 219", opciones: [626, 636, 646], correcta: 626 },
  { pregunta: "478 + 321", opciones: [789, 799, 809], correcta: 799 },
  { pregunta: "10 × 10", opciones: [90, 100, 110], correcta: 100 },
  { pregunta: "999 - 111", opciones: [888, 878, 898], correcta: 888 },
];

const itemsHabitatIniciales: ItemClasificar[] = [
  { id: "pez", nombre: "🐟", tipo: "acuatico" },
  { id: "rana", nombre: "🐸", tipo: "acuatico" },
  { id: "arbol", nombre: "🌳", tipo: "terrestre" },
  { id: "perro", nombre: "🐶", tipo: "terrestre" },
  { id: "pajaro", nombre: "🐦", tipo: "aereo" },
  { id: "abeja", nombre: "🐝", tipo: "aereo" },
];

const itemsReciclajeIniciales: ItemClasificar[] = [
  { id: "papel", nombre: "📄", tipo: "papel" },
  { id: "periodico", nombre: "📰", tipo: "papel" },
  { id: "botella", nombre: "🧴", tipo: "plastico" },
  { id: "vaso", nombre: "🥤", tipo: "plastico" },
  { id: "cascara", nombre: "🍌", tipo: "organico" },
  { id: "manzana", nombre: "🍎", tipo: "organico" },
];

const estadosMateriaInfo: TarjetaInfo[] = [
  {
    emoji: "🧊",
    titulo: "Sólido",
    texto: "Tiene forma propia. Ejemplos: hielo, lápiz y mesa.",
  },
  {
    emoji: "💧",
    titulo: "Líquido",
    texto:
      "No tiene forma fija y toma la forma del recipiente. Ejemplos: agua y jugo.",
  },
  {
    emoji: "☁️",
    titulo: "Gaseoso",
    texto: "Se expande en el aire. Ejemplos: vapor y aire.",
  },
];

const mezclasInfo: TarjetaInfo[] = [
  {
    emoji: "🥛",
    titulo: "Mezcla soluble",
    texto:
      "Se mezcla y parece una sola sustancia. Ejemplos: agua con sal y agua con azúcar.",
  },
  {
    emoji: "🏖️",
    titulo: "Mezcla insoluble",
    texto:
      "No se mezcla por completo. Ejemplos: agua con arena y aceite con agua.",
  },
];

const cuerpoInfo: TarjetaInfo[] = [
  {
    emoji: "🦴",
    titulo: "Huesos",
    texto:
      "Algunos huesos importantes son el cráneo, la columna, las costillas, el fémur y la tibia.",
  },
  {
    emoji: "🧠",
    titulo: "Cabeza",
    texto: "En la cabeza tenemos ojos, nariz, boca, orejas y cabello.",
  },
  {
    emoji: "💪",
    titulo: "Tronco y extremidades",
    texto:
      "Tenemos cuello, hombros, brazos, manos, pecho, piernas, rodillas y pies.",
  },
];

const cicloVidaInfo: TarjetaInfo[] = [
  {
    emoji: "🥚",
    titulo: "Nacimiento",
    texto: "Los seres vivos nacen o germinan.",
  },
  {
    emoji: "🌱",
    titulo: "Crecimiento",
    texto: "Luego crecen y cambian con el tiempo.",
  },
  {
    emoji: "🐣",
    titulo: "Reproducción",
    texto: "Cuando son adultos pueden tener descendientes.",
  },
  {
    emoji: "🍂",
    titulo: "Fin del ciclo",
    texto: "Todo ser vivo cumple su ciclo de vida.",
  },
];

const animalesInfo: TarjetaInfo[] = [
  {
    emoji: "🐶",
    titulo: "Vertebrados",
    texto:
      "Tienen huesos y columna vertebral. Ejemplos: perro, pez, ave y rana.",
  },
  {
    emoji: "🪱",
    titulo: "Invertebrados",
    texto:
      "No tienen columna vertebral. Ejemplos: mariposa, araña, caracol y lombriz.",
  },
];

const rangosAvatar = [
  { minimo: 0, nombre: "Aprendiz", emoji: "🧒" },
  { minimo: 10, nombre: "Aventurero", emoji: "🗡️" },
  { minimo: 20, nombre: "Guerrero", emoji: "🛡️" },
  { minimo: 35, nombre: "Maestro", emoji: "⚔️" },
  { minimo: 50, nombre: "Leyenda", emoji: "👑" },
];

const itemsTienda: ItemTienda[] = [
  {
    id: "sombrero_mago",
    nombre: "Sombrero mágico",
    emoji: "🎩",
    precio: 20,
    tipo: "skin",
    descripcion: "Da un estilo mágico a tu héroe.",
  },
  {
    id: "espada_luz",
    nombre: "Espada de luz",
    emoji: "⚔️",
    precio: 35,
    tipo: "skin",
    descripcion: "Tu avatar se ve más poderoso.",
  },
  {
    id: "corona_real",
    nombre: "Corona real",
    emoji: "👑",
    precio: 50,
    tipo: "skin",
    descripcion: "Aspecto de campeón.",
  },
  {
    id: "golpe_extra",
    nombre: "Golpe extra",
    emoji: "💥",
    precio: 30,
    tipo: "poder",
    descripcion: "Aumenta el daño al jefe en +10.",
  },
  {
    id: "escudo",
    nombre: "Escudo protector",
    emoji: "🛡️",
    precio: 25,
    tipo: "poder",
    descripcion: "Premio visual para tu héroe.",
  },
];

const sumasProgresivas = {
  Facil: [
    [14, 6, 25],
    [31, 8, 12],
    [45, 10, 23],
    [70, 9, 16],
    [54, 11, 33],
    [88, 4, 21],
    [63, 15, 20],
  ],
  Medio: [
    [245, 78, 503],
    [321, 654, 87],
    [432, 210, 678],
    [540, 76, 812],
    [205, 905, 67],
    [456, 789, 123],
    [890, 45, 234],
  ],
  Dificil: [
    [999, 12, 450],
    [720, 18, 905],
    [678, 901, 56],
    [345, 567, 789],
    [120, 340, 980],
    [999, 888, 77],
    [610, 305, 920],
  ],
};

const claveProgresoJuego = (nombre: string) => `progreso-juego-${nombre}`;

const leerProgreso = (nombre: string): Progreso => {
  if (typeof window === "undefined") return { puntaje: 0, nivel: "Fácil" };
  const data = window.localStorage.getItem(nombre);
  if (!data) return { puntaje: 0, nivel: "Fácil" };
  try {
    const parsed = JSON.parse(data) as Progreso;
    return {
      puntaje: parsed.puntaje ?? 0,
      nivel: parsed.nivel ?? "Fácil",
    };
  } catch {
    return { puntaje: 0, nivel: "Fácil" };
  }
};

const guardarProgreso = (nombre: string, puntaje: number, nivel: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(nombre, JSON.stringify({ puntaje, nivel }));
};

const leerProgresoJuego = (nombre: string): ProgresoJuego => {
  const base: ProgresoJuego = {
    monedas: 0,
    inventario: [],
    skinActiva: "",
    bonusDanio: 0,
    medallas: [],
    sonidoActivo: true,
    musicaActiva: true,
    vozActiva: false,
    volumenGeneral: 0.18,
  };

  if (typeof window === "undefined") return base;
  const guardado = window.localStorage.getItem(claveProgresoJuego(nombre));
  if (!guardado) return base;

  try {
    const data = JSON.parse(guardado);
    return {
      monedas: typeof data.monedas === "number" ? data.monedas : 0,
      inventario: Array.isArray(data.inventario) ? data.inventario : [],
      skinActiva: typeof data.skinActiva === "string" ? data.skinActiva : "",
      bonusDanio: typeof data.bonusDanio === "number" ? data.bonusDanio : 0,
      medallas: Array.isArray(data.medallas) ? data.medallas : [],
      sonidoActivo:
        typeof data.sonidoActivo === "boolean" ? data.sonidoActivo : true,
      musicaActiva:
        typeof data.musicaActiva === "boolean" ? data.musicaActiva : true,
      vozActiva: typeof data.vozActiva === "boolean" ? data.vozActiva : false,
      volumenGeneral:
        typeof data.volumenGeneral === "number" ? data.volumenGeneral : 0.18,
    };
  } catch {
    return base;
  }
};

const guardarProgresoJuego = (nombre: string, progreso: ProgresoJuego) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    claveProgresoJuego(nombre),
    JSON.stringify(progreso)
  );
};

const nivelPorPuntaje = (p: number) => {
  if (p >= 20) return "Difícil";
  if (p >= 10) return "Medio";
  return "Fácil";
};

const obtenerRangoAvatar = (puntaje: number) =>
  [...rangosAvatar].reverse().find((r) => puntaje >= r.minimo) ??
  rangosAvatar[0];

const mezclar = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

const crearOpciones = (correcta: number, min: number, max: number) => {
  const valores = new Set<number>([correcta]);
  const rangoMin = Math.max(min, correcta - 120);
  const rangoMax = Math.min(max, correcta + 120);

  while (valores.size < 3) {
    const candidato =
      Math.floor(Math.random() * (rangoMax - rangoMin + 1)) + rangoMin;
    if (candidato !== correcta) valores.add(candidato);
  }

  return Array.from(valores).sort(() => Math.random() - 0.5);
};

const crearOpcionesCercanas = (correcta: number) => {
  const valores = new Set<number>([correcta]);

  while (valores.size < 3) {
    const variacion = Math.floor(Math.random() * 40) + 10;
    const signo = Math.random() > 0.5 ? 1 : -1;
    const candidata = correcta + variacion * signo;
    if (candidata >= 0) valores.add(candidata);
  }

  return mezclar(Array.from(valores));
};

const generarEjerciciosSumas = (nivel: string): Ejercicio[] => {
  const base =
    nivel === "Fácil"
      ? sumasProgresivas.Facil
      : nivel === "Medio"
      ? sumasProgresivas.Medio
      : sumasProgresivas.Dificil;

  const misiones = base.map((nums, i) => {
    const desordenados = mezclar(nums);
    const orden = [...nums].sort((a, b) => b - a);
    const correcta = nums.reduce((acc, n) => acc + n, 0);

    return {
      pregunta: `${desordenados.join(" + ")} = ?`,
      orden,
      correcta,
      opciones: crearOpcionesCercanas(correcta),
      estrellas: i < 2 ? 1 : i < 5 ? 2 : 3,
      boss: false,
      recompensaMonedas: i < 2 ? 5 : i < 5 ? 8 : 12,
      danoJefe: i < 2 ? 10 : i < 5 ? 15 : 20,
    };
  });

  const bossNums =
    nivel === "Fácil"
      ? [95, 47, 18]
      : nivel === "Medio"
      ? [845, 129, 76]
      : [999, 650, 248];

  return [
    ...misiones,
    {
      pregunta: `${mezclar(bossNums).join(" + ")} = ?`,
      orden: [...bossNums].sort((a, b) => b - a),
      correcta: bossNums.reduce((acc, n) => acc + n, 0),
      opciones: crearOpcionesCercanas(bossNums.reduce((acc, n) => acc + n, 0)),
      estrellas: 3,
      boss: true,
      recompensaMonedas: 25,
      danoJefe: 35,
    },
  ];
};

const generarEjerciciosRestas = (nivel: string): Ejercicio[] => {
  const configuracion =
    nivel === "Fácil"
      ? { min: 1, max: 99, total: 10 }
      : nivel === "Medio"
      ? { min: 100, max: 499, total: 10 }
      : { min: 500, max: 999, total: 10 };

  return Array.from({ length: configuracion.total }, () => {
    const mayor =
      Math.floor(Math.random() * (configuracion.max - configuracion.min + 1)) +
      configuracion.min;
    const menor = Math.floor(Math.random() * mayor);
    const correcta = mayor - menor;
    return {
      pregunta: `${mayor} - ${menor}`,
      correcta,
      opciones: crearOpciones(correcta, 0, 999),
    };
  });
};

const generarEjerciciosMultiplicaciones = (nivel: string): Ejercicio[] => {
  const rango = nivel === "Fácil" ? 5 : nivel === "Medio" ? 8 : 10;

  return Array.from({ length: 12 }, () => {
    const a = Math.floor(Math.random() * (rango + 1));
    const b = Math.floor(Math.random() * (rango + 1));
    const correcta = a * b;
    return {
      pregunta: `${a} × ${b}`,
      correcta,
      opciones: crearOpciones(correcta, 0, 100),
    };
  });
};

export default function App() {
  const [pantalla, setPantalla] = useState<Pantalla>("inicio");
  const [jugador, setJugador] = useState<Jugador | null>(null);
  const [jugadorEntrando, setJugadorEntrando] = useState<Jugador | null>(null);

  const [puntaje, setPuntaje] = useState(0);
  const [nivel, setNivel] = useState("Fácil");
  const [indice, setIndice] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [bloqueado, setBloqueado] = useState(false);
  const [respondio, setRespondio] = useState(false);
  const [correctaActual, setCorrectaActual] = useState(false);

  const [habitatItems, setHabitatItems] = useState<ItemClasificar[]>(
    itemsHabitatIniciales
  );
  const [habitatCorrectos, setHabitatCorrectos] = useState(0);
  const [reciclajeItems, setReciclajeItems] = useState<ItemClasificar[]>(
    itemsReciclajeIniciales
  );
  const [reciclajeCorrectos, setReciclajeCorrectos] = useState(0);
  const [seleccionadoHabitat, setSeleccionadoHabitat] = useState<string | null>(
    null
  );
  const [seleccionadoReciclaje, setSeleccionadoReciclaje] = useState<
    string | null
  >(null);

  const [rankingAnimado, setRankingAnimado] = useState(false);

  const [monedas, setMonedas] = useState(0);
  const [vidasJefe, setVidasJefe] = useState(100);
  const [vidasJefeMax, setVidasJefeMax] = useState(100);
  const [erroresEnRonda, setErroresEnRonda] = useState(0);
  const [medallas, setMedallas] = useState<string[]>([]);
  const [rachaPerfecta, setRachaPerfecta] = useState(0);
  const [animarAtaque, setAnimarAtaque] = useState(false);
  const [golpeCritico, setGolpeCritico] = useState(false);
  const [inventario, setInventario] = useState<string[]>([]);
  const [skinActiva, setSkinActiva] = useState("");
  const [bonusDanio, setBonusDanio] = useState(0);

  const [textoCargaVisible, setTextoCargaVisible] = useState(false);
  const [destelloCarga, setDestelloCarga] = useState(false);
  const [progresoCarga, setProgresoCarga] = useState(0);

  const [sonidoActivo, setSonidoActivo] = useState(true);
  const [musicaActiva, setMusicaActiva] = useState(true);
  const [vozActiva, setVozActiva] = useState(false);
  const [volumenGeneral, setVolumenGeneral] = useState(0.18);

  const [ejerciciosSumas, setEjerciciosSumas] = useState<Ejercicio[]>([]);
  const [ejerciciosRestas, setEjerciciosRestas] = useState<Ejercicio[]>([]);
  const [ejerciciosMultiplicaciones, setEjerciciosMultiplicaciones] = useState<
    Ejercicio[]
  >([]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const musicaRef = useRef<{
    osc1: OscillatorNode;
    osc2: OscillatorNode;
    gain: GainNode;
  } | null>(null);

  const obtenerAvatarVisual = () => {
    const rango = obtenerRangoAvatar(puntaje);
    if (skinActiva === "sombrero_mago") return `${rango.emoji}🎩`;
    if (skinActiva === "espada_luz") return `${rango.emoji}⚔️`;
    if (skinActiva === "corona_real") return `${rango.emoji}👑`;
    return `${rango.emoji}`;
  };

  const obtenerAvatarVisualDeJugador = (
    jugadorBase: Jugador,
    puntajeJugador: number
  ) => {
    const rango = obtenerRangoAvatar(puntajeJugador);
    const progresoJuego = leerProgresoJuego(jugadorBase.nombre);
    const skin = progresoJuego.skinActiva;

    if (skin === "sombrero_mago") return `${rango.emoji}🎩`;
    if (skin === "espada_luz") return `${rango.emoji}⚔️`;
    if (skin === "corona_real") return `${rango.emoji}👑`;
    return `${rango.emoji}`;
  };

  const obtenerAudioCtx = () => {
    if (typeof window === "undefined") return null;
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return null;
    if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
    return audioCtxRef.current;
  };

  const hablar = (texto: string) => {
    if (!vozActiva) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = "es-ES";
    voz.rate = 0.96;
    voz.pitch = 1.05;
    voz.volume = Math.min(1, volumenGeneral * 2);
    window.speechSynthesis.speak(voz);
  };

  const tocarNota = ({
    frecuencia = 440,
    tipo = "triangle",
    inicio = 0,
    duracion = 0.2,
    volumen = 0.12,
    frecuenciaFinal,
  }: {
    frecuencia?: number;
    tipo?: OscillatorType;
    inicio?: number;
    duracion?: number;
    volumen?: number;
    frecuenciaFinal?: number;
  }) => {
    if (!sonidoActivo) return;
    const ctx = obtenerAudioCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = tipo;
    osc.frequency.setValueAtTime(frecuencia, ctx.currentTime + inicio);

    if (frecuenciaFinal) {
      osc.frequency.exponentialRampToValueAtTime(
        frecuenciaFinal,
        ctx.currentTime + inicio + duracion
      );
    }

    gain.gain.setValueAtTime(0.0001, ctx.currentTime + inicio);
    gain.gain.exponentialRampToValueAtTime(
      Math.max(0.0002, volumen * volumenGeneral),
      ctx.currentTime + inicio + 0.03
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + inicio + duracion
    );

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + inicio);
    osc.stop(ctx.currentTime + inicio + duracion);
  };

  const detenerMusicaFondo = () => {
    try {
      if (musicaRef.current) {
        musicaRef.current.osc1.stop();
        musicaRef.current.osc2.stop();
        musicaRef.current.gain.disconnect();
        musicaRef.current = null;
      }
    } catch {}
  };

  const iniciarMusicaFondo = () => {
    if (!musicaActiva || !sonidoActivo || musicaRef.current) return;
    const ctx = obtenerAudioCtx();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "triangle";
    osc1.frequency.setValueAtTime(196, ctx.currentTime);
    osc2.frequency.setValueAtTime(293.66, ctx.currentTime);
    gain.gain.setValueAtTime(0.02 * volumenGeneral, ctx.currentTime);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();

    musicaRef.current = { osc1, osc2, gain };
  };

  const sonidoEntrada = () => {
    tocarNota({
      frecuencia: 520,
      frecuenciaFinal: 820,
      tipo: "triangle",
      duracion: 0.22,
      volumen: 0.18,
    });
    tocarNota({
      frecuencia: 780,
      frecuenciaFinal: 1080,
      tipo: "sine",
      inicio: 0.08,
      duracion: 0.18,
      volumen: 0.11,
    });
  };

  const sonidoCorrecto = () => {
    tocarNota({
      frecuencia: 640,
      frecuenciaFinal: 820,
      tipo: "triangle",
      duracion: 0.16,
      volumen: 0.16,
    });
    tocarNota({
      frecuencia: 900,
      frecuenciaFinal: 1080,
      tipo: "triangle",
      inicio: 0.08,
      duracion: 0.2,
      volumen: 0.12,
    });
  };

  const sonidoError = () => {
    tocarNota({
      frecuencia: 320,
      frecuenciaFinal: 180,
      tipo: "sawtooth",
      duracion: 0.26,
      volumen: 0.16,
    });
  };

  const sonidoMoneda = () => {
    tocarNota({
      frecuencia: 880,
      tipo: "square",
      duracion: 0.12,
      volumen: 0.11,
    });
    tocarNota({
      frecuencia: 1180,
      tipo: "square",
      inicio: 0.08,
      duracion: 0.14,
      volumen: 0.09,
    });
  };

  const sonidoCritico = () => {
    tocarNota({
      frecuencia: 420,
      frecuenciaFinal: 1300,
      tipo: "square",
      duracion: 0.24,
      volumen: 0.18,
    });
    tocarNota({
      frecuencia: 900,
      frecuenciaFinal: 1600,
      tipo: "triangle",
      inicio: 0.03,
      duracion: 0.2,
      volumen: 0.12,
    });
  };

  const sonidoNivel = () => {
    tocarNota({
      frecuencia: 520,
      tipo: "triangle",
      duracion: 0.14,
      volumen: 0.13,
    });
    tocarNota({
      frecuencia: 720,
      tipo: "triangle",
      inicio: 0.1,
      duracion: 0.16,
      volumen: 0.13,
    });
    tocarNota({
      frecuencia: 980,
      tipo: "triangle",
      inicio: 0.2,
      duracion: 0.22,
      volumen: 0.13,
    });
  };

  const sonidoVictoria = () => {
    tocarNota({
      frecuencia: 620,
      tipo: "triangle",
      duracion: 0.18,
      volumen: 0.14,
    });
    tocarNota({
      frecuencia: 820,
      tipo: "triangle",
      inicio: 0.12,
      duracion: 0.2,
      volumen: 0.14,
    });
    tocarNota({
      frecuencia: 1020,
      tipo: "triangle",
      inicio: 0.24,
      duracion: 0.22,
      volumen: 0.14,
    });
    tocarNota({
      frecuencia: 1320,
      tipo: "triangle",
      inicio: 0.36,
      duracion: 0.32,
      volumen: 0.14,
    });
  };

  const sonidoBoton = () => {
    tocarNota({
      frecuencia: 500,
      frecuenciaFinal: 620,
      tipo: "sine",
      duracion: 0.08,
      volumen: 0.07,
    });
  };

  const sonidoJefeDerrotado = () => {
    tocarNota({
      frecuencia: 300,
      frecuenciaFinal: 180,
      tipo: "sawtooth",
      duracion: 0.22,
      volumen: 0.12,
    });
    tocarNota({
      frecuencia: 500,
      frecuenciaFinal: 900,
      tipo: "triangle",
      inicio: 0.18,
      duracion: 0.32,
      volumen: 0.15,
    });
  };

  const sonidoCompra = () => {
    tocarNota({
      frecuencia: 700,
      tipo: "square",
      duracion: 0.08,
      volumen: 0.09,
    });
    tocarNota({
      frecuencia: 980,
      tipo: "square",
      inicio: 0.07,
      duracion: 0.1,
      volumen: 0.09,
    });
    tocarNota({
      frecuencia: 1280,
      tipo: "triangle",
      inicio: 0.14,
      duracion: 0.12,
      volumen: 0.08,
    });
  };

  useEffect(() => {
    setEjerciciosSumas(generarEjerciciosSumas(nivel));
    setEjerciciosRestas(generarEjerciciosRestas(nivel));
    setEjerciciosMultiplicaciones(generarEjerciciosMultiplicaciones(nivel));
  }, [nivel]);

  useEffect(() => {
    if (!jugador) return;
    guardarProgresoJuego(jugador.nombre, {
      monedas,
      inventario,
      skinActiva,
      bonusDanio,
      medallas,
      sonidoActivo,
      musicaActiva,
      vozActiva,
      volumenGeneral,
    });
  }, [
    jugador,
    monedas,
    inventario,
    skinActiva,
    bonusDanio,
    medallas,
    sonidoActivo,
    musicaActiva,
    vozActiva,
    volumenGeneral,
  ]);

  useEffect(() => {
    if (monedas >= 100 && !medallas.includes("🪙 Cazador de monedas")) {
      setMedallas((prev) => [...prev, "🪙 Cazador de monedas"]);
    }
  }, [monedas, medallas]);

  useEffect(() => {
    const pantallasConMusica = ["inicio", "menu", "tienda", "ranking", "panel"];
    if (pantallasConMusica.includes(pantalla) && musicaActiva && sonidoActivo) {
      iniciarMusicaFondo();
    } else {
      detenerMusicaFondo();
    }

    return () => {
      if (!pantallasConMusica.includes(pantalla)) detenerMusicaFondo();
    };
  }, [pantalla, musicaActiva, sonidoActivo, volumenGeneral]);

  useEffect(() => {
    if (!sonidoActivo) {
      detenerMusicaFondo();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [sonidoActivo]);

  const ejerciciosActuales = useMemo(() => {
    if (pantalla === "sumas") return ejerciciosSumas;
    if (pantalla === "restas") return ejerciciosRestas;
    if (pantalla === "multiplicaciones") return ejerciciosMultiplicaciones;
    if (pantalla === "jefeFinal") return ejerciciosJefe;
    return [] as Ejercicio[];
  }, [pantalla, ejerciciosSumas, ejerciciosRestas, ejerciciosMultiplicaciones]);

  const rankingOrdenado = useMemo(() => {
    return estudiantes
      .map((e) => {
        const progreso = leerProgreso(e.nombre);
        const progresoJuego = leerProgresoJuego(e.nombre);
        const rango = obtenerRangoAvatar(progreso.puntaje);

        return {
          nombre: e.nombre,
          rol: e.rol,
          puntaje: progreso.puntaje,
          nivel: progreso.nivel,
          rango: rango.nombre,
          avatarVisual: obtenerAvatarVisualDeJugador(e, progreso.puntaje),
          monedas: progresoJuego.monedas,
          medallas: progresoJuego.medallas,
          inventario: progresoJuego.inventario,
          skinActiva: progresoJuego.skinActiva,
          bonusDanio: progresoJuego.bonusDanio,
        };
      })
      .sort((a, b) => {
        if (b.puntaje !== a.puntaje) return b.puntaje - a.puntaje;
        if (b.monedas !== a.monedas) return b.monedas - a.monedas;
        return b.medallas.length - a.medallas.length;
      });
  }, [puntaje, pantalla, monedas, medallas, inventario, skinActiva]);

  const tarjeta: CSSProperties = {
    background: "white",
    borderRadius: 24,
    padding: 20,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    maxWidth: 980,
    width: "100%",
  };

  const boton: CSSProperties = {
    padding: "12px 18px",
    borderRadius: 16,
    border: "none",
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
    margin: 6,
  };

  const zonaTouch = (color: string): CSSProperties => ({
    border: `3px dashed ${color}`,
    borderRadius: 18,
    padding: 18,
    minHeight: 110,
    flex: 1,
    fontSize: 22,
    fontWeight: 700,
    background: "#fff",
  });

  const tarjetaInfo: CSSProperties = {
    background: "#ffffff",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  };

  const contenedorPantalla: CSSProperties = {
    minHeight: "100vh",
    padding: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const limpiarQuiz = () => {
    setIndice(0);
    setMensaje("");
    setRespondio(false);
    setCorrectaActual(false);
    setBloqueado(false);
    setErroresEnRonda(0);
    setRachaPerfecta(0);
    setVidasJefe(100);
    setVidasJefeMax(100);
    setAnimarAtaque(false);
    setGolpeCritico(false);
  };

  const irAInicio = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setMensaje("");
    setPantalla("inicio");
    setRankingAnimado(false);
  };

  const cargarJugador = (e: Jugador) => {
    setJugador(e);

    const progreso = leerProgreso(e.nombre);
    setPuntaje(progreso.puntaje);
    setNivel(progreso.nivel);

    const progresoJuego = leerProgresoJuego(e.nombre);
    setMonedas(progresoJuego.monedas);
    setInventario(progresoJuego.inventario);
    setSkinActiva(progresoJuego.skinActiva);
    setBonusDanio(progresoJuego.bonusDanio);
    setMedallas(progresoJuego.medallas);
    setSonidoActivo(progresoJuego.sonidoActivo);
    setMusicaActiva(progresoJuego.musicaActiva);
    setVozActiva(progresoJuego.vozActiva);
    setVolumenGeneral(progresoJuego.volumenGeneral);
  };

  const entrarConAnimacion = (e: Jugador) => {
    setJugadorEntrando(e);
    cargarJugador(e);
    setPantalla("cargando");
    setTextoCargaVisible(false);
    setDestelloCarga(false);
    setProgresoCarga(0);

    setTimeout(() => {
      setTextoCargaVisible(true);
      setDestelloCarga(true);
      setProgresoCarga(28);
      sonidoEntrada();
    }, 120);

    setTimeout(() => setProgresoCarga(56), 500);
    setTimeout(() => setProgresoCarga(82), 980);
    setTimeout(() => setProgresoCarga(100), 1450);

    setTimeout(() => {
      setPantalla("menu");
      setTextoCargaVisible(false);
      setDestelloCarga(false);
      setProgresoCarga(0);
      setJugadorEntrando(null);
    }, 1950);
  };

  const sumarPunto = () => {
    const nuevo = puntaje + 1;
    const nuevoNivel = nivelPorPuntaje(nuevo);

    setPuntaje(nuevo);
    setNivel(nuevoNivel);

    if (jugador) guardarProgreso(jugador.nombre, nuevo, nuevoNivel);

    if (nuevoNivel !== nivel) {
      sonidoNivel();
      hablar("Subiste de nivel");
    }
  };

  const ganarMonedas = (cantidad: number) =>
    setMonedas((prev) => prev + cantidad);

  const registrarMedalla = (nombre: string) => {
    setMedallas((prev) => (prev.includes(nombre) ? prev : [...prev, nombre]));
  };

  const activarAnimacionAtaque = (critico = false) => {
    setGolpeCritico(critico);
    setAnimarAtaque(true);
    setTimeout(() => {
      setAnimarAtaque(false);
      setGolpeCritico(false);
    }, 650);
  };

  const comprarItem = (itemId: string) => {
    const item = itemsTienda.find((x) => x.id === itemId);
    if (!item) return;

    if (inventario.includes(item.id)) {
      setMensaje("✅ Ya compraste ese objeto.");
      return;
    }

    if (monedas < item.precio) {
      setMensaje("❌ No tienes suficientes monedas.");
      return;
    }

    setMonedas((prev) => prev - item.precio);
    setInventario((prev) => [...prev, item.id]);
    setMensaje(`🛍️ Compraste ${item.nombre}`);
    sonidoCompra();
    hablar("Compra realizada");

    if (item.tipo === "skin") setSkinActiva(item.id);
    if (item.id === "golpe_extra") setBonusDanio(10);
  };

  const equiparSkin = (itemId: string) => {
    if (!inventario.includes(itemId)) return;
    setSkinActiva(itemId);
    setMensaje("✨ Skin equipada");
  };

  const reiniciarQuiz = (tema: "sumas" | "restas" | "multiplicaciones") => {
    limpiarQuiz();

    if (tema === "sumas") {
      setVidasJefe(100);
      setVidasJefeMax(100);
      setErroresEnRonda(0);
      setRachaPerfecta(0);
      setEjerciciosSumas(generarEjerciciosSumas(nivel));
    }

    if (tema === "restas") setEjerciciosRestas(generarEjerciciosRestas(nivel));
    if (tema === "multiplicaciones") {
      setEjerciciosMultiplicaciones(generarEjerciciosMultiplicaciones(nivel));
    }

    setPantalla(tema);
  };

  const verificarRespuesta = (opcion: number) => {
    if (bloqueado) return;
    const ejercicio = ejerciciosActuales[indice];
    if (!ejercicio) return;

    const esCorrecta = opcion === ejercicio.correcta;

    setBloqueado(true);
    setRespondio(true);
    setCorrectaActual(esCorrecta);

    if (esCorrecta) {
      sumarPunto();
      sonidoCorrecto();
      sonidoMoneda();
      hablar("Correcto");

      const recompensa = ejercicio.recompensaMonedas ?? 3;
      ganarMonedas(recompensa);

      if (pantalla === "sumas") {
        const baseDanio = ejercicio.danoJefe ?? 10;
        const critico = Math.random() < 0.25;
        const totalDanio = baseDanio + bonusDanio + (critico ? 10 : 0);

        setVidasJefe((prev) => Math.max(0, prev - totalDanio));
        activarAnimacionAtaque(critico);

        if (critico) sonidoCritico();

        setMensaje(
          critico
            ? `💥 ¡Golpe crítico! +${recompensa} monedas y ${totalDanio} de daño`
            : `⚔️ Ataque exitoso. +${recompensa} monedas y ${totalDanio} de daño`
        );
      } else {
        setMensaje(`✅ Correcto. +${recompensa} monedas`);
      }

      setRachaPerfecta((prev) => prev + 1);
    } else {
      sonidoError();
      hablar("Inténtalo de nuevo");
      setErroresEnRonda((prev) => prev + 1);
      setRachaPerfecta(0);

      if (pantalla === "sumas") {
        setMensaje(
          `❌ Incorrecto. La respuesta correcta es ${ejercicio.correcta}. El jefe resistió tu ataque`
        );
      } else {
        setMensaje(
          `❌ Incorrecto. La respuesta correcta es ${ejercicio.correcta}`
        );
      }
    }
  };

  const siguientePregunta = () => {
    const ultimo = indice >= ejerciciosActuales.length - 1;

    if (!ultimo) {
      setIndice((prev) => prev + 1);
      setMensaje("");
      setRespondio(false);
      setCorrectaActual(false);
      setBloqueado(false);
      return;
    }

    if (pantalla === "sumas") {
      if (erroresEnRonda === 0) {
        registrarMedalla("🏅 Maestro sin errores");
        ganarMonedas(30);
      }

      if (vidasJefe <= 0) {
        registrarMedalla("👑 Vencedor del jefe");
        ganarMonedas(40);
        sonidoJefeDerrotado();
        hablar("Jefe derrotado");
      }

      if (rachaPerfecta >= ejerciciosActuales.length) {
        registrarMedalla("🔥 Racha perfecta");
      }
    }

    if (pantalla === "jefeFinal") {
      if (erroresEnRonda === 0) {
        registrarMedalla("🌟 Campeón del jefe final");
        ganarMonedas(50);
      }

      setRankingAnimado(false);
      setPantalla("ranking");
      setTimeout(() => {
        sonidoVictoria();
        hablar("Victoria");
        setRankingAnimado(true);
      }, 80);
      return;
    }

    limpiarQuiz();
    setPantalla("jefeFinal");
  };

  const reiniciarHabitat = () => {
    setHabitatItems(itemsHabitatIniciales);
    setHabitatCorrectos(0);
    setMensaje("");
    setSeleccionadoHabitat(null);
  };

  const reiniciarReciclaje = () => {
    setReciclajeItems(itemsReciclajeIniciales);
    setReciclajeCorrectos(0);
    setMensaje("");
    setSeleccionadoReciclaje(null);
  };

  const clasificarHabitat = (tipoZona: string) => {
    if (!seleccionadoHabitat) {
      setMensaje("👉 Primero toca un dibujo.");
      return;
    }
    const item = habitatItems.find((x) => x.id === seleccionadoHabitat);
    if (!item) return;

    if (item.tipo === tipoZona) {
      setHabitatItems((prev) => prev.filter((x) => x.id !== item.id));
      setHabitatCorrectos((prev) => prev + 1);
      setSeleccionadoHabitat(null);
      setMensaje("✅ ¡Muy bien!");
      sumarPunto();
      sonidoCorrecto();
      sonidoMoneda();
    } else {
      setMensaje("❌ Intenta otra vez");
      sonidoError();
    }
  };

  const clasificarReciclaje = (tipoZona: string) => {
    if (!seleccionadoReciclaje) {
      setMensaje("👉 Primero toca un objeto.");
      return;
    }
    const item = reciclajeItems.find((x) => x.id === seleccionadoReciclaje);
    if (!item) return;

    if (item.tipo === tipoZona) {
      setReciclajeItems((prev) => prev.filter((x) => x.id !== item.id));
      setReciclajeCorrectos((prev) => prev + 1);
      setSeleccionadoReciclaje(null);
      setMensaje("✅ ¡Clasificación correcta!");
      sumarPunto();
      sonidoCorrecto();
      sonidoMoneda();
    } else {
      setMensaje("❌ Ese objeto va en otro lugar");
      sonidoError();
    }
  };

  const exportarCSV = () => {
    const filas = estudiantes.map((e) => {
      const progreso = leerProgreso(e.nombre);
      const progresoJuego = leerProgresoJuego(e.nombre);
      const rango = obtenerRangoAvatar(progreso.puntaje);
      return [
        e.nombre,
        progreso.puntaje,
        progreso.nivel,
        rango.nombre,
        progresoJuego.monedas,
        progresoJuego.skinActiva || "Ninguna",
        progresoJuego.medallas.join(" | ") || "Sin medallas",
      ].join(",");
    });

    const contenido =
      "Nombre,Puntaje,Nivel,Rango,Monedas,Skin,Medallas\n" + filas.join("\n");
    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte_estudiantes.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const BotonInicio = () => (
    <button
      onClick={irAInicio}
      style={{
        position: "fixed",
        top: 14,
        left: 14,
        background: "#ef4444",
        color: "white",
        border: "none",
        borderRadius: 14,
        padding: "10px 14px",
        fontWeight: 700,
        cursor: "pointer",
        zIndex: 999,
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      }}
    >
      🏠 Inicio
    </button>
  );

  const VistaInformativa = ({
    titulo,
    subtitulo,
    items,
    fondo,
  }: {
    titulo: string;
    subtitulo: string;
    items: TarjetaInfo[];
    fondo: string;
  }) => (
    <div style={{ ...contenedorPantalla, background: fondo }}>
      <BotonInicio />
      <div style={tarjeta}>
        <h2 style={{ textAlign: "center" }}>{titulo}</h2>
        <p style={{ textAlign: "center", fontSize: 19 }}>{subtitulo}</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
            marginTop: 20,
          }}
        >
          {items.map((item, i) => (
            <div key={`${item.titulo}-${i}`} style={tarjetaInfo}>
              <div style={{ fontSize: 42 }}>{item.emoji}</div>
              <h3 style={{ marginBottom: 8 }}>{item.titulo}</h3>
              <p style={{ fontSize: 18, margin: 0 }}>{item.texto}</p>
              <button
                style={{
                  ...boton,
                  background: "#38bdf8",
                  color: "white",
                  marginTop: 12,
                  width: "100%",
                }}
                onClick={() => {
                  sonidoBoton();
                  hablar(`${item.titulo}. ${item.texto}`);
                }}
              >
                🔊 Escuchar
              </button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            style={{ ...boton, background: "#9ca3af", color: "white" }}
            onClick={() => setPantalla("cienciasMenu")}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );

  if (pantalla === "inicio") {
    return (
      <div
        style={{
          ...contenedorPantalla,
          background:
            "linear-gradient(180deg, #93c5fd 0%, #fef9c3 50%, #fde68a 100%)",
          minHeight: "100vh",
          padding: 20,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            background: "rgba(255,255,255,0.88)",
            borderRadius: 28,
            padding: 24,
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            border: "3px solid #ffffff",
            width: "100%",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 26 }}>
            <div style={{ fontSize: 64, marginBottom: 10 }}>🏰🎮⭐</div>
            <h1 style={{ margin: 0, fontSize: 38, color: "#0f172a" }}>
              Aventuras de Aprendizaje
            </h1>
            <p
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#334155",
                marginTop: 10,
                marginBottom: 8,
              }}
            >
              Elige tu personaje para comenzar la misión
            </p>
            <p
              style={{
                fontSize: 16,
                color: "#475569",
                maxWidth: 760,
                margin: "0 auto",
                lineHeight: 1.5,
              }}
            >
              Resuelve desafíos de matemática, lenguaje y ciencias, gana
              monedas, desbloquea premios y sube de rango como un verdadero
              héroe.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 18,
            }}
          >
            {estudiantes.map((e) => {
              const progreso = leerProgreso(e.nombre);
              const rango = obtenerRangoAvatar(progreso.puntaje);

              return (
                <button
                  key={e.nombre}
                  onClick={() => entrarConAnimacion(e)}
                  style={{
                    background:
                      "linear-gradient(180deg, #ffffff 0%, #eff6ff 100%)",
                    borderRadius: 24,
                    border: "2px solid #bfdbfe",
                    padding: 20,
                    cursor: "pointer",
                    boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
                    minHeight: 250,
                  }}
                >
                  <div style={{ fontSize: 64, marginBottom: 10 }}>
                    {obtenerAvatarVisualDeJugador(e, progreso.puntaje)}
                  </div>

                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 900,
                      color: "#0f172a",
                      marginBottom: 6,
                    }}
                  >
                    {e.nombre}
                  </div>

                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#475569",
                      marginBottom: 14,
                    }}
                  >
                    {e.rol}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                      textAlign: "left",
                      fontSize: 15,
                    }}
                  >
                    <div
                      style={{
                        background: "#f8fafc",
                        borderRadius: 12,
                        padding: "8px 10px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      ⭐ <strong>Puntaje:</strong> {progreso.puntaje}
                    </div>

                    <div
                      style={{
                        background: "#f8fafc",
                        borderRadius: 12,
                        padding: "8px 10px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      🎯 <strong>Nivel:</strong> {progreso.nivel}
                    </div>

                    <div
                      style={{
                        background: "#f8fafc",
                        borderRadius: 12,
                        padding: "8px 10px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      👑 <strong>Rango:</strong> {rango.nombre}
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 16,
                      background: "#2563eb",
                      color: "white",
                      borderRadius: 14,
                      padding: "10px 14px",
                      fontSize: 16,
                      fontWeight: 800,
                    }}
                  >
                    Entrar a jugar
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: 26 }}>
            <button
              style={{ ...boton, background: "#86efac" }}
              onClick={() => setPantalla("casa")}
            >
              📚 Repaso en casa
            </button>
            <p
              style={{
                fontSize: 15,
                color: "#475569",
                marginBottom: 0,
              }}
            >
              Cada estudiante conserva su progreso, monedas, medallas e
              inventario.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (pantalla === "cargando") {
    const jugadorActivo = jugadorEntrando ?? jugador;
    const rango = jugadorActivo ? obtenerRangoAvatar(puntaje) : null;

    const skinNombre =
      skinActiva === "sombrero_mago"
        ? "Sombrero mágico"
        : skinActiva === "espada_luz"
        ? "Espada de luz"
        : skinActiva === "corona_real"
        ? "Corona real"
        : "Sin skin";

    const mensajeRango =
      rango?.nombre === "Leyenda"
        ? "Tu leyenda continúa"
        : rango?.nombre === "Maestro"
        ? "Tu sabiduría abre una nueva misión"
        : rango?.nombre === "Guerrero"
        ? "Tu fuerza crece en cada desafío"
        : rango?.nombre === "Aventurero"
        ? "Una nueva aventura te espera"
        : "Prepárate para aprender jugando";

    const particulas = [
      { top: "10%", left: "12%", size: 16, delay: "0s", dur: "2.6s" },
      { top: "16%", left: "82%", size: 24, delay: "0.4s", dur: "3.2s" },
      { top: "28%", left: "20%", size: 18, delay: "1s", dur: "2.8s" },
      { top: "34%", left: "74%", size: 14, delay: "0.2s", dur: "3s" },
      { top: "54%", left: "10%", size: 20, delay: "0.9s", dur: "2.7s" },
      { top: "64%", left: "86%", size: 18, delay: "0.6s", dur: "3.4s" },
      { top: "80%", left: "18%", size: 22, delay: "1.3s", dur: "2.9s" },
      { top: "84%", left: "76%", size: 16, delay: "0.8s", dur: "3.1s" },
    ];

    return (
      <div
        style={{
          ...contenedorPantalla,
          minHeight: "100vh",
          overflow: "hidden",
          position: "relative",
          background:
            "linear-gradient(180deg, #0f172a 0%, #1d4ed8 40%, #60a5fa 75%, #dbeafe 100%)",
        }}
      >
        <style>{`
          @keyframes estrellaSuave {
            0% { transform: translateY(0px) scale(1); opacity: 0.25; }
            50% { transform: translateY(-8px) scale(1.18); opacity: 0.9; }
            100% { transform: translateY(0px) scale(1); opacity: 0.25; }
          }
          @keyframes aparecerPanel {
            0% { opacity: 0; transform: translateY(10px) scale(0.98); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes heroeEntrada {
            0% { transform: scale(0.88); opacity: 0.35; }
            60% { transform: scale(1.08); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes brilloLateral {
            0% { transform: translateX(-130%); opacity: 0; }
            25% { opacity: 0.4; }
            100% { transform: translateX(220%); opacity: 0; }
          }
          @keyframes pulsoTitulo {
            0% { opacity: 0.85; }
            50% { opacity: 1; }
            100% { opacity: 0.85; }
          }
        `}</style>

        {particulas.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: p.top,
              left: p.left,
              fontSize: p.size,
              animation: `estrellaSuave ${p.dur} ease-in-out infinite`,
              animationDelay: p.delay,
              pointerEvents: "none",
            }}
          >
            ✨
          </div>
        ))}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: destelloCarga
              ? "radial-gradient(circle at center, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 24%, rgba(255,255,255,0) 58%)"
              : "transparent",
            transition: "all 0.6s ease",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            width: "100%",
            maxWidth: 720,
            margin: "0 auto",
            background: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.22)",
            borderRadius: 30,
            padding: "40px 26px 34px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
            animation: "aparecerPanel 0.45s ease",
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "36%",
              height: "100%",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0) 100%)",
              animation: textoCargaVisible ? "brilloLateral 1.5s ease" : "none",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              fontSize: textoCargaVisible ? 96 : 78,
              marginBottom: 8,
              animation: textoCargaVisible ? "heroeEntrada 0.65s ease" : "none",
              filter: destelloCarga
                ? "drop-shadow(0 0 14px rgba(255,255,255,0.35))"
                : "none",
              transition: "all 0.3s ease",
            }}
          >
            {jugadorActivo ? obtenerAvatarVisual() : "🧒"}
          </div>

          <h1
            style={{
              color: "white",
              fontSize: 40,
              fontWeight: 900,
              margin: "6px 0 6px",
              animation: "pulsoTitulo 2s ease-in-out infinite",
            }}
          >
            {jugadorActivo
              ? `¡Bienvenido, ${jugadorActivo.nombre}!`
              : "¡Bienvenido!"}
          </h1>

          <p
            style={{
              color: "#dbeafe",
              fontSize: 21,
              fontWeight: 700,
              margin: "0 0 18px 0",
            }}
          >
            {mensajeRango}
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            <span
              style={{
                background: "rgba(255,255,255,0.16)",
                color: "white",
                padding: "9px 14px",
                borderRadius: 999,
                fontWeight: 800,
                fontSize: 15,
              }}
            >
              ⭐ Puntaje: {puntaje}
            </span>
            <span
              style={{
                background: "rgba(255,255,255,0.16)",
                color: "white",
                padding: "9px 14px",
                borderRadius: 999,
                fontWeight: 800,
                fontSize: 15,
              }}
            >
              🎯 Nivel: {nivel}
            </span>
            <span
              style={{
                background: "rgba(255,255,255,0.16)",
                color: "white",
                padding: "9px 14px",
                borderRadius: 999,
                fontWeight: 800,
                fontSize: 15,
              }}
            >
              👑 Rango: {rango ? rango.nombre : "Aprendiz"}
            </span>
            <span
              style={{
                background: "rgba(255,255,255,0.16)",
                color: "white",
                padding: "9px 14px",
                borderRadius: 999,
                fontWeight: 800,
                fontSize: 15,
              }}
            >
              ✨ {skinNombre}
            </span>
          </div>

          <div
            style={{
              width: "86%",
              maxWidth: 420,
              height: 18,
              margin: "0 auto",
              background: "rgba(255,255,255,0.16)",
              borderRadius: 999,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.24)",
              boxShadow: "inset 0 2px 8px rgba(0,0,0,0.16)",
            }}
          >
            <div
              style={{
                width: `${progresoCarga}%`,
                height: "100%",
                borderRadius: 999,
                background:
                  "linear-gradient(90deg, #fde047 0%, #f59e0b 45%, #fb7185 100%)",
                transition: "width 0.42s ease",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 40,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 100%)",
                }}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              color: "white",
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            Cargando misión... {progresoCarga}%
          </div>

          <p
            style={{
              marginTop: 10,
              color: "#e0f2fe",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Preparando retos, recompensas y aventuras
          </p>
        </div>
      </div>
    );
  }

  if (pantalla === "casa") {
    return (
      <div
        style={{
          ...contenedorPantalla,
          background: "linear-gradient(#dcfce7, #f0fdf4)",
        }}
      >
        <BotonInicio />
        <div style={tarjeta}>
          <h2 style={{ textAlign: "center" }}>📚 Repaso en casa</h2>
          {repasoCasa.map((frase, i) => (
            <p key={i} style={{ fontSize: 20 }}>
              ✅ {frase}
            </p>
          ))}
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button
              style={{ ...boton, background: "#60a5fa", color: "white" }}
              onClick={() => setPantalla("menu")}
            >
              Ir al menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (pantalla === "menu") {
    const rango = obtenerRangoAvatar(puntaje);
    const skinNombre =
      skinActiva === "sombrero_mago"
        ? "Sombrero mágico"
        : skinActiva === "espada_luz"
        ? "Espada de luz"
        : skinActiva === "corona_real"
        ? "Corona real"
        : "Ninguna";

    return (
      <div
        style={{
          ...contenedorPantalla,
          background: "linear-gradient(180deg, #fde68a 0%, #fff7ed 100%)",
        }}
      >
        <BotonInicio />
        <div
          style={{
            ...tarjeta,
            maxWidth: 980,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 18,
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                background: "linear-gradient(180deg, #ffffff 0%, #eff6ff 100%)",
                borderRadius: 24,
                padding: 22,
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                border: "2px solid #bfdbfe",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 68, marginBottom: 8 }}>
                {obtenerAvatarVisual()}
              </div>

              <h2 style={{ margin: "8px 0" }}>{jugador?.nombre}</h2>
              <p style={{ marginTop: 0, color: "#475569", fontWeight: 700 }}>
                {jugador?.rol}
              </p>

              <div
                style={{
                  display: "grid",
                  gap: 10,
                  marginTop: 18,
                  textAlign: "left",
                  fontSize: 16,
                }}
              >
                {[
                  `⭐ Puntaje: ${puntaje}`,
                  `🎯 Nivel: ${nivel}`,
                  `👑 Rango: ${rango.nombre}`,
                  `🪙 Monedas: ${monedas}`,
                  `✨ Skin equipada: ${skinNombre}`,
                  `🏅 Medallas: ${medallas.length}`,
                ].map((txt) => (
                  <div
                    key={txt}
                    style={{
                      background: "#f8fafc",
                      borderRadius: 14,
                      padding: "10px 14px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <strong>{txt}</strong>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: 14,
                  padding: "12px 14px",
                  border: "1px solid #e2e8f0",
                  marginTop: 10,
                  textAlign: "left",
                }}
              >
                <div style={{ fontWeight: 800, marginBottom: 10 }}>
                  🔊 Sonido
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginBottom: 10,
                  }}
                >
                  <button
                    style={{
                      ...boton,
                      background: sonidoActivo ? "#22c55e" : "#cbd5e1",
                      color: "white",
                    }}
                    onClick={() => {
                      setSonidoActivo(!sonidoActivo);
                      if (sonidoActivo) return;
                      sonidoBoton();
                    }}
                  >
                    {sonidoActivo ? "Sonido ON" : "Sonido OFF"}
                  </button>

                  <button
                    style={{
                      ...boton,
                      background: musicaActiva ? "#3b82f6" : "#cbd5e1",
                      color: "white",
                    }}
                    onClick={() => {
                      setMusicaActiva(!musicaActiva);
                      sonidoBoton();
                    }}
                  >
                    {musicaActiva ? "Música ON" : "Música OFF"}
                  </button>

                  <button
                    style={{
                      ...boton,
                      background: vozActiva ? "#a855f7" : "#cbd5e1",
                      color: "white",
                    }}
                    onClick={() => {
                      setVozActiva(!vozActiva);
                      sonidoBoton();
                    }}
                  >
                    {vozActiva ? "Voz ON" : "Voz OFF"}
                  </button>
                </div>

                <div>
                  <label style={{ fontWeight: 700, fontSize: 14 }}>
                    Volumen: {Math.round(volumenGeneral * 100)}
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={40}
                    step={1}
                    value={Math.round(volumenGeneral * 100)}
                    onChange={(e) =>
                      setVolumenGeneral(Number(e.target.value) / 100)
                    }
                    style={{ width: "100%", marginTop: 8 }}
                  />
                </div>
              </div>

              <button
                style={{
                  ...boton,
                  background: "#f59e0b",
                  color: "white",
                  width: "100%",
                  marginTop: 18,
                }}
                onClick={() => setPantalla("tienda")}
              >
                🛍️ Ir a la tienda
              </button>
            </div>

            <div
              style={{
                background: "linear-gradient(180deg, #ffffff 0%, #fff7ed 100%)",
                borderRadius: 24,
                padding: 22,
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                border: "2px solid #fed7aa",
              }}
            >
              <h2 style={{ textAlign: "center", marginTop: 0 }}>
                🎮 Selecciona una misión
              </h2>

              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <p style={{ marginBottom: 10, fontWeight: 700 }}>
                  Ajusta el nivel
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    style={{
                      ...boton,
                      background: nivel === "Fácil" ? "#4ade80" : "#dcfce7",
                      color: "#14532d",
                    }}
                    onClick={() => setNivel("Fácil")}
                  >
                    🟢 Fácil
                  </button>

                  <button
                    style={{
                      ...boton,
                      background: nivel === "Medio" ? "#facc15" : "#fef9c3",
                      color: "#854d0e",
                    }}
                    onClick={() => setNivel("Medio")}
                  >
                    🟡 Medio
                  </button>

                  <button
                    style={{
                      ...boton,
                      background: nivel === "Difícil" ? "#f87171" : "#fee2e2",
                      color: "#7f1d1d",
                    }}
                    onClick={() => setNivel("Difícil")}
                  >
                    🔴 Difícil
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 12,
                  marginTop: 18,
                }}
              >
                <button
                  style={{
                    ...boton,
                    background: "#60a5fa",
                    color: "white",
                    width: "100%",
                    minHeight: 72,
                  }}
                  onClick={() => reiniciarQuiz("sumas")}
                >
                  🏰 Torre de sumas
                </button>

                <button
                  style={{
                    ...boton,
                    background: "#fb7185",
                    color: "white",
                    width: "100%",
                    minHeight: 72,
                  }}
                  onClick={() => reiniciarQuiz("restas")}
                >
                  ➖ Restas 1 al 999
                </button>

                <button
                  style={{
                    ...boton,
                    background: "#a78bfa",
                    color: "white",
                    width: "100%",
                    minHeight: 72,
                  }}
                  onClick={() => reiniciarQuiz("multiplicaciones")}
                >
                  ✖️ Tablas 0 al 10
                </button>

                <button
                  style={{
                    ...boton,
                    background: "#ec4899",
                    color: "white",
                    width: "100%",
                    minHeight: 72,
                  }}
                  onClick={() => setPantalla("lenguaje")}
                >
                  ✏️ Lenguaje
                </button>

                <button
                  style={{
                    ...boton,
                    background: "#22c55e",
                    color: "white",
                    width: "100%",
                    minHeight: 72,
                  }}
                  onClick={() => {
                    reiniciarHabitat();
                    setPantalla("cienciasMenu");
                  }}
                >
                  🌱 Ciencias
                </button>

                <button
                  style={{
                    ...boton,
                    background: "#f59e0b",
                    color: "white",
                    width: "100%",
                    minHeight: 72,
                  }}
                  onClick={() => setPantalla("tienda")}
                >
                  🛍️ Tienda
                </button>

                <button
                  style={{
                    ...boton,
                    background: "#eab308",
                    color: "white",
                    width: "100%",
                    minHeight: 72,
                  }}
                  onClick={() => {
                    setRankingAnimado(false);
                    setPantalla("ranking");
                    setTimeout(() => setRankingAnimado(true), 80);
                  }}
                >
                  🏆 Ranking
                </button>

                <button
                  style={{
                    ...boton,
                    background: "#0f172a",
                    color: "white",
                    width: "100%",
                    minHeight: 72,
                  }}
                  onClick={() => setPantalla("panel")}
                >
                  🧙‍♂️ Panel del profesor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pantalla === "tienda") {
    return (
      <div
        style={{
          ...contenedorPantalla,
          background: "linear-gradient(#fef3c7, #fff7ed)",
        }}
      >
        <BotonInicio />
        <div style={tarjeta}>
          <div style={{ textAlign: "center" }}>
            <h2>🛍️ Tienda del héroe</h2>
            <p>
              Monedas disponibles: <strong>{monedas}</strong>
            </p>
            <p>
              Avatar actual: <strong>{obtenerAvatarVisual()}</strong>
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              marginTop: 20,
            }}
          >
            {itemsTienda.map((item) => {
              const comprado = inventario.includes(item.id);

              return (
                <div
                  key={item.id}
                  style={{
                    background: "#fff",
                    borderRadius: 18,
                    padding: 16,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                    border: comprado
                      ? "3px solid #22c55e"
                      : "2px solid #fed7aa",
                  }}
                >
                  <div style={{ fontSize: 42 }}>{item.emoji}</div>
                  <h3>{item.nombre}</h3>
                  <p style={{ minHeight: 50 }}>{item.descripcion}</p>
                  <p>
                    <strong>Precio:</strong> {item.precio} monedas
                  </p>

                  {!comprado ? (
                    <button
                      style={{
                        ...boton,
                        background: "#f59e0b",
                        color: "white",
                        width: "100%",
                      }}
                      onClick={() => comprarItem(item.id)}
                    >
                      Comprar
                    </button>
                  ) : item.tipo === "skin" ? (
                    <button
                      style={{
                        ...boton,
                        background: "#22c55e",
                        color: "white",
                        width: "100%",
                      }}
                      onClick={() => equiparSkin(item.id)}
                    >
                      Equipar
                    </button>
                  ) : (
                    <button
                      style={{
                        ...boton,
                        background: "#94a3b8",
                        color: "white",
                        width: "100%",
                      }}
                      disabled
                    >
                      Comprado
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <p style={{ fontSize: 20, fontWeight: 700 }}>{mensaje}</p>
            <button
              style={{ ...boton, background: "#9ca3af", color: "white" }}
              onClick={() => setPantalla("menu")}
            >
              Volver al menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (["sumas", "restas", "multiplicaciones", "jefeFinal"].includes(pantalla)) {
    const ejercicio = ejerciciosActuales[indice];
    if (!ejercicio) return null;

    const titulo =
      pantalla === "sumas"
        ? "🏰 Torre de Sumas del 1 al 999"
        : pantalla === "restas"
        ? "➖ Restas del 1 al 999"
        : pantalla === "multiplicaciones"
        ? "✖️ Tablas del 0 al 10"
        : "🧙‍♂️ Jefe Final";

    const fondo =
      pantalla === "sumas"
        ? "linear-gradient(#bfdbfe, #eff6ff)"
        : pantalla === "restas"
        ? "linear-gradient(#fecdd3, #fff1f2)"
        : pantalla === "multiplicaciones"
        ? "linear-gradient(#ddd6fe, #f5f3ff)"
        : "linear-gradient(#fca5a5, #ffedd5)";

    return (
      <div style={{ ...contenedorPantalla, background: fondo }}>
        <BotonInicio />
        <div style={tarjeta}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>
              {obtenerAvatarVisual()}
            </div>

            <h2>{titulo}</h2>
            <p>
              {pantalla === "sumas"
                ? `Misión ${indice + 1} de ${ejerciciosActuales.length}`
                : `Pregunta ${indice + 1} de ${ejerciciosActuales.length}`}
            </p>
            <p>⭐ Puntaje: {puntaje}</p>
            <p>🪙 Monedas: {monedas}</p>
            <p>
              Rango: <strong>{obtenerRangoAvatar(puntaje).nombre}</strong>
            </p>

            {pantalla === "sumas" && (
              <div style={{ marginBottom: 16 }}>
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#1d4ed8",
                    marginBottom: 10,
                  }}
                >
                  🎯 Ordena los números de mayor a menor y luego suma
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 8,
                    flexWrap: "wrap",
                    marginBottom: 10,
                  }}
                >
                  {ejercicio.estrellas
                    ? Array.from({ length: ejercicio.estrellas }).map(
                        (_, i) => (
                          <span key={i} style={{ fontSize: 28 }}>
                            ⭐
                          </span>
                        )
                      )
                    : null}
                </div>

                {ejercicio.boss && (
                  <p
                    style={{
                      fontSize: 22,
                      fontWeight: 900,
                      color: "#7c3aed",
                      marginBottom: 10,
                    }}
                  >
                    👑 Desafío final de sumas
                  </p>
                )}

                <div style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                      fontWeight: 800,
                    }}
                  >
                    <span>👹 Vida del jefe</span>
                    <span>
                      {vidasJefe} / {vidasJefeMax}
                    </span>
                  </div>

                  <div
                    style={{
                      width: "100%",
                      height: 22,
                      background: "#e5e7eb",
                      borderRadius: 999,
                      overflow: "hidden",
                      border: "2px solid #cbd5e1",
                    }}
                  >
                    <div
                      style={{
                        width: `${(vidasJefe / vidasJefeMax) * 100}%`,
                        height: "100%",
                        background:
                          vidasJefe > 60
                            ? "#22c55e"
                            : vidasJefe > 30
                            ? "#f59e0b"
                            : "#ef4444",
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    flexWrap: "wrap",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: animarAtaque ? 60 : 48,
                      transform: animarAtaque
                        ? "translateX(18px) scale(1.2)"
                        : "translateX(0) scale(1)",
                      transition: "all 0.25s ease",
                    }}
                  >
                    {obtenerAvatarVisual()}
                  </div>

                  <div
                    style={{
                      fontSize: animarAtaque ? 34 : 24,
                      opacity: animarAtaque ? 1 : 0.25,
                      transform: animarAtaque ? "scale(1.35)" : "scale(1)",
                      transition: "all 0.25s ease",
                      color: golpeCritico ? "#dc2626" : "#f59e0b",
                      fontWeight: 900,
                    }}
                  >
                    {animarAtaque
                      ? golpeCritico
                        ? "💥 CRÍTICO"
                        : "⚔️ ATAQUE"
                      : "⚡"}
                  </div>

                  <div
                    style={{
                      fontSize: animarAtaque ? 64 : 50,
                      transform: animarAtaque
                        ? "translateX(-18px) rotate(-6deg)"
                        : "translateX(0) rotate(0deg)",
                      transition: "all 0.25s ease",
                      filter: animarAtaque
                        ? "drop-shadow(0 0 10px rgba(239,68,68,0.45))"
                        : "none",
                    }}
                  >
                    👹
                  </div>
                </div>
              </div>
            )}

            {pantalla === "jefeFinal" && (
              <>
                <p>
                  <strong>El Mago Supremo te desafía</strong>
                </p>
                <button
                  style={{ ...boton, background: "#7c3aed", color: "white" }}
                  onClick={() =>
                    hablar("Has llegado al desafío final del Mago Supremo")
                  }
                >
                  🔊 Escuchar al Mago
                </button>
              </>
            )}

            <div
              style={{
                fontSize: 40,
                fontWeight: 900,
                margin: "22px 0",
                wordBreak: "break-word",
              }}
            >
              {ejercicio.pregunta}
            </div>

            {pantalla === "sumas" &&
              respondio &&
              !correctaActual &&
              ejercicio.orden && (
                <p
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#475569",
                    marginBottom: 18,
                  }}
                >
                  Orden correcto: {ejercicio.orden.join(" + ")}
                </p>
              )}
          </div>

          <div style={{ textAlign: "center" }}>
            {ejercicio.opciones.map((opcion) => (
              <button
                key={opcion}
                style={{ ...boton, background: "#fde047", minWidth: 90 }}
                onClick={() => verificarRespuesta(opcion)}
                disabled={bloqueado}
              >
                {opcion}
              </button>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <p
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: correctaActual ? "green" : "crimson",
              }}
            >
              {mensaje}
            </p>

            {respondio && (
              <button
                style={{ ...boton, background: "#34d399", color: "white" }}
                onClick={siguientePregunta}
              >
                {indice < ejerciciosActuales.length - 1
                  ? "Siguiente"
                  : pantalla === "jefeFinal"
                  ? "Ver ranking"
                  : "Ir al jefe final"}
              </button>
            )}

            {medallas.length > 0 && (
              <div style={{ marginTop: 18 }}>
                <p style={{ fontSize: 20, fontWeight: 800 }}>
                  🏆 Medallas ganadas
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                >
                  {medallas.map((m) => (
                    <span
                      key={m}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 999,
                        background: "#fef3c7",
                        border: "2px solid #f59e0b",
                        fontWeight: 800,
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 12 }}>
              <button
                style={{ ...boton, background: "#9ca3af", color: "white" }}
                onClick={() => setPantalla("menu")}
              >
                Volver al menú
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pantalla === "lenguaje") {
    return (
      <div
        style={{
          ...contenedorPantalla,
          background: "linear-gradient(#fbcfe8, #fdf2f8)",
        }}
      >
        <BotonInicio />
        <div style={tarjeta}>
          <h2 style={{ textAlign: "center" }}>✏️ Dictado ampliado</h2>
          <p style={{ textAlign: "center" }}>
            Escucha y escribe en tu cuaderno.
          </p>
          <div style={{ maxHeight: 420, overflowY: "auto", marginTop: 10 }}>
            {frasesDictado.map((f, i) => (
              <div
                key={`frase-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <button
                  style={{
                    ...boton,
                    background: "#ec4899",
                    color: "white",
                    margin: 0,
                  }}
                  onClick={() => hablar(f)}
                >
                  🔊
                </button>
                <span style={{ fontSize: 18 }}>{f}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button
              style={{ ...boton, background: "#9ca3af", color: "white" }}
              onClick={() => setPantalla("menu")}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (pantalla === "cienciasMenu") {
    return (
      <div
        style={{
          ...contenedorPantalla,
          background: "linear-gradient(#bbf7d0, #ecfccb)",
        }}
      >
        <BotonInicio />
        <div style={tarjeta}>
          <h2 style={{ textAlign: "center" }}>🌱 Ciencias Naturales</h2>
          <p style={{ textAlign: "center", fontSize: 20 }}>
            Contenido incorporado para tercero de básica.
          </p>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button
              style={{ ...boton, background: "#38bdf8", color: "white" }}
              onClick={() => setPantalla("cienciasEstados")}
            >
              🧊 Estados de la materia
            </button>
            <button
              style={{ ...boton, background: "#14b8a6", color: "white" }}
              onClick={() => setPantalla("cienciasMezclas")}
            >
              🥛 Mezclas solubles e insolubles
            </button>
            <button
              style={{ ...boton, background: "#f97316", color: "white" }}
              onClick={() => setPantalla("cienciasCuerpo")}
            >
              🦴 Huesos y cuerpo humano
            </button>
            <button
              style={{ ...boton, background: "#84cc16", color: "white" }}
              onClick={() => setPantalla("cienciasCiclo")}
            >
              🌱 Ciclo de los seres vivos
            </button>
            <button
              style={{ ...boton, background: "#8b5cf6", color: "white" }}
              onClick={() => setPantalla("cienciasAnimales")}
            >
              🐶 Vertebrados e invertebrados
            </button>
            <button
              style={{ ...boton, background: "#0ea5e9", color: "white" }}
              onClick={() => {
                reiniciarHabitat();
                setPantalla("cienciasHabitat");
              }}
            >
              🌍 Hábitats
            </button>
            <button
              style={{ ...boton, background: "#22c55e", color: "white" }}
              onClick={() => {
                reiniciarReciclaje();
                setPantalla("cienciasReciclaje");
              }}
            >
              ♻️ Reciclaje
            </button>
            <button
              style={{ ...boton, background: "#9ca3af", color: "white" }}
              onClick={() => setPantalla("menu")}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (pantalla === "cienciasEstados") {
    return (
      <VistaInformativa
        titulo="🧊 Estados de la materia"
        subtitulo="Aprende sólido, líquido y gaseoso con ejemplos sencillos."
        items={estadosMateriaInfo}
        fondo="linear-gradient(#bae6fd, #eff6ff)"
      />
    );
  }

  if (pantalla === "cienciasMezclas") {
    return (
      <VistaInformativa
        titulo="🥛 Mezclas solubles e insolubles"
        subtitulo="Observa qué materiales se mezclan y cuáles no."
        items={mezclasInfo}
        fondo="linear-gradient(#ccfbf1, #f0fdfa)"
      />
    );
  }

  if (pantalla === "cienciasCuerpo") {
    return (
      <VistaInformativa
        titulo="🦴 Huesos y partes del cuerpo humano"
        subtitulo="Reconoce las partes principales del cuerpo y algunos huesos."
        items={cuerpoInfo}
        fondo="linear-gradient(#fed7aa, #fff7ed)"
      />
    );
  }

  if (pantalla === "cienciasCiclo") {
    return (
      <VistaInformativa
        titulo="🌱 Ciclo de los seres vivos"
        subtitulo="Todo ser vivo nace, crece, se reproduce y cumple su ciclo."
        items={cicloVidaInfo}
        fondo="linear-gradient(#d9f99d, #f7fee7)"
      />
    );
  }

  if (pantalla === "cienciasAnimales") {
    return (
      <VistaInformativa
        titulo="🐶 Animales vertebrados e invertebrados"
        subtitulo="Diferencia animales con huesos y sin huesos."
        items={animalesInfo}
        fondo="linear-gradient(#e9d5ff, #f5f3ff)"
      />
    );
  }

  if (pantalla === "cienciasHabitat") {
    return (
      <div
        style={{
          ...contenedorPantalla,
          background: "linear-gradient(#bbf7d0, #dcfce7)",
        }}
      >
        <BotonInicio />
        <div style={tarjeta}>
          <h2 style={{ textAlign: "center" }}>🌍 Clasifica por hábitat</h2>
          <p style={{ textAlign: "center" }}>
            Paso 1: toca un dibujo. Paso 2: toca la caja correcta.
          </p>
          <p style={{ textAlign: "center", fontWeight: 700 }}>
            ⭐ Puntaje: {puntaje}
          </p>

          <div
            style={{
              marginTop: 20,
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              justifyContent: "center",
            }}
          >
            {habitatItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSeleccionadoHabitat(item.id)}
                style={{
                  ...boton,
                  fontSize: 42,
                  background:
                    seleccionadoHabitat === item.id ? "#fde68a" : "#fff",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  minWidth: 88,
                }}
              >
                {item.nombre}
              </button>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 24,
            }}
          >
            <button
              style={{ ...zonaTouch("#0ea5e9"), cursor: "pointer" }}
              onClick={() => clasificarHabitat("acuatico")}
            >
              🌊 Acuático
            </button>
            <button
              style={{ ...zonaTouch("#22c55e"), cursor: "pointer" }}
              onClick={() => clasificarHabitat("terrestre")}
            >
              🌳 Terrestre
            </button>
            <button
              style={{ ...zonaTouch("#f59e0b"), cursor: "pointer" }}
              onClick={() => clasificarHabitat("aereo")}
            >
              ☁️ Aéreo
            </button>
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: 22,
              fontWeight: 700,
              marginTop: 20,
            }}
          >
            {mensaje}
          </p>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            {habitatCorrectos === itemsHabitatIniciales.length && (
              <button
                style={{ ...boton, background: "#34d399", color: "white" }}
                onClick={() => {
                  reiniciarReciclaje();
                  setPantalla("cienciasReciclaje");
                }}
              >
                Siguiente actividad
              </button>
            )}
            <button
              style={{ ...boton, background: "#9ca3af", color: "white" }}
              onClick={() => setPantalla("cienciasMenu")}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (pantalla === "cienciasReciclaje") {
    return (
      <div
        style={{
          ...contenedorPantalla,
          background: "linear-gradient(#d9f99d, #f0fdf4)",
        }}
      >
        <BotonInicio />
        <div style={tarjeta}>
          <h2 style={{ textAlign: "center" }}>♻️ Clasifica para reciclar</h2>
          <p style={{ textAlign: "center" }}>
            Paso 1: toca un objeto. Paso 2: toca el recipiente correcto.
          </p>
          <p style={{ textAlign: "center", fontWeight: 700 }}>
            ⭐ Puntaje: {puntaje}
          </p>

          <div
            style={{
              marginTop: 20,
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              justifyContent: "center",
            }}
          >
            {reciclajeItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSeleccionadoReciclaje(item.id)}
                style={{
                  ...boton,
                  fontSize: 42,
                  background:
                    seleccionadoReciclaje === item.id ? "#fde68a" : "#fff",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  minWidth: 88,
                }}
              >
                {item.nombre}
              </button>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 24,
            }}
          >
            <button
              style={{ ...zonaTouch("#3b82f6"), cursor: "pointer" }}
              onClick={() => clasificarReciclaje("papel")}
            >
              🟦 Papel
            </button>
            <button
              style={{ ...zonaTouch("#22c55e"), cursor: "pointer" }}
              onClick={() => clasificarReciclaje("plastico")}
            >
              🟩 Plástico
            </button>
            <button
              style={{ ...zonaTouch("#f59e0b"), cursor: "pointer" }}
              onClick={() => clasificarReciclaje("organico")}
            >
              🟫 Orgánico
            </button>
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: 22,
              fontWeight: 700,
              marginTop: 20,
            }}
          >
            {mensaje}
          </p>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            {reciclajeCorrectos === itemsReciclajeIniciales.length && (
              <button
                style={{ ...boton, background: "#ef4444", color: "white" }}
                onClick={() => {
                  limpiarQuiz();
                  setPantalla("jefeFinal");
                }}
              >
                Ir al jefe final
              </button>
            )}
            <button
              style={{ ...boton, background: "#9ca3af", color: "white" }}
              onClick={() => setPantalla("cienciasMenu")}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (pantalla === "ranking") {
    return (
      <div
        style={{
          ...contenedorPantalla,
          background: "linear-gradient(#fde68a, #fff7ed)",
        }}
      >
        <BotonInicio />
        <div style={tarjeta}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <h2>🏆 Ranking de campeones</h2>
            <p>Así van los héroes del aula</p>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            {rankingOrdenado.map((r, i) => (
              <div
                key={r.nombre}
                style={{
                  background:
                    i === 0
                      ? "linear-gradient(90deg, #fde68a, #fff7ed)"
                      : i === 1
                      ? "linear-gradient(90deg, #e5e7eb, #f8fafc)"
                      : i === 2
                      ? "linear-gradient(90deg, #fdba74, #fff7ed)"
                      : "#ffffff",
                  borderRadius: 18,
                  padding: 16,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                  border:
                    i === 0
                      ? "3px solid #f59e0b"
                      : i === 1
                      ? "3px solid #94a3b8"
                      : i === 2
                      ? "3px solid #ea580c"
                      : "2px solid #fed7aa",
                  transform: rankingAnimado
                    ? "translateY(0) scale(1)"
                    : "translateY(14px) scale(0.98)",
                  opacity: rankingAnimado ? 1 : 0,
                  transition: `all 0.45s ease ${i * 0.08}s`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div style={{ fontSize: 34, minWidth: 44 }}>
                      {i === 0 ? "👑" : i === 1 ? "🥈" : i === 2 ? "🥉" : "⭐"}
                    </div>

                    <div style={{ fontSize: 42 }}>{r.avatarVisual}</div>

                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800 }}>
                        {r.nombre}
                      </div>
                      <div style={{ fontSize: 15, color: "#475569" }}>
                        {r.rol}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign: "right",
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    ⭐ {r.puntaje} pts
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 12,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: 8,
                    fontSize: 15,
                  }}
                >
                  <div>
                    <strong>🎯 Nivel:</strong> {r.nivel}
                  </div>
                  <div>
                    <strong>👑 Rango:</strong> {r.rango}
                  </div>
                  <div>
                    <strong>🪙 Monedas:</strong> {r.monedas}
                  </div>
                  <div>
                    <strong>🏅 Medallas:</strong> {r.medallas.length}
                  </div>
                </div>

                {r.medallas.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      {r.medallas.map((m) => (
                        <span
                          key={m}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 999,
                            background: "#fef3c7",
                            border: "2px solid #f59e0b",
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button
              style={{ ...boton, background: "#9ca3af", color: "white" }}
              onClick={() => setPantalla("menu")}
            >
              Volver al menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (pantalla === "panel") {
    return (
      <div
        style={{
          ...contenedorPantalla,
          background: "linear-gradient(#dbeafe, #eff6ff)",
        }}
      >
        <BotonInicio />
        <div style={tarjeta}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <h2>🧙‍♂️ Panel del profesor</h2>
            <p>Seguimiento del progreso de los estudiantes</p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 14,
            }}
          >
            {estudiantes.map((e) => {
              const progreso = leerProgreso(e.nombre);
              const progresoJuego = leerProgresoJuego(e.nombre);
              const avatarVisual = obtenerAvatarVisualDeJugador(
                e,
                progreso.puntaje
              );
              const rango = obtenerRangoAvatar(progreso.puntaje);

              return (
                <div
                  key={e.nombre}
                  style={{
                    background: "#ffffff",
                    borderRadius: 18,
                    padding: 16,
                    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                    border: "2px solid #bfdbfe",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ fontSize: 42 }}>{avatarVisual}</div>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800 }}>
                        {e.nombre}
                      </div>
                      <div style={{ fontSize: 15, color: "#475569" }}>
                        {e.rol}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: 15, lineHeight: 1.8 }}>
                    <div>
                      <strong>⭐ Puntaje:</strong> {progreso.puntaje}
                    </div>
                    <div>
                      <strong>🎯 Nivel:</strong> {progreso.nivel}
                    </div>
                    <div>
                      <strong>👑 Rango:</strong> {rango.nombre}
                    </div>
                    <div>
                      <strong>🪙 Monedas:</strong> {progresoJuego.monedas}
                    </div>
                    <div>
                      <strong>🎒 Inventario:</strong>{" "}
                      {progresoJuego.inventario.length > 0
                        ? progresoJuego.inventario.join(", ")
                        : "Vacío"}
                    </div>
                    <div>
                      <strong>✨ Skin activa:</strong>{" "}
                      {progresoJuego.skinActiva
                        ? progresoJuego.skinActiva
                        : "Ninguna"}
                    </div>
                    <div>
                      <strong>💥 Bonus de daño:</strong>{" "}
                      {progresoJuego.bonusDanio}
                    </div>
                    <div>
                      <strong>🏅 Medallas:</strong>{" "}
                      {progresoJuego.medallas.length > 0
                        ? progresoJuego.medallas.join(" · ")
                        : "Sin medallas"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button
              style={{ ...boton, background: "#22c55e", color: "white" }}
              onClick={exportarCSV}
            >
              📊 Descargar CSV
            </button>
            <button
              style={{ ...boton, background: "#9ca3af", color: "white" }}
              onClick={() => setPantalla("menu")}
            >
              Volver al menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
