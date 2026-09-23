/* Cierra y Lucra · mapa de alto valor. Números solo si están publicados. */
const CIERRA_URL = "https://akashahub.com.br/cierraelucra/";

const CIERRA_SISTEMAS = [
  {
    id: "casa",
    t: "Casa",
    kid: "La casa en el móvil. Nombre, cara, Google y un botón. Quien no pasó por la puerta también compra.",
    entra: ["Una página con su nombre", "Google: dirección, horario, mapa", "Botón de WhatsApp", "La misma cara que la fachada"],
    no: ["Obra infinita", "Tráfico pagado", "App"],
    nota: "O Legado. Igual ao Se Plante: a casa nova no celular. Só quando NÃO existe site."
  },
  {
    id: "capa",
    t: "Capa",
    kid: "Ya tienen casa. No se reconstruye. Se pone la capa que falta: un solo camino, y que Google entregue esta puerta.",
    entra: ["Un camino, no cinco", "Ficha de Google de esta sede", "Botón que cae en la persona que decide"],
    no: ["Otro sitio encima del que ya funciona", "Hablar mal del Instagram"],
    nota: "Já tem site. Não venda obra. Venda a camada."
  },
  {
    id: "academy",
    t: "Academy",
    kid: "La clase termina y el alumno se va. La Academy es la casa del miembro: camino, clase, comunidad, retorno.",
    entra: ["Casa de miembros", "Camino claro", "Clase o protocolo", "Un motivo para volver"],
    no: ["Otra red social", "Depender solo de Wellhub, ClassPass o Mindbody"],
    nota: "O molde da Fluir Academy (akashahub.com.br/academy). O aluno fica na casa deles, não no app do outro."
  },
  {
    id: "movimiento",
    t: "Movimiento",
    kid: "La noche tiene puertas. Cada puerta es una presencia. El invitado vuelve. La casa ve quién quedó.",
    entra: ["Circuito de la noche", "Puertas con sello", "Lista de quien volvió", "Un patrocinador por puerta, si cabe"],
    no: ["Un juego de niños", "Prometer que va a viralizar"],
    nota: "É o circuito que você pensou pro Zé Augusto: balizas, presença, a noite como sistema. Já existe em akashahub.com.br/circuito e /eventos. Não abre com o nome dele."
  },
  {
    id: "plataforma",
    t: "Plataforma",
    kid: "Cuando la casa y la comunidad ya existen, se conectan. Varias sedes, un solo miembro. Esto llega después, no en la primera frase.",
    entra: ["Varias puertas, un miembro", "Lo que la Academy ya probó, ahora entre casas"],
    no: ["Abrir la call con una app", "Prometer la plataforma antes de la casa"],
    nota: "Convergência é esta camada. Só depois. Na primeira call, não."
  }
];

const CIERRA_PREGUNTA = "De cero a diez, ¿resolver esto ahora te importa?";

const CIERRA_BEATS = [
  { n: "01", t: "Honra", d: "Lo que ya funciona, se queda. No se tira nada." },
  { n: "02", t: "Un punto", d: "Una frase. La capa que falta. No un inventario de SEO." },
  { n: "03", t: "Pieza", d: "Se abre con su nombre. Cuarenta segundos. No se construye en la llamada." },
  { n: "04", t: "Pregunta", d: "De cero a diez. Y silencio." },
  { n: "05", t: "Diez", d: "Si es diez, el ciclo. Si es siete, qué falta. Si no es, se agradece." }
];

const CIERRA_NUNCA = [
  "No decir el precio primero.",
  "No decir cincuenta por ciento de descuento.",
  "No reconstruir lo que ya les funciona.",
  "No soltar SEO, embudo, tráfico, inteligencia artificial.",
  "No abrir con una app ni con Convergencia.",
  "No vender cannabis ni nada ilegal.",
  "No hablar mal de su Instagram ni de su web.",
  "No construir cuatro horas en su wifi. La pieza ya está."
];

const CIERRA_FAIXAS = [
  { id: "lectura", t: "Lectura", es: "Miramos lo que hay. Decimos lo que falta. Una página.", eur: "800–1.500 €", usd: "900–1.600 USD", nota: "Se pedirem número cedo, isto é o diagnóstico. Não é o sistema." },
  { id: "casa", t: "Casa", es: "Primer ciclo. Casa en el móvil, cara, Google, botón.", eur: "3.500–7.000 €", usd: "4.000–8.000 USD", nota: "Faixa interna. Ajusta na call. Agência em Barcelona cobra a obra inteira, bem acima disto." },
  { id: "sistema", t: "Sistema", es: "Academy o Movimiento. La casa que se queda cuando la clase o la noche termina.", eur: "8.000–18.000 €", usd: "9.000–20.000 USD", nota: "Não fale 50% off. Fale recorte: um ciclo, não a obra infinita." }
];

