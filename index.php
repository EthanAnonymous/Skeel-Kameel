<?php
// React SPA Router
// Routes all requests through React's index.html

$request = $_SERVER['REQUEST_URI'];

// Get the directory where index.php is located
$base = dirname($_SERVER['SCRIPT_NAME']);
if ($base === '/' || $base === '\\') {
    $base = '/';
} else {
    $base = rtrim($base, '/') . '/';
}

// Remove the base path from the request
$request = substr($request, strlen($base));
$request = '/' . ltrim($request, '/');

// Parse the URL to get just the path
$request = parse_url($request, PHP_URL_PATH);
if ($request === null || $request === '') {
    $request = '/';
}

// Serve static files directly
if (preg_match('/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$/i', $request)) {
    $file = __DIR__ . '/dist' . $request;
    if (file_exists($file)) {
        // Set appropriate content type
        $ext = pathinfo($file, PATHINFO_EXTENSION);
        $content_types = [
            'js' => 'application/javascript',
            'css' => 'text/css',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            'woff' => 'font/woff',
            'woff2' => 'font/woff2',
            'ttf' => 'font/ttf',
            'eot' => 'application/vnd.ms-fontobject',
            'ico' => 'image/x-icon'
        ];
        header('Content-Type: ' . ($content_types[$ext] ?? 'application/octet-stream'));
        readfile($file);
        exit;
    }
}

// For everything else, serve index.html (React SPA routing)
$index_file = __DIR__ . '/dist/index.html';
if (file_exists($index_file)) {
    header('Content-Type: text/html');
    readfile($index_file);
} else {
    header("HTTP/1.0 404 Not Found");
    echo "Application not built. Please run: npm run build";
}
?>
