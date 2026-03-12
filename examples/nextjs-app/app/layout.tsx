import type { ReactNode } from "react";

export const metadata = {
  title: "Customer Portal",
  description: "A secure portal for subscription and billing management."
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}
