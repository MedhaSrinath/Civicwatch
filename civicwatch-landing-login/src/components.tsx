export function CivicLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' };
  return (
    <span className={`civicwatch-logo ${sizes[size]}`}>
      Civic<span style={{ color: 'var(--saffron)' }}>Watch</span>
    </span>
  );
}
