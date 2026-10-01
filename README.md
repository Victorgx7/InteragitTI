# InteragiTI

Site institucional da **InteragiTI**, desenvolvido para apresentar os serviços da empresa, facilitar o contato com clientes e destacar soluções de tecnologia, sistemas, infraestrutura e certificados digitais.

> Repositório: https://github.com/Victorgx7/InteragitTI

## Visão geral

O projeto é uma aplicação web multipágina construída com tecnologias web tradicionais, mantendo uma estrutura simples e fácil de hospedar.

### Principais objetivos

- Apresentar a InteragiTI e seus serviços.
- Divulgar soluções de sistemas e infraestrutura.
- Apresentar informações sobre certificados digitais.
- Disponibilizar canais de contato direto pelo WhatsApp.
- Exibir avaliações de clientes.
- Oferecer uma experiência responsiva para desktop e dispositivos móveis.

## Funcionalidades

### Página inicial

A página `index.html` funciona como a entrada principal do site e apresenta:

- Hero section com chamada para ação.
- Serviços de TI.
- Sistemas e PDV.
- Redes e infraestrutura.
- Certificados digitais.
- Consultoria e treinamento.
- Venda de equipamentos.
- Manutenção.
- Seção de avaliações.
- Processo de atendimento em três etapas.
- CTA para contato via WhatsApp.

### Sobre

A página `sobrenos.html` apresenta:

- História e posicionamento da InteragiTI.
- Informações institucionais.
- Números e indicadores apresentados pela empresa.
- Valores de atendimento.
- Chamada para contato.

### Soluções

A página `solucoes.html` detalha as soluções oferecidas pela empresa, com foco em sistemas de gestão, PDV e ferramentas relacionadas à operação empresarial.

### Certificados digitais

A página `certificados.html` apresenta:

- Conceito de certificado digital.
- Aplicações práticas.
- e-CPF.
- e-CNPJ.
- Informações de emissão e suporte.
- Chamadas para contato.

### Contato

A página `contato.html` disponibiliza:

- Formulário de contato.
- Redirecionamento para WhatsApp.
- E-mail.
- Telefones.
- Horário de atendimento.
- Endereço.
- Mapa do Google Maps.

## Arquitetura

O projeto está organizado em uma camada de apresentação estática e uma pequena camada dinâmica para avaliações.

```text
InteragitTI/
├── InteragiTI/
│   ├── index.html
│   ├── sobrenos.html
│   ├── solucoes.html
│   ├── certificados.html
│   ├── contato.html
│   │
│   ├── api/
│   │   └── reviews.php
│   │
│   ├── config/
│   │   └── places.php
│   │
│   ├── css/
│   │   ├── style.css
│   │   ├── internal.css
│   │   ├── about.css
│   │   ├── glass.css
│   │   ├── interactions.css
│   │   └── reviews.css
│   │
│   ├── js/
│   │   ├── main.js
│   │   └── reviews.js
│   │
│   └── Assets/
│       ├── icon/
│       └── img/
│
├── docs/
│   ├── ARQUITETURA.md
│   └── CONFIGURACAO.md
│
└── README.md
```

## Tecnologias

| Tecnologia | Utilização |
|---|---|
| HTML5 | Estrutura das páginas |
| CSS3 | Layout, responsividade e identidade visual |
| JavaScript | Interações, animações e avaliações |
| PHP 8+ | Endpoint das avaliações |
| Google Places API | Consulta das avaliações do Google |
| Google Maps | Exibição da localização |
| WhatsApp | Canal de contato e conversão |
| Git/GitHub | Versionamento e hospedagem do código |

O projeto não utiliza um framework front-end ou um gerenciador de dependências obrigatório.

## Integração de avaliações

As avaliações são carregadas pelo arquivo:

`InteragiTI/api/reviews.php`

O fluxo é:

```text
Página inicial
     │
     ▼
reviews.js
     │
     ▼
GET /api/reviews.php
     │
     ▼
reviews.php
     │
     ├── Cache válido ──────────► Retorna cache
     │
     ├── API configurada ──────► Google Places API
     │                              │
     │                              ▼
     │                         Normalização
     │                              │
     │                              ▼
     │                           Cache
     │
     └── Falha/sem configuração ► Cache anterior ou avaliações estáticas
```

Essa estratégia evita que a página dependa exclusivamente de uma resposta da API externa para exibir a seção de avaliações.

