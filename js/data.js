/* =========================================================
   DATA — contenido de guaraní (vocabulario, frases, lecciones,
   escenarios de conversación, cultura, logros).

   Criterio de contenido:
   - Se priorizan palabras y frases fijas ampliamente
     documentadas en guaraní paraguayo estándar.
   - Cuando una expresión es coloquial o jopará (mezcla con
     español) se marca explícitamente en `register`.
   - Se evitan oraciones "armadas" con conjugaciones verbales
     que no están claramente atestiguadas, para no inventar
     gramática. Por eso varias frases largas son las mismas
     expresiones fijas reutilizadas en distintos contextos
     (así se aprende de verdad: repetición de frases de alta
     frecuencia, no un diccionario de oraciones sueltas).
   - `pron` es una guía fonética simplificada (no AFI), pensada
     para hispanohablantes, no un estándar académico.
   ========================================================= */

const REGISTER = {
  STD: 'estandar',
  COL: 'coloquial',
  JOP: 'jopara',
};

/* ---------------------------------------------------------
   VOCABULARIO / BANCO DE FRASES
   --------------------------------------------------------- */
const VOCAB = [
  {
    id: 'mbaeichapa', gn: "Mba'éichapa", es: '¡Hola! / ¿Cómo estás?',
    pron: "ma-BEH-cha-pa", category: 'saludos', register: REGISTER.STD,
    example: { gn: "Mba'éichapa, Alfon!", es: '¡Hola, Alfon! ¿Cómo estás?' },
    note: "El saludo más usado en el día a día paraguayo. Sirve para cualquier momento del día.",
  },
  {
    id: 'mbaeichapareime', gn: "Mba'éichapa reime?", es: '¿Cómo estás?',
    pron: "ma-BEH-cha-pa RAY-meh", category: 'saludos', register: REGISTER.STD,
    example: { gn: "Mba'éichapa reime, Alfon?", es: '¿Cómo estás, Alfon?' },
    note: 'Variante más explícita de Mba\'éichapa, agregando "reime" (estás/te encontrás).',
  },
  {
    id: 'ipora', gn: 'Iporã', es: 'Bien / Lindo / Está bueno',
    pron: "ee-po-RAH", category: 'saludos', register: REGISTER.STD,
    example: { gn: 'Iporã, ha nde?', es: 'Bien, ¿y vos?' },
    note: 'La respuesta más común a "Mba\'éichapa".',
  },
  {
    id: 'iporaite', gn: 'Iporãite', es: 'Muy bien',
    pron: "ee-po-rah-EE-teh", category: 'saludos', register: REGISTER.STD,
    example: { gn: 'Iporãite, aguyje!', es: '¡Muy bien, gracias!' },
    note: 'El sufijo "-ite" intensifica: "de verdad", "muy".',
  },
  {
    id: 'hande', gn: 'Ha nde?', es: '¿Y vos?',
    pron: "ha neh", category: 'saludos', register: REGISTER.COL,
    example: { gn: 'Iporã, ha nde?', es: 'Bien, ¿y vos?' },
    note: 'Coletilla conversacional muy frecuente después de responder un saludo.',
  },
  {
    id: 'aguyje', gn: 'Aguyje', es: 'Gracias',
    pron: "ah-GUY-jeh", category: 'cortesia', register: REGISTER.STD,
    example: { gn: 'Aguyje ndéve.', es: 'Gracias a vos.' },
    note: '"Ndéve" es "a vos/a ti" — se agrega para agradecer a alguien en particular.',
  },
  {
    id: 'hee', gn: 'Héẽ', es: 'Sí',
    pron: "heh-EH", category: 'basicos', register: REGISTER.STD,
  },
  {
    id: 'nahaniri', gn: 'Nahániri', es: 'No',
    pron: "na-ha-NEE-ree", category: 'basicos', register: REGISTER.STD,
  },
  {
    id: 'ani', gn: 'Ani', es: 'No (para pedir que no se haga algo)',
    pron: "AH-nee", category: 'basicos', register: REGISTER.STD,
    note: 'Se usa para negar una acción u orden, distinto de "Nahániri" que niega un hecho.',
  },
  {
    id: 'cherera', gn: 'Che réra...', es: 'Mi nombre es... / Me llamo...',
    pron: "cheh REH-ra", category: 'presentaciones', register: REGISTER.STD,
    example: { gn: 'Che réra Alfon.', es: 'Mi nombre es Alfon.' },
  },
  {
    id: 'nderereapa', gn: "Mba'éichapa nde réra?", es: '¿Cómo te llamás?',
    pron: "ma-BEH-cha-pa neh REH-ra", category: 'presentaciones', register: REGISTER.STD,
  },
  {
    id: 'jajotopata', gn: 'Jajotopáta', es: 'Nos vemos / Hasta que nos encontremos',
    pron: "ja-jo-to-PA-ta", category: 'despedidas', register: REGISTER.STD,
  },
  {
    id: 'mbaepareikoteve', gn: "Mba'épa reikotevẽ?", es: '¿Qué necesitás?',
    pron: "ma-BEH-pa ray-ko-teh-VEH", category: 'compras', register: REGISTER.STD,
  },
  {
    id: 'cheaikoteveypetei', gn: "Che aikotevẽ peteĩ y.", es: 'Necesito un agua.',
    pron: "cheh ai-ko-teh-VEH peh-teh-EE ü", category: 'compras', register: REGISTER.STD,
    note: '"Aikotevẽ" = necesito. "Peteĩ" = uno/una.',
  },
  {
    id: 'mbaeichapandepyhare', gn: 'Mba\'éichapa ndepyhare?', es: '¿Cómo pasaste la noche?',
    pron: "ma-BEH-cha-pa ndeh-pyh-AH-reh", category: 'saludos', register: REGISTER.STD,
    note: 'Saludo típico de la mañana, equivalente a preguntar cómo dormiste.',
  },
  {
    id: 'araipora', gn: 'Ára iporã', es: 'Lindo día / Buen clima',
    pron: "AH-ra ee-po-RAH", category: 'clima', register: REGISTER.STD,
    note: '"Ára" es día/clima; combinado con "iporã" describe buen tiempo.',
  },
  {
    id: 'iporapa', gn: 'Iporãpa?', es: '¿Todo bien? / ¿Está bien?',
    pron: "ee-po-RAH-pa", category: 'saludos', register: REGISTER.COL,
    note: 'El sufijo "-pa" convierte una frase en pregunta de sí/no.',
  },
  {
    id: 'y', gn: 'Y', es: 'Agua', pron: 'ü (u cerrada, nasal)',
    category: 'vocabulario', register: REGISTER.STD,
    example: { gn: 'Che aikotevẽ peteĩ y.', es: 'Necesito un agua.' },
  },
  {
    id: 'terere', gn: 'Tereré', es: 'Tereré', pron: 'teh-reh-REH',
    category: 'cultura', register: REGISTER.STD,
    note: 'Bebida fría de yerba mate con agua helada (y a veces hierbas/"remedios"). Se comparte en ronda con guampa y bombilla.',
  },
  {
    id: 'mandio', gn: "Mandi'o", es: 'Mandioca', pron: "man-dee-OH",
    category: 'vocabulario', register: REGISTER.STD,
    note: 'Alimento base de la cocina paraguaya, presente en casi todas las comidas.',
  },
  {
    id: 'kamby', gn: 'Kamby', es: 'Leche', pron: 'kam-BÜ', category: 'vocabulario', register: REGISTER.STD,
  },
  {
    id: 'soo', gn: "So'o", es: 'Carne', pron: "so-OH", category: 'vocabulario', register: REGISTER.STD,
  },
  {
    id: 'sy', gn: 'Sy', es: 'Mamá / Madre', pron: 'sü', category: 'familia', register: REGISTER.STD,
  },
  {
    id: 'tuva', gn: 'Túva', es: 'Papá / Padre', pron: 'TOO-va', category: 'familia', register: REGISTER.STD,
  },
  {
    id: 'membykuera', gn: 'Che memby', es: 'Mi hijo/a', pron: 'cheh MEM-bü',
    category: 'familia', register: REGISTER.STD,
    note: 'El guaraní distingue quién habla: "memby" es el hijo/a dicho por la madre. Los términos de parentesco cambian según quién se refiere a quién — parte de lo interesante del idioma.',
  },
  { id: 'n1', gn: 'Peteĩ', es: 'Uno', pron: 'peh-teh-EE', category: 'numeros', register: REGISTER.STD },
  { id: 'n2', gn: 'Mokõi', es: 'Dos', pron: 'mo-KOH-ee', category: 'numeros', register: REGISTER.STD },
  { id: 'n3', gn: 'Mbohapy', es: 'Tres', pron: 'mbo-HA-pü', category: 'numeros', register: REGISTER.STD },
  { id: 'n4', gn: 'Irundy', es: 'Cuatro', pron: 'ee-ROON-dü', category: 'numeros', register: REGISTER.STD },
  { id: 'n5', gn: 'Po', es: 'Cinco', pron: 'po', category: 'numeros', register: REGISTER.STD },
  { id: 'n6', gn: 'Poteĩ', es: 'Seis', pron: 'po-teh-EE', category: 'numeros', register: REGISTER.STD },
  { id: 'n7', gn: 'Pokõi', es: 'Siete', pron: 'po-KOH-ee', category: 'numeros', register: REGISTER.STD },
  { id: 'n8', gn: 'Poapy', es: 'Ocho', pron: 'po-A-pü', category: 'numeros', register: REGISTER.STD },
  { id: 'n9', gn: 'Porundy', es: 'Nueve', pron: 'po-ROON-dü', category: 'numeros', register: REGISTER.STD },
  { id: 'n10', gn: 'Pa', es: 'Diez', pron: 'pa', category: 'numeros', register: REGISTER.STD },
  { id: 'c-pyta', gn: 'Pytã', es: 'Rojo', pron: 'pü-TAH', category: 'colores', register: REGISTER.STD },
  { id: 'c-moroti', gn: 'Morotĩ', es: 'Blanco', pron: 'mo-ro-TEE', category: 'colores', register: REGISTER.STD },
  { id: 'c-hu', gn: 'Hũ', es: 'Negro', pron: 'hoo', category: 'colores', register: REGISTER.STD },
  { id: 'c-sayju', gn: "Sa'yju", es: 'Amarillo', pron: "sa-Y-hoo", category: 'colores', register: REGISTER.STD },
  {
    id: 'c-hovy', gn: 'Hovy', es: 'Azul (y verde en uso tradicional)', pron: 'ho-VÜ',
    category: 'colores', register: REGISTER.STD,
    note: 'En guaraní tradicional "hovy" podía nombrar tanto el azul como el verde. Hoy se usa "hovyũ" para especificar verde.',
  },
  { id: 'c-hovyu', gn: 'Hovyũ', es: 'Verde', pron: 'ho-VÜ-oo', category: 'colores', register: REGISTER.STD },
];

