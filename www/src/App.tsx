import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/magicui/terminal";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Terminal>
          <TypingAnimation>
            {`$ lershi-minimal-app my-app`}
          </TypingAnimation>

          <AnimatedSpan delay={1500} className="text-green-500">
            <span>✔ Project directory created.</span>
          </AnimatedSpan>

          <AnimatedSpan delay={2000} className="text-green-500">
            <span>✔ Copied template files.</span>
          </AnimatedSpan>

          <AnimatedSpan delay={2500} className="text-green-500">
            <span>✔ Replaced placeholders.</span>
          </AnimatedSpan>

          <AnimatedSpan delay={3000} className="text-green-500">
            <span>✔ Initialized git repository.</span>
          </AnimatedSpan>

          <AnimatedSpan delay={3500} className="text-green-500">
            <span>✔ Installed dependencies.</span>
          </AnimatedSpan>

          <AnimatedSpan delay={4000} className="text-blue-500">
            <span>ℹ Next steps:</span>
            <span className="pl-2">cd my-app</span>
            <span className="pl-2">npm start</span>
          </AnimatedSpan>

          <TypingAnimation delay={4500} className="text-muted-foreground">
            <a href="https://www.npmjs.com/package/lershi-minimal-app" target="_blank" rel="noopener noreferrer">
              🔗 npm: https://www.npmjs.com/package/lershi-minimal-app
            </a>
          </TypingAnimation>
          <TypingAnimation delay={5000} className="text-muted-foreground">
            <a href="https://github.com/lershi-devlabs/lershi-minimal-app" target="_blank" rel="noopener noreferrer">
              🔗 GitHub: https://github.com/lershi-devlabs/lershi-minimal-app
            </a>
          </TypingAnimation>
        </Terminal>
      </div>
    </ThemeProvider>
  );
}

export default App;