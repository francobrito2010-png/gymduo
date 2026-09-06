/* ============================================================
 *  GymDuo — Catálogo de ejercicios y contenidos
 *  60+ ejercicios etiquetados por músculo, equipamiento y nivel.
 *  Equipamiento: 'gym' (gym completo) | 'mancuernas' | 'peso'
 *  Nivel: 'principiante' | 'intermedio'
 *  musculo = principal ; sec = secundarios (ids del mapa muscular)
 * ============================================================ */
(function () {
  const E = (id, nombre, musculo, sec, equipo, nivel, tecnica, error) => ({
    id, nombre, musculo, sec, equipo, nivel, tecnica, error
  })

  window.EXERCISES = [
    // ---------------- PECHO ----------------
    E('press_banca', 'Press de banca', 'pecho', ['triceps', 'hombros'], 'gym', 'intermedio',
      'Tumbado, baja la barra al pecho controlando y empuja hasta estirar los brazos. Escápulas hacia atrás y pies firmes.',
      'No rebotes la barra en el pecho ni despegues los glúteos del banco.'),
    E('press_mancuernas', 'Press con mancuernas', 'pecho', ['triceps', 'hombros'], 'mancuernas', 'principiante',
      'En banco, baja las mancuernas a los lados del pecho y empuja arriba juntándolas un poco. Codos a ~45°.',
      'Codos demasiado abiertos (90°) cargan el hombro. Baja controlado.'),
    E('flexiones', 'Flexiones (push-ups)', 'pecho', ['triceps', 'hombros', 'abdomen'], 'peso', 'principiante',
      'Cuerpo recto de cabeza a talones, manos algo más anchas que los hombros. Baja el pecho casi al suelo y empuja.',
      'Cadera caída o subida. Aprieta abdomen y glúteo para mantener la línea.'),
    E('aperturas', 'Aperturas con mancuernas', 'pecho', ['hombros'], 'mancuernas', 'intermedio',
      'En banco, brazos casi estirados, abre en arco amplio y junta arriba sintiendo el pecho.',
      'No bajes demasiado ni bloquees el codo. Movimiento de abrazo.'),
    E('press_inclinado', 'Press inclinado', 'pecho', ['hombros', 'triceps'], 'mancuernas', 'intermedio',
      'Banco a 30°, empuja las mancuernas hacia arriba. Trabaja la parte alta del pecho.',
      'Inclinación excesiva convierte el ejercicio en press de hombro.'),
    E('fondos_pecho', 'Fondos en paralelas', 'pecho', ['triceps', 'hombros'], 'gym', 'intermedio',
      'Inclina el torso hacia delante, baja doblando codos y sube. Torso adelante = más pecho.',
      'Bajar demasiado fuerza el hombro. Rango cómodo.'),

    // ---------------- HOMBROS ----------------
    E('press_militar', 'Press militar', 'hombros', ['triceps', 'trapecios'], 'mancuernas', 'principiante',
      'De pie o sentado, empuja las mancuernas de los hombros hacia arriba sin arquear la espalda.',
      'Arquear la lumbar. Aprieta abdomen y glúteo.'),
    E('elevaciones_laterales', 'Elevaciones laterales', 'hombros', [], 'mancuernas', 'principiante',
      'Sube las mancuernas a los lados hasta la altura del hombro, codos ligeramente doblados.',
      'Usar impulso o subir por encima del hombro. Peso ligero y controlado.'),
    E('elevaciones_frontales', 'Elevaciones frontales', 'hombros', [], 'mancuernas', 'principiante',
      'Sube la mancuerna al frente hasta la altura de los ojos y baja controlando.',
      'Balancear el cuerpo. Mantén el torso quieto.'),
    E('pajaro', 'Pájaro (deltoide posterior)', 'hombros', ['trapecios', 'dorsales'], 'mancuernas', 'intermedio',
      'Torso inclinado adelante, abre los brazos a los lados apretando la parte trasera del hombro.',
      'Encoger el trapecio en vez de abrir. Codos altos.'),
    E('press_arnold', 'Press Arnold', 'hombros', ['triceps'], 'mancuernas', 'intermedio',
      'Empieza con palmas hacia ti y gira mientras empujas arriba. Trabaja todo el hombro.',
      'Girar demasiado rápido. Controla la rotación.'),
    E('face_pull', 'Face pull', 'hombros', ['trapecios', 'dorsales'], 'gym', 'intermedio',
      'Con polea a la altura de la cara, tira hacia la frente separando las manos. Salud del hombro.',
      'Tirar con los brazos en vez de abrir codos. Codos altos.'),

    // ---------------- BÍCEPS ----------------
    E('curl_biceps', 'Curl de bíceps', 'biceps', ['antebrazos'], 'mancuernas', 'principiante',
      'Codos pegados al cuerpo, sube la mancuerna doblando el codo y baja controlando.',
      'Balancear el cuerpo. El codo no se mueve.'),
    E('curl_martillo', 'Curl martillo', 'biceps', ['antebrazos'], 'mancuernas', 'principiante',
      'Igual que el curl pero con las palmas enfrentadas. Trabaja bíceps y antebrazo.',
      'Subir con impulso. Mantén las muñecas firmes.'),
    E('curl_concentrado', 'Curl concentrado', 'biceps', [], 'mancuernas', 'intermedio',
      'Sentado, codo apoyado en el muslo, sube la mancuerna concentrando el bíceps.',
      'Usar el hombro. Aísla el bíceps.'),
    E('curl_barra', 'Curl con barra', 'biceps', ['antebrazos'], 'gym', 'intermedio',
      'De pie, sube la barra doblando codos, bájala controlando sin abrir los codos.',
      'Arquear la espalda para subir más peso.'),
    E('dominadas_supinas', 'Dominadas supinas (chin-up)', 'biceps', ['dorsales'], 'gym', 'intermedio',
      'Agarre con palmas hacia ti, tira hasta la barbilla sobre la barra.',
      'Rango corto. Sube del todo y baja estirando.'),

    // ---------------- TRÍCEPS ----------------
    E('fondos_banco', 'Fondos en banco', 'triceps', ['pecho', 'hombros'], 'peso', 'principiante',
      'Manos en un banco detrás, baja el cuerpo doblando codos y empuja arriba.',
      'Bajar demasiado tensa el hombro. Codos hacia atrás, no afuera.'),
    E('extension_tricep', 'Extensión de tríceps sobre cabeza', 'triceps', [], 'mancuernas', 'principiante',
      'Mancuerna sobre la cabeza, baja detrás de la nuca doblando el codo y estira.',
      'Abrir los codos. Mantenlos apuntando arriba.'),
    E('patada_tricep', 'Patada de tríceps', 'triceps', [], 'mancuernas', 'principiante',
      'Torso inclinado, codo pegado y alto, estira el brazo hacia atrás.',
      'Mover el hombro. Solo se mueve el antebrazo.'),
    E('press_frances', 'Press francés', 'triceps', [], 'gym', 'intermedio',
      'Tumbado, baja la barra a la frente doblando codos y estira.',
      'Mover los codos hacia los pies. Mantenlos fijos.'),
    E('jalon_tricep', 'Jalón de tríceps en polea', 'triceps', [], 'gym', 'principiante',
      'Codos pegados, empuja la barra hacia abajo hasta estirar y sube controlando.',
      'Inclinarte para empujar con el peso. Torso quieto.'),

    // ---------------- ANTEBRAZOS ----------------
    E('curl_muneca', 'Curl de muñeca', 'antebrazos', [], 'mancuernas', 'principiante',
      'Antebrazos apoyados, sube y baja la mancuerna solo con la muñeca.',
      'Rango muy corto. Deja rodar hasta los dedos y cierra.'),
    E('farmer_walk', 'Paseo del granjero', 'antebrazos', ['trapecios', 'abdomen'], 'mancuernas', 'principiante',
      'Camina con una mancuerna pesada en cada mano, hombros atrás y torso firme.',
      'Encoger los hombros o encorvarte. Camina erguido.'),

    // ---------------- ABDOMEN ----------------
    E('plancha', 'Plancha', 'abdomen', ['oblicuos', 'lumbar'], 'peso', 'principiante',
      'Apóyate en antebrazos y puntas, cuerpo recto. Aprieta abdomen y glúteo y aguanta.',
      'Cadera arriba o lumbar hundida. Línea recta.'),
    E('crunch', 'Crunch abdominal', 'abdomen', [], 'peso', 'principiante',
      'Tumbado, sube los hombros del suelo llevando las costillas a la cadera. No tires del cuello.',
      'Tirar de la cabeza con las manos. El cuello va relajado.'),
    E('elevacion_piernas', 'Elevación de piernas', 'abdomen', ['oblicuos'], 'peso', 'intermedio',
      'Tumbado, sube las piernas rectas hasta 90° y baja sin tocar el suelo.',
      'Arquear la lumbar. Pega la zona baja al suelo.'),
    E('mountain_climbers', 'Escaladores', 'abdomen', ['oblicuos', 'cuadriceps'], 'peso', 'principiante',
      'En posición de plancha, lleva las rodillas al pecho alternando rápido.',
      'Subir la cadera. Mantén el torso estable.'),
    E('rueda_ab', 'Rueda abdominal', 'abdomen', ['lumbar', 'dorsales'], 'gym', 'intermedio',
      'De rodillas, rueda hacia delante estirando el cuerpo y vuelve con el abdomen.',
      'Arquear la lumbar al estirar. Aprieta el core.'),

    // ---------------- OBLICUOS ----------------
    E('giro_ruso', 'Giro ruso', 'oblicuos', ['abdomen'], 'peso', 'principiante',
      'Sentado, torso atrás, gira de lado a lado tocando el suelo. Con peso para más intensidad.',
      'Girar solo los brazos. El giro sale del torso.'),
    E('plancha_lateral', 'Plancha lateral', 'oblicuos', ['abdomen'], 'peso', 'principiante',
      'De lado, apoya un antebrazo y sube la cadera formando una línea recta.',
      'Cadera caída. Mantén el cuerpo alineado.'),
    E('bicicleta', 'Bicicleta abdominal', 'oblicuos', ['abdomen'], 'peso', 'principiante',
      'Tumbado, lleva codo a rodilla contraria alternando en pedaleo.',
      'Ir demasiado rápido sin rango. Controla el giro.'),

    // ---------------- DORSALES / ESPALDA ----------------
    E('dominadas', 'Dominadas', 'dorsales', ['biceps', 'trapecios'], 'gym', 'intermedio',
      'Agarre ancho palmas al frente, tira llevando el pecho a la barra apretando la espalda.',
      'Solo doblar los brazos. Piensa en llevar los codos abajo.'),
    E('remo_mancuerna', 'Remo con mancuerna', 'dorsales', ['biceps', 'trapecios'], 'mancuernas', 'principiante',
      'Apoya una mano y rodilla en el banco, rema la mancuerna hacia la cadera pegando el codo.',
      'Girar el torso o encoger el hombro. Tira con la espalda.'),
    E('jalon_pecho', 'Jalón al pecho', 'dorsales', ['biceps'], 'gym', 'principiante',
      'Sentado, tira de la barra al pecho llevando los codos abajo y atrás.',
      'Tirar detrás de la nuca o balancearte.'),
    E('remo_barra', 'Remo con barra', 'dorsales', ['lumbar', 'biceps', 'trapecios'], 'gym', 'intermedio',
      'Torso inclinado, rema la barra al ombligo apretando la espalda.',
      'Redondear la espalda. Mantén el pecho firme.'),
    E('superman', 'Superman', 'dorsales', ['lumbar', 'gluteos'], 'peso', 'principiante',
      'Boca abajo, eleva brazos y piernas a la vez apretando la espalda y el glúteo.',
      'Tirar del cuello hacia atrás. Mira al suelo.'),
    E('remo_invertido', 'Remo invertido', 'dorsales', ['biceps', 'trapecios'], 'peso', 'principiante',
      'Bajo una barra a la altura del pecho, cuerpo recto, tira llevando el pecho a la barra.',
      'Cadera caída. Mantén el cuerpo en línea.'),

    // ---------------- TRAPECIOS ----------------
    E('encogimientos', 'Encogimientos (shrugs)', 'trapecios', [], 'mancuernas', 'principiante',
      'Sube los hombros hacia las orejas con mancuernas y baja controlando.',
      'Rodar los hombros. Sube recto arriba y abajo.'),
    E('remo_menton', 'Remo al mentón', 'trapecios', ['hombros'], 'mancuernas', 'intermedio',
      'Sube la barra/mancuernas pegada al cuerpo hasta el pecho, codos altos.',
      'Subir por encima de la clavícula molesta el hombro.'),

    // ---------------- LUMBAR ----------------
    E('peso_muerto', 'Peso muerto', 'lumbar', ['gluteos', 'isquios', 'trapecios'], 'gym', 'intermedio',
      'Espalda recta, empuja el suelo con los pies y sube la barra pegada a las piernas.',
      'Redondear la espalda. Pecho arriba y barra pegada.'),
    E('hiperextension', 'Hiperextensiones', 'lumbar', ['gluteos', 'isquios'], 'gym', 'principiante',
      'En el banco romano, baja el torso y sube hasta la línea del cuerpo apretando glúteo.',
      'Hiperextender arriba. Para en la línea del cuerpo.'),
    E('buenos_dias', 'Buenos días', 'lumbar', ['isquios', 'gluteos'], 'gym', 'intermedio',
      'Barra en la espalda, inclina el torso adelante con rodillas casi rectas y sube.',
      'Doblar mucho las rodillas o redondear la espalda.'),

    // ---------------- GLÚTEOS ----------------
    E('hip_thrust', 'Hip thrust', 'gluteos', ['isquios'], 'gym', 'principiante',
      'Espalda apoyada en un banco, empuja la cadera arriba apretando el glúteo y baja.',
      'Arquear la lumbar arriba. Mete la pelvis y aprieta glúteo.'),
    E('puente_gluteo', 'Puente de glúteo', 'gluteos', ['isquios'], 'peso', 'principiante',
      'Tumbado, pies apoyados, sube la cadera apretando el glúteo arriba.',
      'Empujar con la lumbar. Aprieta arriba 1 segundo.'),
    E('patada_gluteo', 'Patada de glúteo', 'gluteos', [], 'peso', 'principiante',
      'A cuatro apoyos, lleva el talón hacia el techo con la rodilla doblada.',
      'Arquear la lumbar. El movimiento sale del glúteo.'),
    E('sentadilla_sumo', 'Sentadilla sumo', 'gluteos', ['cuadriceps', 'aductores'], 'mancuernas', 'principiante',
      'Pies anchos y puntas afuera, baja manteniendo el pecho arriba y empuja el suelo.',
      'Rodillas hacia dentro. Ábrelas hacia las puntas.'),
    E('zancadas', 'Zancadas', 'gluteos', ['cuadriceps', 'isquios'], 'mancuernas', 'principiante',
      'Da un paso adelante y baja la rodilla trasera casi al suelo. Sube empujando con el talón.',
      'Rodilla muy adelantada. La rodilla sigue la punta del pie.'),

    // ---------------- CUÁDRICEPS ----------------
    E('sentadilla', 'Sentadilla', 'cuadriceps', ['gluteos', 'isquios', 'abdomen'], 'peso', 'principiante',
      'Pies al ancho de hombros, baja como si te sentaras manteniendo el pecho arriba y talones apoyados.',
      'Rodillas hacia dentro o talones que se despegan.'),
    E('sentadilla_barra', 'Sentadilla con barra', 'cuadriceps', ['gluteos', 'isquios', 'lumbar'], 'gym', 'intermedio',
      'Barra en la espalda alta, baja hasta romper el paralelo con el pecho firme y sube.',
      'Redondear la espalda o subir la cadera primero.'),
    E('prensa', 'Prensa de piernas', 'cuadriceps', ['gluteos', 'isquios'], 'gym', 'principiante',
      'Empuja la plataforma hasta casi estirar (sin bloquear) y baja controlando.',
      'Bloquear las rodillas de golpe o despegar la cadera.'),
    E('extension_cuadriceps', 'Extensión de cuádriceps', 'cuadriceps', [], 'gym', 'principiante',
      'Sentado, estira las piernas contra el rodillo y baja controlando.',
      'Impulsar con la cadera. Movimiento controlado.'),
    E('sentadilla_bulgara', 'Sentadilla búlgara', 'cuadriceps', ['gluteos', 'isquios'], 'mancuernas', 'intermedio',
      'Un pie atrás en un banco, baja la rodilla delantera y sube. Muy completa para pierna.',
      'Dar el paso demasiado corto. Busca estabilidad.'),
    E('sentadilla_goblet', 'Sentadilla goblet', 'cuadriceps', ['gluteos', 'abdomen'], 'mancuernas', 'principiante',
      'Sujeta una mancuerna en el pecho y baja en sentadilla con el torso erguido.',
      'Inclinar el torso adelante. Pecho arriba.'),
    E('step_up', 'Subidas al cajón (step-up)', 'cuadriceps', ['gluteos'], 'mancuernas', 'principiante',
      'Sube a un cajón empujando con el talón de la pierna de arriba, baja controlando.',
      'Impulsarte con la pierna de abajo. Trabaja la de arriba.'),

    // ---------------- ISQUIOS ----------------
    E('curl_femoral', 'Curl femoral', 'isquios', ['gemelos'], 'gym', 'principiante',
      'Tumbado o sentado en la máquina, lleva el talón al glúteo y baja controlando.',
      'Levantar la cadera. Solo se mueve la rodilla.'),
    E('peso_muerto_rumano', 'Peso muerto rumano', 'isquios', ['gluteos', 'lumbar'], 'mancuernas', 'intermedio',
      'Rodillas casi rectas, baja las mancuernas pegadas a la pierna llevando la cadera atrás.',
      'Redondear la espalda o doblar mucho la rodilla. Siente el estiramiento atrás.'),
    E('curl_nordico', 'Curl nórdico', 'isquios', [], 'peso', 'intermedio',
      'De rodillas con los pies sujetos, baja el cuerpo recto frenando con los femorales.',
      'Doblar la cadera. El cuerpo baja recto como una tabla.'),

    // ---------------- ADUCTORES ----------------
    E('aductor_maquina', 'Aductor en máquina', 'aductores', [], 'gym', 'principiante',
      'Sentado, junta las piernas contra la resistencia y abre controlando.',
      'Soltar de golpe. Controla la vuelta.'),
    E('sentadilla_cossack', 'Sentadilla cosaco', 'aductores', ['cuadriceps', 'gluteos'], 'peso', 'intermedio',
      'Pies muy anchos, baja hacia un lado doblando esa rodilla y estira la otra pierna.',
      'Despegar el talón. Mantén el pie apoyado.'),

    // ---------------- GEMELOS ----------------
    E('elevacion_gemelos', 'Elevación de gemelos', 'gemelos', [], 'peso', 'principiante',
      'De pie, sube sobre las puntas todo lo que puedas y baja estirando el talón.',
      'Rango corto. Sube al máximo y baja del todo.'),
    E('gemelo_sentado', 'Gemelo sentado', 'gemelos', [], 'gym', 'principiante',
      'Sentado con peso en las rodillas, sube y baja los talones con rango completo.',
      'Rebotar. Aprieta arriba 1 segundo.'),
    E('salto_comba', 'Comba (saltar la cuerda)', 'gemelos', ['abdomen'], 'peso', 'principiante',
      'Salta con los tobillos, contacto breve con el suelo. Buen cardio y gemelo.',
      'Saltar muy alto. Saltos pequeños y rápidos.')
  ]

  // ---------------- TIPS ----------------
  window.TIPS = {
    grasa: [
      { t: 'El déficit manda', d: 'Para bajar grasa necesitas comer un poco menos de lo que gastas. Ni pasar hambre ni dietas milagro.', a: 'Esta semana quita las bebidas azucaradas y el picoteo entre horas.' },
      { t: 'Proteína en cada comida', d: 'Ayuda a no perder músculo y te sacia. Una porción del tamaño de tu palma por comida.', a: 'Añade huevo, pollo, atún o yogur a cada comida.' },
      { t: 'Camina cada día', d: 'Los pasos diarios queman más grasa que el cardio puntual y no cansan para el gym.', a: 'Ponte una meta de 8.000 pasos al día.' },
      { t: 'Duerme 7-8h', d: 'Dormir mal aumenta el hambre y bajas menos grasa. Es tan importante como entrenar.', a: 'Fija una hora para apagar el móvil esta semana.' },
      { t: 'Pesas > solo cardio', d: 'Las pesas mantienen el músculo mientras bajas grasa. El cardio suma, pero no lo sustituyas todo por correr.', a: 'Haz tus sesiones de fuerza y añade 2 caminatas.' }
    ],
    masa: [
      { t: 'Superávit controlado', d: 'Para ganar músculo come un poco más de lo que gastas. Subir muy rápido es solo grasa.', a: 'Añade una comida o snack proteico al día y pésate cada semana.' },
      { t: 'Progresa las cargas', d: 'El músculo crece si cada semanas mueves algo más de peso o más reps que antes.', a: 'Apunta tus pesos y sube reps o kilos cuando llegues arriba del rango.' },
      { t: 'Frecuencia 2x', d: 'Entrenar cada músculo 2 veces por semana crece más que hacerlo 1 sola vez a tope.', a: 'Reparte el volumen: no metas todo el pecho en un solo día.' },
      { t: 'Proteína suficiente', d: 'Apunta a ~1,6-2 g por kg de peso al día. Sin ladrillos: comida normal repartida.', a: 'Calcula tu objetivo de proteína y repártelo en 3-4 comidas.' },
      { t: 'Descansa para crecer', d: 'El músculo crece descansando, no en el gym. Duerme y deja días de recuperación.', a: 'Respeta al menos 1-2 días de descanso reales esta semana.' }
    ]
  }

  // ---------------- FAQ / DUDAS ----------------
  window.FAQS = [
    { q: '¿Cuánto peso pongo?', a: 'Elige un peso con el que las últimas 2 reps cuesten pero con buena técnica. Si terminas fácil, sube un poco la próxima. Si no llegas a las reps, baja.' },
    { q: '¿Qué hago si falté un día?', a: 'Nada grave. Retoma donde ibas, no intentes “recuperar” haciendo doble. Si puedes, mueve la sesión a otro día de la semana. La constancia mensual importa más que un día suelto.' },
    { q: '¿Cuántas veces por semana un músculo?', a: 'Lo ideal es 2 veces por semana. Una vez también funciona, pero repartir el trabajo en 2 días suele dar mejores resultados y menos agujetas.' },
    { q: '¿Cardio antes o después?', a: 'Si tu prioridad es fuerza o músculo, haz las pesas primero y el cardio después. Si solo buscas cardio ese día, da igual. Un calentamiento suave siempre al principio.' },
    { q: 'Dolor vs lesión', a: 'Las agujetas y el ardor muscular durante el ejercicio son normales. Un dolor agudo, pinchazo, en una articulación o que va a peor NO lo es: para y descansa. Si persiste varios días, consulta.' },
    { q: '¿Cuánto descanso entre series?', a: 'Fuerza/masa: 90-180s. Tonificar/resistencia: 45-75s. Descansa lo suficiente para hacer las reps con buena técnica.' }
  ]
})();
