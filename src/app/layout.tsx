export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout is intentionally minimal — locale-specific layout lives in [locale]/layout.tsx
  return children;
}