const CIERRA_LINEA_PRECIO = "No es un descuento. Es un ciclo. No estás comprando la obra de una agencia. Estás comprando el primer sistema, con tu nombre.";

const CIERRA_PRUEBA = [
  { t: "Academy", d: "Casa de miembros. Camino, clase, eventos. Ya está en marcha.", href: "https://akashahub.com.br/academy" },
  { t: "Circuito", d: "La noche en puertas. Presencia, no un post.", href: "https://akashahub.com.br/circuito/" },
  { t: "Eventos", d: "El encuentro como sistema, no como story.", href: "https://akashahub.com.br/eventos/" },
  { t: "Casa", d: "Una casa digital armada antes de la reunión, con el nombre del comercio.", href: "https://akashahub.com.br/777projetoseplantesistem777/" }
];

const CIERRA_STATUS = [
  { id: "mapa", t: "Mapa" },
  { id: "llame", t: "Llamé" },
  { id: "mostre", t: "Mostré" },
  { id: "propuesta", t: "Propuesta" },
  { id: "cerro", t: "Cerró" },
  { id: "no", t: "No" }
];

const CIERRA_PLACES = [
  {
    id: "beyoga",
    name: "Beyoga",
    city: "Barcelona",
    country: "España",
    where: "Carrer Buenos Aires 52 · Eixample",
    cat: "Pilates y yoga boutique",
    sistema: "academy",
    wa: "34639179123",
    waNote: "publicado en la web",
    tel: "34934197781",
    site: "https://beyogabcn.com",
    has: "Web, WhatsApp, varias zonas (Eixample, Diagonal, Les Corts, Sant Gervasi), pilates clásico y yoga.",
    falta: "El alumno termina la clase y la casa no lo sigue. Falta la casa del miembro.",
    abre: "Hola. Pasé por Beyoga, en Buenos Aires. El estudio ya está claro. Vi una sola capa: la clase termina y el alumno se va. Puedo enseñarte en cuarenta segundos una academy con vuestro nombre, sin cambiar el estudio.",
    recado: "Hola. Pasé por Beyoga. Lo que ya tenéis funciona. Quería enseñarte una capa, sin cambiar el estudio. Cuarenta segundos.",
    nota: "Não venda site. Eles já têm. A dor é retenção do aluno. Academy no molde da Flui. Eixample é poder de compra."
  },
  {
    id: "balance",
    name: "Balance Studio",
    city: "Barcelona",
    country: "España",
    where: "Carrer de Girona 115 · Eixample",
    cat: "Pilates boutique",
    sistema: "academy",
    wa: "34630829433",
    waNote: "la web muestra WhatsApp junto al móvil",
    tel: "34934766034",
    site: "https://www.balancestudio.es",
    has: "Web de boutique, móvil y fijo. Se presentan como el primer pilates boutique de Barcelona.",
    falta: "La marca es clara. El miembro todavía no tiene una casa propia fuera de la hora de clase.",
    abre: "Hola. Pasé por Balance, en Girona. La casa ya se entiende. Vi un punto: quien prueba no tiene dónde quedarse después de la clase. Cuarenta segundos, con vuestro nombre, sin tocar lo que ya funciona.",
    recado: "Hola. Pasé por Balance Studio. La casa ya se entiende. Quería mostrar una capa para quien prueba y todavía no se queda. Cuarenta segundos.",
    nota: "Confirmar na call se o 630 829 433 ainda é o WhatsApp. Site existe. Academy, não obra."
  },
  {
    id: "yogaone",
    name: "YogaOne Aragó",
    city: "Barcelona",
    country: "España",
    where: "Eixample · Aragó",
    cat: "Yoga",
    sistema: "academy",
    wa: "34616093854",
    waNote: "WhatsApp de reservas Urban Sports · puede no ser dirección",
    site: "https://yogaonearagoeixample.com",
    has: "Web, más de cuarenta clases, Wellhub y Urban Sports.",
    falta: "Parte de la agenda vive en la plataforma de otro. La casa no es dueña del miembro.",
    abre: "Hola. Vi YogaOne en el Eixample. La oferta de clases ya es grande. El punto es otro: quien entra por una plataforma se queda en la plataforma. Puedo enseñarte la casa del miembro, sin quitar lo que ya llena la sala.",
    recado: "Hola. Vi YogaOne. Las clases ya funcionan. Quería mostrar una casa para el miembro, sin quitar lo que ya llena la sala. Cuarenta segundos.",
    nota: "O Zap publicado é o de reserva do Urban Sports. Pode não ser o dono. Confirma quem decide. Não ataques a Wellhub. Mostra a casa por cima."
  },
  {
    id: "sabda",
    name: "SABDA",
    city: "Barcelona",
    country: "España",
    where: "Carrer de Muntaner 83B · Eixample",
    cat: "Wellness inmersivo",
    sistema: "movimiento",
    email: "connect@sabdastudio.com",
    site: "https://sabdastudio.com",
    has: "Estudio inmersivo, membresía, alquiler para eventos y corporativo. Sin WhatsApp público.",
    falta: "La noche y el evento corporativo todavía se piden por correo. Falta el circuito: puertas, presencia, retorno.",
    abre: "Hola. Pasé por SABDA, en Muntaner. El espacio ya es otra cosa. Vi un punto: el evento todavía se pide por correo. Puedo enseñarte el circuito de la noche, con vuestro nombre, sin tocar la clase.",
    recado: "Hola. Escribo por SABDA. El espacio ya funciona. Quería enseñar el circuito de una noche, sin cambiar la clase. Cuarenta segundos.",
    nota: "Sem WhatsApp público. E-mail connect@sabdastudio.com. Não inventes número. Movimiento: a noite com portas. Encaixa no que você pensou pro Zé. Eles já alugam o espaço."
  },
  {
    id: "vive",
    name: "Vive Pilates",
    city: "Madrid",
    country: "España",
    where: "Calle de Menorca 36 · Retiro",
    cat: "Pilates",
    sistema: "academy",
    wa: "34614527636",
    waNote: "WhatsApp publicado en la web",
    tel: "34915063507",
    email: "Vivepilatesmadrid@gmail.com",
    site: "https://vivepilatesmadrid.com",
    has: "Web, WhatsApp, fijo, y la reserva puesta en Mindbody.",
    falta: "La agenda es de otro. El alumno no tiene casa en Vive cuando cierra la app.",
    abre: "Hola. Pasé por Vive, en Menorca. La reserva ya funciona. Vi una capa: el alumno vive en la aplicación de otro. Puedo enseñarte la casa, con vuestro nombre, sin apagar lo que ya reserva.",
    recado: "Hola. Pasé por Vive Pilates. La reserva ya funciona. Quería mostrar la casa del alumno, sin apagar lo que ya reserva. Cuarenta segundos.",
    nota: "Retiro, ao lado de Salamanca. Mindbody é a dependência. Academy por cima. Zap confirmado na web."
  },
  {
    id: "pinar",
    name: "Pinar Pilates",
    city: "Madrid",
    country: "España",
    where: "Calle del Pinar 8 · Salamanca",
    cat: "Reformer boutique",
    sistema: "academy",
    cel: "34611994729",
    email: "hola@pinarpilates.com",
    site: "https://pinarpilates.com",
    has: "Web, estudio nuevo en Salamanca, grupos de ocho, teléfono publicado como llamada.",
    falta: "Casa clara y chica. Todavía no hay un sistema para que quien prueba se quede.",
    abre: "Hola. Vi Pinar, en Salamanca. El estudio ya se entiende: pocos, bien. El punto es el después de la prueba. Cuarenta segundos, con vuestro nombre.",
    recado: "Hola. Vi Pinar Pilates. El estudio ya se entiende. Quería mostrar qué pasa después de la clase de prueba. Cuarenta segundos.",
    nota: "Salamanca é o bairro. O número é telefone na web, NÃO está marcado como WhatsApp. Liga ou confirma. Não marques como Zap."
  },
  {
    id: "fbs",
    name: "FBS Beauty",
    city: "Marbella",
    country: "España",
    where: "Av. Ricardo Soriano 54",
    cat: "Estética",
    sistema: "academy",
    wa: "34633782536",
    waNote: "WhatsApp publicado en la web",
    site: "https://fbs.beauty",
    has: "Web y WhatsApp en el centro de Marbella. Consulta de rostro y cuerpo.",
    falta: "La visita termina y la clienta no tiene un protocolo que la traiga de vuelta.",
    abre: "Hola. Pasé por FBS, en Ricardo Soriano. La consulta ya tiene puerta. Vi un punto: después de la visita, la clienta no tiene casa. Puedo enseñarte ese seguimiento, con vuestro nombre, sin hablar de un tratamiento.",
    recado: "Hola. Pasé por FBS Beauty. La consulta ya tiene puerta. Quería mostrar el seguimiento, sin cambiar lo que ya hacéis. Cuarenta segundos.",
    nota: "Clínica. Não fale de procedimento, não prometa resultado. Fale da casa depois da visita. Marbella paga. Academy = protocolo de retorno, não medicina."
  },
  {
    id: "mba",
    name: "Marbella Beauty Academy",
    city: "Marbella",
    country: "España",
    where: "9C Alfredo Palma",
    cat: "Academia de formación",
    sistema: "plataforma",
    wa: "34600269750",
    waNote: "WhatsApp publicado",
    email: "enquiriesmba@gmail.com",
    has: "Academy real, veinte años, títulos, WhatsApp de información.",
    falta: "El alumno entra por mensaje. No vi un campus: módulo, camino, comunidad de quien ya se formó.",
    abre: "Hola. Vi la Academy. Veinte años no se improvisan. El punto es el alumno que ya entró: hoy vuelve a preguntar por mensaje. Puedo enseñarte el campus, con vuestro nombre, sin tocar el título.",
    recado: "Hola. Vi Marbella Beauty Academy. Lo que ya enseñáis se queda. Quería mostrar el campus del alumno, sin cambiar la formación. Cuarenta segundos.",
    nota: "Eles JÁ são academy. Não venda ‘uma academy’. Venda o campus digital em cima. Plataforma só porque a casa de formação já existe. Se travarem, desce para Academy (membros), não para site."
  },
  {
    id: "hc",
    name: "HC Estética Marbella",
    city: "Marbella",
    country: "España",
    where: "C/ Ventura del Mar 11",
    cat: "Estética clínica",
    sistema: "capa",
    wa: "34649122756",
    waNote: "WhatsApp publicado",
    tel: "34951829584",
    email: "estetica@hcmarbella.com",
    site: "https://hcaesthetic.com",
    has: "Web, WhatsApp y fijo. Clínica con peso.",
    falta: "Hay más de una puerta (web, Instagram, centralita). Falta un camino solo para quien pide consulta.",
    abre: "Hola. Vi la estética de HC en Ventura del Mar. La clínica ya tiene peso. Vi un punto: quien quiere consulta todavía elige entre varias puertas. Puedo enseñarte un solo camino, sin tocar la medicina.",
    recado: "Hola. Vi HC Estética. La clínica ya tiene peso. Quería mostrar un solo camino para la consulta, sin tocar lo médico. Cuarenta segundos.",
    nota: "Pode ser unidade de um hospital. Fala com quem decide a comunicação, não com a recepção de urgência. Zero promessa clínica. Capa, não site novo."
  },
  {
    id: "marbea",
    name: "Clínica Estética Marbella",
    city: "Marbella",
    country: "España",
    where: "Av. Severo Ochoa 12, local 7",
    cat: "Estética",
    sistema: "capa",
    wa: "34670988153",
    waNote: "WhatsApp publicado en Instagram",
    site: "https://marbea.es",
    has: "Web de ofertas y WhatsApp de promociones.",
    falta: "La puerta pública es la oferta. Falta el camino de consulta, no otra promoción.",
    abre: "Hola. Vi la clínica en Severo Ochoa. Las ofertas ya llegan. El punto es otro: quien puede pagar un trabajo serio no entra por un descuento. Puedo enseñarte el camino de la consulta, sin tirar lo que ya os escribe.",
    recado: "Hola. Vi la clínica. Las ofertas ya llegan. Quería mostrar el camino de la consulta, sin tirar lo que ya funciona. Cuarenta segundos.",
    nota: "Eles vendem promoção. Você não entra por baixo. Sobe o ticket: consulta, não desconto. Se pedirem preço, recorte, nunca 50% off."
  },
  {
    id: "teva",
    name: "Teva Wellness",
    city: "Ciudad de México",
    country: "México",
    where: "Edgar Allan Poe 1 · Polanco",
    cat: "Club de bienestar",
    sistema: "movimiento",
    cel: "525669923260",
    email: "hello@tevawellnesslifestyle.com",
    site: "https://tevawellnesslifestyle.com",
    has: "Club de lujo en Polanco, web, teléfono de contacto. No está marcado como WhatsApp.",
    falta: "El club ya es la casa física. Falta el rito: la noche, el miembro que vuelve, la presencia.",
    abre: "Hola. Vi Teva, en Polanco. El club ya es la casa. No vengo a construir otra. Vi una capa: la noche y el miembro que vuelve. Cuarenta segundos, sin cambiar lo que ya abriste.",
    recado: "Hola. Vi Teva en Polanco. El club ya es la casa. Quería mostrar una capa, la noche y el retorno, sin cambiar lo que ya funciona. Cuarenta segundos.",
    nota: "Polanco. Número publicado como telefone, não como WhatsApp. Não marques Zap. Movimiento por cima do clube. Não reconstruas o site."
  },
  {
    id: "empower",
    name: "Empower Pilates",
    city: "San Pedro Garza García",
    country: "México",
    where: "Av. Vasconcelos 345, local 211 · Plaza Tanarah",
    cat: "Pilates",
    sistema: "academy",
    wa: "5218131096893",
    waNote: "WhatsApp publicado en Instagram",
    has: "Instagram y WhatsApp. Clase para mujeres, prueba por enlace.",
    falta: "La prueba entra por mensaje. No hay casa del miembro ni camino después de la clase.",
    abre: "Hola. Vi Empower, en Vasconcelos. La prueba ya tiene puerta. Vi un punto: quien viene una vez no tiene casa para quedarse. Puedo enseñarte esa casa, con vuestro nombre, en cuarenta segundos.",
    recado: "Hola. Vi Empower Pilates. La prueba ya tiene puerta. Quería mostrar la casa para quien viene y todavía no se queda. Cuarenta segundos.",
    nota: "San Pedro é a cidade mais rica do México. Zap do Instagram. Academy simples: a mulher de 50+ que faz a prova e não fica. Não fales de app."
  },
  {
    id: "pilatesnow",
    name: "Pilates Now and Spa",
    city: "San Pedro Garza García",
    country: "México",
    where: "Av. Manuel Gómez Morín 1101 · Chipinque",
    cat: "Pilates y spa",
    sistema: "academy",
    tel: "528119686059",
    email: "info@pilatesnowandspa.com",
    site: "https://www.pilatesnowandspa.com",
    has: "Web y dos teléfonos de guía. Reformer y spa en Chipinque.",
    falta: "Hay casa en internet. No vi un sistema para que la clienta del spa vuelva sola.",
    abre: "Hola. Vi Pilates Now, en Chipinque. Reformer y spa ya son la casa. El punto es la vuelta: quien vino al spa no tiene un camino propio. Cuarenta segundos, sin reconstruir la web.",
    recado: "Hola. Vi Pilates Now. La casa ya está. Quería mostrar el camino de vuelta, sin reconstruir la web. Cuarenta segundos.",
    nota: "Guia traz também 81 2261 1063. Nenhum está marcado como WhatsApp. Confirma na porta se ainda abre. Chipinque é ticket alto."
  },
  {
    id: "philipai",
    name: "Philipai",
    city: "Santiago",
    country: "Chile",
    where: "Mariano Sánchez Fontecilla 344 · Las Condes",
    cat: "Spa",
    sistema: "capa",
    wa: "56944647479",
    waNote: "WhatsApp publicado",
    email: "contacto@philipai.cl",
    site: "https://www.philipai.cl",
    has: "Web, WhatsApp y tres sedes: Las Condes, Providencia y Kennedy.",
    falta: "Tres puertas, tres horarios. Falta un solo camino de reserva, con la misma cara.",
    abre: "Hola. Vi Philipai. Tres sedes ya es una casa. Vi un punto: cada puerta cuenta la reserva a su manera. Puedo enseñarte un solo camino, sin cerrar ninguna sede.",
    recado: "Hola. Vi Philipai. Las sedes ya funcionan. Quería mostrar un solo camino de reserva, sin cerrar ninguna. Cuarenta segundos.",
    nota: "Las Condes. Já têm site e Zap. Capa: uma reserva para três sedes. Não vendas casa nova."
  }
];

function cierraSistema(id) {
  return CIERRA_SISTEMAS.find((s) => s.id === id) || CIERRA_SISTEMAS[0];
}