const VOCAB_BY_ID = Object.fromEntries(VOCAB.map(v => [v.id, v]));
const CATEGORIES = [...new Set(VOCAB.map(v => v.category))];

/* ---------------------------------------------------------
   NIVELES Y LECCIONES
   Cada lección tiene "steps": una mezcla de tipos de ejercicio
   que consumen ids de VOCAB. buildLessonSteps() en lesson.js
   normaliza esto en tiempo de ejecución.
   --------------------------------------------------------- */
const LEVELS = [
  {
    id: 1, title: 'Primeros pasos', subtitle: 'Saludos, presentaciones y lo esencial',
    color: 'primary', icon: 'seed',
    lessons: [
      { id: 'l1-1', title: 'Saludos básicos', vocabIds: ['mbaeichapa', 'ipora', 'iporaite', 'hande'] },
      { id: 'l1-2', title: 'Presentarte', vocabIds: ['cherera', 'nderereapa', 'mbaeichapa', 'ipora'] },
      { id: 'l1-3', title: 'Sí, no y gracias', vocabIds: ['hee', 'nahaniri', 'aguyje', 'ani'] },
      { id: 'l1-4', title: 'Números del 1 al 10', vocabIds: ['n1','n2','n3','n4','n5','n6','n7','n8','n9','n10'] },
      { id: 'l1-5', title: 'Colores', vocabIds: ['c-pyta','c-moroti','c-hu','c-sayju','c-hovy','c-hovyu'] },
      { id: 'l1-6', title: 'Familia', vocabIds: ['sy','tuva','membykuera'] },
      { id: 'l1-7', title: 'Despedirte', vocabIds: ['jajotopata', 'aguyje', 'ipora'] },
    ],
  },
  {
    id: 2, title: 'Conversaciones', subtitle: 'Comprar, pedir y hablar de tu día',
    color: 'secondary', icon: 'chat',
    lessons: [
      { id: 'l2-1', title: 'En el almacén', vocabIds: ['mbaepareikoteve', 'cheaikoteveypetei', 'aguyje'] },
      { id: 'l2-2', title: 'Pedir algo', vocabIds: ['cheaikoteveypetei', 'y', 'aguyje'] },
      { id: 'l2-3', title: 'El clima', vocabIds: ['araipora', 'ipora', 'iporapa'] },
      { id: 'l2-4', title: 'Cómo dormiste', vocabIds: ['mbaeichapandepyhare', 'ipora', 'iporaite'] },
    ],
  },
  {
    id: 3, title: 'Guaraní cotidiano', subtitle: 'Expresiones que vas a escuchar todo el tiempo',
    color: 'accent', icon: 'spark',
    lessons: [
      { id: 'l3-1', title: 'Repaso rápido', vocabIds: ['mbaeichapa', 'ipora', 'aguyje', 'jajotopata', 'hande'] },
      { id: 'l3-2', title: 'Sabores paraguayos', vocabIds: ['terere', 'mandio', 'kamby', 'soo'] },
      { id: 'l3-3', title: 'Coloquial vs. estándar', vocabIds: ['iporapa', 'hande', 'ani'] },
    ],
  },
  {
    id: 4, title: 'Fluidez', subtitle: 'Uní todo en conversaciones reales',
    color: 'success', icon: 'flame',
    lessons: [
      { id: 'l4-1', title: 'Conversación completa', vocabIds: ['mbaeichapa', 'ipora', 'hande', 'nderereapa', 'cherera', 'jajotopata'] },
      { id: 'l4-2', title: 'Comprensión auditiva', vocabIds: ['mbaepareikoteve', 'cheaikoteveypetei', 'araipora', 'mbaeichapandepyhare'] },
    ],
  },
];

