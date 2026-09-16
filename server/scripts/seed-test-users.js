// Seeds random-but-realistic customer accounts for testing the admin
// panel's Customers page. Safe to re-run — upserts by email, so it just
// tops up to TARGET_COUNT rather than duplicating. Every seeded user shares
// the password below (bcrypt-hashed like any real signup) so you can also
// sign in as one of them on the client storefront if you want to test that
// side too.
import { prisma } from "../src/lib/prisma.js";
import { hashPassword } from "../src/lib/auth.js";

const TARGET_COUNT = 28;
const SEED_PASSWORD = "Test@1234";

const FIRST_NAMES = [
  "Aditya", "Ananya", "Arjun", "Debashree", "Debanjan", "Ishita", "Kabir",
  "Koushik", "Mahua", "Manisha", "Nabanita", "Naina", "Partha", "Pritam",
  "Priya", "Rahul", "Rajesh", "Rimi", "Rohan", "Sagnik", "Sampriti",
  "Sanjana", "Sayan", "Shreya", "Somnath", "Soumya", "Subhankar", "Suman",
  "Tanmoy", "Tiyasha",
];

const LAST_NAMES = [
  "Basak", "Biswas", "Chakraborty", "Das", "Dutta", "Ghosh", "Halder",
  "Karmakar", "Mahato", "Mandal", "Mondal", "Mukherjee", "Pal", "Roy",
  "Saha", "Sarkar", "Sen", "Sheikh", "Talukdar", "Varma",
];

// Malda and nearby West Bengal towns — matches the business's actual
// service area (see project_business_context memory).
const PLACES = [
  { city: "English Bazar", state: "West Bengal", pincode: "732101" },
  { city: "Old Malda", state: "West Bengal", pincode: "732102" },
  { city: "Gazole", state: "West Bengal", pincode: "732124" },
  { city: "Chanchal", state: "West Bengal", pincode: "732123" },
  { city: "Ratua", state: "West Bengal", pincode: "732205" },
  { city: "Habibpur", state: "West Bengal", pincode: "732206" },
  { city: "Kaliachak", state: "West Bengal", pincode: "732201" },
  { city: "Siliguri", state: "West Bengal", pincode: "734001" },
  { city: "Kolkata", state: "West Bengal", pincode: "700001" },
];

const BUSINESS_NAMES = [
  "Ganesh Traders", "Malda Book Depot", "Sarkar Stationery Mart",
  "New Bharat Enterprises", "Shree Ram Provision Store", "Bikram Printers",
  "Annapurna Sweets", "City Electronics", "Maa Tara General Store",
  "Sunrise School Supplies",
];

const ADDRESS_LABELS = ["Home", "Office", "Shop"];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone() {
  return `+91 9${String(Math.floor(Math.random() * 900000000) + 100000000)}`;
}

function randomDateWithinLastYear() {
  const now = Date.now();
  const oneYearMs = 365 * 24 * 60 * 60 * 1000;
  return new Date(now - Math.random() * oneYearMs);
}

function buildUser(index) {
  const firstName = randomItem(FIRST_NAMES);
  const lastName = randomItem(LAST_NAMES);
  const hasBusiness = Math.random() < 0.35;

  return {
    name: `${firstName} ${lastName}`,
    // Deterministic on index so re-runs upsert the same row instead of
    // piling up near-duplicates.
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@example.com`,
    phone: randomPhone(),
    businessName: hasBusiness ? randomItem(BUSINESS_NAMES) : null,
    gstin: hasBusiness && Math.random() < 0.6
      ? `19${String(Math.floor(Math.random() * 9e9)).padStart(10, "0")}Z${index % 10}`
      : null,
    loyaltyPoints: Math.floor(Math.random() * 2000),
    createdAt: randomDateWithinLastYear(),
  };
}

function buildAddresses(userId) {
  const count = Math.floor(Math.random() * 3); // 0, 1 or 2
  return Array.from({ length: count }, (_, i) => {
    const place = randomItem(PLACES);
    return {
      userId,
      label: ADDRESS_LABELS[i] ?? "Other",
      recipientName: "—",
      phone: randomPhone(),
      addressLine1: `${Math.floor(Math.random() * 200) + 1}, ${randomItem(["Netaji Subhas Road", "Rabindra Sarani", "Station Road", "College Road", "Circular Road"])}`,
      addressLine2: Math.random() < 0.4 ? `Near ${randomItem(["Kotwali Bus Stand", "Malda Town Station", "DM Office", "Ram Krishna Pally"])}` : null,
      city: place.city,
      state: place.state,
      pincode: place.pincode,
      isDefaultShipping: i === 0,
      isDefaultBilling: i === 0,
    };
  });
}

async function seed() {
  const passwordHash = await hashPassword(SEED_PASSWORD);
  let created = 0;
  let skipped = 0;

  for (let i = 1; i <= TARGET_COUNT; i++) {
    const data = buildUser(i);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      skipped++;
      continue;
    }

    const user = await prisma.user.create({
      data: { ...data, passwordHash },
    });

    const addresses = buildAddresses(user.id);
    if (addresses.length > 0) {
      await prisma.address.createMany({ data: addresses });
    }

    created++;
  }

  console.log(`Seeded ${created} test users (${skipped} already existed, password: "${SEED_PASSWORD}").`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => process.exit());
