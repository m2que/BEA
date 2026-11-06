type Gtag = (...args: unknown[]) => void;

export const track = (name: string, params?: Record<string, unknown>) => {
  const gtag = (window as Window & { gtag?: Gtag }).gtag;
  gtag?.('event', name, params);
};