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
  
  // Generic error messages for production
  const errorResponse = {
    error: isProduction && statusCode === 500 
      ? 'Er is een fout opgetreden. Probeer het later opnieuw.' 
      : err.message || 'Interne serverfout',
    statusCode
  };
  
  // Add stack trace in development only
  if (!isProduction && err.stack) {
    errorResponse.stack = err.stack;
  }
  
  // Temporarily add more debug info in production for debugging
  if (isProduction && statusCode === 500) {
    errorResponse.debug = {
      message: err.message,
      code: err.code
    };
  }
  
  res.status(statusCode).json(errorResponse);
}
