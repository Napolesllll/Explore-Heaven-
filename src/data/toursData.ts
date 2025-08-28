// src/data/toursData.ts

export interface Tour {
  id: string;
  nombre: string;
  descripcion: string;
  salida: string;
  regreso: string;
  duracion: string;
  incluido: string[];
  noIncluido: string[];
  outfit: string[];
  itinerario: string[];
  ubicacion: string;
  preguntasFrecuentes?: string[];
  fotos?: string[];
  precio: string; // ← Aquí la ruta de tu imagen
}

export const tours: Tour[] = [
  {
    id: "comuna13",
    nombre: "Tour Comuna 13",
    descripcion:
      "Al caminar por el barrio Comuna 13 de Medellín, uno no puede evitar sentirse confundido. ¿Cómo es posible que un lugar tan hermoso tenga tanta historia oscura? Nuestro recorrido por la Comuna 13 de Medellín explica por qué.\n\nEntre murales y memoria, esta zona, que alguna vez fue epicentro del conflicto armado colombiano, ha logrado reinventarse sin olvidar su pasado. En los años 90 y principios de los 2000, la Comuna 13 fue escenario de enfrentamientos entre guerrillas, paramilitares y fuerzas del Estado, incluyendo la tristemente célebre Operación Orión en 2002, que dejó profundas cicatrices en la comunidad.\n\nHoy, sin embargo, sus calles laberínticas están llenas de color, música y vida. Los grafitis vibrantes no solo decoran las fachadas, sino que cuentan historias de resistencia, dolor y esperanza. Cada mural es una ventana al alma de sus habitantes, que han transformado el miedo en arte y el silencio en rimas de rap.\n\nAl recorrer sus escaleras eléctricas —símbolo de inclusión y progreso— y escuchar las historias de guías locales como Tatam, uno entiende que la belleza de la Comuna 13 no está solo en sus vistas panorámicas o en su arte urbano, sino en la fuerza de una comunidad que decidió no rendirse.\n\nEste recorrido no es solo turístico: es una experiencia emocional, una lección de resiliencia y una invitación a mirar más allá de lo evidente. Porque en la Comuna 13, cada paso es un testimonio de transformación.",
    salida: "1:00 pm",
    regreso: "5:00 pm",
    duracion: "4 Horas",
    incluido: [
      "Recogida y regreso a tu hotel o apartamento",
      "Coche privado con aire acondicionado con conductor bilingüe",
      "Excursión para grupos pequeños",
      "Impuestos municipales",
      "Seguro de viaje",
      "Fotos y videos",
      "Billete para el Metro Cable (1 por persona)",
      "Ingreso: Metro de Medellín",
      "Ingreso: Escaleras Eléctricas de la Comuna 13"
    ],
    noIncluido: [
      "Comida y bebida",
      "Gastos Personales y Souvenirs",
      "Actividades Opcionales Adicionales",
      "Propinas",
      "Lo que no se haya indicado"
    ],
    outfit: [
      "Ropa fresca y deportiva para caminatas cortas o medias",
      "Llevar buso o chaqueta por posible mal clima",
      "Traje o vestido de baño para actividades acuáticas"
    ],
    itinerario: [
      "Metro de Medellín (40 min)",
      "Escaleras Eléctricas de la Comuna 13 (60 min)",
      "Recorrido por la zona de grafitis y shows de arte urbano (3 horas)"
    ],
    ubicacion: "https://www.google.com.co/maps/place/San+Javier,+Medellín",
    fotos: [
      "/images/tours/escalators.jpg",
      "/images/tours/beautiful-view-o.jpg",
      "/images/tours/pintada-en-comuna-medellin.webp"
    ],
    precio: "Desde 0 USD por persona"
  },
  {
    id: "museo-antioquia",
    nombre: "Museo de Antioquia",
    descripcion:
      "El Museo de Antioquia, ubicado en Medellín, Colombia, es un tesoro cultural que cautiva a los visitantes con su rica historia y variada colección de arte. Fundado en 1881, es el primer museo del departamento de Antioquia y el segundo más antiguo de Colombia. Su sede actual, el antiguo Palacio Municipal, se encuentra frente a la emblemática Plaza Botero, en pleno corazón de la ciudad.\n\nEste museo alberga una impresionante colección de obras del maestro Fernando Botero, así como piezas de arte precolombino, moderno y contemporáneo. Además, sus murales de Pedro Nel Gómez y exposiciones temporales ofrecen una mirada profunda a la historia, la identidad y los desafíos sociales de la región.\n\nMás que un espacio de exhibición, el Museo de Antioquia se ha convertido en un agente de transformación social. A través de iniciativas como Museo 360 y programas comunitarios, ha logrado vincular el arte con las realidades del centro de Medellín, generando espacios de diálogo, inclusión y aprendizaje.\n\nVisitar este museo es sumergirse en la memoria cultural de Antioquia, explorar sus múltiples narrativas y descubrir cómo el arte puede ser una herramienta poderosa para el cambio.",
    salida: "10:00 am",
    regreso: "4:00 pm",
    duracion: "6 Horas",
    incluido: [
      "Recogida y regreso a tu hotel o apartamento",
      "Coche privado con aire acondicionado con conductor bilingüe",
      "Seguro de viaje",
      "Fotos y videos",
      "Tarifas del Museo",
      "Ingreso: Museo de Antioquia"
    ],
    noIncluido: [
      "Gastos Personales y Souvenirs",
      "Comidas y bebidas no explícitas en el itinerario",
      "Actividades Opcionales Adicionales",
      "Propinas",
      "Lo que no se haya indicado"
    ],
    outfit: [
      "Outfit urbano y cómodo",
      "Llevar buso o chaqueta por posible mal clima"
    ],
    itinerario: [
      "Transporte hacia el museo (1 hora)",
      "Visita guiada al Museo de Antioquia (2 horas)",
      "Almuerzo en el centro de Medellín (2 horas)",
      "Regreso al hotel (1 hora)"
    ],
    ubicacion: "https://www.google.com/maps/place/Museo+de+Antioquia",
    fotos: [
      "/images/tours/museo-ant.jpg",
      "/images/tours/mus.jpg",
      "/images/tours/museo.jpg"
    ],
    precio: "0 USD por persona"
  },
  {
    id: "tour-experiencia-cafetera-colombia",
    nombre: "Experiencia Cafetera Inigualable en Colombia",
    descripcion:
      "Sumérgete en el corazón de la cultura cafetera de Colombia con un recorrido que va más allá de una simple degustación de café. Este tour ofrece una inmersión sensorial completa en una de las tradiciones más emblemáticas del país. Visita Manizales, Salento y el Valle del Cocora, participa en una experiencia cafetera auténtica y descubre por qué el café colombiano es uno de los mejores del mundo.\n\nEl Eje Cafetero colombiano, reconocido por la UNESCO como Patrimonio de la Humanidad en 2011, es mucho más que una región productora de café: es un paisaje cultural vivo que refleja la historia, el trabajo y la pasión de generaciones enteras. Manizales, con su arquitectura republicana y sus montañas imponentes, ofrece una bienvenida cálida entre neblina y aroma a café recién hecho. Salento, por su parte, es la viva imagen de la Colombia rural, con sus casas coloridas, balcones floridos y la cercanía al majestuoso Valle del Cocora, hogar de las palmas de cera más altas del mundo.\n\nDurante esta experiencia, no solo caminarás entre cafetales y aprenderás sobre el proceso de cultivo, recolección y tostado del café, sino que también te conectarás con la esencia de una cultura que gira en torno a esta bebida. Desde los antiguos Jeep Willys que recorren los caminos rurales hasta las fincas que conservan prácticas tradicionales, cada momento está impregnado de autenticidad.\n\nEste tour es ideal para quienes buscan algo más que turismo: es una oportunidad para entender el alma cafetera de Colombia, disfrutar de paisajes inolvidables y llevarse en el corazón el sabor de una historia que se cultiva en cada grano.",
    salida: "Día 1 a las 7:00 A.M.",
    regreso: "Día 3 a las 7:00 P.M.",
    duracion: "3 días",
    incluido: [
      "Alojamiento",
      "Comidas principales",
      "Recogida y regreso a tu hotel o apartamento",
      "Coche privado con aire acondicionado con conductor bilingüe",
      "Seguro de viaje",
      "Fotos y videos"
    ],
    noIncluido: [
      "Gastos personales y souvenirs",
      "Comidas y bebidas si no están explícito en el itinerario",
      "Actividades opcionales adicionales",
      "Propinas",
      "Lo que no se haya indicado"
    ],
    outfit: [
      "Outfit urbano, recuerda priorizar tu comodidad",
      "Llevar buso o chaqueta porque puede estar haciendo mal clima",
      "Traje o vestido de baño para actividades acuáticas"
    ],
    itinerario: [
      "Día 1: Llegada y Exploración de Manizales",
      "– Llegada por carretera a Manizales, disfrutando de paisajes naturales y gastronomía local.",
      "– Almuerzo típico y recorrido por el Centro Histórico (Catedral, Plaza de Bolívar).",
      "– Excursión al Parque Nacional Natural Los Nevados o visita a Termales del Otoño.",
      "– Cena y descanso en hotel local.",
      "Día 2: Café y Cultura en Salento y Zona Cafetera",
      "– Desayuno y traslado a Salento (1.5 h).",
      "– Almuerzo típico y visita al Valle de Cocora (caminata entre palmas de cera).",
      "– Visita a finca cafetera: tour, recolección, cata y cultura cafetera.",
      "– Cena, tiempo libre en Salento, alojamiento en finca u hotel.",
      "Día 3: Manizales y regreso",
      "– Desayuno y regreso a Manizales.",
      "– Visita al Parque Los Yarumos: senderos, miradores y aves.",
      "– Almuerzo, compras de café y artesanías.",
      "– Traslado al aeropuerto o terminal.",
      "– Fin de la experiencia."
    ],
    ubicacion: "https://www.google.com/maps/place/Valle+de+Cocora/@4.637712,-75.4916449,17z/data=!3m1!4b1!4m6!3m5!1s0x8e38924a03c5355b:0x8d19427653a3da27!8m2!3d4.637712!4d-75.48907!16s%2Fm%2F027cc1f?hl=es&entry=ttu&g_ep=EgoyMDI0MDkwNC4wIKXMDSoASAFQAw%3D%3D",
    fotos: [
      "/images/tours/mani.jpg",
      "/images/tours/salento.jpg",
      "/images/tours/cocora.jpg"
    ],
    precio: "Desde 800 USD por persona"
  },

  {
    id: "tour-vida-nocturna-medellin",
    nombre: "Tour Vida Nocturna en Medellín",
    descripcion:
      "Descubre la vibrante vida nocturna de Medellín con un recorrido exclusivo por las mejores discotecas de la ciudad. Este tour ofrece una experiencia inolvidable para quienes desean disfrutar de música, baile y la auténtica cultura de fiesta paisa. Incluye transporte privado y acceso VIP a los clubes más exclusivos.\n\nProvenza, en el corazón de El Poblado, es el epicentro de la vida nocturna paisa. Sus calles se llenan de energía, luces y ritmos que van desde el reguetón y la salsa hasta la electrónica más sofisticada. Este tour te lleva por una selección de discotecas icónicas como Perro Negro, con su ambiente alternativo y cervezas artesanales; Envy Rooftop, donde la vista panorámica de Medellín se mezcla con cócteles exclusivos; y La House, famosa por su música crossover y atmósfera vibrante.\n\nTambién visitarás lugares como Dulcinea, un espacio VIP frecuentado por celebridades, y Viuz, ideal para los amantes del techno y la electrónica. Cada parada está diseñada para ofrecerte una experiencia única, con acceso preferencial, transporte cómodo y la compañía de un guía que conoce los secretos mejor guardados de la noche paisa.\n\nEste tour no es solo una salida nocturna: es una inmersión en la cultura festiva de Medellín, donde cada club tiene su estilo, cada canción su historia, y cada noche su magia. Prepárate para bailar, brindar y vivir una noche que recordarás por mucho tiempo.",
    salida: "11:30 P.M.",
    regreso: "4:30 A.M.",
    duracion: "1 noche",
    incluido: [
      "Recogida y regreso a tu hotel o apartamento",
      "Coche privado con aire acondicionado con conductor bilingüe",
      "Transporte privado entre las discotecas",
      "Entrada VIP a las discotecas seleccionadas",
      "Fotos y videos",
      "Seguro de viaje"
    ],
    noIncluido: [
      "Comidas y bebidas si no están explícito en el itinerario",
      "Gastos personales y souvenirs",
      "Actividades opcionales adicionales",
      "Propinas",
      "Lo que no se haya indicado"
    ],
    outfit: [
      "Outfit urbano, recuerda priorizar tu comodidad",
      "Llevar buso o chaqueta porque puede estar haciendo mal clima"
    ],
    itinerario: [
      "1. Punto de Encuentro y Recogida – Recogida en hotel o punto céntrico (30 min)",
      "2. Discoteca 1: Perro Negro – Ambiente animado en Provenza, entrada VIP y primeros tragos (4 h)",
      "3. Discoteca 2: Envy Rooftop – Club con vista panorámica y excelente ambiente musical (4 h)",
      "4. Discoteca 3: La House – Música crossover y ambiente vibrante (4 h)",
      "5. Discoteca 4: Dulcinea – Espacio VIP de lujo, popular entre celebridades (duración flexible)",
      "6. Discoteca 5: Viuz – Club especializado en techno y electrónica (duración flexible)",
      "7. Regreso al punto de encuentro u hotel (30 min)"
    ],
    ubicacion: "https://www.google.com.co/maps/place/Provenza/@6.2586103,-75.5935036,13z/data=!4m13!1m2!2m1!1sprovenza+medellin!3m9!1s0x8e4429a96fcffe55:0x61f5f6024f48d1d8!5m2!4m1!1i2!8m2!3d6.2070249!4d-75.5655785!15sChFwcm92ZW56YSBtZWRlbGxpbloTIhFwcm92ZW56YSBtZWRlbGxpbpIBCnBsYXlncm91bmTgAQA!16s%2Fg%2F1tgm3xqd?entry=ttu&g_ep=EgoyMDI0MDgyOC4wIKXMDSoASAFQAw%3D%3D",
    fotos: [
      "/images/tours/nocturna.jpg",
      "/images/tours/provenza.jpg",
      "/images/tours/alumbrado.jpg"
    ],
    precio: "Desde 150 USD por persona"
  },

  {
    id: "pablo-escobar-tour",
    nombre: "Tour Pablo Escobar en Medellín",
    descripcion:
      "¿Necesitas siquiera una razón para inscribirte en un tour de Pablo Escobar en Medellín?\n\nSi te fascina la vida y el legado de Pablo Escobar, quizás quieras unirte a nuestro Tour de Pablo Escobar en Medellín. Se trata de un recorrido de 3 horas que te llevará a algunos de los lugares más emblemáticos relacionados con el famoso capo de la droga. De hecho, verás sus antiguas propiedades, la casa donde fue asesinado y su lugar de descanso final.\n\nPero no se trata de un simple recorrido turístico. Nuestro tour de Pablo Escobar en Medellín es una experiencia inmersiva. De hecho, le permitirá conocer en profundidad la historia y la cultura de Medellín durante la era de Pablo Escobar.\n\nAdemás, un guía experto te acompañará a través de esos tiempos polémicos. Podrá compartir contigo sus historias y perspectivas personales.\n\nDurante las décadas de 1980 y 1990, Medellín fue considerada una de las ciudades más peligrosas del mundo, marcada por el auge del narcotráfico y la violencia generada por el Cartel de Medellín. Pablo Escobar, su líder, acumuló una fortuna estimada en más de 30 mil millones de dólares y dejó una huella profunda en la historia del país. Este tour busca ofrecer una mirada crítica y reflexiva sobre ese pasado, visitando sitios como el Parque Memorial Inflexión, que honra a las víctimas del conflicto urbano y promueve la memoria colectiva.\n\nTambién se exploran espacios como el barrio Loreto (antes conocido como barrio Pablo Escobar), donde se han borrado murales que glorificaban al capo y se han reemplazado por expresiones artísticas que celebran la resiliencia de la comunidad. La experiencia está diseñada para fomentar el diálogo sobre el impacto social del narcotráfico y cómo Medellín ha logrado transformarse en una ciudad vibrante, creativa y resiliente.",
    salida: "10:00 am",
    regreso: "4:00 pm",
    duracion: "6 Horas",
    incluido: [
      "Entrada al Museo de Pablo Escobar",
      "Recogida y regreso a tu hotel o apartamento",
      "Coche privado con aire acondicionado con conductor bilingüe",
      "Seguro de viaje",
      "Fotos y videos"
    ],
    noIncluido: [
      "Gastos Personales y Souvenirs",
      "Comidas y bebidas si no están explícito en el itinerario",
      "Actividades Opcionales Adicionales",
      "Propinas",
      "Lo que no se haya indicado"
    ],
    outfit: [
      "Ropa fresca y deportiva la cual permita hacer caminatas cortas y medias",
      "Llevar buso o chaqueta porque puede estar haciendo mal clima"
    ],
    itinerario: [
      "Punto de Encuentro y Recogida: Transporte (1 Hora)",
      "El Barrio El Poblado: Recorrido (2 Horas)",
      "La Casa de Pablo Escobar (Museo de la Memoria de Pablo Escobar): Visita Guiada (1 Hora)",
      "Parque Memorial Inflexión: Reflexión y Educación (1 Hora)",
      "Regreso: Transporte (1 Hora)"
    ],
    ubicacion: "https://www.google.com/maps/search/barrio+de+pablo+escobar/@6.2317303,-75.5577448,17z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI0MDkwNC4wIKXMDSoASAFQAw%3D%3D",
    fotos: [
      "/images/tours/pabl.webp",
      "/images/tours/nap.jpg",
      "/images/tours/tumba.webp"
    ],
    precio: "200 USD por persona"
  },


  {
    id: "tour-guatape",
    nombre: "Tour a Guatapé y El Peñol",
    descripcion:
      "¡Visitar Medellín sin hacer un Guatapé Tour es como no haber visitado Medellín en absoluto! Este hermoso pueblo colorido, ubicado a solo dos horas de la ciudad, ofrece paisajes naturales impresionantes, actividades acuáticas, historia, arte y mucho más. Disfruta de una experiencia única y completa en este destino imprescindible.\n\nGuatapé, conocido como el pueblo de los zócalos, es una joya arquitectónica y cultural enclavada en el oriente antioqueño. Sus fachadas decoradas con relieves coloridos narran historias de la vida campesina, la colonización y las tradiciones locales. Fundado en 1811, el municipio ha evolucionado de una economía agrícola y ganadera a convertirse en uno de los destinos turísticos más visitados de Colombia, especialmente desde la construcción del embalse de 2.262 hectáreas por parte de las Empresas Públicas de Medellín en la década de 1970.\n\nEl tour también incluye la imponente Piedra del Peñol, un batolito de 220 metros de altura que ofrece una de las vistas panorámicas más espectaculares del país. Subir sus 740 escalones es una experiencia desafiante pero gratificante, rodeada de mitos y leyendas que enriquecen su historia. Algunos relatos locales aseguran que la piedra era objeto de adoración por comunidades prehispánicas, mientras otros afirman que es la punta de un meteorito o que sus grietas fueron hechas por el hacha del diablo.\n\nEste recorrido no solo te conecta con la belleza natural de Antioquia, sino también con su historia, su gente y su capacidad de transformación. Ya sea navegando por la represa, explorando los zócalos o disfrutando de la gastronomía local, Guatapé y El Peñol te ofrecen una experiencia que combina aventura, cultura y descanso en un solo día.",
    salida: "7:00 A.M.",
    regreso: "10:00 P.M.",
    duracion: "1 día",
    incluido: [
      "Recogida y regreso a tu hotel o apartamento",
      "Coche privado con aire acondicionado con conductor bilingüe",
      "Fotos y videos",
      "Seguro de viaje"
    ],
    noIncluido: [
      "Gastos personales y souvenirs",
      "Actividades opcionales adicionales",
      "Comidas y bebidas si no están explícito en el itinerario",
      "Propinas",
      "Lo que no se haya indicado"
    ],
    outfit: [
      "Ropa fresca y deportiva para caminatas cortas o medias",
      "Traje o vestido de baño para actividades acuáticas",
      "Buso o chaqueta por si el clima cambia"
    ],
    itinerario: [
      "1. Inicio de la experiencia: Transporte (3 h) – Recogida y desayuno en la carretera, degustación de frutas locales.",
      "2. Subida al Peñol: Caminata (2 h) – Sube los 740 escalones y disfruta de la vista panorámica.",
      "3. Almuerzo: (2 h) – Elección libre de restaurante en el pueblo con opciones variadas.",
      "4. Recorrido por el pueblo: Caminata (2 h) – Descubre los zócalos coloridos y la historia local.",
      "5. Escoge una experiencia:",
      "5.1. Recorrido en yate por la represa (3 h) – Incluye comida, bebidas, jacuzzi, solárium y recorrido.",
      "5.2. Recorrido en bote por finca del 'Patrón del Mal' (3 h) – Recorrido histórico y regreso en bote.",
      "6. Regreso: Transporte (3 h) – Cena opcional en la carretera y regreso a tu hospedaje."
    ],
    ubicacion: "https://www.google.com.co/maps/place/Guatape,+Guatap%C3%A9,+Antioquia/@6.2311374,-75.1632859,16z/data=!3m1!4b1!4m6!3m5!1s0x8e441d2972edf1bb:0xc8e9c49c096f7adc!8m2!3d6.2337643!4d-75.1592213!16zL20vMDdodnhq?entry=ttu&g_ep=EgoyMDI0MDgyOC4wIKXMDSoASAFQAw%3D%3D",
    fotos: [
      "/images/tours/penol.jpg",
      "/images/tours/peee.jpg",
      "/images/tours/ac.jpg"
    ],
    precio: "Desde 220 USD por persona"
  },


  {
    id: "tour-parapente",
    nombre: "Tour de Parapente en San Félix",
    descripcion:
      "Vuela por los cielos de Medellín con esta experiencia de parapente en San Félix. Si eres un amante de la aventura o simplemente deseas disfrutar de vistas espectaculares mientras te relajas, este tour es ideal para ti. Disfruta de un desayuno local, vuelo con piloto certificado y hermosos miradores del Valle de Aburrá.\n\nSan Félix, un corregimiento del municipio de Bello, se ha convertido en el epicentro del parapente en Antioquia gracias a sus condiciones climáticas ideales y sus vientos constantes que permiten volar durante todo el año. A tan solo 45 minutos de Medellín, este lugar ofrece una experiencia única entre montañas, nubes y paisajes que quitan el aliento. Desde lo alto, se puede observar el extenso Valle de Aburrá, con sus municipios rodeados de verde y la ciudad vibrante extendiéndose en el horizonte.\n\nMás de una docena de empresas operan en la zona, ofreciendo vuelos seguros con pilotos certificados y equipos de última generación. El recorrido comienza con un desayuno tradicional antioqueño, seguido por el ascenso a la zona de vuelo, donde el viento frío y fuerte da la bienvenida a los aventureros. Una vez en el aire, los parapentes danzan como cometas sobre el valle, y quienes se atreven a pedir maniobras acrobáticas viven una descarga de adrenalina inolvidable.\n\nAdemás del vuelo, el tour incluye paradas en miradores locales donde se pueden degustar productos típicos como chocolate artesanal y arepas, y adquirir recuerdos hechos por artesanos de la región. Esta experiencia no solo es una aventura aérea, sino también una conexión profunda con la naturaleza, la cultura local y la emoción de volar.",
    salida: "9:00 A.M.",
    regreso: "1:00 P.M.",
    duracion: "4 horas",
    incluido: [
      "Vuelo en parapente",
      "Recogida y regreso a tu hotel o apartamento",
      "Coche privado con aire acondicionado con conductor bilingüe",
      "Seguro de viaje",
      "Fotos y videos"
    ],
    noIncluido: [
      "Gastos personales y souvenirs",
      "Comidas y bebidas si no están explícito en el itinerario",
      "Actividades opcionales adicionales",
      "Propinas",
      "Lo que no se haya indicado"
    ],
    outfit: [
      "Outfit urbano cómodo",
      "Buso o chaqueta por si el clima es frío"
    ],
    itinerario: [
      "1. Recogida y desayuno en ruta (1 h) – Te recogemos en tu alojamiento o en la Iglesia del parque del Poblado y disfrutarás un desayuno tradicional con frutas frescas.",
      "2. Vuelo en parapente (1 h) – Sobrevuela Medellín con un piloto certificado y, si deseas, pide maniobras acrobáticas.",
      "3. Parada en miradores (1 h) – Disfruta de vistas espectaculares del Valle de Aburrá, compra recuerdos y prueba productos locales como chocolate y arepas.",
      "4. Regreso al hotel (1 h) – Finaliza la experiencia con un transporte cómodo de regreso."
    ],
    ubicacion: "https://www.google.com.mx/maps/place/San+Felix,+Bello,+Antioquia/@6.3447133,-75.6112469,15z/data=!3m1!4b1!4m6!3m5!1s0x8e442e5c8cea6e43:0x59ae967126fae86c!8m2!3d6.33999!4d-75.59307!16s%2Fg%2F11bc8bkbfy?entry=ttu&g_ep=EgoyMDI0MDgyOC4wIKXMDSoASAFQAw%3D%3D",
    fotos: [
      "/images/tours/felix.jpg",
      "/images/tours/e4.jpg",
      "/images/tours/pa.jpg"
    ],
    precio: "Desde 120 USD por persona"
  },

  {
    id: "tour-atv-medellin",
    nombre: "Tour en ATV por las montañas de Medellín",
    descripcion:
      "¡Vive una experiencia única y llena de adrenalina con nuestros tours en ATV en Medellín! Recorre rutas emocionantes con quads 4x4, sumérgete en la vibrante naturaleza de Colombia y vive paisajes impresionantes. No necesitas experiencia previa. Todo está incluido para que solo disfrutes. Somos la empresa número 1 en tours de ATV en Medellín. ¡Prepárate para una aventura épica que recordarás por siempre!\n\nEl turismo de aventura en Medellín ha evolucionado significativamente desde principios de los 2000, cuando la ciudad comenzó a reinventarse como un destino seguro y vibrante. Los tours en ATV surgieron como una alternativa emocionante para explorar las montañas, ríos y senderos rurales que rodean el Valle de Aburrá. Hoy, esta actividad se ha consolidado como una de las favoritas entre viajeros que buscan adrenalina y contacto directo con la naturaleza.\n\nEste tour te lleva por caminos escarpados, bosques nublados y paisajes que parecen sacados de una postal. Los quads 4x4 de 450cc permiten recorrer terrenos difíciles con facilidad, mientras que los guías locales, expertos en seguridad y cultura, enriquecen la experiencia con historias y datos curiosos sobre la región. Además, el recorrido incluye una parada en el Río Buey, donde puedes nadar en aguas cristalinas rodeado de vegetación exuberante.\n\nLa experiencia también ofrece momentos de descanso y contemplación: desde una piscina infinita con vista a las montañas hasta un almuerzo típico paisa que celebra los sabores de Antioquia. Este tour no solo es una aventura sobre ruedas, sino una inmersión en la biodiversidad, la gastronomía y la hospitalidad de las montañas paisas.",
    salida: "8:00 A.M.",
    regreso: "5:00 P.M.",
    duracion: "Todo el día (aproximadamente 9 horas)",
    incluido: [
      "Recogida y regreso a tu hotel o apartamento",
      "Coche privado con aire acondicionado con conductor bilingüe",
      "Seguro de viaje",
      "Fotos y videos",
      "Quads 4x4 de 450cc",
      "Diversos senderos",
      "Equipo de seguridad",
      "Snacks",
      "Guías de habla inglesa"
    ],
    noIncluido: [
      "Gastos personales y souvenirs",
      "Comidas y bebidas si no están explícitas en el itinerario",
      "Actividades opcionales adicionales",
      "Propinas",
      "Lo que no se haya indicado"
    ],
    outfit: [
      "Ropa fresca y deportiva adecuada para caminatas cortas o medias",
      "Buzo o chaqueta en caso de clima frío"
    ],
    itinerario: [
      "1. Inicio de la experiencia y transporte (2 h): Recogida en tu alojamiento o punto acordado. Viaje hacia el sur de Medellín, subiendo a las montañas en una furgoneta cómoda y climatizada.",
      "2. Experiencia ATV (5 h): Tras una instrucción profesional, recorrerás rutas emocionantes hasta el Río Buey donde podrás nadar. Disfruta un almuerzo típico paisa, vistas espectaculares y para los más aventureros, un verdadero sendero 4x4. Alternativamente, puedes relajarte en la piscina infinita con una bebida refrescante. ¡Todo incluido!",
      "3. Regreso (2 h): Vuelta a tu alojamiento para cerrar esta experiencia intensa y memorable."
    ],
    ubicacion: "https://www.google.com.mx/maps/place/Reserva+Natural+Tahamies/@6.2644079,-75.4491241,17z/data=!3m1!4b1!4m6!3m5!1s0x8e4427598d72d925:0x6dd83a25033e36ad!8m2!3d6.2644079!4d-75.4465492!16s%2Fg%2F11lrl9m0wd?entry=ttu",
    fotos: [
      "/images/tours/99.jpg",
      "/images/tours/biker.jpg",
      "/images/tours/can.webp"
    ],
    precio: "Desde 200 USD por persona",
    preguntasFrecuentes: []
  },


  {
    id: "tour-vuelo-guatape",
    nombre: "Vuelo Panorámico sobre Guatapé",
    descripcion:
      "Tenemos los mejores planes para volar sobre uno de los paisajes más espectaculares de Colombia. Sorprende a tu familia o vive una experiencia única en vuelos privados o compartidos. Desde el cielo podrás admirar la majestuosa represa, la icónica Piedra del Peñol y sus islas, volando a 500 metros de altura y a 150 km/h. Una experiencia inolvidable que combina adrenalina, lujo y paisajes sin igual.\n\nGuatapé, con sus zócalos coloridos y calles vibrantes, es uno de los destinos más encantadores de Antioquia. Pero desde el aire, su belleza adquiere una dimensión completamente nueva. El vuelo panorámico permite contemplar la inmensidad de la represa de Guatapé, un embalse artificial creado en los años 70 que transformó el paisaje y dio origen a un sistema de islas que parecen flotar entre montañas.\n\nUno de los puntos más destacados del recorrido es la Piedra del Peñol, un batolito de 220 metros de altura que ha sido símbolo de la región desde tiempos prehispánicos. Los indígenas tahamíes la consideraban un lugar sagrado, y su primera escalada oficial en 1954 marcó el inicio de su fama turística. Hoy, miles de visitantes suben sus 740 escalones cada año, pero solo desde el aire se puede apreciar su forma imponente y la grieta natural que la atraviesa.\n\nEste tour es ideal para quienes buscan una experiencia exclusiva, ya sea en vuelos compartidos o privados, con opciones que incluyen fotografía profesional, bebidas, snacks y atención personalizada. Más que un paseo aéreo, es una celebración de la majestuosidad natural y cultural de Guatapé, perfecta para ocasiones especiales o simplemente para vivir Colombia desde las alturas.",
    salida: "Horario bajo reserva",
    regreso: "Horario bajo reserva",
    duracion: "6 a 12 minutos de vuelo (dependiendo del plan elegido) + tiempo de traslado",
    incluido: [
      "Vuelo inicialmente desde Guatapé",
      "Recogida y regreso a tu hotel o apartamento",
      "Coche privado con aire acondicionado con conductor bilingüe",
      "Fotos y videos",
      "Seguro de viaje"
    ],
    noIncluido: [
      "Gastos personales y souvenirs",
      "Comidas y bebidas si no están explícitos en el itinerario",
      "Actividades opcionales adicionales",
      "Propinas",
      "Lo que no se haya indicado"
    ],
    outfit: [
      "Outfit urbano, priorizando la comodidad",
      "Buzo o chaqueta en caso de mal clima"
    ],
    itinerario: [
      "Individual: Vuelo compartido de 6 minutos recorriendo la represa, el malecón y alrededores del Peñol.",
      "Familiar: Vuelo para hasta 6 personas por 6 minutos sobre Guatapé. *Sujeto a peso y disponibilidad (máx. 400 kg)*.",
      "Privado: Vuelo privado de 6 minutos para máximo 2 personas sobre los lugares más representativos de Guatapé.",
      "Individual Premium: Vuelo compartido de 12 minutos por la represa, malecón y alrededores.",
      "Familiar Premium: Vuelo de 12 minutos para hasta 6 personas sobre todo Guatapé. *Sujeto a peso (400 kg)*.",
      "Privado Premium: Vuelo de 12 minutos para máximo 2 personas sobre la piedra y el malecón.",
      "Black Luxury: Vuelo para 6 personas. Incluye foto digital e impresa, reel de 15 segundos, snacks y bebidas.",
      "Gold Luxury: Vuelo para 6 personas. Foto digital e impresa, reel de 30 segundos, snacks y bebidas.",
      "STAND BY 2HRS: Traslado Medellín - Guatapé - Medellín. Sobrevuelo represa y Piedra del Peñol. Incluye snacks, bebidas, host personalizado y 2 horas de espera en Guatapé.",
      "FULL DAY: Traslado Medellín - Guatapé - Medellín con tiempo libre de espera desde las 8 a.m. hasta las 5 p.m."
    ],
    ubicacion: "https://www.google.com/maps/place/Hotel+Los+Recuerdos/@6.2272911,-75.1828488,17z/data=!3m1!4b1!4m9!3m8!1s0x8e46a7f756e3022d:0x7a1f526738441b7d!5m2!4m1!1i2!8m2!3d6.2272911!4d-75.1802739!16s%2Fg%2F11b8v9qd0b?entry=ttu",
    precio: "Desde 150 USD por persona",
    preguntasFrecuentes: [],
    fotos: [
      "/images/tours/hel.jpg",
      "/images/tours/biker.jpg",
      "/images/tours/can.webp"
    ]
  },

  {
    id: "tour-hacienda-napoles",
    nombre: "Tour a la Hacienda Nápoles",
    descripcion:
      "Explora un parque temático que fue propiedad de Pablo Escobar en un recorrido privado desde Medellín. Sumérgete en una historia única y descubre cómo este lugar se transformó en un espacio de conservación, educación y entretenimiento para toda la familia. Observa animales salvajes, disfruta de atracciones acuáticas, jardines temáticos y conoce a Vanesa, la mascota del parque. ¡Un recorrido que mezcla naturaleza, historia y mucha diversión!\n\nLa Hacienda Nápoles, ubicada en Puerto Triunfo, Antioquia, fue originalmente una finca privada construida en 1978 por Pablo Escobar. En su época, contaba con lujos extravagantes como una pista de aterrizaje, zoológico con especies exóticas, lagos artificiales, esculturas, y hasta una réplica del avión con el que inició su imperio criminal. Tras la caída del Cartel de Medellín, la propiedad pasó a manos del Estado colombiano y permaneció en abandono hasta que, en 2007, comenzó su transformación en parque temático.\n\nHoy, el Parque Temático Hacienda Nápoles es un símbolo de renovación. Con más de 3.000 hectáreas, se ha convertido en un santuario de fauna y flora, con áreas dedicadas a la conservación de especies amenazadas, educación ambiental y recreación familiar. El parque alberga hipopótamos, tigres, jirafas, cebras y muchas otras especies, además de zonas acuáticas, museos, aviarios y jardines temáticos. Su enfoque actual busca cambiar la narrativa de violencia por una de aprendizaje, naturaleza y resiliencia.\n\nEste tour es ideal para quienes desean conocer una parte importante de la historia reciente de Colombia, mientras disfrutan de un día lleno de aventura, reflexión y diversión. Es una experiencia que conecta el pasado con el presente, mostrando cómo un lugar marcado por la controversia puede convertirse en un espacio de esperanza y transformación.",
    salida: "6:00 a.m.",
    regreso: "8:00 p.m.",
    duracion: "14 horas (incluye transporte y recorrido en el parque)",
    incluido: [
      "Recogida y regreso a tu hotel o apartamento",
      "Coche privado con aire acondicionado con conductor bilingüe",
      "Seguro de viaje",
      "Fotos y videos",
      "Tarifas del Parque Nacional",
      "Ingreso/entrada al Parque Temático Hacienda Nápoles"
    ],
    noIncluido: [
      "Comidas y bebidas",
      "Entrada al parque acuático",
      "Hospedaje",
      "Actividades opcionales adicionales",
      "Propinas",
      "Lo que no se haya indicado"
    ],
    outfit: [
      "Ropa fresca y deportiva para caminatas",
      "Traje o vestido de baño para actividades acuáticas",
      "Buzo o chaqueta por si el clima cambia"
    ],
    itinerario: [
      "1. Inicio de la experiencia (3 horas): Recogida en tu hotel o en la Iglesia del parque del Poblado. Durante el camino puedes disfrutar del desayuno y paisajes hermosos.",
      "2. Visita al Parque Temático Hacienda Nápoles (8 horas): Recorrido completo por la propiedad. Verás animales como hipopótamos, tigres, jirafas y muchos más. Incluye ingreso general y guía bilingüe privado.",
      "3. Regreso (3 horas): Oportunidad para cenar en el camino y regreso cómodo hasta la puerta de tu hospedaje."
    ],
    ubicacion: "https://www.google.com/maps/place/Parque+Tem%C3%A1tico+Hacienda+Napoles/",
    fotos: [
      "/images/tours/napoles.jpg",
      "/images/tours/biker.jpg",
      "/images/tours/can.webp"
    ],
    precio: "Desde 300 USD por persona",
    preguntasFrecuentes: []
  },


  {
    id: "tour-pueblito-paisa",
    nombre: "Tour al Pueblito Paisa",
    descripcion:
      "El Pueblito Paisa es una réplica a escala real de un pueblo tradicional antioqueño del siglo XIX. Recorre sus calles empedradas, visita casas típicas, prueba la gastronomía local y disfruta de la música y cultura tradicional. Desde su mirador podrás disfrutar de una de las mejores vistas panorámicas de Medellín.\n\nUbicado en la cima del Cerro Nutibara, el Pueblito Paisa fue inaugurado en 1978 como un homenaje a las tradiciones rurales de Antioquia. Su arquitectura criolla combina técnicas indígenas como el bahareque con influencias coloniales españolas, y está organizada alrededor de una plaza central con iglesia, alcaldía, barbería, escuela y fonda, tal como se hacía en los pueblos de antaño.\n\nEste lugar es considerado patrimonio cultural y ambiental de Medellín, y funciona como museo vivo al aire libre. Además de sus construcciones típicas, alberga el Museo Ciudad, el Parque de las Esculturas y senderos ecológicos que permiten explorar la fauna y flora del Valle de Aburrá. La escultura del Cacique Nutibara, obra de José Horacio Betancur, preside el lugar como símbolo de la identidad paisa.\n\nDurante festividades como la Feria de las Flores o la temporada decembrina, el Pueblito Paisa se llena de música, trovadores, artesanías y gastronomía típica, convirtiéndose en un punto de encuentro entre lo ancestral y lo contemporáneo. Es el sitio perfecto para entender el alma antioqueña, disfrutar de una bandeja paisa con mazamorra, y tomarse una foto en una tradicional chiva decorada.",
    salida: "3:00 p.m.",
    regreso: "6:00 p.m.",
    duracion: "3 horas",
    incluido: [
      "Recogida y regreso a tu hotel o apartamento",
      "Coche privado con aire acondicionado con conductor bilingüe",
      "Seguro de viaje",
      "Fotos y videos"
    ],
    noIncluido: [
      "Gastos personales y souvenirs",
      "Comidas y bebidas si no están explícitas en el itinerario",
      "Actividades opcionales adicionales",
      "Propinas",
      "Lo que no se haya indicado"
    ],
    outfit: [
      "Outfit urbano cómodo",
      "Llevar buso o chaqueta por si hace mal clima"
    ],
    itinerario: [
      "1. Inicio de la experiencia: Transporte (1 hora) – Recogida en tu hospedaje o la iglesia del Parque del Poblado.",
      "2. Recorrido por el Pueblito Paisa (1 hora) – Explora calles, arquitectura y mirador con vistas de la ciudad.",
      "3. Visita a restaurantes de comida típica colombiana (1 hora) – Oportunidad para degustar platos tradicionales como bandeja paisa, arepas o empanadas.",
      "4. Regreso: Transporte (1 hora) – Te llevamos de vuelta al lugar donde te estés hospedando."
    ],
    ubicacion: "https://www.google.com/maps/place/Pueblito+Paisa/",
    fotos: [
      "/images/tours/pueb.jpeg",
      "/images/tours/biker.jpg",
      "/images/tours/can.webp"
    ],
    precio: "60 USD por persona",
    preguntasFrecuentes: []
  },


  {
    id: "tour-metro-medellin",
    nombre: "Tour por el Sistema Metro de Medellín",
    descripcion:
      "Explora el sistema de transporte más innovador de Colombia: el Metro, Tranvía, Teleférico, Metroplús y rutas integradas. Conoce cómo transformó la ciudad y vive la experiencia de viajar como un local por los corredores más icónicos de Medellín. Este recorrido incluye historia, cultura y vistas panorámicas impresionantes del Valle de Aburrá.\n\nEl Metro de Medellín, inaugurado en 1995, es mucho más que un medio de transporte: es un símbolo de transformación urbana, orgullo ciudadano y resiliencia colectiva. Fue el primer sistema ferroviario moderno en Colombia y se convirtió en el eje articulador de la movilidad en el Valle de Aburrá. Su desarrollo incluyó la participación activa de la comunidad y dio origen a la reconocida “Cultura Metro”, basada en el respeto, la limpieza y el civismo.\n\nHoy, el sistema cuenta con líneas de tren, tranvía, buses articulados (Metroplús) y metrocables que conectan zonas de difícil acceso en las laderas de la ciudad. Medellín fue pionera mundial en integrar teleféricos como transporte público masivo, logrando reducir trayectos de dos horas a tan solo treinta minutos. Esta innovación ha sido reconocida internacionalmente, ubicando al Metro de Medellín entre los diez mejores sistemas de transporte del mundo.\n\nDurante el tour, los visitantes no solo recorren estaciones emblemáticas como Parque Berrío y San Antonio, sino que también descubren cómo el sistema ha influido en el desarrollo social, económico y ambiental de la ciudad. Desde el tranvía de Ayacucho, que revitalizó un corredor cultural, hasta el Metrocable que lleva al Parque Arví, cada trayecto revela una historia de progreso y conexión.\n\nEste tour es ideal para quienes desean entender Medellín desde su infraestructura más representativa, viajando entre arte urbano, arquitectura moderna y paisajes que narran el renacer de una ciudad.",
    salida: "10:00 a.m.",
    regreso: "3:00 p.m.",
    duracion: "5 horas",
    incluido: [
      "Recogida y regreso a tu hotel o apartamento",
      "Coche privado con aire acondicionado con conductor bilingüe",
      "Seguro de viaje",
      "Fotos y videos",
      "Tasas de funicular y metro"
    ],
    noIncluido: [
      "Gastos personales y souvenirs",
      "Comidas y bebidas si no están explícitas en el itinerario",
      "Actividades opcionales adicionales",
      "Propinas",
      "Lo que no se haya indicado"
    ],
    outfit: [
      "Outfit urbano cómodo",
      "Llevar buso o chaqueta por si hace mal clima"
    ],
    itinerario: [
      "1. Punto de Encuentro y Recogida (30 minutos) – Recogida en tu hotel o en punto céntrico.",
      "2. Desplazamiento hasta la estación Parque Berrío (2 horas) – Recorrido por el centro de Medellín, visita a tiendas y zonas turísticas.",
      "3. Visita a la Catedral Metropolitana de Medellín (1 hora) – Un lugar con gran valor histórico durante la época de Pablo Escobar.",
      "4. Desplazamiento en tranvía (1 hora) – Viaje panorámico por el corazón de Medellín.",
      "5. Recorrido en teleférico hasta la Estación Villa Sierra (30 minutos) – Vistas espectaculares del Valle de Aburrá y sus montañas."
    ],
    ubicacion: "https://www.google.com/maps/place/Medell%C3%ADn,+Antioquia/",
    fotos: [
      "/images/tours/Metro.webp",
      "/images/tours/biker.jpg",
      "/images/tours/metro.webp"
    ],
    precio: "80 USD por persona",
    preguntasFrecuentes: []
  }











];