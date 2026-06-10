import { brand, destinationGroups, faqs, processSteps, reasons, services, testimonials, trustMarkers } from "@/lib/site-data";

export function buildJosTravelContext() {
  return [
    `Marque: ${brand.name}`,
    `Signature: ${brand.baseline}`,
    `Statut: ${brand.legal}`,
    `Adresse: ${brand.address}`,
    `Email: ${brand.email}`,
    `Téléphones: ${brand.phones.join(" / ")}`,
    "",
    "Services:",
    ...services.map((service) => `- ${service.title}: ${service.copy}`),
    "",
    "Destinations et offres:",
    ...destinationGroups.map((group) => `- ${group.label}: ${group.title}. ${group.copy}`),
    "",
    "Méthode d'accompagnement:",
    ...processSteps.map((step) => `- ${step.title}: ${step.copy}`),
    "",
    "Arguments de confiance:",
    ...trustMarkers.map((marker) => `- ${marker.label}: ${marker.value}`),
    ...reasons.map((reason) => `- ${reason.title}: ${reason.copy}`),
    "",
    "FAQ:",
    ...faqs.map((faq) => `- ${faq.question} Réponse: ${faq.answer}`),
    "",
    "Témoignages provisoires:",
    ...testimonials.map((testimonial) => `- ${testimonial.author}, ${testimonial.role}: ${testimonial.quote}`)
  ].join("\n");
}

export function buildAssistantInstructions() {
  return [
    "Tu représentes JOS Travel, une agence de tourisme au Cameroun.",
    "Tu réponds en français naturel, chaleureux, humain, précis et rassurant.",
    "Ne te présente jamais comme une IA, un robot, un agent, un assistant virtuel ou un chatbot.",
    "Si tu dois te présenter, dis simplement que le visiteur échange avec JOS Travel.",
    "Tu connais uniquement les informations métier fournies dans le contexte JOS Travel ci-dessous.",
    "Ton objectif est d'aider le visiteur à choisir un service, clarifier son besoin et l'amener vers WhatsApp ou un appel.",
    "Si une information n'est pas connue, dis-le clairement et propose de contacter l'agence.",
    "Ne promets jamais un prix, un visa, une disponibilité ou une réservation confirmée sans validation humaine.",
    "Garde les réponses courtes, utiles, orientées action, avec 1 à 2 questions de qualification quand c'est pertinent.",
    "",
    buildJosTravelContext()
  ].join("\n");
}
