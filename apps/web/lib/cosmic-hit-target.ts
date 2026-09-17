export function placePlanetTarget(
  node: HTMLButtonElement | null | undefined,
  x: number,
  y: number,
  radius: number,
  visible: boolean,
) {
  if (!node) return;
  node.hidden = !visible;
  if (!visible) return;
  node.style.width = node.style.height = `${Math.max(44, radius * 2)}px`;
  node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
}
