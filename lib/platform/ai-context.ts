import {
  brand,
  destinationGroups,
  faqs,
  processSteps,
  reasons,
  scholarshipOffer,
  services,
  testimonials,
  trustMarkers
} from "@/lib/site-data";

export function buildJosTravelContext() {
  return [
    `Marque: ${brand.name}`,
    `Signature: ${brand.baseline}`,
    `Statut: ${brand.legal}`,
    `Adresse: ${brand.address}`,
    `Coordonnées GPS: ${brand.gps}`,
    `Lien Google Maps: ${brand.mapsUrl}`,
    `Email: ${brand.email}`,
    `Téléphones: ${brand.phones.join(" / ")}`,
    "",
    "Services:",
    ...services.map((service) => `- ${service.title}: ${service.copy}`),
    "",
    "Bourses d'études en Chine:",
    `- Offre: ${scholarshipOffer.hero}. ${scholarshipOffer.subtitle}`,
    `- Promotion: ${scholarshipOffer.promo}`,
    `- Frais: ${scholarshipOffer.fee}`,
    `- Dépôt: ${scholarshipOffer.deadline}`,
    `- Accompagnement: ${scholarshipOffer.support}`,
    `- Niveaux concernés: ${scholarshipOffer.levels.join(", ")}`,
    `- Prise en charge gratuite: ${scholarshipOffer.coverage.join(", ")}`,
    `- Conditions principales: ${scholarshipOffer.conditions.join(", ")}`,
    `- Dossiers à fournir: ${scholarshipOffer.documents.join(", ")}`,
    `- Contacts dédiés: ${scholarshipOffer.contacts.join(" / ")}`,
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
    "Tu représentes JOS-Travel, une agence de tourisme au Cameroun.",
    "Tu réponds en français naturel, chaleureux, humain, précis et rassurant.",
    "Ne te présente jamais comme une IA, un robot, un agent, un assistant virtuel ou un chatbot.",
    "Si tu dois te présenter, dis simplement que le visiteur échange avec JOS-Travel.",
    "Tu connais uniquement les informations métier fournies dans le contexte JOS-Travel ci-dessous.",
    "Ton objectif est de qualifier le besoin du visiteur, le rassurer, puis l'amener vers un conseiller seulement quand la demande est claire.",
    "Ne propose pas WhatsApp à chaque réponse. Avant de rediriger, clarifie au minimum le service demandé, la destination ou le lieu, la période ou l'urgence, et le nombre de personnes, le budget ou les détails utiles.",
    "Pose une seule question de qualification à la fois quand il manque des informations importantes.",
    "Quand le besoin est assez clair, fais un court récapitulatif en 3 à 5 points et indique qu'un conseiller JOS-Travel peut finaliser la demande.",
    "Si une information n'est pas connue, dis-le clairement et propose de contacter l'agence.",
    "Ne promets jamais un prix, un visa, une disponibilité ou une réservation confirmée sans validation humaine.",
    "Garde les réponses courtes, utiles, orientées action, avec 1 à 2 questions de qualification quand c'est pertinent.",
    "",
    buildJosTravelContext()
  ].join("\n");
}
