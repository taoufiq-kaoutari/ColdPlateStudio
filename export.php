<?php
ini_set('display_errors','0');
require_once __DIR__ . '/solver.php';
try {
    $payload = isset($_POST['payload']) ? (string)$_POST['payload'] : '{}';
    $raw = json_decode($payload, true);
    if (!is_array($raw) || json_last_error() !== JSON_ERROR_NONE) throw new Exception('Invalid export data.');
    $c = cfg($raw);
    $r = solve($c, make_geometry($c));
    $rows = result_rows($r);
} catch (Exception $e) {
    http_response_code(422);
    exit('Export unavailable: ' . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8'));
}
header('Content-Type: application/vnd.ms-excel; charset=UTF-8');
header('Content-Disposition: attachment; filename="coldplate_results.xls"');
header('Cache-Control: no-store');
echo "\xEF\xBB\xBF";
echo '<html><head><meta charset="utf-8"></head><body><table border="1"><tr style="background:#dcecff;font-weight:bold"><th>Quantity</th><th>Value</th><th>Unit</th></tr>';
foreach ($rows as $row) {
    echo '<tr><td>' . htmlspecialchars((string)$row[0], ENT_QUOTES, 'UTF-8') . '</td><td>' . htmlspecialchars((string)$row[1], ENT_QUOTES, 'UTF-8') . '</td><td>' . htmlspecialchars((string)$row[2], ENT_QUOTES, 'UTF-8') . '</td></tr>';
}
echo '</table><p>© ' . date('Y') . ' Taoufiq KAOUTARI</p></body></html>';
