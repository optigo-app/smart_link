import ThemeRegistry from './ThemeRegistry';
import './globals.css';

export const metadata = {
  title: 'AppQR - Smart Link Management',
  description: 'Cross-platform redirection and real-time analytics for your mobile apps',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
