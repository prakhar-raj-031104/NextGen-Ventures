import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const serviceImages: Record<string, string> = {
  // Amazon seller interface on MacBook — clean, dark-bg compatible, directly relevant
  "marketplace-growth":
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=85",

  // Phone held up showing social media analytics dashboard — crisp, colorful
  "digital-marketing":
    "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1600&q=85",

  // MacBook open to Figma design file — instantly recognizable, professional
  "ui-ux-design":
    "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1600&q=85",

  // Colorful syntax-highlighted code on screen — iconic dev photo, great contrast
  "website-design-development":
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=85",

  // Beautifully arranged product photography studio setup — directly on-brand
  "ecommerce-imaging":
    "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1600&q=85",

  // Mobile app UI displayed on phone — clean, modern, on-brand for app dev
  "application-development":
    "https://images.unsplash.com/photo-1512941937938-a272ab375398?auto=format&fit=crop&w=1600&q=85",
};

async function main() {
  for (const [slug, imageUrl] of Object.entries(serviceImages)) {
    const updated = await prisma.service.update({
      where: { slug },
      data: { imageUrl },
      select: { slug: true, imageUrl: true },
    });
    console.log(`✓ ${updated.slug}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
