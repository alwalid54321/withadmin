const { logger } = require('../config/db');

class ApiResponse {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  static error(res, message = 'Internal Server Error', statusCode = 500, errors = null) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString()
    };

    if (errors) {
      response.errors = errors;
    }

    if (process.env.NODE_ENV === 'development' && errors) {
      response.debug = {
        stack: errors.stack,
        details: errors.message
      };
    }

    return res.status(statusCode).json(response);
  }

  static paginated(res, data, page, limit, total, message = 'Success') {
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null
      },
      timestamp: new Date().toISOString()
    });
  }

  static created(res, data, message = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }

  static noContent(res) {
    return res.status(204).send();
  }

  static badRequest(res, message = 'Bad Request', errors = null) {
    return this.error(res, message, 400, errors);
  }

  static unauthorized(res, message = 'Unauthorized access') {
    return this.error(res, message, 401);
  }

  static forbidden(res, message = 'Access forbidden') {
    return this.error(res, message, 403);
  }

  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  }

  static tooManyRequests(res, message = 'Too many requests') {
    return this.error(res, message, 429);
  }

  static validationError(res, errors) {
    return this.error(res, 'Validation Error', 422, errors);
  }

  // Format validation errors from express-validator
  static formatValidationErrors(errors) {
    return errors.array().reduce((acc, error) => {
      if (!acc[error.param]) {
        acc[error.param] = [];
      }
      acc[error.param].push(error.msg);
      return acc;
    }, {});
  }

  // Handle async route handlers
  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch((error) => {
        logger.error('Async handler error:', error);
        return this.error(res, error.message);
      });
    };
  }

  // Create a standardized error response
  static createErrorResponse(error) {
    const errorResponse = {
      message: error.message || 'An error occurred',
      code: error.code || 'INTERNAL_ERROR',
      status: error.status || 500
    };

    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = error.stack;
      errorResponse.details = error.details || {};
    }

    return errorResponse;
  }

  // Handle database errors
  static handleDbError(error) {
    let message = 'Database error occurred';
    let status = 500;

    switch (error.code) {
      case 'ER_DUP_ENTRY':
        message = 'Duplicate entry found';
        status = 409;
        break;
      case 'ER_NO_REFERENCED_ROW':
      case 'ER_NO_REFERENCED_ROW_2':
        message = 'Referenced record not found';
        status = 404;
        break;
      case 'ER_BAD_NULL_ERROR':
        message = 'Required field missing';
        status = 400;
        break;
      case 'ER_ACCESS_DENIED_ERROR':
        message = 'Database access denied';
        status = 403;
        break;
      default:
        logger.error('Unhandled database error:', error);
    }

    return { message, status };
  }

  // Format success response with metadata
  static successWithMeta(res, data, metadata, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data,
      metadata,
      timestamp: new Date().toISOString()
    });
  }

  // Send file download response
  static download(res, filePath, fileName) {
    return res.download(filePath, fileName, (err) => {
      if (err) {
        logger.error('File download error:', err);
        return this.error(res, 'Error downloading file');
      }
    });
  }

  // Stream response
  static stream(res, stream, contentType = 'application/octet-stream') {
    res.setHeader('Content-Type', contentType);
    stream.pipe(res);
    
    stream.on('error', (error) => {
      logger.error('Stream error:', error);
      res.end();
    });
  }
}

module.exports = ApiResponse;
