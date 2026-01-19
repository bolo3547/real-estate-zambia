/**
 * ==============================
 * API ROUTE STRUCTURE
 * Real Estate Platform
 * ==============================
 * 
 * Base URL: /api/v1
 * 
 * All routes follow RESTful conventions with
 * role-based access control (RBAC)
 */

import { Router } from 'express';
import propertyRoutes from './property.routes';

const router = Router();

/**
 * ==============================
 * PUBLIC ROUTES
 * ==============================
 */

// Public property viewing (some endpoints)
router.use('/properties', propertyRoutes);

export default router;

/**
 * ==============================
 * ROUTE STRUCTURE REFERENCE
 * ==============================
 * 
 * /api/v1/auth
 *   POST   /register              - Register new user
 *   POST   /login                 - Login
 *   POST   /logout                - Logout
 *   POST   /refresh               - Refresh token
 *   POST   /forgot-password       - Request password reset
 *   POST   /reset-password        - Reset password
 *   POST   /verify-email          - Verify email
 *   POST   /resend-verification   - Resend verification email
 * 
 * /api/v1/users
 *   GET    /me                    - Get current user
 *   PATCH  /me                    - Update current user
 *   DELETE /me                    - Delete account (soft)
 *   GET    /me/properties         - Get user's properties
 *   GET    /me/saved              - Get saved properties
 *   POST   /me/saved/:propertyId  - Save a property
 *   DELETE /me/saved/:propertyId  - Unsave a property
 *   GET    /me/inquiries          - Get user's inquiries
 *   GET    /me/notifications      - Get notifications
 *   PATCH  /me/notifications/:id  - Mark notification read
 * 
 * /api/v1/properties
 *   GET    /                      - List properties (public, filtered)
 *   GET    /featured              - Get featured properties
 *   GET    /:idOrSlug             - Get property details
 *   POST   /                      - Create property (AGENT, LANDLORD)
 *   PATCH  /:id                   - Update property (owner/agent)
 *   DELETE /:id                   - Delete property (soft)
 *   POST   /:id/images            - Upload images
 *   DELETE /:id/images/:imageId   - Delete image
 *   PATCH  /:id/images/reorder    - Reorder images
 *   POST   /:id/view              - Track view
 *   POST   /:id/inquire           - Create inquiry
 *   POST   /:id/submit            - Submit for approval
 *   POST   /:id/withdraw          - Withdraw listing
 * 
 * /api/v1/search
 *   GET    /properties            - Advanced property search
 *   GET    /suggestions           - Search suggestions
 *   GET    /locations             - Location autocomplete
 *   GET    /nearby                - Nearby properties (geo)
 * 
 * /api/v1/agents
 *   GET    /                      - List agents
 *   GET    /:id                   - Get agent profile
 *   GET    /:id/properties        - Get agent's listings
 *   GET    /:id/reviews           - Get agent reviews
 *   POST   /:id/reviews           - Submit review
 *   POST   /:id/contact           - Contact agent
 * 
 * /api/v1/landlord
 *   GET    /profile               - Get landlord profile
 *   PATCH  /profile               - Update landlord profile
 *   GET    /properties            - Get owned properties
 *   GET    /analytics             - Property analytics
 *   GET    /inquiries             - All inquiries for properties
 * 
 * /api/v1/inquiries
 *   GET    /                      - List inquiries
 *   GET    /:id                   - Get inquiry details
 *   PATCH  /:id                   - Update inquiry status
 *   POST   /:id/respond           - Respond to inquiry
 *   DELETE /:id                   - Delete inquiry
 * 
 * /api/v1/messages
 *   GET    /                      - List conversations
 *   GET    /:inquiryId            - Get messages for inquiry
 *   POST   /:inquiryId            - Send message
 *   PATCH  /:id/read              - Mark as read
 *   DELETE /:id                   - Delete message
 * 
 * /api/v1/subscriptions
 *   GET    /                      - Get current subscription
 *   GET    /plans                 - List available plans
 *   POST   /checkout              - Create checkout session
 *   POST   /cancel                - Cancel subscription
 *   POST   /resume                - Resume subscription
 * 
 * /api/v1/uploads
 *   POST   /image                 - Upload image
 *   POST   /document              - Upload document
 *   DELETE /:id                   - Delete upload
 * 
 * /api/v1/admin
 *   GET    /dashboard             - Dashboard stats
 *   GET    /users                 - List all users
 *   GET    /users/:id             - Get user details
 *   PATCH  /users/:id             - Update user
 *   PATCH  /users/:id/status      - Change user status
 *   GET    /properties            - All properties
 *   GET    /properties/pending    - Pending approvals
 *   PATCH  /properties/:id/approve - Approve property
 *   PATCH  /properties/:id/reject  - Reject property
 *   GET    /agents                - List agents
 *   PATCH  /agents/:id/verify     - Verify agent
 *   GET    /audit-logs            - View audit logs
 *   GET    /analytics             - Platform analytics
 *   GET    /config                - System config
 *   PATCH  /config                - Update config
 * 
 * /api/v1/webhooks
 *   POST   /stripe                - Stripe webhooks
 *   POST   /email                 - Email service webhooks
 */
