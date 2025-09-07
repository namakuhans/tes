# Discord Auto Store Bot

A comprehensive Discord bot for managing an automated store with MongoDB integration, featuring product management, midleman services, reputation system, and advanced reporting.

## Features

### 🛒 Store Management
- **Product Management**: Add, edit, remove products with stock tracking
- **Midleman Services**: Escrow transaction management
- **Payment Methods**: Multiple payment options configuration
- **Real-time Updates**: Auto-refreshing store embed every 5 seconds

### 👥 User Features
- **Buy System**: Modal-based product purchasing with ticket creation
- **Midleman System**: Escrow service requests with automated handling
- **Reputation System**: User reputation tracking with history
- **Transaction History**: Personal transaction records with pagination
- **Report System**: User reporting with evidence attachment support

### 🔧 Admin Features
- **Complete Store Setup**: Channel and role configuration
- **Stock Management**: Real-time inventory tracking
- **Transaction Monitoring**: Comprehensive logging system
- **Report Moderation**: Ban/kick/reject system with confirmations
- **Role Management**: Flexible permission system

## Installation

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Discord Bot Token

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd discord-auto-store
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DISCORD_TOKEN=your_discord_bot_token_here
MONGODB_URI=mongodb://localhost:27017/discord-auto-store
CLIENT_ID=your_discord_client_id_here
GUILD_ID=your_discord_guild_id_here
```

4. **Setup Assets**
Place your GIF files in the `/assets/` directory:
- `shop-open.gif` - Displayed when store is open
- `shop-closed.gif` - Displayed when store is closed  
- `DM.gif` - Sent in DM notifications
- `report-alert.gif` - Displayed in report alerts

5. **Start the bot**
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## Configuration

### Initial Setup Commands (Admin Only)

1. **Set main store channel**
```
/setup #store-channel
```

2. **Configure roles**
```
/setadmin @AdminRole
/setgeneral @GeneralRole
```

3. **Set up logging channels**
```
/setbuylog #buy-logs
/setmidmanlog #midman-logs
/setreportmediator #reports
/setreportlog #report-logs
/setproductlog #product-logs
```

4. **Configure ticket categories**
```
/setbuyticket Buy-Tickets-Category
/setmidlemanticket Midleman-Tickets-Category
```

5. **Add products and services**
```
/addstock PROD001 "Premium Account" 10 25.99
/addmm MM001 5 10
```

6. **Add payment methods**
```
/addpayment PayPal paypal@example.com "John Doe"
/addpayment Bitcoin bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh "Crypto Wallet"
```

## Commands Reference

### General User Commands
- `/reps <user> <reason>` - Give reputation to a user
- `/repsinfo <user>` - View reputation information
- `/report <user> <reason> [attachment]` - Report a user
- `/mytrx` - View transaction history
- `/bot` - Bot information
- `/help` - Command documentation

### Admin Commands
- `/setup <channel>` - Set main store channel
- `/addstock <code> <name> <quantity> <price>` - Add product
- `/editstock <code> [name] [quantity] [price]` - Edit product
- `/removestock <code>` - Remove product
- `/addmm <code> <escrow_count> <tax>` - Add midleman service
- `/editmm <code> [escrow_count] [tax]` - Edit midleman service
- `/removemm <code>` - Remove midleman service
- `/addpayment <name> <account> <holder>` - Add payment method
- `/removepayment <name>` - Remove payment method
- `/shop <open|close>` - Control store status
- `/role <user> <role>` - Assign roles
- `/trx <user>` - View user transactions

## Database Schema

### Collections
- **products** - Store inventory management
- **midleman_services** - Escrow service configurations
- **transactions** - Transaction history and tracking
- **reputation** - User reputation system
- **reports** - User report management
- **bot_config** - Bot configuration settings
- **payment_methods** - Payment option storage

## Architecture

### File Structure
```
/discord-auto-store/
├── /src/
│   ├── /commands/
│   │   ├── /general/     # User commands
│   │   └── /admin/       # Admin commands
│   ├── /events/          # Discord events
│   ├── /modals/          # Modal interactions
│   ├── /buttons/         # Button interactions
│   ├── /utils/           # Helper functions
│   ├── /models/          # MongoDB schemas
│   ├── index.js          # Main bot file
│   └── config.js         # Configuration
├── /assets/              # GIF assets
├── .env                  # Environment variables
├── package.json
└── README.md
```

### Key Features
- **Modular Architecture**: Clean separation of concerns
- **Role-based Access Control**: Flexible permission system
- **Real-time Updates**: Auto-refreshing embeds
- **Comprehensive Logging**: Full audit trail
- **Error Handling**: Robust error management
- **Transaction Safety**: Atomic operations with rollback

## Support

For support, feature requests, or bug reports, please create an issue in the repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

Created by **iHannsy**
- Discord Bot Framework: Discord.js v14
- Database: MongoDB with Mongoose
- Runtime: Node.js