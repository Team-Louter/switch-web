// 스타일
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/Theme';
import { GlobalStyle } from '@/styles/GlobalStyle';

// 라우팅
import Router from './routes';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router />
    </ThemeProvider>
  );
}

export default App;
