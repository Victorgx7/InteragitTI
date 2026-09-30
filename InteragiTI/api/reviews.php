<?php

declare(strict_types=1);

$config = require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'places.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($requestOrigin !== '' && in_array($requestOrigin, $config['cors_origins'], true)) {
    header("Access-Control-Allow-Origin: {$requestOrigin}");
    header('Vary: Origin');
}
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

function sendReviews(array $payload, bool $stale = false): never
{
    $payload['stale'] = $stale;
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function emptyReviews(): array
{
    return ['rating' => 0, 'total' => 0, 'reviews' => []];
}

function staticReviews(): array
{
    $texts = [
        'Atendimento e prestação de serviço Top!!! De confiança!!!',
        'Nós trabalhamos com a InteragiTI, a mais ou menos 8 anos, e eles são realmente incríveis. A melhor empresa no segmento. O suporte é fantástico, sempre respondem quando precisa, e quanto ao sistema, não tenho nem o que falar. Foi criado sob medida pro nosso negocio, e ultrapassou nossas expectativas. Super indico a InteragiTI.',
        'Serviço exemplar, qualidade superior no atendimento e profissionalismo, preço Justo e muito competente, super recomendo!!',
        'Já fazem uns 3 anos que contratamos os serviços da InteragiTI e só tenho uma coisa a dizer. A melhor empresa do país, extremamente atenciosos, atendem de pronto, são extremamente profissionais e fazem um trabalho incrível.',
        'Serviço excelente! Evandro e equipe são rápidos e prestativos. Sanaram todas as minhas dúvidas.',
    ];

    return [
        'rating' => 5.0,
        'total' => 30,
        'reviews' => array_map(static fn (string $text): array => [
            'author' => 'Cliente InteragiTI',
            'rating' => 5,
            'text' => $text,
            'relativeTime' => 'Avaliação no Google',
            'profilePhoto' => '',
        ], $texts),
    ];
}

function readCache(string $file): ?array
{
    if (!is_readable($file)) {
        return null;
    }

    $cached = json_decode((string) file_get_contents($file), true);
    return is_array($cached) && isset($cached['fetched_at'], $cached['data']) && is_array($cached['data'])
        ? $cached
        : null;
}

function cleanText(mixed $value, int $limit = 1000): string
{
    $text = is_string($value) ? trim(strip_tags($value)) : '';
    return function_exists('mb_substr') ? mb_substr($text, 0, $limit) : substr($text, 0, $limit);
}

function cleanUrl(mixed $value): string
{
    $url = is_string($value) ? trim($value) : '';
    return str_starts_with($url, 'https://') && filter_var($url, FILTER_VALIDATE_URL) ? $url : '';
}

function normalizeReviews(array $source): array
{
    $reviews = [];
    foreach (is_array($source['reviews'] ?? null) ? $source['reviews'] : [] as $review) {
        if (!is_array($review)) {
            continue;
        }
        $rating = (int) ($review['rating'] ?? 0);
        $reviewText = is_array($review['text'] ?? null) ? ($review['text']['text'] ?? '') : ($review['text'] ?? '');
        $text = cleanText($reviewText);
        if (($rating !== 4 && $rating !== 5) || $text === '') {
            continue;
        }
        $reviews[] = [
            'author' => cleanText($review['authorAttribution']['displayName'] ?? 'Cliente', 120) ?: 'Cliente',
            'rating' => $rating,
            'text' => $text,
            'relativeTime' => cleanText($review['relativePublishTimeDescription'] ?? '', 80),
            'profilePhoto' => cleanUrl($review['authorAttribution']['photoUri'] ?? ''),
        ];
    }

    return [
        'rating' => round(max(0, min(5, (float) ($source['rating'] ?? 0))), 1),
        'total' => max(0, (int) ($source['userRatingCount'] ?? 0)),
        'reviews' => array_slice($reviews, 0, 10),
    ];
}

$cached = readCache($config['cache_file']);
if ($cached !== null && (time() - (int) $cached['fetched_at']) < $config['cache_ttl']) {
    sendReviews($cached['data']);
}

if ($config['api_key'] === '' || $config['place_id'] === '') {
    if ($cached !== null) {
        sendReviews($cached['data'], true);
    }
    sendReviews(staticReviews(), true);
}

$apiUrl = 'https://places.googleapis.com/v1/places/' . rawurlencode($config['place_id']);
$curl = curl_init($apiUrl);
curl_setopt_array($curl, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 8,
    CURLOPT_CONNECTTIMEOUT => 4,
    CURLOPT_HTTPHEADER => [
        'X-Goog-Api-Key: ' . $config['api_key'],
        'X-Goog-FieldMask: rating,userRatingCount,reviews',
    ],
]);
$body = curl_exec($curl);
$status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

$decoded = is_string($body) ? json_decode($body, true) : null;
if ($status >= 200 && $status < 300 && is_array($decoded)) {
    $data = normalizeReviews($decoded);
    $cacheDirectory = dirname($config['cache_file']);
    if (is_dir($cacheDirectory) || mkdir($cacheDirectory, 0750, true)) {
        file_put_contents($config['cache_file'], json_encode(['fetched_at' => time(), 'data' => $data], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX);
    }
    sendReviews($data);
}

if ($cached !== null) {
    sendReviews($cached['data'], true);
}

sendReviews(staticReviews(), true);