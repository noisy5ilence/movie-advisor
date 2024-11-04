const ThemeColor = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `
        try {
          if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.querySelector('meta[name="theme-color"]').setAttribute('content', 'hsl(222.2 84% 4.9%)')
          }
        } catch (_) {}
      `
    }}
  />
);

export default ThemeColor;
