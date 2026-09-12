<?php

$payload = file_get_contents('php://input');

echo '<h2>Payload</h2>';
echo '<pre>';
echo htmlspecialchars($payload);
echo '</pre>';

echo '<h2>Content Type</h2>';
echo '<pre>';
echo htmlspecialchars($_SERVER['CONTENT_TYPE'] ?? 'Unknown');
echo '</pre>';
