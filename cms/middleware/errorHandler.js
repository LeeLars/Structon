export function errorHandler(err, req, res, next) {
  // Log error with full details to console (for Railway logs)
  console.error('❌ Error Details:', {
    message: err.message,
    stack: err.stack,
    code: err.code,
    path: req.path,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString()
  });
  
  // Don't leak sensitive error details in production
  const isProduction = process.env.NODE_ENV === 'production';
  const statusCode = err.status || err.statusCode || 500;
  
  // Build error response
  const errorResponse = {
    error: isProduction && statusCode === 500 
      ? 'Er is een fout opgetreden. Probeer het later opnieuw.' 
      : err.message || 'Interne serverfout',
    statusCode
  };
  
  // Always include details if available (for debugging upload issues)
  if (err.details) {
    errorResponse.details = err.details;
  }
  
  // Add cloudinaryConfigured status if available
  if (err.cloudinaryConfigured !== undefined) {
    errorResponse.cloudinaryConfigured = err.cloudinaryConfigured;
  }
  
  // Add stack trace in development only
  if (!isProduction && err.stack) {
    errorResponse.stack = err.stack;
  }
  
  res.status(statusCode).json(errorResponse);
}
