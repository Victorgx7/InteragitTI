# Arquitetura técnica — InteragiTI

## 1. Visão geral

A aplicação possui uma arquitetura híbrida simples:

- **Front-end estático:** HTML5 + CSS3 + JavaScript.
- **Back-end pontual:** PHP.
- **Serviço externo:** Google Places API.
- **Comunicação comercial:** WhatsApp.
- **Mapas:** Google Maps.

A maior parte do site é executada diretamente no navegador. O PHP é utilizado principalmente para disponibilizar as avaliações do Google de forma controlada e com cache.

## 2. Fluxo da aplicação

### 2.1 Navegação

```text
Usuário
  │
  ├── index.html
  ├── sobrenos.html
  ├── solucoes.html
  ├── certificados.html
  └── contato.html
       │
       ├── CSS
       ├── JavaScript
       └── Assets
```

As páginas compartilham a identidade visual e utilizam arquivos CSS e JavaScript comuns.

## 3. Módulo de avaliações

O módulo de avaliações possui três partes principais:

```text
js/reviews.js
      │
      │ HTTP GET
      ▼
api/reviews.php
      │
      ├── config/places.php
      │
      ├── cache/reviews_cache.json
      │
      └── Google Places API
```

### 3.1 Front-end

O arquivo `js/reviews.js`:

1. Localiza a seção de avaliações.
2. Faz uma requisição para `api/reviews.php`.
3. Recebe JSON.
4. Cria os cards das avaliações.
5. Atualiza nota e quantidade de avaliações.
6. Controla navegação e autoplay.
7. Utiliza avaliações de fallback caso a requisição falhe.

Também há suporte para:

- botão anterior;
- botão próximo;
- indicadores;
- swipe em telas touch;
- pausa ao passar o mouse;
- redução de movimento.

### 3.2 Endpoint PHP

O arquivo `api/reviews.php` funciona como uma camada intermediária entre o navegador e o Google.

Ele:

- retorna `application/json`;
- trata requisições `OPTIONS`;
- aplica CORS apenas para origens configuradas;
- verifica o cache;
- consulta a Google Places API quando necessário;
- normaliza os dados recebidos;
- limita o número de avaliações retornadas;
- armazena os resultados em cache;
- utiliza dados anteriores ou avaliações estáticas quando a API não estiver disponível.

### 3.3 Normalização

A resposta externa é transformada em um formato menor e previsível:

```json
{
  "rating": 5,
  "total": 30,
  "reviews": [
    {
      "author": "Cliente",
      "rating": 5,
      "text": "Texto da avaliação",
      "relativeTime": "Avaliação no Google",
      "profilePhoto": ""
    }
  ],
  "stale": false
}
```

O campo `stale` indica que os dados retornados não são necessariamente a consulta mais recente à API externa.

## 4. Cache

O cache é configurado através de:

```env
GOOGLE_REVIEWS_CACHE_TTL=86400
```

O valor padrão é de 86400 segundos, equivalente a 24 horas.

Quando existe um cache válido:

```text
Requisição
   ↓
Cache válido?
   ├── Sim → retorna cache
   └── Não → consulta Google
```

Se a consulta externa falhar, o sistema tenta utilizar um cache anterior antes de recorrer às avaliações estáticas.

## 5. Configuração

O arquivo `config/places.php` carrega as configurações do ambiente e fornece ao endpoint:

- chave da Google Places API;
- Place ID;
- localização do arquivo de cache;
- TTL do cache;
- origens permitidas pelo CORS.

O arquivo também possui um carregador simples para um arquivo `.env` local.

## 6. CORS

As origens permitidas são definidas por:

```env
REVIEWS_CORS_ORIGINS=https://seu-dominio.com
```

É possível informar mais de uma origem separando os valores por vírgula.

Exemplo:

```env
REVIEWS_CORS_ORIGINS=https://seu-dominio.com,http://localhost:8000
```

A API não libera qualquer origem automaticamente; ela compara a origem recebida com a lista configurada.

## 7. Front-end

### HTML

Cada página é independente, o que facilita a hospedagem e a manutenção de um site institucional de pequeno/médio porte.

### CSS

Os estilos são modularizados por finalidade.

A folha principal é `style.css`, enquanto estilos específicos são carregados conforme a página.

### JavaScript

O `main.js` concentra comportamentos compartilhados.

O `reviews.js` é carregado na página inicial para controlar exclusivamente o módulo de avaliações.

## 8. Contato

O formulário da página `contato.html` não envia dados para um banco de dados.

O JavaScript monta uma mensagem contendo:

- nome;
- empresa;
- WhatsApp;
- necessidade informada.

Depois, abre o WhatsApp com a mensagem preparada.

```text
Formulário
   ↓
JavaScript
   ↓
Mensagem formatada
   ↓
WhatsApp
```

Isso significa que atualmente não existe uma API própria para armazenamento de leads nesse formulário.

## 9. Dependências externas

O projeto utiliza recursos externos, incluindo:

- Google Fonts.
- Google Places API.
- Google Maps.
- WhatsApp.
- Logo hospedada no domínio da InteragiTI em algumas páginas.

Para uma implantação totalmente independente de terceiros, esses recursos poderiam futuramente ser localizados ou substituídos conforme a necessidade.

## 10. Requisitos do servidor

Para o site estático:

- servidor web capaz de servir HTML/CSS/JS/imagens.

Para o módulo completo:

- PHP 8.0 ou superior;
- extensão cURL;
- permissão de escrita no diretório de cache;
- acesso HTTPS à Google Places API;
- variáveis de ambiente configuradas.

## 11. Possíveis evoluções técnicas

A arquitetura atual é adequada para um site institucional, mas pode evoluir para:

- criação de componentes reutilizáveis;
- centralização de configurações;
- validação mais completa de formulários;
- armazenamento de leads;
- painel administrativo;
- banco de dados;
- autenticação;
- testes automatizados;
- pipeline de CI/CD;
- separação mais clara entre apresentação e serviços;
- gerenciamento de dependências.

Essas mudanças não são necessárias para o funcionamento atual e devem ser consideradas conforme o crescimento do projeto.