/* ---------------------------------------------------------
   ESCENARIOS DE CONVERSACIÓN — "Ñañe'ẽ"
   Cada línea del NPC usa frases fijas validadas; las opciones
   correctas/incorrectas también son items reales de VOCAB
   (nunca se inventa una oración nueva).
   --------------------------------------------------------- */
const SCENARIOS = [
  {
    id: 'conociendo', title: 'Conociendo a alguien', icon: 'wave',
    setting: 'Estás en una plaza y alguien se acerca a saludarte.',
    lines: [
      { npc: "Mba'éichapa!", npcEs: '¡Hola! ¿Cómo estás?',
        options: [
          { vocabId: 'ipora', text: 'Iporã, ha nde?', correct: true },
          { vocabId: 'jajotopata', text: 'Jajotopáta.', correct: false },
          { vocabId: 'nahaniri', text: 'Nahániri.', correct: false },
        ] },
      { npc: "Mba'éichapa nde réra?", npcEs: '¿Cómo te llamás?',
        options: [
          { vocabId: 'cherera', text: 'Che réra Alfon.', correct: true },
          { vocabId: 'aguyje', text: 'Aguyje.', correct: false },
          { vocabId: 'hee', text: 'Héẽ.', correct: false },
        ] },
      { npc: 'Iporãite! Jajotopáta.', npcEs: '¡Muy bien! Nos vemos.',
        options: [
          { vocabId: 'jajotopata', text: 'Jajotopáta!', correct: true },
          { vocabId: 'mbaeichapa', text: "Mba'éichapa!", correct: false },
        ] },
    ],
  },
  {
    id: 'almacen', title: 'En el almacén', icon: 'basket',
    setting: 'Entrás a un almacén de barrio a comprar algo para tomar.',
    lines: [
      { npc: "Mba'éichapa! Mba'épa reikotevẽ?", npcEs: '¡Hola! ¿Qué necesitás?',
        options: [
          { vocabId: 'cheaikoteveypetei', text: 'Che aikotevẽ peteĩ y.', correct: true },
          { vocabId: 'cherera', text: 'Che réra Alfon.', correct: false },
          { vocabId: 'jajotopata', text: 'Jajotopáta.', correct: false },
        ] },
      { npc: 'Iporã, aguyje!', npcEs: '¡Bien, gracias!',
        options: [
          { vocabId: 'aguyje', text: 'Aguyje ndéve!', correct: true },
          { vocabId: 'nahaniri', text: 'Nahániri.', correct: false },
        ] },
    ],
  },
  {
    id: 'terere-amigos', title: 'Tomando tereré con amigos', icon: 'cup',
    setting: 'Es la tarde y tus amigos te invitan a la ronda de tereré.',
    lines: [
      { npc: "Mba'éichapa! Iporãpa?", npcEs: '¡Hola! ¿Todo bien?',
        options: [
          { vocabId: 'iporaite', text: 'Iporãite, ha nde?', correct: true },
          { vocabId: 'nahaniri', text: 'Nahániri.', correct: false },
          { vocabId: 'cherera', text: 'Che réra Alfon.', correct: false },
        ] },
      { npc: 'Ára iporã, ha!', npcEs: '¡Lindo día, eh!',
        options: [
          { vocabId: 'ipora', text: 'Iporã, héẽ!', correct: true },
          { vocabId: 'ani', text: 'Ani!', correct: false },
        ] },
    ],
  },
  {
    id: 'familia', title: 'Con la familia', icon: 'home',
    setting: 'Llegás a la casa de la familia de un amigo.',
    lines: [
      { npc: "Mba'éichapa, ejike!", npcEs: '¡Hola, pasá!',
        options: [
          { vocabId: 'aguyje', text: 'Aguyje!', correct: true },
          { vocabId: 'jajotopata', text: 'Jajotopáta.', correct: false },
        ] },
      { npc: 'Mba\'éichapa nde réra?', npcEs: '¿Cómo te llamás?',
        options: [
          { vocabId: 'cherera', text: 'Che réra Alfon.', correct: true },
          { vocabId: 'hee', text: 'Héẽ.', correct: false },
        ] },
    ],
  },
  {
    id: 'trabajo', title: 'Saludo en el trabajo', icon: 'briefcase',
    setting: 'Llegás a la oficina y te cruzás con un compañero.',
    lines: [
      { npc: "Mba'éichapa ndepyhare?", npcEs: '¿Cómo pasaste la noche?',
        options: [
          { vocabId: 'iporaite', text: 'Iporãite, ha nde?', correct: true },
          { vocabId: 'jajotopata', text: 'Jajotopáta.', correct: false },
        ] },
      { npc: 'Iporã, aguyje!', npcEs: '¡Bien, gracias!',
        options: [
          { vocabId: 'jajotopata', text: 'Jajotopáta, ára iporã!', correct: true },
          { vocabId: 'nahaniri', text: 'Nahániri.', correct: false },
        ] },
    ],
  },
  {
    id: 'fiesta', title: 'En una fiesta', icon: 'party',
    setting: 'Estás en un cumpleaños y alguien nuevo te saluda.',
    lines: [
      { npc: "Mba'éichapa!", npcEs: '¡Hola!',
        options: [
          { vocabId: 'ipora', text: 'Iporã, ha nde?', correct: true },
          { vocabId: 'ani', text: 'Ani.', correct: false },
        ] },
      { npc: 'Iporãpa ko fiesta?', npcEs: '¿Está buena la fiesta?',
        options: [
          { vocabId: 'iporaite', text: 'Iporãite!', correct: true },
          { vocabId: 'nahaniri', text: 'Nahániri.', correct: false },
        ] },
    ],
  },
];

