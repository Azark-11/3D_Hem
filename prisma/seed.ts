import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const products = [
    {
      id: "prod_luffy_wanted",
      slug: "luffy-wanted-poster",
      name: "Luffy Wanted Poster",
      nameEn: "Luffy Wanted Poster",
      description:
        "**Luffy Wanted Poster** – ett ikoniskt 3D-tryckt konstverk inspirerat av världens mest eftersökta sjörövare.\n\nTillverkad i högkvalitativ PLA med skarp detaljåtergivning och matte finish. Perfekt som present eller väggdekoration för anime-fans.\n\n- Material: PLA\n- Mått: 150 × 210 × 8 mm\n- Vikt: ca 200 g\n- Färg: Guldbrun/svart",
      descriptionEn:
        "**Luffy Wanted Poster** – an iconic 3D-printed art piece inspired by the world's most wanted pirate.\n\nMade from high-quality PLA with sharp detail reproduction and matte finish. Perfect gift or wall decoration for anime fans.",
      priceOre: 12900,
      images: JSON.stringify(["/products/luffy-wanted-poster-1.jpg"]),
      category: "figurer",
      stock: 15,
      material: "PLA",
      dimensionsMm: "150 × 210 × 8 mm",
      weightGrams: 200,
      featured: true,
      active: true,
    },
    {
      id: "prod_led_lamp",
      slug: "led-lampa-varm-vit",
      name: "LED-lampa – Varm Vit",
      nameEn: "LED Lamp – Warm White",
      description:
        "**LED-lampa – Varm Vit** – en stilren 3D-tryckt lampa med inbyggd USB LED-strip som ger ett varmt, mysigt ljus.\n\nDesignad för att passa på skrivbord, bokhyllor eller som nattlampa. Koppla in via USB och njut av det lugna lampskenet.\n\n- Material: PLA + USB LED-strip\n- Mått: 120 × 120 × 180 mm\n- Vikt: ca 350 g\n- Ljusfärg: Varm vit (2700K)",
      descriptionEn:
        "**LED Lamp – Warm White** – a sleek 3D-printed lamp with built-in USB LED strip providing warm, cozy light.",
      priceOre: 34900,
      images: JSON.stringify(["/products/led-lampa-varm-vit-1.jpg"]),
      category: "lampor",
      stock: 8,
      material: "PLA + USB LED-strip",
      dimensionsMm: "120 × 120 × 180 mm",
      weightGrams: 350,
      featured: true,
      active: true,
    },
    {
      id: "prod_desk_organizer",
      slug: "skrivbordsorganiserare",
      name: "Skrivbordsorganiserare",
      nameEn: "Desk Organizer",
      description:
        "**Skrivbordsorganiserare** – håll ordning på skrivbordet med denna robusta organiserare i PETG.\n\nMed fack för pennor, gem, post-it och telefon är den perfekt för hemmakontoret eller arbetsplatsen. PETG-materialet ger hög tålighet och temperaturbeständighet.\n\n- Material: PETG\n- Mått: 200 × 150 × 80 mm\n- Vikt: ca 150 g\n- Antal fack: 4",
      descriptionEn:
        "**Desk Organizer** – keep your desk tidy with this robust PETG organizer featuring compartments for pens, clips, sticky notes and phone.",
      priceOre: 8900,
      images: JSON.stringify(["/products/skrivbordsorganiserare-1.jpg"]),
      category: "funktionellt",
      stock: 25,
      material: "PETG",
      dimensionsMm: "200 × 150 × 80 mm",
      weightGrams: 150,
      featured: true,
      active: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
    console.log(`Upserted product: ${product.name}`);
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
