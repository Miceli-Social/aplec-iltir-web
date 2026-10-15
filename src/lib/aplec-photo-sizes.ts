// Match the 1240px page shell, 260px auto-fit columns and 20px grid gap.
// Account for sparse grids too: a single photo occupies the entire row.
export function aplecPhotoSizes(count: number, layout: "gallery" | "card" | "admin" = "gallery") {
  const mobileInset = layout === "admin" ? 76 : 0;
  const desktopInset = layout === "admin" ? 96 : 0;
  const imageInset = layout === "card" ? 34 : 0;
  const columns = Math.max(1, Math.min(4, count));
  const rules: string[] = [];
  for (const [start, end, shell] of [[0, 720, 32 + mobileInset], [720, 1288, 48 + desktopInset]]) {
    for (let column = 1; column <= columns; column++) {
      const breakpoint = column === columns ? end : Math.min(end, shell + 260 * (column + 1) + 20 * column - 1);
      if (breakpoint <= start) continue;
      rules.push(`(max-width: ${breakpoint}px) calc((100vw - ${shell + 20 * (column - 1)}px) / ${column} - ${imageInset}px)`);
      if (breakpoint === end) break;
    }
  }
  return [...rules, `${Math.ceil((1240 - desktopInset - 20 * (columns - 1)) / columns - imageInset)}px`].join(", ");
}
