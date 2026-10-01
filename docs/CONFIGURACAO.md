# Configuração e instalação — InteragiTI

## 1. Pré-requisitos

Para trabalhar apenas com as páginas estáticas:

- navegador moderno;
- editor de código.

Para executar todas as funcionalidades:

- PHP 8.0+;
- extensão cURL do PHP;
- servidor web ou servidor local do PHP;
- acesso à internet;
- Google Places API configurada, caso as avaliações dinâmicas sejam utilizadas.

## 2. Estrutura do projeto

O código da aplicação está dentro de:

```text
InteragiTI/
```

A partir da raiz do repositório:

```text
InteragiTI/index.html
InteragiTI/sobrenos.html
InteragiTI/solucoes.html
InteragiTI/certificados.html
InteragiTI/contato.html
```

## 3. Variáveis de ambiente

O módulo de avaliações utiliza:

```env
GOOGLE_PLACES_API_KEY=
GOOGLE_PLACE_ID=
GOOGLE_REVIEWS_CACHE_TTL=86400
REVIEWS_CORS_ORIGINS=
```

### GOOGLE_PLACES_API_KEY

Chave utilizada pelo PHP para consultar a Google Places API.

Essa chave é secreta e não deve ser publicada no GitHub.

### GOOGLE_PLACE_ID

Identificador do estabelecimento na plataforma do Google.

### GOOGLE_REVIEWS_CACHE_TTL

Tempo, em segundos, durante o qual o cache é considerado válido.

Exemplo de 24 horas:

```env
GOOGLE_REVIEWS_CACHE_TTL=86400
```

### REVIEWS_CORS_ORIGINS

Lista de origens autorizadas a consumir o endpoint de avaliações.

Exemplo:

```env
REVIEWS_CORS_ORIGINS=https://www.seudominio.com,http://localhost:8000
```

## 4. Arquivo .env

O projeto pode carregar as variáveis de um arquivo:

```text
InteragiTI/.env
```

Exemplo:

```env
GOOGLE_PLACES_API_KEY=sua_chave_aqui
GOOGLE_PLACE_ID=seu_place_id_aqui
GOOGLE_REVIEWS_CACHE_TTL=86400
REVIEWS_CORS_ORIGINS=http://localhost:8000
```

Não coloque credenciais reais em documentação, commits ou capturas de tela.

## 5. Execução local

Abra um terminal na raiz do repositório e execute:

```bash
php -S localhost:8000
```

Depois acesse:

```text
http://localhost:8000/InteragiTI/
```

Como o projeto possui arquivos PHP, utilizar um servidor local é preferível a abrir os arquivos HTML diretamente no navegador quando for testar a aplicação completa.

## 6. Teste do endpoint

Com o servidor local executando, o endpoint pode ser acessado em:

```text
http://localhost:8000/InteragiTI/api/reviews.php
```

A resposta esperada é JSON.

## 7. Google Places API

Para avaliações dinâmicas, a aplicação precisa de uma chave válida e de um Place ID.

A API utilizada pelo código é a Places API v1.

O endpoint solicita os campos necessários para:

- nota;
- quantidade de avaliações;
- avaliações.

A chave deve possuir as permissões necessárias no projeto Google Cloud correspondente.

## 8. Cache

O PHP utiliza um arquivo JSON para cachear as avaliações.

O caminho utilizado pelo código é:

```text
InteragiTI/cache/reviews_cache.json
```

Esse arquivo pode ser criado automaticamente quando o PHP possui permissão de escrita no diretório.

## 9. Fallback

Existem dois níveis de fallback:

1. cache anterior, quando disponível;
2. avaliações estáticas definidas no código.

Isso permite que a seção continue apresentando conteúdo mesmo quando a API externa estiver indisponível.

## 10. Deploy

Antes de publicar:

- configure as variáveis de ambiente no servidor;
- confirme que PHP e cURL estão habilitados;
- confirme permissão de escrita no cache;
- configure HTTPS;
- restrinja a chave da Google API;
- configure CORS para o domínio correto;
- teste o endpoint;
- teste todas as páginas;
- teste o WhatsApp;
- teste o mapa;
- teste a versão mobile.

## 11. Checklist de publicação

```text
[ ] PHP 8+ funcionando
[ ] cURL habilitado
[ ] Google Places API configurada
[ ] GOOGLE_PLACES_API_KEY configurada
[ ] GOOGLE_PLACE_ID configurado
[ ] REVIEWS_CORS_ORIGINS configurado
[ ] Cache com permissão de escrita
[ ] HTTPS ativo
[ ] Links de WhatsApp testados
[ ] Formulário testado
[ ] Google Maps testado
[ ] Menu mobile testado
[ ] Avaliações testadas
```
