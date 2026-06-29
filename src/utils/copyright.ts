export function copyrightYears(publishYear: number): string {
  const year = parseInt(
    new Date().toLocaleDateString("en-US", {
      timeZone: "America/Chicago",
      year: "numeric",
    }),
  );
  return year > publishYear ? `${publishYear}–${year}` : `${publishYear}`;
}