/* ---------------------------------------------------------
   CULTURA — "Guaraní y Paraguay"
   Datos generales, sin estadísticas puntuales no verificables.
   --------------------------------------------------------- */
const CULTURE_CARDS = [
  {
    id: 'idioma-oficial', title: 'Idioma oficial', icon: 'flag',
    text: 'El guaraní es idioma oficial de Paraguay junto al español desde la Constitución de 1992. Es uno de los pocos países de América donde una lengua indígena es hablada por gran parte de la población, más allá del origen étnico.',
  },
  {
    id: 'jopara', title: 'Jopará', icon: 'mix',
    text: '"Jopará" significa literalmente "mezcla". Así se llama a la forma de hablar cotidiana en Paraguay, que combina guaraní y español en la misma frase. Es distinto al guaraní académico o "guaraníete".',
  },
  {
    id: 'terere-cultura', title: 'La ronda de tereré', icon: 'cup',
    text: 'El tereré es agua helada con yerba mate (a veces con "remedios" o hierbas). Se toma en ronda, compartiendo la misma guampa y bombilla — es un momento social, no solo una bebida.',
  },
  {
    id: 'musica', title: 'Música en guaraní', icon: 'music',
    text: 'Géneros como la guarania y la polca paraguaya tienen letras en guaraní o jopará. La música es una de las formas más vivas en que el idioma llega a nuevas generaciones.',
  },
  {
    id: 'expresiones', title: 'Expresiones del día a día', icon: 'bubble',
    text: 'Frases como "Mba\'éichapa" o "Iporã" se escuchan constantemente en Paraguay, incluso en conversaciones que son mayormente en español. Aprenderlas es el primer paso para entender el jopará.',
  },
];