## Configuração

A integração utiliza variáveis de ambiente. Consulte:

- [Configuração do projeto](docs/CONFIGURACAO.md)
- [Arquitetura técnica](docs/ARQUITETURA.md)

Variáveis utilizadas atualmente:

```env
GOOGLE_PLACES_API_KEY=
GOOGLE_PLACE_ID=
GOOGLE_REVIEWS_CACHE_TTL=86400
REVIEWS_CORS_ORIGINS=
```

**Nunca publique uma chave real da Google Places API no repositório.**

## Execução local

### Apenas front-end

Para visualizar as páginas estáticas, é possível abrir `InteragiTI/index.html` diretamente no navegador.

Entretanto, a integração PHP das avaliações precisa de um servidor PHP.

### Com PHP

Na pasta que contém os arquivos do projeto:

```bash
php -S localhost:8000
```

Depois, acesse:

```text
http://localhost:8000/InteragiTI/
```

O ambiente deve possuir PHP 8+ e a extensão cURL habilitada para consultar a Google Places API.

## Deploy

Como o projeto possui PHP, o ambiente de produção precisa oferecer suporte a PHP.

Uma hospedagem compatível deve permitir:

1. Servir arquivos HTML, CSS, JavaScript e imagens.
2. Executar PHP.
3. Utilizar HTTPS.
4. Configurar variáveis de ambiente.
5. Permitir requisições HTTP(S) de saída para a Google Places API.
6. Permitir que o PHP grave o arquivo de cache, quando necessário.

## Segurança

Alguns cuidados importantes:

- Não versionar arquivos `.env`.
- Não expor `GOOGLE_PLACES_API_KEY`.
- Restringir a chave da Google API por API, aplicação e/ou domínio conforme o ambiente.
- Utilizar HTTPS em produção.
- Manter as origens permitidas em `REVIEWS_CORS_ORIGINS` restritas aos domínios necessários.
- Revisar periodicamente as chaves e credenciais utilizadas pelo projeto.

## Responsividade e acessibilidade

O front-end possui:

- Meta viewport para dispositivos móveis.
- Menu responsivo.
- Botões de ação acessíveis.
- Textos alternativos em imagens.
- Estados de foco em elementos interativos.
- Suporte à preferência do usuário por redução de movimento através de `prefers-reduced-motion`.

## Organização do CSS

Os estilos foram separados por responsabilidade:

- `style.css`: estilos gerais e identidade principal.
- `internal.css`: estilos compartilhados pelas páginas internas.
- `about.css`: estilos específicos da página Sobre.
- `glass.css`: efeitos visuais e componentes com estética glass.
- `interactions.css`: efeitos e interações visuais.
- `reviews.css`: componentes da seção de avaliações.

## Organização do JavaScript

### `main.js`

Responsável pelas interações gerais do site, incluindo:

- Menu mobile.
- Comportamentos de navegação.
- Animações.
- Interações de cards e botões.
- Efeitos de movimento.
- Animação de indicadores numéricos.
- Respeito à preferência de redução de movimento.

### `reviews.js`

Responsável pela interface das avaliações:

- Busca dos dados no endpoint PHP.
- Renderização dos cards.
- Navegação anterior/próxima.
- Indicadores de posição.
- Autoplay.
- Navegação por toque em dispositivos móveis.
- Fallback quando a API não está disponível.

## Manutenção

Ao alterar uma página:

1. Preserve os caminhos relativos dos assets.
2. Verifique o funcionamento do menu em desktop e mobile.
3. Teste os links de WhatsApp.
4. Teste o formulário de contato.
5. Verifique as imagens e ícones.
6. Teste a seção de avaliações.
7. Teste a página em diferentes larguras de tela.

Ao alterar a integração de avaliações:

1. Verifique as variáveis de ambiente.
2. Confirme o `GOOGLE_PLACE_ID`.
3. Confirme as permissões da chave da Google API.
4. Verifique o cache.
5. Teste o endpoint `api/reviews.php`.
6. Verifique o fallback de avaliações.

## Documentação adicional

- [Arquitetura técnica](docs/ARQUITETURA.md)
- [Configuração e instalação](docs/CONFIGURACAO.md)

## Status

Projeto em desenvolvimento e manutenção contínua.

---

Desenvolvido para a presença digital da **InteragiTI**.
