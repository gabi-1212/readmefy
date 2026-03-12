const highlights = [
  "Billing history",
  "Subscription controls",
  "Support conversations"
];

export default function HomePage() {
  return (
    <main>
      <h1>Customer Portal</h1>
      <p>Give customers a single place to manage their account lifecycle.</p>
      <ul>
        {highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
    </main>
  );
}
