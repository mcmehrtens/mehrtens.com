export interface AuthorMeta {
  name: string;
  self?: boolean;
  sameAs?: string[];
}

const authors = {
  mmehrtens: { name: "Matthew Mehrtens", self: true },
  brunnels: {
    name: "Brandon Runnels",
    sameAs: [
      "https://orcid.org/0000-0003-3043-5227",
      "https://www.solids.group/people/brandon-runnels/",
      "https://scholar.google.com/citations?user=inKcmZQAAAAJ&hl=en&oi=ao",
      "https://github.com/bsrunnels",
      "https://www.linkedin.com/in/brandon-runnels-79735023",
      "https://www.researchgate.net/profile/Brandon-Runnels",
    ],
  },
} as const satisfies Record<string, AuthorMeta>;

export type AuthorKey = keyof typeof authors;

function meta(key: AuthorKey): AuthorMeta {
  return authors[key];
}

export function authorRef(key: AuthorKey, site: URL | undefined) {
  return { "@id": meta(key).self ? `${site}#person` : `${site}#${key}` };
}

export function authorNodes(keys: AuthorKey[], site: URL | undefined) {
  return [...new Set(keys)]
    .filter((key) => !meta(key).self)
    .map((key) => ({
      "@type": "Person",
      "@id": `${site}#${key}`,
      name: meta(key).name,
      sameAs: meta(key).sameAs,
    }));
}

export function personNode(site: URL | undefined) {
  return {
    "@type": "Person",
    "@id": `${site}#person`,
    affiliation: { "@id": "https://www.iastate.edu/#org" },
    alumniOf: { "@id": "https://www.iastate.edu/#org" },
    award:
      "Department of War (DoW) National Defense Science and Engineering Graduate (NDSEG) Fellowship",
    email: "matthew@mehrtens.com",
    familyName: "Mehrtens",
    funding: {
      "@type": "Grant",
      funder: {
        "@type": "GovernmentOrganization",
        name: "U.S. Department of War (DoW)",
      },
      description:
        "A competitive fellowship that is awarded to U.S. citizens, U.S. nationals, and U.S. dual citizens who intend to pursue a Doctoral degree aligned to the DoD services Broad Agency Announcements (BAAs) in research and development at a U.S. institution of their choice.",
      name: "National Defense Science and Engineering Graduate (NDSEG) Fellowship",
      url: "https://ndseg.sysplus.com",
    },
    gender: "https://schema.org/Male",
    givenName: "Matthew",
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      educationalLevel: "Undergraduate",
      credentialCategory: "Bachelor's Degree",
      recognizedBy: { "@id": "https://www.iastate.edu/#org" },
      name: "Bachelor of Science in Aerospace Engineering",
    },
    height: {
      "@type": "QuantitativeValue",
      unitCode: "FOT",
      value: 6,
    },
    honorificPrefix: "Mr.",
    jobTitle: "Computational Physics Student Summer Workshop Fellow",
    knowsLanguage: {
      "@type": "Language",
      alternateName: "en",
      name: "English",
    },
    memberOf: {
      "@type": "OrganizationRole",
      roleName: "President",
      memberOf: {
        "@type": "Organization",
        name: "Tau Beta Pi Iowa Alpha Chapter",
        url: "https://iowaalpha.tbp.org",
        parentOrganization: {
          "@type": "Organization",
          name: "Tau Beta Pi",
          url: "https://www.tbp.org",
        },
      },
    },
    nationality: {
      "@type": "Country",
      name: "United States",
    },
    pronouns: "he/him",
    worksFor: [
      {
        "@type": "OrganizationRole",
        endDate: "2026-08",
        roleName: "Computational Physics Student Summer Workshop Fellow",
        startDate: "2026-06",
        worksFor: {
          "@type": "ResearchOrganization",
          name: "Los Alamos National Laboratory",
          url: "https://www.lanl.gov",
        },
      },
      {
        "@type": "OrganizationRole",
        endDate: "2026-05",
        roleName: "Research Assistant",
        startDate: "2025-01",
        worksFor: { "@id": "https://www.iastate.edu/#org" },
      },
      {
        "@type": "OrganizationRole",
        endDate: "2025-12",
        roleName: "Teaching Assistant (AERE 4210 Advanced Flight Structures)",
        startDate: "2025-08",
        worksFor: { "@id": "https://www.iastate.edu/#org" },
      },
      {
        "@type": "OrganizationRole",
        endDate: "2024-12",
        roleName: "System & Software Engineering Intern",
        startDate: "2022-05",
        worksFor: {
          "@type": "Organization",
          name: "Collins Aerospace",
          url: "https://www.collinsaerospace.com",
        },
      },
      {
        "@type": "OrganizationRole",
        endDate: "2022-05",
        roleName: "Accounting Technical Intern",
        startDate: "2020-12",
        worksFor: { "@id": "https://www.iastate.edu/#org" },
      },
      {
        "@type": "OrganizationRole",
        endDate: "2021-08",
        roleName: "Assistant Manager",
        startDate: "2018-06",
        worksFor: {
          "@type": "Organization",
          name: "Cinemark Movies 12",
          url: "https://www.cinemark.com",
        },
      },
      {
        "@type": "OrganizationRole",
        endDate: "2017-08",
        roleName: "Seasonal Pollinator",
        startDate: "2016-06",
        worksFor: {
          "@type": "Organization",
          name: "Dow AgroSciences",
        },
      },
    ],
    description:
      "Ph.D. student in engineering mechanics at Iowa State University researching the topological optimization of solid composite propellants.",
    name: "Matthew Mehrtens",
    sameAs: [
      "https://orcid.org/0009-0002-6996-656X",
      "https://github.com/mcmehrtens",
      "https://scholar.google.com/citations?user=jOi0_hYAAAAJ",
      "https://www.researchgate.net/profile/Matthew-Mehrtens",
      "https://music.apple.com/profile/mcmehrtens",
    ],
    url: `${site}`,
  };
}

export const orgNode = {
  "@type": "CollegeOrUniversity",
  "@id": "https://www.iastate.edu/#org",
  name: "Iowa State University",
  url: "https://www.iastate.edu",
};
