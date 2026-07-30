<?php
ini_set('display_errors', '0');
ini_set('log_errors', '1');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');

function json_response($payload, $status) {
    if (function_exists('http_response_code')) {
        http_response_code($status);
    }
    $json = json_encode($payload, JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        echo '{"ok":false,"error":"Unable to encode the calculation response."}';
        return;
    }
    echo $json;
}

try {
    require_once __DIR__ . '/solver.php';

    $body = file_get_contents('php://input');
    if ($body === false || trim($body) === '') {
        throw new Exception('No input data were received.');
    }

    $raw = json_decode($body, true);
    if (!is_array($raw) || json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('The submitted input data are invalid.');
    }

    $geometryOnly = isset($raw['_mode']) && $raw['_mode'] === 'geometry';
    unset($raw['_mode']);
    $c = cfg($raw);
    $g = make_geometry($c);
    if ($geometryOnly) {
        json_response(array('ok' => true, 'data' => array('c' => $c, 'g' => $g)), 200);
        exit;
    }
    $r = solve($c, $g);
    $r['rows'] = result_rows($r);

    json_response(array('ok' => true, 'data' => $r), 200);
} catch (Exception $e) {
    json_response(array('ok' => false, 'error' => $e->getMessage()), 422);
} catch (Throwable $e) {
    json_response(array('ok' => false, 'error' => 'The physical model could not be evaluated on this server.'), 500);
}
