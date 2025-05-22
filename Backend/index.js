require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const mongoose     = require('mongoose');
const nodemailer   = require('nodemailer');
const cookieParser = require('cookie-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi    = require('swagger-ui-express');

const authRoutes   = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const authenticate = require('./middleware/authenticate');
const Event        = require('./models/Event');
const User         = require('./models/User');

const app = express();

// ─── Swagger / OpenAPI Setup ─────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'Festiva API',
      version:     '1.0.0',
      description: 'Event ticketing backend',
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Local server' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type:         'http',
          scheme:       'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        EventInput: {
          type: 'object',
          required: [
            'title','price','startDate','endDate',
            'location','category','ticketsAvailable'
          ],
          properties: {
            title:           { type: 'string' },
            price:           { type: 'number' },
            startDate:       { type: 'string', format: 'date-time' },
            endDate:         { type: 'string', format: 'date-time' },
            location:        { type: 'string' },
            category:        { type: 'string' },
            ticketsAvailable:{ type: 'integer', minimum: 0 }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// ─── Middleware ───────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ─── Routes ────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,
  port:   Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOrderConfirmation(toEmail, orderItems) {
  const lines = orderItems
    .map(i => `• ${i.event.title} ×${i.quantity} = $${i.quantity * i.event.price}`)
    .join('\n');

  await transporter.sendMail({
    from:    `"Festiva Tickets" <${process.env.EMAIL_USER}>`,
    to:      toEmail,
    subject: 'Your Festiva Ticket Confirmation',
    text:    `Thank you for your purchase!\n\nHere’s your order summary:\n${lines}\n\nEnjoy the show!`
  });
}

// Auth: register, login, refresh
app.use('/auth', authRoutes);

// Events: all endpoints in routes/events.js (GET public, POST/PUT/DELETE protected)
app.use('/events', eventsRoutes);

// Orders: protected, sends confirmation email
app.post('/orders', authenticate, async (req, res) => {
  try {
    // Lookup user email in DB
    const dbUser = await User.findById(req.user.id);
    if (!dbUser || !dbUser.email) {
      throw new Error('User email not found in database');
    }
    const toEmail = dbUser.email;

    // Build items
    const orderItems = await Promise.all(
      req.body.items.map(async i => {
        const evt = await Event.findById(i.eventId);
        if (!evt) throw new Error('Event not found: ' + i.eventId);
        return { event: evt, quantity: i.quantity };
      })
    );

    await sendOrderConfirmation(toEmail, orderItems);
    res.json({ success: true, message: 'Order placed and email sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ─── Start Server ────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('DB connection error:', err));
