const SITE_NAME = "Matthew Mehrtens";

export interface RouteMeta {
  title: string;
  tabTitle?: string;
  description: string;
}

export const routes = {
  "/": {
    title: "About Me",
    tabTitle: "Matthew Mehrtens",
    description:
      "Personal site of Matthew Mehrtens—a Ph.D. student in engineering mechanics at Iowa State University with a deep passion for computers and consumer technology.",
  },
  "/404": {
    title: "Page Not Found",
    description: "The page you’re looking for doesn’t exist.",
  },
  "/blog": { title: "Blog", description: "Writing by Matthew Mehrtens." },
  "/contact": {
    title: "Contact",
    description: "How to get in touch with Matthew Mehrtens.",
  },
  "/hall-of-fame": {
    title: "Hall of Fame",
    description:
      "Security researchers who have responsibly disclosed vulnerabilities affecting mehrtens.com.",
  },
  "/privacy": {
    title: "Privacy Policy",
    description: "Privacy policy for mehrtens.com.",
  },
  "/projects": {
    title: "Projects",
    description: "Projects by Matthew Mehrtens.",
  },
  "/projects/publications": {
    title: "Publications",
    description:
      "Academic publications featuring Matthew Mehrtens as an author.",
  },
  "/terms": {
    title: "Terms of Service",
    description: "Terms of service for mehrtens.com.",
  },
} as const satisfies Record<string, RouteMeta>;

export type RoutePath = keyof typeof routes;

function metaFor(path: string): RouteMeta {
  if (!(path in routes)) {
    throw new Error(`No route registered for "${path}"`);
  }
  return routes[path as RoutePath];
}

export function titleFor(path: string): string {
  return metaFor(path).title;
}

export function tabTitleFor(path: string): string {
  const meta = metaFor(path);
  return meta.tabTitle ?? `${meta.title} - ${SITE_NAME}`;
}

export function descriptionFor(path: string): string {
  return metaFor(path).description;
}

export interface Crumb {
  href: string;
  label: string;
}

export function breadcrumbFor(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);

  const paths = segments.map(
    (_, i) => "/" + segments.slice(0, i + 1).join("/"),
  );

  return paths.map((href) => ({ href, label: titleFor(href) }));
}

export function breadcrumbListFor(pathname: string, site: URL | undefined) {
  const crumbs = breadcrumbFor(pathname);
  return {
    "@type": "BreadcrumbList",
    "@id": `${new URL(pathname, site).href}#breadcrumb`,
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      item: new URL(crumb.href, site).href,
      position: i + 1,
      name: crumb.label,
    })),
  };
}
