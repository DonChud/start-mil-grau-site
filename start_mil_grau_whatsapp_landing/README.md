# Start Mil Grau — Landing Page de Agendamento por WhatsApp

Landing page estática e totalmente editável em HTML, CSS e JavaScript puro.

## Como abrir
Basta abrir `index.html` no navegador. Para desenvolvimento, recomenda-se a extensão Live Server no VS Code.

## Configuração obrigatória
Abra `script.js` e edite:

```js
const CONFIG = {
  whatsappNumber: "5541999999999",
  businessName: "Start Mil Grau",
  businessHours: "Seg–Sáb • 08:00 às 18:00",
  availableTimes: ["08:00","09:30","11:00","13:30","15:00","16:30","18:00"]
};
```

O número deve conter DDI + DDD + número, apenas dígitos. Exemplo para Brasil: `5541991234567`.

## Onde editar serviços
No array `services` dentro de `script.js`.

## Onde editar planos
No array `plans` dentro de `script.js`.

## Observação importante
Esta versão não reserva horários em banco de dados e não bloqueia conflito de agenda. O usuário escolhe uma preferência e é redirecionado ao WhatsApp com uma mensagem pronta. A confirmação final fica com a equipe.

## Arquivos
- `index.html` — estrutura da página
- `styles.css` — identidade visual e responsividade
- `script.js` — serviços, planos, formulário, validação e redirecionamento para WhatsApp
- `assets/logo.png` — logo da Start Mil Grau
