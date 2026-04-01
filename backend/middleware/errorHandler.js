// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    // Default error values
    let error = { ...err };
    error.message = err.message;

    // Log to console for dev
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found`;
        error = { message, statusCode: 404 };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `${field} already exists`;
        error = { message, statusCode: 400 };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
            .map(val => val.message)
            .join(', ');
        error = { message, statusCode: 400 };
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = { message, statusCode: 401 };
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = { message, statusCode: 401 };
    }

    // Multer errors
    if (err.name === 'MulterError') {
        let message = 'File upload error';
        if (err.code === 'FILE_TOO_LARGE') message = 'File is too large';
        if (err.code === 'LIMIT_FILE_COUNT') message = 'Too many files';
        error = { message, statusCode: 400 };
    }

    // Custom error handling for file type
    if (err.message && err.message.includes('Only PDF files are allowed')) {
        error = { 
            message: 'Only PDF files are allowed', 
            statusCode: 400 
        };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
        statusCode: error.statusCode || 500
    });
};

export default errorHandler;
