const BMC_HTML = `<!doctype html>
<html>
<head>
<style>
  html, body { margin: 0; padding: 0; background: transparent; }
  body { display: flex; align-items: center; justify-content: center; height: 100%; }
</style>
</head>
<body>
<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="stampaaaron" data-color="#FFDD00" data-emoji="☕" data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff"></script>
</body>
</html>`;

export function BuyMeACoffeeButton() {
  return (
    <iframe
      title="Buy me a coffee"
      srcDoc={BMC_HTML}
      scrolling="no"
      style={{ border: 'none', width: 232, height: 68 }}
    />
  );
}
