export function errorHandler(err, req, res, next) {
  // Log error with context
  console.error('❌ Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
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
  
  res.status(statusCode).json(errorResponse);
}
