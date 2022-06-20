import App from '/App.universal'
import javascript from '@kaliber/build/lib/javascript'
import stylesheet from '@kaliber/build/lib/stylesheet'
import '/reset.css'
import '/index.css'

export default (
  <html lang='en'>
    <head>
      <meta charSet='utf-8' />
      <title>@kaliber/scroll-progression</title>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      {stylesheet}
      {javascript}
      <link
        href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </head>
    <body>
      {/* Enable to test the element scroll parent */}
      {/* <div style={{ height: '50vh', overflow: 'auto' }}> */}
        <App />
      {/* </div> */}
    </body>
  </html>
)
