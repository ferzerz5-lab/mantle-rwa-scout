export const metadata = {
  title: "Mantle RWA Scout",
  description: "AI research agent for Mantle ecosystem RWA assets.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#080808" }}>
        {children}
      </body>
    </html>
  );
}
