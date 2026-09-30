<?php

declare(strict_types=1);

function loadEnvironment(string $path): void
{
    if (!is_readable($path)) {
        return;
    }

    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
            continue;
        }

        [$name, $value] = explode('=', $line, 2);
        $name = trim($name);
        $value = trim(trim($value), "\"'");
        if ($name !== '' && getenv($name) === false) {
            putenv("{$name}={$value}");
        }
    }
}

loadEnvironment(dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env');

return [
    'api_key' => (string) getenv('GOOGLE_PLACES_API_KEY'),
    'place_id' => (string) getenv('GOOGLE_PLACE_ID'),
    'cache_file' => dirname(__DIR__) . DIRECTORY_SEPARATOR . 'cache' . DIRECTORY_SEPARATOR . 'reviews_cache.json',
    'cache_ttl' => max(60, (int) (getenv('GOOGLE_REVIEWS_CACHE_TTL') ?: 86400)),
    'cors_origins' => array_values(array_filter(array_map('trim', explode(',', (string) getenv('REVIEWS_CORS_ORIGINS'))))),
];