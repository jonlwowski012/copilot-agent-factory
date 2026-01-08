const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const router = express.Router();

// ===== MIDDLEWARE =====

/**
 * Authentication middleware - validates JWT token
 */
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Invalid or missing token',
      code: 'UNAUTHORIZED'
    });
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  try {
    // Validate JWT and attach user to request
    const user = await validateJWT(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }
};

/**
 * Admin authorization middleware
 */
const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({
      error: 'Admin access required',
      code: 'FORBIDDEN'
    });
  }
  next();
};

/**
 * Validation error handler middleware
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors.array()
    });
  }
  next();
};

// ===== VALIDATION RULES =====

const userCreateValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be 3-50 characters')
    .isAlphanumeric()
    .withMessage('Username must be alphanumeric')
    .toLowerCase(),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('full_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Full name must be less than 100 characters')
];

const userUpdateValidation = [
  param('userId')
    .isUUID()
    .withMessage('Invalid user ID'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('full_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
];

const listUsersValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  query('search')
    .optional()
    .trim()
];

// ===== CRUD ENDPOINTS =====

/**
 * POST /api/users
 * Create a new user
 */
router.post(
  '/api/users',
  authenticate,
  userCreateValidation,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { username, email, password, full_name } = req.body;
      
      // Check if user already exists
      const existingUser = await db.findUserByUsernameOrEmail(username, email);
      if (existingUser) {
        return res.status(409).json({
          error: 'Username or email already exists',
          code: 'USER_EXISTS'
        });
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Create user
      const newUser = await db.createUser({
        id: uuidv4(),
        username,
        email,
        password_hash: passwordHash,
        full_name: full_name || null,
        created_at: new Date(),
        updated_at: new Date()
      });
      
      // Return response (exclude password_hash)
      const response = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        full_name: newUser.full_name,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at
      };
      
      return res.status(201).json(response);
      
    } catch (error) {
      next(error);  // Pass to error handler
    }
  }
);

/**
 * GET /api/users
 * List users with pagination
 */
router.get(
  '/api/users',
  authenticate,
  listUsersValidation,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 20, 100);
      const search = req.query.search || null;
      
      const offset = (page - 1) * limit;
      
      const { users, total } = await db.listUsers({
        offset,
        limit,
        search
      });
      
      // Format response
      const data = users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        created_at: user.created_at,
        updated_at: user.updated_at
      }));
      
      return res.status(200).json({
        data,
        pagination: {
          page,
          per_page: limit,
          total,
          total_pages: Math.ceil(total / limit)
        }
      });
      
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/users/:userId
 * Get user by ID
 */
router.get(
  '/api/users/:userId',
  authenticate,
  param('userId').isUUID().withMessage('Invalid user ID'),
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const user = await db.getUserById(req.params.userId);
      
      if (!user) {
        return res.status(404).json({
          error: `User with ID ${req.params.userId} not found`,
          code: 'USER_NOT_FOUND'
        });
      }
      
      // Format response (exclude password_hash)
      const response = {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
      
      return res.status(200).json(response);
      
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /api/users/:userId
 * Update user (partial update)
 */
router.patch(
  '/api/users/:userId',
  authenticate,
  userUpdateValidation,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      
      // Check authorization
      if (userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({
          error: 'Can only update own profile',
          code: 'FORBIDDEN'
        });
      }
      
      // Check if user exists
      const existingUser = await db.getUserById(userId);
      if (!existingUser) {
        return res.status(404).json({
          error: `User with ID ${userId} not found`,
          code: 'USER_NOT_FOUND'
        });
      }
      
      // Prepare update data
      const updateData = {};
      if (req.body.email) updateData.email = req.body.email;
      if (req.body.full_name !== undefined) updateData.full_name = req.body.full_name;
      
      // Hash password if provided
      if (req.body.password) {
        updateData.password_hash = await bcrypt.hash(req.body.password, 10);
      }
      
      updateData.updated_at = new Date();
      
      // Perform update
      const updatedUser = await db.updateUser(userId, updateData);
      
      // Format response
      const response = {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        full_name: updatedUser.full_name,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at
      };
      
      return res.status(200).json(response);
      
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/users/:userId
 * Delete user (admin only)
 */
router.delete(
  '/api/users/:userId',
  authenticate,
  requireAdmin,
  param('userId').isUUID().withMessage('Invalid user ID'),
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      
      // Check if user exists
      const existingUser = await db.getUserById(userId);
      if (!existingUser) {
        return res.status(404).json({
          error: `User with ID ${userId} not found`,
          code: 'USER_NOT_FOUND'
        });
      }
      
      // Delete user
      await db.deleteUser(userId);
      
      return res.status(204).send();
      
    } catch (error) {
      next(error);
    }
  }
);

// ===== ERROR HANDLER =====

router.use((error, req, res, next) => {
  console.error('API Error:', error);
  
  return res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR'
  });
});

module.exports = router;
