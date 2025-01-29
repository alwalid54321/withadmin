# Market Data Admin Panel

A secure and feature-rich admin panel for managing market data, products, and currencies.

## Features

- **Secure Authentication**
  - JWT-based authentication
  - Protected routes
  - Session management

- **Product Management**
  - Add, edit, and delete products
  - Bulk import/export functionality
  - Real-time validation
  - Image upload support

- **Currency Management**
  - Track multiple currencies
  - Update exchange rates
  - Monitor market trends
  - Historical data tracking

- **Advanced Search & Filtering**
  - Real-time search functionality
  - Filter by trend (up/down/stable)
  - Clear filter options
  - Responsive design

- **Data Import/Export**
  - Support for JSON and CSV formats
  - Bulk data operations
  - Data validation
  - Error handling

## Getting Started

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Set up environment variables:
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=your_api_url
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

## Usage

### Admin Login
- Navigate to `/login`
- Enter your credentials
- You will be redirected to the admin panel upon successful authentication

### Managing Products
1. Add a Product:
   - Fill in the product details
   - Upload product image
   - Set prices and specifications
   - Click "Add Product"

2. Import Products:
   - Prepare your JSON/CSV file following the sample format
   - Use the import feature in the admin panel
   - Review the import results

3. Export Products:
   - Click "Export Products"
   - Choose your export format
   - Download the file

### Managing Currencies
1. Add Currency:
   - Enter currency details
   - Set exchange rates
   - Upload flag image
   - Click "Add Currency"

2. Update Rates:
   - Select the currency
   - Update the rates
   - Save changes

## Security Features

- Token-based authentication
- Protected API endpoints
- Input validation
- File upload validation
- XSS protection
- CSRF protection

## API Documentation

### Authentication
```
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/verify
```

### Products
```
GET /api/products
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
```

### Currencies
```
GET /api/currencies
POST /api/currencies
PUT /api/currencies/:id
DELETE /api/currencies/:id
```

### Import/Export
```
POST /api/import
GET /api/export/:type
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.