/* ---------------------------------------------------------
   LOGROS / GAMIFICACIÓN
   --------------------------------------------------------- */
const ACHIEVEMENTS = [
  { id: 'primeras-palabras', title: 'Primeras 20 palabras', desc: 'Aprendiste tus primeras 20 palabras.', icon: 'seed', check: s => s.wordsLearned.length >= 20 },
  { id: 'racha-7', title: '7 días aprendiendo', desc: 'Una semana entera de racha activa.', icon: 'flame', check: s => s.streak >= 7 },
  { id: 'primera-conversacion', title: 'Primera conversación', desc: 'Completaste un escenario en Ñañe\'ẽ.', icon: 'chat', check: s => s.scenariosCompleted.length >= 1 },
  { id: 'nandejara', title: 'Ñandejára', desc: 'Completaste el Nivel 1 entero.', icon: 'crown', check: s => s.lessonsCompleted.filter(id => id.startsWith('l1-')).length >= LEVELS[0].lessons.length },
  { id: 'cien-palabras', title: '100 palabras aprendidas', desc: 'Ya conocés 100 palabras y frases.', icon: 'trophy', check: s => s.wordsLearned.length >= 100 },
  { id: 'racha-30', title: '30 días de racha', desc: 'Un mes entero sin cortar la racha.', icon: 'flame', check: s => s.streak >= 30 },
];

/* ---------------------------------------------------------
   FRASE DEL DÍA — rota según el día del año
   --------------------------------------------------------- */
const PHRASE_OF_DAY_POOL = ['mbaeichapandepyhare', 'araipora', 'iporapa', 'aguyje', 'jajotopata', 'mbaeichapareime'];
function getPhraseOfDay() {
  const dayIndex = Math.floor(Date.now() / 86400000);
  const id = PHRASE_OF_DAY_POOL[dayIndex % PHRASE_OF_DAY_POOL.length];
  return VOCAB_BY_ID[id];
}
